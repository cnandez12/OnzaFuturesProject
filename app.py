"""Una sola aplicación web: receptor de TradingView, panel interno y sitio público."""

from __future__ import annotations

import hmac
import os
import re

import psycopg2
import requests
from psycopg2.extras import Json, RealDictCursor
from flask import jsonify, request

from dashboard.app import app, INITIAL_BALANCE
from audit_scenarios import MODES
from audit_reporting import AUDIT_SQL, build_report
from onza_contract import InvalidSignal, canonicalize
from audit_log import audit
from presentation_config import RISK_PER_TRADE, metadata as presentation_metadata
from dashboard_auth import install_dashboard_auth
from public_website import install_public_website
from request_limits import TTLCache, slow_route


app.config["MAX_CONTENT_LENGTH"] = 16 * 1024
# El orden importa: el host público responde antes de pedir la contraseña del panel.
install_public_website(app)
install_dashboard_auth(app)

BITUNIX_MARKET = "https://fapi.bitunix.com/api/v1/futures/market"
BITUNIX_INTERVALS = frozenset({"1m", "5m", "15m", "30m", "1h", "4h", "1d"})
TICKERS_TTL = 3
AUDIT_ROWS_TTL = 10
PUBLIC_RESULTS_TTL = 15
response_cache = TTLCache()


class MarketDataError(ValueError):
    def __init__(self, code):
        super().__init__('Respuesta de mercado inválida')
        self.code = code if isinstance(code, int) else None


def _bitunix_data(path: str, params: dict) -> list:
    response = requests.get(f"{BITUNIX_MARKET}/{path}", params=params, timeout=4)
    response.raise_for_status()
    body = response.json()
    if body.get("code") != 0 or not isinstance(body.get("data"), list):
        raise MarketDataError(body.get("code"))
    return body["data"]


def _bitunix_public(path: str, params: dict, ttl: float = 0):
    try:
        if path == "tickers":
            # A disabled market can reject an entire filtered request (code 20015).
            # The catalogue is independent of those filters; cache once and select locally.
            tickers = response_cache.get(("tickers", "catalogue"), ttl or TICKERS_TTL,
                                         lambda: _bitunix_data("tickers", {}))
            wanted = set(params.get("symbols", "").split(","))
            return jsonify([row for row in tickers if row.get("symbol") in wanted])
        if ttl:
            key = (path, tuple(sorted(params.items())))
            return jsonify(response_cache.get(key, ttl, lambda: _bitunix_data(path, params)))
        return jsonify(_bitunix_data(path, params))
    except MarketDataError as exc:
        app.logger.warning("Bitunix market rejected path=%s symbol=%s interval=%s code=%s",
                           path, params.get("symbol", "catalogue"), params.get("interval", ""), exc.code)
        unavailable = exc.code == 20015
        return jsonify(error="Bitunix no habilita este mercado para consultar velas" if unavailable else "Datos de Bitunix no disponibles",
                       code="market_unavailable" if unavailable else "upstream_error",
                       upstream_code=exc.code), 502
    except (requests.RequestException, ValueError) as exc:
        app.logger.warning("Bitunix market failed path=%s symbol=%s interval=%s error=%s",
                           path, params.get("symbol", "catalogue"), params.get("interval", ""), type(exc).__name__)
        return jsonify(error="Datos de Bitunix no disponibles", code="upstream_error"), 502


@app.get("/api/bitunix/tickers")
@slow_route
def bitunix_tickers():
    symbols = request.args.get("symbols", "")
    if not re.fullmatch(r"[A-Z0-9]+USDT(?:,[A-Z0-9]+USDT){0,39}", symbols):
        return jsonify(error="symbols inválidos"), 400
    return _bitunix_public("tickers", {"symbols": symbols}, ttl=TICKERS_TTL)


BINANCE_FUTURES = "https://fapi.binance.com/fapi/v1"


def _binance_contracts():
    response = requests.get(f"{BINANCE_FUTURES}/exchangeInfo", timeout=4)
    response.raise_for_status()
    symbols = response.json().get("symbols")
    if not isinstance(symbols, list):
        raise ValueError("Catálogo Binance inválido")
    return {s["symbol"]: s for s in symbols if s.get("contractType") == "PERPETUAL"
            and s.get("quoteAsset") == "USDT" and s.get("marginAsset") == "USDT"}


def _binance_candles(symbol, interval, start, end):
    try:
        contracts = response_cache.get("binance-futures-contracts", 300, _binance_contracts)
        contract = contracts.get(symbol)
        if contract is None:
            return jsonify(error="Binance Futures no ofrece este contrato perpetuo USDT",
                           code="market_unavailable", source="BINANCE"), 404
        params = dict(symbol=symbol, interval=interval, startTime=start, endTime=end, limit=200)
        def fetch_candles():
            response = requests.get(f"{BINANCE_FUTURES}/klines", params=params, timeout=4)
            response.raise_for_status()
            body = response.json()
            if not isinstance(body, list):
                raise ValueError("Velas Binance inválidas")
            return [dict(time=str(k[0]), open=k[1], high=k[2], low=k[3], close=k[4],
                         baseVol=k[5], quoteVol=k[7]) for k in body]
        candles = response_cache.get(("binance-kline", tuple(sorted(params.items()))), 5, fetch_candles)
        result = jsonify(candles)
        result.headers["X-Chart-Source"] = "BINANCE"
        result.headers["X-Chart-Market-Status"] = contract.get("status", "UNKNOWN")
        return result
    except (requests.RequestException, ValueError, KeyError, IndexError, TypeError) as exc:
        upstream_status = getattr(getattr(exc, "response", None), "status_code", None)
        app.logger.warning("Binance chart failed symbol=%s interval=%s error=%s http=%s", symbol, interval, type(exc).__name__, upstream_status)
        return jsonify(error="Respaldo Binance Futures no disponible", code="upstream_error", source="BINANCE", upstream_status=upstream_status), 502


@app.get("/api/bitunix/kline")
@slow_route
def bitunix_kline():
    symbol = request.args.get("symbol", "")
    interval = request.args.get("interval", "")
    source = request.args.get("source", "bitunix")
    if source not in ("bitunix", "binance"):
        return jsonify(error="Fuente de velas inválida"), 400
    if not re.fullmatch(r"[A-Z0-9]+USDT", symbol) or interval not in BITUNIX_INTERVALS:
        return jsonify(error="Parámetros de vela inválidos"), 400
    try:
        start = int(request.args.get("startTime", ""))
        end = int(request.args.get("endTime", ""))
    except ValueError:
        return jsonify(error="Fechas inválidas"), 400
    if start <= 0 or end <= start or end - start > 366 * 86400000:
        return jsonify(error="Rango de fechas inválido"), 400
    if source == "binance":
        return _binance_candles(symbol, interval, start, end)
    return _bitunix_public("kline", {"symbol": symbol, "interval": interval,
                                      "startTime": start, "endTime": end,
                                      "limit": 200, "type": "LAST_PRICE"})


def database_connection():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL no configurada")
    return psycopg2.connect(url, connect_timeout=2)


def _audit_rows():
    conn = database_connection()
    try:
        conn.set_session(readonly=True, isolation_level="REPEATABLE READ")
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SET LOCAL statement_timeout = 15000")
                cur.execute(AUDIT_SQL)
                return cur.fetchall()
    finally:
        conn.close()


@app.get("/api/audit/results")
@slow_route
def audit_results():
    mode = request.args.get("mode", "partial_be")
    if mode not in MODES:
        return jsonify(error="Modo de auditoría inválido"), 400
    try:
        event_rows = response_cache.get("audit-rows", AUDIT_ROWS_TTL, _audit_rows)
        report = build_report(event_rows, mode=mode,
                              fallback_margin=os.getenv("MARGIN_PER_TRADE", "20"),
                              filters={key: request.args.get(key, "") for key in ("from", "to", "status", "search")},
                              risk_override=RISK_PER_TRADE)
        report["presentation"] = presentation_metadata()
        return jsonify(report)
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    except (psycopg2.Error, RuntimeError) as exc:
        app.logger.error("Auditoría no disponible: %s", type(exc).__name__)
        return jsonify(error="Auditoría no disponible"), 503


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
    if not isinstance(supplied, str) or not hmac.compare_digest(
            supplied.encode("utf-8"), expected.encode("utf-8")):
        audit("TV RECHAZADO", http=401, motivo="Autenticacion invalida")
        return jsonify(error="API key inválida"), 401
    try:
        payload = canonicalize(raw)
    except InvalidSignal as exc:
        audit("TV RECHAZADO", http=422, motivo=str(exc))
        return jsonify(error=str(exc)), 422
    audit("TV VALIDADO", payload, entrada=payload.get("entry"), precio=payload.get("price"))
    conn = None
    try:
        conn = database_connection()
        with conn:
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
    except (psycopg2.Error, RuntimeError) as exc:
        audit("TV ERROR AL GUARDAR", payload, http=503, error=type(exc).__name__)
        return jsonify(error="Base de datos no disponible"), 503
    finally:
        if conn is not None:
            conn.close()
    audit("TV GUARDADO EN COLA", payload, event_id, http=202)
    return jsonify(status="queued", eventId=event_id, signalId=payload["signalId"]), 202


@app.get("/health/vorza")
def vorza_health():
    from vorza_delivery import enabled, settings
    active = enabled()
    configured = False
    configuration = "Sin configurar"
    try:
        settings()
        configured = True
        configuration = "Configurado"
    except ValueError as exc:
        configuration = str(exc)
    try:
        with database_connection() as conn, conn.cursor() as cur:
            cur.execute("SELECT state,count(*) FROM vorza_deliveries GROUP BY state")
            counts = dict(cur.fetchall())
            cur.execute("SELECT state,count(*) FROM vorza_actions GROUP BY state")
            actions = dict(cur.fetchall())
        return jsonify(status="ok", enabled=active, configured=configured,
                       configuration=configuration, queue=counts, action_queue=actions,
                       api_version="1.1", scope="publish_close_cancel",
                       tp_split=[40,40,20], rate_limit=10, replay_paused_events=False)
    except (psycopg2.Error, RuntimeError):
        return jsonify(status="unavailable", enabled=active), 503


TELEGRAM_HEALTH_SQL = """SELECT 'principal' AS queue, telegram_status AS status, count(*) AS total,
        EXTRACT(EPOCH FROM now() - min(received_at))::bigint AS oldest_seconds
    FROM tv_events
    WHERE state = 'applied' AND telegram_status IN ('pending', 'sending', 'failed', 'unknown')
    GROUP BY telegram_status
    UNION ALL
    SELECT 'distribucion', status, count(*),
        EXTRACT(EPOCH FROM now() - min(available_at))::bigint
    FROM telegram_publications
    WHERE status IN ('pending', 'sending', 'failed', 'unknown')
    GROUP BY status"""
# Un envío en curso dura segundos; más que esto indica un worker interrumpido.
STALE_SENDING_SECONDS = 120
STALE_PENDING_SECONDS = 900


@app.get("/health/telegram")
def telegram_health():
    """Solo conteos: qué publicaciones están atascadas y requieren revisión."""
    conn = None
    try:
        conn = database_connection()
        with conn:
            with conn.cursor() as cur:
                cur.execute(TELEGRAM_HEALTH_SQL)
                found = cur.fetchall()
    except (psycopg2.Error, RuntimeError):
        return jsonify(status="unavailable"), 503
    finally:
        if conn is not None:
            conn.close()
    queues = {"principal": {}, "distribucion": {}}
    attention = False
    for queue, status, total, oldest in found:
        queues[queue][status] = {"total": int(total), "oldest_seconds": int(oldest or 0)}
        if status in ("failed", "unknown"):
            attention = True
        elif status == "sending" and (oldest or 0) > STALE_SENDING_SECONDS:
            attention = True
        elif status == "pending" and (oldest or 0) > STALE_PENDING_SECONDS:
            attention = True
    return jsonify(status="attention" if attention else "ok", queues=queues,
                   review="python telegram_review.py list")


# Sitio público del producto: proyección de solo lectura, sin acciones de entrega.
@app.get("/api/public/results")
@slow_route
def public_results():
    from public_results import load_public, public_market_marks
    try:
        return jsonify(response_cache.get(
            "public-results", PUBLIC_RESULTS_TTL,
            lambda: load_public(database_connection, INITIAL_BALANCE, price_loader=public_market_marks, risk_override=RISK_PER_TRADE)))
    except (psycopg2.Error, RuntimeError, ValueError):
        return jsonify(error="Registro temporalmente no disponible"), 503


@app.get("/api/public/tickers")
def public_tickers():
    return bitunix_tickers()


@app.get("/api/public/candles")
def public_candles():
    return bitunix_kline()


@app.after_request
def public_read_only_cors(response):
    if request.path.startswith("/api/public/"):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Cache-Control"] = "public, max-age=15"
    return response
