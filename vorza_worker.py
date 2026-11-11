"""VORZA-only publisher. The receiver, Telegram and dashboard never await its HTTP."""
import os
import time
from datetime import datetime, timezone, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor, Json
from dotenv import load_dotenv
from audit_log import audit, audit_wait
from vorza_delivery import enabled, settings, adapt, publish, action_body, send_action
from vorza_queue import ENTRY_SQL, claim, finish, ACTION_EVENT_SQL, claim_action, finish_action

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
            enqueue_actions()
            if not deliver_action(config) and not deliver_one(config):
                time.sleep(1)
        except (psycopg2.Error,OSError,RuntimeError,KeyError,ValueError) as exc:
            audit_wait('VORZA WORKER ERROR',canal='vorza',error=type(exc).__name__)
            time.sleep(3)


def enqueue_actions():
    with connect() as conn,conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(ACTION_EVENT_SQL)
        for event in cur.fetchall():
            body=action_body(event['signal_id'],'close','opposite_signal',
                             'Cierre por señal contraria | '+str((event.get('payload') or {}).get('timeframe','')))
            cur.execute("""INSERT INTO vorza_actions(event_id,delivery_id,external_id,action,payload,deadline)
             VALUES (%s,%s,%s,'close',%s,%s) ON CONFLICT DO NOTHING""",
             (event['id'],event['delivery_id'],event['signal_id'],Json(body),event['received_at']+timedelta(hours=1)))


def request_action(external_id,action,reason=None,note=''):
    # Operator-only local CLI; not a public mutation endpoint. It never sends HTTP.
    if not enabled():
        raise ValueError('VORZA desactivado; no se acumulan acciones manuales')
    body=action_body(external_id,action,reason,note)
    with connect() as conn,conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('SELECT enabled FROM vorza_control WHERE id=1 FOR SHARE')
        control=cur.fetchone()
        if not control or not control['enabled']:
            raise ValueError('VORZA desactivado en base de datos')
        cur.execute("SELECT id FROM vorza_deliveries WHERE external_id=%s AND state='delivered' AND remote_id IS NOT NULL AND remote_uid IS NOT NULL",(external_id,))
        parent=cur.fetchone()
        if not parent:
            raise ValueError('No existe publicacion confirmada; no se solicita la accion')
        cur.execute("""INSERT INTO vorza_actions(delivery_id,external_id,action,payload,deadline)
         VALUES (%s,%s,%s,%s,now()+interval '1 hour') ON CONFLICT(external_id,action) DO NOTHING RETURNING id""",
         (parent['id'],external_id,action,Json(body)))
        row=cur.fetchone()
        if row:
            return row['id']
        cur.execute('SELECT id,payload FROM vorza_actions WHERE external_id=%s AND action=%s',(external_id,action))
        row=cur.fetchone()
        if row['payload'] != body:
            raise ValueError('La accion ya existe con otros datos; no se modifica ni reenvia')
        return row['id']


def deliver_action(config):
    if not enabled():
        return False
    with connect() as conn,conn.cursor(cursor_factory=RealDictCursor) as cur:
        job=claim_action(cur,config.rate)
    if not job:
        return False
    result=send_action(job['payload'],config.key,job['expected_remote_id'],job['expected_remote_uid'])
    with connect() as conn,conn.cursor() as cur:
        state=finish_action(cur,job,result)
    audit('VORZA ACCION RESULTADO',event_id=job['event_id'],signalId=job['external_id'],
          accion=job['action'],estado=state,http=result.http,detalle=result.detail,
          intento=job['attempts'],remote_id=result.remote_id,open_trades_notified=result.open_trades_notified)
    return True


if __name__=='__main__':
    main()
