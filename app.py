"""Una sola aplicación pública: dashboard copiado + receptor de TradingView."""

from __future__ import annotations

import hmac
import os
import re

import psycopg2
import requests
from psycopg2.extras import Json, RealDictCursor
from flask import jsonify, request

from dashboard.app import app, check_auth
from audit_scenarios import MODES, evaluate, summarize
from onza_contract import InvalidSignal, canonicalize
from audit_log import audit


app.config["MAX_CONTENT_LENGTH"] = 16 * 1024

BITUNIX_MARKET = "https://fapi.bitunix.com/api/v1/futures/market"
BITUNIX_INTERVALS = frozenset({"1m", "5m", "15m", "30m", "1h", "4h", "1d"})


def _bitunix_public(path: str, params: dict):
    try:
        response = requests.get(f"{BITUNIX_MARKET}/{path}", params=params, timeout=5)
        response.raise_for_status()
        body = response.json()
        if body.get("code") != 0 or not isinstance(body.get("data"), list):
            raise ValueError("Respuesta de mercado inválida")
        return jsonify(body["data"])
    except (requests.RequestException, ValueError):
        return jsonify(error="Datos de Bitunix no disponibles"), 502


@app.get("/api/bitunix/tickers")
def bitunix_tickers():
    symbols = request.args.get("symbols", "")
    if not re.fullmatch(r"[A-Z0-9]+USDT(?:,[A-Z0-9]+USDT){0,39}", symbols):
        return jsonify(error="symbols inválidos"), 400
    return _bitunix_public("tickers", {"symbols": symbols})


@app.get("/api/bitunix/kline")
def bitunix_kline():
    symbol = request.args.get("symbol", "")
    interval = request.args.get("interval", "")
    if not re.fullmatch(r"[A-Z0-9]+USDT", symbol) or interval not in BITUNIX_INTERVALS:
        return jsonify(error="Parámetros de vela inválidos"), 400
    try:
        start = int(request.args.get("startTime", ""))
        end = int(request.args.get("endTime", ""))
    except ValueError:
        return jsonify(error="Fechas inválidas"), 400
    if start <= 0 or end <= start or end - start > 366 * 86400000:
        return jsonify(error="Rango de fechas inválido"), 400
    return _bitunix_public("kline", {"symbol": symbol, "interval": interval,
                                      "startTime": start, "endTime": end,
                                      "limit": 200, "type": "LAST_PRICE"})


def database_connection():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL no configurada")
    return psycopg2.connect(url, connect_timeout=2)


@app.get("/api/audit/results")
def audit_results():
    if not check_auth():
        return jsonify(error="Unauthorized"), 401
    mode = request.args.get("mode", "partial_no_be")
    if mode not in MODES:
        return jsonify(error="Modo de auditoría inválido"), 400
    try:
        with database_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """SELECT s.signal_id, s.exchange, s.margin_used,
                              s.be_activated_at, e.id, e.event_type,
                              e.payload, e.received_at, e.applied_at, e.onza_status
                       FROM tv_signals s JOIN tv_events e
                         ON e.signal_id=s.signal_id AND e.state='applied'
                       ORDER BY s.id, e.applied_at, e.id"""
                )
                event_rows = cur.fetchall()
    except (psycopg2.Error, RuntimeError) as exc:
        app.logger.error("Auditoría no disponible: %s", type(exc).__name__)
        return jsonify(error="Auditoría no disponible"), 503

    grouped = {}
    for row in event_rows:
        signal_id = row["signal_id"]
        if signal_id not in grouped:
            grouped[signal_id] = {"exchange": row["exchange"],
                                  "margin": row["margin_used"] or os.getenv("MARGIN_PER_TRADE", "20"),
                                  "margin_recorded": row["margin_used"] is not None,
                                  "activation": row["be_activated_at"], "events": [], "onza": []}
        grouped[signal_id]["events"].append({
            "id": row["id"], "typeSignal": row["event_type"],
            "payload": row["payload"], "received_at": row["received_at"],
            "applied_at": row["applied_at"]})
        grouped[signal_id]["onza"].append(row["onza_status"])
    results = []
    for signal_id, item in grouped.items():
        if not any(e["typeSignal"] == "entry" for e in item["events"]):
            continue
        result = evaluate(signal_id, item["events"], mode=mode,
                          margin=item["margin"], be_activated_at=item["activation"])
        result["source_exchange"] = item["exchange"]
        result["margin_recorded"] = item["margin_recorded"]
        result["onza_delivery"] = "delivered" if all(s == "delivered" for s in item["onza"]) else "pending_or_review"
        results.append(result)
    results.reverse()
    return jsonify(summary=summarize(results, mode), rows=results)


@app.post("/webhook/tradingview")
def tradingview_webhook():
    audit("TV PETICION RECIBIDA")
    expected = os.getenv("TRADINGVIEW_API_KEY")
    if not expected:
        audit("TV RECHAZADO", http=503, motivo="TRADINGVIEW_API_KEY no configurada")
        return jsonify(error="Receptor no configurado"), 503
    raw = request.get_json(silent=True)
    if not isinstance(raw, dict):
        audit("TV RECHAZADO", http=400, motivo="JSON invalido")
        return jsonify(error="Se requiere JSON válido"), 400
    supplied = raw.get("apiKey", "")
    if not isinstance(supplied, str) or not hmac.compare_digest(supplied, expected):
        audit("TV RECHAZADO", http=401, motivo="Autenticacion invalida")
        return jsonify(error="API key inválida"), 401
    try:
        payload = canonicalize(raw)
    except InvalidSignal as exc:
        audit("TV RECHAZADO", http=422, motivo=str(exc))
        return jsonify(error=str(exc)), 422
    audit("TV VALIDADO", payload, entrada=payload.get("entry"), precio=payload.get("price"))
    try:
        with database_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM onza_project_meta WHERE project = 'onza-futures'")
                if cur.fetchone() is None:
                    raise RuntimeError("La base no pertenece a Onza Futures Project")
                cur.execute(
                    """INSERT INTO tv_events (signal_id, event_type, payload)
                       VALUES (%s, %s, %s) ON CONFLICT (signal_id, event_type) DO NOTHING
                       RETURNING id""",
                    (payload["signalId"], payload["typeSignal"], Json(payload)),
                )
                row = cur.fetchone()
                if row is None:
                    cur.execute(
                        "SELECT payload FROM tv_events WHERE signal_id = %s AND event_type = %s",
                        (payload["signalId"], payload["typeSignal"]),
                    )
                    previous = cur.fetchone()[0]
                    if previous != payload:
                        audit("TV CONFLICTO", payload, http=409, motivo="Duplicado con datos distintos")
                        return jsonify(error="Evento duplicado con datos diferentes"), 409
                    audit("TV DUPLICADO", payload, http=200, accion="Sin repetir entregas")
                    return jsonify(status="duplicate", signalId=payload["signalId"]), 200
                event_id = row[0]
                # Se emite al confirmar la transacción; despierta al despachador
                # sin esperar el siguiente sondeo de respaldo.
                cur.execute("NOTIFY onza_events")
    except (psycopg2.Error, RuntimeError) as exc:
        audit("TV ERROR AL GUARDAR", payload, http=503, error=type(exc).__name__)
        return jsonify(error="Base de datos no disponible"), 503
    audit("TV GUARDADO EN COLA", payload, event_id, http=202)
    return jsonify(status="queued", eventId=event_id, signalId=payload["signalId"]), 202


@app.get("/health/onza")
def onza_health():
    try:
        with database_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) FROM tv_events WHERE state = 'pending'")
                pending = cur.fetchone()[0]
                cur.execute("SELECT COUNT(*) FROM tv_events WHERE state = 'rejected'")
                rejected = cur.fetchone()[0]
                cur.execute("""SELECT COUNT(*) FROM tv_events WHERE onza_status = 'pending'
                               AND state IN ('pending', 'applied')""")
                onza_pending = cur.fetchone()[0]
                cur.execute("""SELECT ROUND(EXTRACT(EPOCH FROM (onza_finished_at - received_at)) * 1000)::int
                               FROM tv_events WHERE onza_status = 'delivered'
                               AND onza_finished_at IS NOT NULL
                               ORDER BY onza_finished_at DESC LIMIT 1""")
                last_row = cur.fetchone()
        return jsonify(status="ok", pending=pending, rejected=rejected,
                       onza_pending=onza_pending,
                       last_onza_delivery_ms=last_row[0] if last_row else None)
    except (psycopg2.Error, RuntimeError):
        return jsonify(status="unavailable"), 503
