"""VORZA-only publisher. The receiver, Telegram and dashboard never await its HTTP."""
import os
import time
from datetime import datetime, timezone, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor, Json
from dotenv import load_dotenv
from audit_log import audit, audit_wait
from vorza_delivery import enabled, settings, adapt, publish
from vorza_queue import ENTRY_SQL, claim, finish

load_dotenv()


def connect():
    return psycopg2.connect(os.environ["DATABASE_URL"],connect_timeout=5)


def enqueue(config):
    with connect() as conn,conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(ENTRY_SQL)
        for event in cur.fetchall():
            state='pending'
            detail=None
            try:
                body=adapt(event['payload'],config)
            except (ValueError,KeyError,TypeError):
                body={'external_id':event['signal_id']}
                state='failed';detail='Entrada incompatible con el contrato VORZA'
            deadline=event['received_at']+timedelta(minutes=config.expires)
            if deadline <= datetime.now(timezone.utc):
                state='expired';detail='Entrada antigua; sin publicacion'
            cur.execute("SELECT 1 FROM tv_events WHERE signal_id=%s AND event_type<>'entry' AND state='applied' LIMIT 1",(event['signal_id'],))
            if cur.fetchone():
                state='skipped';detail='Señal ya avanzada; no publicar como entrada nueva'
            cur.execute("""INSERT INTO vorza_deliveries(event_id,external_id,payload,deadline,state,detail)
             VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING""",
             (event['id'],event['signal_id'],Json(body),deadline,state,detail))


def deliver_one(config):
    if not enabled():
        return False
    with connect() as conn,conn.cursor(cursor_factory=RealDictCursor) as cur:
        job=claim(cur,config.rate)
    if not job:
        return False
    result=publish(job['payload'],config.key)
    with connect() as conn,conn.cursor() as cur:
        state=finish(cur,job,result)
    audit('VORZA RESULTADO',event_id=job['event_id'],signalId=job['external_id'],
          estado=state,http=result.http,detalle=result.detail,intento=job['attempts'],
          remote_id=result.remote_id,recipients=result.recipients,duplicate=result.duplicate)
    return True


def main():
    audit('WORKER INICIADO',canal='vorza')
    while True:
        try:
            if not enabled():
                audit_wait('VORZA DESACTIVADO',canal='vorza',motivo='Sin publicaciones ni reenvio de acumulados')
                time.sleep(2)
                continue
            try:
                config=settings()
            except ValueError as exc:
                audit_wait('VORZA CONFIGURACION PENDIENTE',canal='vorza',motivo=str(exc))
                time.sleep(5)
                continue
            enqueue(config)
            if not deliver_one(config):
                time.sleep(1)
        except (psycopg2.Error,OSError,RuntimeError,KeyError,ValueError) as exc:
            audit_wait('VORZA WORKER ERROR',canal='vorza',error=type(exc).__name__)
            time.sleep(3)


if __name__=='__main__':
    main()
