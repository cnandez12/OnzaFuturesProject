"""Procesa la cola durable y publica sin bloquear a TradingView.

Una respuesta HTTP ambigua queda en 'unknown' o 'sending'. No se reintenta
automáticamente para evitar órdenes duplicadas en Onza.
"""

from __future__ import annotations

import os
import select
import sys
import time
import atexit
import signal
import subprocess
from pathlib import Path
from decimal import Decimal
from datetime import datetime, timezone

import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

from onza_contract import InvalidSignal
from onza_delivery import post_onza, post_telegram
from onza_processing import DeferredEvent, apply_event
from audit_log import audit, audit_wait


load_dotenv()
EVENT_ORDER = {"entry": 0, "tp1": 1, "tp2": 2, "tp3": 3, "sl": 4, "close": 4}
ONZA_REQUIRED = {"entry": (), "tp1": ("entry",),
                 "tp2": ("entry", "tp1"),
                 "tp3": ("entry", "tp1", "tp2"),
                 "sl": ("entry",), "close": ("entry",)}

# Dar prioridad al intento de Onza sin depender de su respuesta ni de su disponibilidad.
LOCAL_READY = "(onza_started_at IS NOT NULL OR received_at <= now() - interval '1 second')"


def onza_gate(event: dict, related: list[dict]) -> tuple[bool, str | None]:
    """Valida lo imprescindible antes del HTTP, sin calcular P&L ni imágenes."""
    kind = event["event_type"]
    by_type = {item["event_type"]: item for item in related}
    for predecessor in ONZA_REQUIRED[kind]:
        if predecessor not in by_type or by_type[predecessor]["onza_status"] != "delivered":
            return False, None
    if kind == "entry":
        return True, None
    entry = by_type["entry"]["payload"]
    payload = event["payload"]
    for field in ("symbol", "timeframe", "sourceExchange", "direction", "leverage"):
        if payload[field] != entry[field]:
            return False, f"{field} no coincide con la entrada"
    if Decimal(str(payload["entry"])) != Decimal(str(entry["entry"])):
        return False, "entry no coincide con la entrada"
    if kind.startswith("tp") or kind == "sl":
        target = (entry["takeProfits"][int(kind[-1]) - 1]["price"]
                  if kind.startswith("tp") else entry["stopLoss"]["price"])
        tolerance = max(Decimal("0.00000001"), Decimal(str(entry["entry"])) * Decimal("0.000001"))
        if abs(Decimal(str(payload["price"])) - Decimal(str(target))) > tolerance:
            return False, "Precio de TP/SL no coincide con la entrada"
    for terminal in ("tp3", "sl", "close"):
        prior = by_type.get(terminal)
        if prior and terminal != kind:
            if prior["onza_status"] == "delivered":
                return False, "La señal ya tiene cierre entregado a Onza"
            if prior["onza_status"] in ("sending", "unknown", "failed"):
                return False, None
    # Una salida de riesgo no espera indefinidamente un TP fallido o ambiguo.
    # El recorrido se conserva en tv_events para conciliación posterior.
    return True, None


def connect():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL no configurada")
    return psycopg2.connect(url, connect_timeout=5)


def listen_onza():
    listener = connect()
    listener.autocommit = True
    with listener.cursor() as cur:
        cur.execute("LISTEN onza_events")
    return listener


def apply_pending(limit=50) -> int:
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute(f"""SELECT id FROM tv_events WHERE state = 'pending'
                           AND {LOCAL_READY} ORDER BY id LIMIT %s""", (limit,))
            ids = [row[0] for row in cur.fetchall()]
    completed = 0
    for event_id in ids:
        try:
            with connect() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        f"""SELECT id, payload, received_at FROM tv_events WHERE id = %s
                           AND state = 'pending' AND {LOCAL_READY}
                           FOR UPDATE SKIP LOCKED""",
                        (event_id,),
                    )
                    event = cur.fetchone()
                    if event is None:
                        continue
                    try:
                        cur.execute("SAVEPOINT local_event")
                        apply_event(cur, event["payload"], event["received_at"])
                    except DeferredEvent as exc:
                        cur.execute("ROLLBACK TO SAVEPOINT local_event")
                        audit_wait("PROCESAMIENTO EN ESPERA", event["payload"], event_id, motivo=str(exc))
                        continue
                    except InvalidSignal as exc:
                        cur.execute("ROLLBACK TO SAVEPOINT local_event")
                        cur.execute(
                            """UPDATE tv_events SET state='rejected', error=%s,
                               onza_status=CASE WHEN onza_status='pending' THEN 'skipped' ELSE onza_status END,
                               telegram_status='skipped' WHERE id=%s""",
                            (str(exc), event_id),
                        )
                        completed += 1
                        audit("PROCESAMIENTO RECHAZADO", event["payload"], event_id, motivo=str(exc))
                        continue
                    cur.execute(
                        "UPDATE tv_events SET state='applied', applied_at=now() WHERE id=%s",
                        (event_id,),
                    )
                    completed += 1
            audit("PROCESAMIENTO GUARDADO", event["payload"], event_id)
        except (psycopg2.Error, RuntimeError) as exc:
            audit("PROCESAMIENTO ERROR", event_id=event_id, error=type(exc).__name__)
    return completed


def claim_delivery(channel: str):
    if channel not in ("onza", "telegram"):
        raise ValueError("Canal de entrega inválido")
    onza_ready = bool(os.getenv("ONZA_API_KEY"))
    telegram_ready = bool(os.getenv("TELEGRAM_BOT_TOKEN") and os.getenv("DESTINATION_CHANNEL_ID"))
    if (channel == "onza" and not onza_ready) or (channel == "telegram" and not telegram_ready):
        audit_wait("CONFIGURACION PENDIENTE", canal=channel,
                   motivo="Faltan variables del canal")
        return None
    queue_filter = ("state IN ('pending', 'applied') AND onza_status='pending'"
                    if channel == "onza" else
                    "state='applied' AND telegram_status='pending'")
    with connect() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                f"""SELECT id, signal_id, event_type, payload, received_at,
                           onza_status, telegram_status
                    FROM tv_events WHERE {queue_filter}
                    ORDER BY id LIMIT 500 FOR UPDATE SKIP LOCKED"""
            )
            for event in cur.fetchall():
                cur.execute(
                    """SELECT event_type, onza_status, telegram_status, payload, state
                       FROM tv_events WHERE signal_id=%s""",
                    (event["signal_id"],),
                )
                related = cur.fetchall()
                send_onza = False
                if channel == "onza":
                    send_onza, invalid = onza_gate(event, related)
                    if invalid:
                        cur.execute(
                            """UPDATE tv_events SET onza_result=%s,
                               onza_status='skipped' WHERE id=%s""",
                            (invalid, event["id"]),
                        )
                        audit("ONZA EVENTO OMITIDO", event["payload"], event["id"], motivo=invalid)
                        continue
                    if not send_onza:
                        audit_wait("ONZA EN ESPERA", event["payload"], event["id"],
                                   motivo="Predecesor sin confirmar o cierre ambiguo; Telegram independiente")
                predecessors = [row for row in related
                                if row["state"] == "applied" and
                                EVENT_ORDER[row["event_type"]] < EVENT_ORDER[event["event_type"]]]
                send_telegram = (
                    channel == "telegram" and telegram_ready and event["telegram_status"] == "pending"
                    and all(row["telegram_status"] == "delivered" for row in predecessors)
                )
                if channel == "telegram" and not send_telegram:
                    audit_wait("TELEGRAM EN ESPERA", event["payload"], event["id"],
                               motivo="Publicacion anterior de esta señal pendiente o sin confirmar")
                if not send_onza and not send_telegram:
                    continue
                if send_onza:
                    cur.execute(
                        "UPDATE tv_events SET onza_status='sending', onza_started_at=now() WHERE id=%s",
                        (event["id"],),
                    )
                else:
                    cur.execute(
                        """UPDATE tv_events SET telegram_status='sending',
                           image_sequence = CASE WHEN event_type='entry' THEN image_sequence
                               ELSE COALESCE(image_sequence, nextval('bitunix_card_rotation_seq')) END
                           WHERE id=%s RETURNING image_sequence""",
                        (event["id"],),
                    )
                    image_sequence = cur.fetchone()["image_sequence"]
                trade = None
                if send_telegram and event["event_type"] != "entry":
                    cur.execute(
                        """SELECT t.*, s.margin_used, s.telegram_entry_message_id, s.telegram_chat_id
                           FROM trades t JOIN tv_signals s ON s.id=t.message_id
                           WHERE s.signal_id=%s""",
                        (event["signal_id"],),
                    )
                    trade = cur.fetchone()
                    if not trade or not trade.get("telegram_entry_message_id") or not trade.get("telegram_chat_id"):
                        cur.execute("UPDATE tv_events SET telegram_status='pending' WHERE id=%s", (event["id"],))
                        audit_wait("TELEGRAM EN ESPERA", event["payload"], event["id"],
                                   motivo="Falta message_id/chat_id de la entrada; no se publica una respuesta suelta")
                        continue
                return (event["id"], event["payload"], send_onza, send_telegram, trade,
                        image_sequence if send_telegram else None, event.get("received_at"))
    return None


def deliver_one(channel: str) -> bool:
    claimed = claim_delivery(channel)
    if claimed is None:
        return False
    event_id, payload, send_onza, send_telegram, trade, image_sequence, event_time = claimed
    updates = {}
    started = time.monotonic()
    queue_ms = None
    if event_time is not None:
        stamp = event_time if event_time.tzinfo else event_time.replace(tzinfo=timezone.utc)
        queue_ms = max(0, round((datetime.now(timezone.utc) - stamp).total_seconds() * 1000))
    audit(f"{channel.upper()} ENVIO INICIADO", payload, event_id,
          desde_recepcion_ms=queue_ms,
          contenido=("texto" if payload.get("typeSignal") == "entry" else "imagen y texto")
          if channel == "telegram" else "webhook")
    if send_onza:
        updates["onza_status"], updates["onza_result"] = post_onza(payload)
    if send_telegram:
        telegram_delivery = post_telegram(
            payload, trade, image_sequence=image_sequence or 1, event_time=event_time, event_id=event_id
        )
        updates["telegram_status"] = telegram_delivery.status
        updates["telegram_result"] = telegram_delivery.detail
    result_label = {"delivered": "CONFIRMADO", "unknown": "SIN CONFIRMACION",
                    "failed": "ERROR", "pending": "PENDIENTE"}[updates[f"{channel}_status"]]
    audit(f"{channel.upper()} {result_label}", payload, event_id,
          estado=updates[f"{channel}_status"], detalle=updates[f"{channel}_result"],
          duracion_ms=round((time.monotonic() - started) * 1000))
    try:
        with connect() as conn:
            with conn.cursor() as cur:
                if send_onza:
                    cur.execute(
                        """UPDATE tv_events SET onza_status=%s, onza_result=%s,
                           onza_finished_at=now() WHERE id=%s""",
                        (updates["onza_status"], updates["onza_result"], event_id),
                    )
                if send_telegram:
                    cur.execute(
                        """UPDATE tv_events SET telegram_status=%s, telegram_result=%s,
                           telegram_message_id=%s WHERE id=%s""",
                        (updates["telegram_status"], updates["telegram_result"], telegram_delivery.message_id, event_id),
                    )
                    if payload["typeSignal"] == "entry" and telegram_delivery.status == "delivered":
                        cur.execute(
                            """UPDATE tv_signals SET telegram_entry_message_id=%s, telegram_chat_id=%s
                               WHERE signal_id=%s""",
                            (telegram_delivery.message_id, telegram_delivery.chat_id, payload["signalId"]),
                        )
    except psycopg2.Error as exc:
        audit("RESULTADO NO GUARDADO", payload, event_id, canal=channel, error=type(exc).__name__)
        return True
    audit("RESULTADO GUARDADO", payload, event_id, canal=channel)
    return True


def main():
    role = sys.argv[1] if len(sys.argv) > 1 else "onza"
    if role not in ("onza", "process", "telegram"):
        raise SystemExit("Uso: worker.py [onza|process|telegram]")
    listener = None
    distribution = None
    if role == "telegram":
        def cleanup_distribution():
            if distribution is not None and distribution.poll() is None:
                distribution.terminate()
                try:
                    distribution.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    distribution.kill()
                    distribution.wait()
        atexit.register(cleanup_distribution)
        def stop_worker(_signum, _frame):
            raise SystemExit(0)
        signal.signal(signal.SIGTERM, stop_worker)
    audit("WORKER INICIADO", canal=role)
    while True:
        try:
            if role == "telegram" and (distribution is None or distribution.poll() is not None):
                distribution = subprocess.Popen([sys.executable, str(Path(__file__).with_name("telegram_channels.py"))])
                audit("TELEGRAM DISTRIBUCION INICIADA")
            if role == "onza" and listener is None:
                listener = listen_onza()
            applied = apply_pending() if role == "process" else 0
            delivered = 0
            if role != "process":
                for _ in range(30):
                    if not deliver_one(role):
                        break
                    delivered += 1
            if not applied and not delivered:
                if role == "onza" and listener is not None:
                    select.select([listener], [], [], 0.5)
                    listener.poll()
                    listener.notifies.clear()
                else:
                    time.sleep(0.5)
        except (psycopg2.Error, OSError, ValueError, RuntimeError) as exc:
            if listener is not None:
                listener.close()
                listener = None
            audit_wait("WORKER ERROR", canal=role, error=type(exc).__name__)
            time.sleep(2)


if __name__ == "__main__":
    main()
