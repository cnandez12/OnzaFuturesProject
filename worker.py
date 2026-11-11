"""Procesa la cola durable y publica sin bloquear a TradingView.

Una respuesta HTTP ambigua queda en 'unknown' o 'sending'. No se reintenta
automáticamente para evitar órdenes duplicadas en Onza.
"""

from __future__ import annotations

import os
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

from telegram_policy import closing_suppression
from onza_contract import InvalidSignal
from telegram_delivery import post_telegram
from onza_processing import DeferredEvent, apply_event
from audit_log import audit, audit_wait


load_dotenv()
EVENT_ORDER = {"entry": 0, "tp1": 1, "tp2": 2, "tp3": 3, "sl": 4, "close": 4}
def connect():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL no configurada")
    return psycopg2.connect(url, connect_timeout=5)


def apply_pending(limit=50) -> int:
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute(f"""SELECT id FROM tv_events WHERE state = 'pending'
                           ORDER BY id LIMIT %s""", (limit,))
            ids = [row[0] for row in cur.fetchall()]
    completed = 0
    for event_id in ids:
        try:
            with connect() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        f"""SELECT id, payload, received_at FROM tv_events WHERE id = %s
                           AND state = 'pending'
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
    if channel != "telegram":
        raise ValueError("Solo existe el canal de entrega Telegram en este trabajador")
    if not (os.getenv("TELEGRAM_BOT_TOKEN") and os.getenv("DESTINATION_CHANNEL_ID")):
        audit_wait("CONFIGURACION PENDIENTE",canal="telegram",motivo="Faltan variables del canal")
        return None
    with connect() as conn,conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""SELECT id,signal_id,event_type,payload,received_at,telegram_status
         FROM tv_events WHERE state='applied' AND telegram_status='pending'
         ORDER BY id LIMIT 500 FOR UPDATE SKIP LOCKED""")
        for event in cur.fetchall():
            cur.execute("SELECT event_type,telegram_status,payload,state FROM tv_events WHERE signal_id=%s",(event['signal_id'],))
            related=cur.fetchall()
            suppressed=closing_suppression(event['event_type'],related)
            if suppressed:
                cur.execute("UPDATE tv_events SET telegram_status='skipped',telegram_result=%s WHERE id=%s",(suppressed,event['id']))
                audit('TELEGRAM EVENTO OMITIDO',event['payload'],event['id'],motivo=suppressed)
                continue
            predecessors=[row for row in related if row['state']=='applied' and EVENT_ORDER[row['event_type']] < EVENT_ORDER[event['event_type']]]
            if not all(row['telegram_status']=='delivered' for row in predecessors):
                audit_wait('TELEGRAM EN ESPERA',event['payload'],event['id'],motivo='Publicacion anterior de esta señal pendiente o sin confirmar')
                continue
            cur.execute("""UPDATE tv_events SET telegram_status='sending',
             image_sequence=CASE WHEN event_type='entry' THEN image_sequence
             ELSE COALESCE(image_sequence, nextval('bitunix_card_rotation_seq')) END
             WHERE id=%s RETURNING image_sequence""",(event['id'],))
            image_sequence=cur.fetchone()['image_sequence']
            trade=None
            if event['event_type']!='entry':
                cur.execute("""SELECT t.*,s.margin_used,s.telegram_entry_message_id,s.telegram_chat_id
                 FROM trades t JOIN tv_signals s ON s.id=t.message_id WHERE s.signal_id=%s""",(event['signal_id'],))
                trade=cur.fetchone()
                if not trade or not trade.get('telegram_entry_message_id') or not trade.get('telegram_chat_id'):
                    cur.execute("UPDATE tv_events SET telegram_status='pending' WHERE id=%s",(event['id'],))
                    audit_wait('TELEGRAM EN ESPERA',event['payload'],event['id'],motivo='Falta referencia al mensaje de entrada')
                    continue
            return event['id'],event['payload'],trade,image_sequence,event.get('received_at')
    return None


def deliver_one(channel: str) -> bool:
    claimed=claim_delivery(channel)
    if claimed is None:
        return False
    event_id,payload,trade,image_sequence,event_time=claimed
    started=time.monotonic()
    queue_ms=None
    if event_time is not None:
        stamp=event_time if event_time.tzinfo else event_time.replace(tzinfo=timezone.utc)
        queue_ms=max(0,round((datetime.now(timezone.utc)-stamp).total_seconds()*1000))
    audit('TELEGRAM ENVIO INICIADO',payload,event_id,desde_recepcion_ms=queue_ms,
          contenido='texto' if payload.get('typeSignal')=='entry' else 'imagen y texto')
    result=post_telegram(payload,trade,image_sequence=image_sequence or 1,event_time=event_time,event_id=event_id)
    label={'delivered':'CONFIRMADO','unknown':'SIN CONFIRMACION','failed':'ERROR','pending':'PENDIENTE'}[result.status]
    audit('TELEGRAM '+label,payload,event_id,estado=result.status,detalle=result.detail,
          duracion_ms=round((time.monotonic()-started)*1000))
    try:
        with connect() as conn,conn.cursor() as cur:
            cur.execute("""UPDATE tv_events SET telegram_status=%s,telegram_result=%s,
             telegram_message_id=%s WHERE id=%s""",(result.status,result.detail,result.message_id,event_id))
            if payload['typeSignal']=='entry' and result.status=='delivered':
                cur.execute("UPDATE tv_signals SET telegram_entry_message_id=%s,telegram_chat_id=%s WHERE signal_id=%s",
                            (result.message_id,result.chat_id,payload['signalId']))
    except psycopg2.Error as exc:
        audit('RESULTADO NO GUARDADO',payload,event_id,canal='telegram',error=type(exc).__name__)
        return True
    audit('RESULTADO GUARDADO',payload,event_id,canal='telegram')
    return True


def main():
    role = sys.argv[1] if len(sys.argv) > 1 else "process"
    if role not in ("process", "telegram"):
        raise SystemExit("Uso: worker.py [process|telegram]")
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
            applied = apply_pending() if role == "process" else 0
            delivered = 0
            if role != "process":
                for _ in range(30):
                    if not deliver_one(role):
                        break
                    delivered += 1
            if not applied and not delivered:
                time.sleep(0.5)
        except (psycopg2.Error, OSError, ValueError, RuntimeError) as exc:
            audit_wait("WORKER ERROR", canal=role, error=type(exc).__name__)
            time.sleep(2)


if __name__ == "__main__":
    main()
