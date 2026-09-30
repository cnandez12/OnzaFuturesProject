"""Procesa la cola durable y publica sin bloquear a TradingView.

Una respuesta HTTP ambigua queda en 'unknown' o 'sending'. No se reintenta
automáticamente para evitar órdenes duplicadas en Onza.
"""

from __future__ import annotations

import os
import select
import sys
import time
from decimal import Decimal

import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

from onza_contract import InvalidSignal
from onza_delivery import post_onza, post_telegram
from onza_processing import DeferredEvent, apply_event


load_dotenv()
EVENT_ORDER = {"entry": 0, "tp1": 1, "tp2": 2, "tp3": 3, "sl": 4, "close": 4}
ONZA_REQUIRED = {"entry": (), "tp1": ("entry",),
                 "tp2": ("entry", "tp1"),
                 "tp3": ("entry", "tp1", "tp2"),
                 "sl": ("entry",), "close": ("entry",)}


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
            cur.execute("""SELECT id FROM tv_events WHERE state = 'pending'
                           AND onza_status IN ('delivered', 'failed', 'unknown')
                           ORDER BY id LIMIT %s""", (limit,))
            ids = [row[0] for row in cur.fetchall()]
    completed = 0
    for event_id in ids:
        try:
            with connect() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """SELECT id, payload, received_at FROM tv_events WHERE id = %s
                           AND state = 'pending' AND onza_status IN ('delivered', 'failed', 'unknown')
                           FOR UPDATE SKIP LOCKED""",
                        (event_id,),
                    )
                    event = cur.fetchone()
                    if event is None:
                        continue
                    try:
                        apply_event(cur, event["payload"], event["received_at"])
                    except DeferredEvent:
                        continue
                    except InvalidSignal as exc:
                        cur.execute(
                            """UPDATE tv_events SET state='rejected', error=%s,
                               onza_status='skipped', telegram_status='skipped' WHERE id=%s""",
                            (str(exc), event_id),
                        )
                        completed += 1
                        continue
                    cur.execute(
                        "UPDATE tv_events SET state='applied', applied_at=now() WHERE id=%s",
                        (event_id,),
                    )
                    completed += 1
        except (psycopg2.Error, RuntimeError) as exc:
            print(f"[worker] Evento {event_id} pendiente por {type(exc).__name__}", flush=True)
    return completed


def claim_delivery(channel: str):
    if channel not in ("onza", "telegram"):
        raise ValueError("Canal de entrega inválido")
    onza_ready = bool(os.getenv("ONZA_API_KEY"))
    telegram_ready = bool(os.getenv("TELEGRAM_BOT_TOKEN") and os.getenv("DESTINATION_CHANNEL_ID"))
    if (channel == "onza" and not onza_ready) or (channel == "telegram" and not telegram_ready):
        return None
    queue_filter = ("state IN ('pending', 'applied') AND onza_status='pending'"
                    if channel == "onza" else
                    "state='applied' AND telegram_status='pending' AND onza_status='delivered'")
    with connect() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                f"""SELECT id, signal_id, event_type, payload, onza_status, telegram_status
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
                            """UPDATE tv_events SET state='rejected', error=%s,
                               onza_status='skipped', telegram_status='skipped' WHERE id=%s""",
                            (invalid, event["id"]),
                        )
                        continue
                predecessors = [row for row in related
                                if row["state"] == "applied" and
                                EVENT_ORDER[row["event_type"]] < EVENT_ORDER[event["event_type"]]]
                send_telegram = (
                    channel == "telegram" and telegram_ready and event["telegram_status"] == "pending"
                    and event["onza_status"] == "delivered"
                    and all(row["telegram_status"] == "delivered" for row in predecessors)
                )
                if not send_onza and not send_telegram:
                    continue
                if send_onza:
                    cur.execute(
                        "UPDATE tv_events SET onza_status='sending', onza_started_at=now() WHERE id=%s",
                        (event["id"],),
                    )
                else:
                    cur.execute(
                        "UPDATE tv_events SET telegram_status='sending' WHERE id=%s",
                        (event["id"],),
                    )
                trade = None
                if send_telegram and event["event_type"] != "entry":
                    cur.execute(
                        """SELECT t.*, s.margin_used FROM trades t JOIN tv_signals s ON s.id=t.message_id
                           WHERE s.signal_id=%s""",
                        (event["signal_id"],),
                    )
                    trade = cur.fetchone()
                return event["id"], event["payload"], send_onza, send_telegram, trade
    return None


def deliver_one(channel: str) -> bool:
    claimed = claim_delivery(channel)
    if claimed is None:
        return False
    event_id, payload, send_onza, send_telegram, trade = claimed
    updates = {}
    if send_onza:
        updates["onza_status"], updates["onza_result"] = post_onza(payload)
    if send_telegram:
        updates["telegram_status"], updates["telegram_result"] = post_telegram(payload, trade)
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
                        "UPDATE tv_events SET telegram_status=%s, telegram_result=%s WHERE id=%s",
                        (updates["telegram_status"], updates["telegram_result"], event_id),
                    )
    except psycopg2.Error as exc:
        print(f"[worker] Resultado del evento {event_id} no persistido: {type(exc).__name__}", flush=True)
    print(f"[worker] Evento {event_id}: {updates}", flush=True)
    return True


def main():
    role = sys.argv[1] if len(sys.argv) > 1 else "onza"
    if role not in ("onza", "process", "telegram"):
        raise SystemExit("Uso: worker.py [onza|process|telegram]")
    listener = None
    while True:
        try:
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
            print(f"[worker] Esperando DB: {type(exc).__name__}", flush=True)
            time.sleep(2)


if __name__ == "__main__":
    main()
