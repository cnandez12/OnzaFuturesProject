"""Independent durable VORZA queue, bounded retries and a shared publisher rate budget."""
from psycopg2.extras import Json

SCHEMA = """
CREATE TABLE IF NOT EXISTS vorza_control (
 id INTEGER PRIMARY KEY CHECK(id=1), enabled BOOLEAN NOT NULL,
 first_event_id BIGINT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 rate_limited_until TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS vorza_deliveries (
 id BIGSERIAL PRIMARY KEY, event_id BIGINT NOT NULL UNIQUE,
 external_id TEXT NOT NULL UNIQUE, payload JSONB NOT NULL,
 state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), deadline TIMESTAMPTZ NOT NULL,
 next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(), started_at TIMESTAMPTZ,
 finished_at TIMESTAMPTZ, http_status INTEGER, detail TEXT,
 remote_id TEXT, remote_uid TEXT, recipients INTEGER, duplicate BOOLEAN,
 remote_expires_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_vorza_ready ON vorza_deliveries(next_attempt_at,id)
 WHERE state IN ('pending','retry');
CREATE TABLE IF NOT EXISTS vorza_attempts (
 id BIGSERIAL PRIMARY KEY, delivery_id BIGINT NOT NULL,
 started_at TIMESTAMPTZ NOT NULL DEFAULT now(), finished_at TIMESTAMPTZ,
 state TEXT, http_status INTEGER, detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_vorza_attempts_started ON vorza_attempts(started_at);
"""
MAX_ATTEMPTS = 6


def configure(cur, enabled):
    cur.execute("SELECT enabled FROM vorza_control WHERE id=1 FOR UPDATE")
    row = cur.fetchone()
    previous = (row["enabled"] if isinstance(row, dict) else row[0]) if row else None
    if not enabled or previous is not True:
        cur.execute("LOCK TABLE tv_events IN SHARE MODE")
        cur.execute("SELECT COALESCE(MAX(id),0)+1 FROM tv_events")
        boundary = cur.fetchone()
        floor = boundary[0] if not isinstance(boundary, dict) else next(iter(boundary.values()))
        cur.execute("""INSERT INTO vorza_control(id,enabled,first_event_id) VALUES (1,%s,%s)
         ON CONFLICT(id) DO UPDATE SET enabled=EXCLUDED.enabled,
         first_event_id=GREATEST(vorza_control.first_event_id,EXCLUDED.first_event_id),updated_at=now()""",(enabled,floor))
        cur.execute("""UPDATE vorza_deliveries SET state='skipped',finished_at=now(),
         detail='Corte de pausa/reactivacion; sin reenvio de acumulados'
         WHERE state IN ('pending','retry','sending')""")
        cur.execute("""UPDATE vorza_actions SET state='skipped',finished_at=now(),
         detail='Corte de pausa/reactivacion; accion acumulada excluida'
         WHERE state IN ('pending','retry','sending')""")
    else:
        cur.execute("UPDATE vorza_control SET enabled=true,updated_at=now() WHERE id=1")


ENTRY_SQL = """SELECT e.id,e.signal_id,e.payload,e.received_at FROM tv_events e
 WHERE e.id >= (SELECT first_event_id FROM vorza_control WHERE id=1 AND enabled)
 AND e.event_type='entry' AND e.state='applied'
 AND NOT EXISTS(SELECT 1 FROM vorza_deliveries d WHERE d.event_id=e.id)
 ORDER BY e.id LIMIT 100"""


def claim(cur, rate):
    rate = min(rate, 10)
    # Serializes rate reservations across all replicas, without holding DB locks during HTTP.
    cur.execute("SELECT pg_advisory_xact_lock(191106100)")
    cur.execute("SELECT enabled,rate_limited_until FROM vorza_control WHERE id=1 FOR UPDATE")
    control=cur.fetchone()
    if not control or not control["enabled"]:
        return None
    cur.execute("""UPDATE vorza_deliveries SET state='unknown',finished_at=now(),detail='Sin acuse final antes del vencimiento'
     WHERE state='sending' AND deadline <= now()""")
    cur.execute("""UPDATE vorza_deliveries SET state='expired',finished_at=now(),detail='Vigencia agotada; no publicar entrada antigua'
     WHERE state IN ('pending','retry') AND deadline <= now()""")
    cur.execute("""UPDATE vorza_deliveries d SET state='skipped',finished_at=now(),
     detail='Señal ya avanzada; no publicar como entrada nueva'
     WHERE d.state='pending' AND d.attempts=0 AND EXISTS (
       SELECT 1 FROM tv_events e WHERE e.signal_id=d.external_id
       AND e.event_type<>'entry' AND e.state='applied')""")
    # Recover interrupted HTTP safely using the same immutable body/external_id.
    cur.execute("""UPDATE vorza_deliveries SET state=CASE WHEN attempts >= %s THEN 'unknown' ELSE 'retry' END,
     next_attempt_at=now(),detail='Trabajador interrumpido; mismo external_id'
     WHERE state='sending' AND started_at < now()-interval '60 seconds'""",(MAX_ATTEMPTS,))
    cur.execute(ATTEMPT_COUNT_SQL)
    if cur.fetchone()["count"] >= rate:
        return None
    cur.execute("SELECT 1 FROM vorza_control WHERE id=1 AND rate_limited_until > now()")
    if cur.fetchone():
        return None
    cur.execute("""SELECT d.* FROM vorza_deliveries d
     WHERE d.state IN ('pending','retry') AND d.next_attempt_at <= now() AND d.deadline > now()
     AND d.attempts < %s
     ORDER BY d.next_attempt_at,d.id LIMIT 1 FOR UPDATE SKIP LOCKED""",(MAX_ATTEMPTS,))
    job=cur.fetchone()
    if not job:
        return None
    cur.execute("""UPDATE vorza_deliveries SET state='sending',attempts=attempts+1,started_at=now()
     WHERE id=%s RETURNING attempts""",(job["id"],))
    job["attempts"]=cur.fetchone()["attempts"]
    cur.execute("INSERT INTO vorza_attempts(delivery_id) VALUES (%s) RETURNING id",(job["id"],))
    job["attempt_id"]=cur.fetchone()["id"]
    return job


def finish(cur,job,result):
    state=result.state
    if state=='retry' and job['attempts'] >= MAX_ATTEMPTS:
        state='unknown' # Never claim a timed-out publish was definitely rejected.
    delay=max(result.retry_after,(5,15,60,60,60,60)[min(job['attempts']-1,5)])
    cur.execute("""UPDATE vorza_attempts SET finished_at=now(),state=%s,http_status=%s,detail=%s WHERE id=%s""",
                (state,result.http,result.detail,job['attempt_id']))
    cur.execute("""UPDATE vorza_deliveries SET state=%s,http_status=%s,detail=%s,
     finished_at=CASE WHEN %s='retry' THEN NULL ELSE now() END,
     next_attempt_at=now()+%s*interval '1 second',remote_id=%s,remote_uid=%s,
     recipients=%s,duplicate=%s,remote_expires_at=%s,remote_tp_split=%s,remote_status=%s,error_code=%s,remote_closed_at=%s,close_reason=%s WHERE id=%s AND state='sending'""",
     (state,result.http,result.detail,state,delay,result.remote_id,result.uid,result.recipients,
      result.duplicate,result.expires_at,Json(list(result.tp_split)) if result.tp_split else None,result.remote_status,result.error_code,result.closed_at,result.close_reason,job['id']))
    if result.http==429:
        cur.execute("""UPDATE vorza_control SET rate_limited_until=GREATEST(COALESCE(rate_limited_until,now()),
         now()+%s*interval '1 second') WHERE id=1""",(max(60,result.retry_after),))
    return state


SCHEMA += """
ALTER TABLE vorza_deliveries ADD COLUMN IF NOT EXISTS remote_tp_split JSONB;
ALTER TABLE vorza_deliveries ADD COLUMN IF NOT EXISTS remote_status TEXT;
ALTER TABLE vorza_deliveries ADD COLUMN IF NOT EXISTS error_code TEXT;
ALTER TABLE vorza_deliveries ADD COLUMN IF NOT EXISTS remote_closed_at TIMESTAMPTZ;
ALTER TABLE vorza_deliveries ADD COLUMN IF NOT EXISTS close_reason TEXT;
CREATE TABLE IF NOT EXISTS vorza_actions (
 id BIGSERIAL PRIMARY KEY, event_id BIGINT UNIQUE, delivery_id BIGINT NOT NULL,
 external_id TEXT NOT NULL, action TEXT NOT NULL CHECK(action IN ('close','cancel')),
 payload JSONB NOT NULL, state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), deadline TIMESTAMPTZ NOT NULL,
 next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(), started_at TIMESTAMPTZ,
 finished_at TIMESTAMPTZ, http_status INTEGER, detail TEXT, error_code TEXT,
 remote_id TEXT, remote_uid TEXT, remote_status TEXT, duplicate BOOLEAN,
 remote_closed_at TIMESTAMPTZ, close_reason TEXT, open_trades_notified INTEGER,
 UNIQUE(external_id,action)
);
CREATE INDEX IF NOT EXISTS idx_vorza_action_ready ON vorza_actions(next_attempt_at,id)
 WHERE state IN ('pending','retry');
CREATE TABLE IF NOT EXISTS vorza_action_attempts (
 id BIGSERIAL PRIMARY KEY, action_id BIGINT NOT NULL,
 started_at TIMESTAMPTZ NOT NULL DEFAULT now(), finished_at TIMESTAMPTZ,
 state TEXT, http_status INTEGER, detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_vorza_action_attempt_time ON vorza_action_attempts(started_at);
"""

ATTEMPT_COUNT_SQL = """SELECT (
 (SELECT count(*) FROM vorza_attempts WHERE started_at > now()-interval '60 seconds') +
 (SELECT count(*) FROM vorza_action_attempts WHERE started_at > now()-interval '60 seconds')
) AS count"""

ACTION_EVENT_SQL = """SELECT e.id,e.signal_id,e.payload,e.received_at,d.id AS delivery_id
 FROM tv_events e JOIN vorza_deliveries d ON d.external_id=e.signal_id
 WHERE e.id >= (SELECT first_event_id FROM vorza_control WHERE id=1 AND enabled)
 AND e.event_type='close' AND e.state='applied' AND d.state='delivered'
 AND d.remote_id IS NOT NULL AND d.remote_uid IS NOT NULL
 AND NOT EXISTS(SELECT 1 FROM vorza_actions a WHERE a.external_id=e.signal_id AND a.action='close')
 ORDER BY e.id LIMIT 100"""


def claim_action(cur,rate):
    cur.execute("SELECT pg_advisory_xact_lock(191106100)")
    cur.execute("SELECT enabled FROM vorza_control WHERE id=1 FOR UPDATE")
    control=cur.fetchone()
    if not control or not control['enabled']:
        return None
    cur.execute("""UPDATE vorza_actions SET state=CASE WHEN state='sending' THEN 'unknown' ELSE 'expired' END,
     finished_at=now(),detail='Plazo local agotado; revisar accion'
     WHERE state IN ('pending','retry','sending') AND deadline <= now()""")
    cur.execute("""UPDATE vorza_actions SET state=CASE WHEN attempts >= %s THEN 'unknown' ELSE 'retry' END,
     next_attempt_at=now(),detail='Trabajador interrumpido; misma accion y external_id'
     WHERE state='sending' AND started_at < now()-interval '60 seconds'""",(MAX_ATTEMPTS,))
    cur.execute(ATTEMPT_COUNT_SQL)
    if cur.fetchone()['count'] >= min(rate,10):
        return None
    cur.execute("SELECT 1 FROM vorza_control WHERE id=1 AND rate_limited_until > now()")
    if cur.fetchone():
        return None
    cur.execute("""SELECT a.*,d.remote_id AS expected_remote_id,d.remote_uid AS expected_remote_uid
     FROM vorza_actions a JOIN vorza_deliveries d ON d.id=a.delivery_id AND d.external_id=a.external_id
     WHERE a.state IN ('pending','retry') AND a.next_attempt_at <= now() AND a.deadline > now()
     AND a.attempts < %s AND d.state='delivered' AND d.remote_id IS NOT NULL AND d.remote_uid IS NOT NULL
     ORDER BY a.next_attempt_at,a.id LIMIT 1 FOR UPDATE OF a SKIP LOCKED""",(MAX_ATTEMPTS,))
    job=cur.fetchone()
    if not job:
        return None
    cur.execute("UPDATE vorza_actions SET state='sending',attempts=attempts+1,started_at=now() WHERE id=%s RETURNING attempts",(job['id'],))
    job['attempts']=cur.fetchone()['attempts']
    cur.execute("INSERT INTO vorza_action_attempts(action_id) VALUES (%s) RETURNING id",(job['id'],))
    job['attempt_id']=cur.fetchone()['id']
    return job


def finish_action(cur,job,result):
    state='unknown' if result.state=='retry' and job['attempts'] >= MAX_ATTEMPTS else result.state
    delay=max(result.retry_after,(5,15,60,60,60,60)[min(job['attempts']-1,5)])
    cur.execute("UPDATE vorza_action_attempts SET finished_at=now(),state=%s,http_status=%s,detail=%s WHERE id=%s",
                (state,result.http,result.detail,job['attempt_id']))
    cur.execute("""UPDATE vorza_actions SET state=%s,http_status=%s,detail=%s,error_code=%s,
     finished_at=CASE WHEN %s='retry' THEN NULL ELSE now() END,
     next_attempt_at=now()+%s*interval '1 second',remote_id=%s,remote_uid=%s,
     remote_status=%s,duplicate=%s,remote_closed_at=%s,close_reason=%s,open_trades_notified=%s
     WHERE id=%s AND state='sending'""",
     (state,result.http,result.detail,result.error_code,state,delay,result.remote_id,result.uid,
      result.remote_status,result.duplicate,result.closed_at,result.close_reason,result.open_trades_notified,job['id']))
    changed=cur.rowcount
    if changed and state=='delivered':
        cur.execute("UPDATE vorza_deliveries SET remote_status=%s,remote_closed_at=%s,close_reason=%s WHERE id=%s",(result.remote_status,result.closed_at,result.close_reason,job['delivery_id']))
    if result.http==429:
        cur.execute("""UPDATE vorza_control SET rate_limited_until=GREATEST(COALESCE(rate_limited_until,now()),
         now()+%s*interval '1 second') WHERE id=1""",(max(60,result.retry_after),))
    if not changed:
        cur.execute("SELECT state FROM vorza_actions WHERE id=%s",(job['id'],))
        row=cur.fetchone()
        state=row['state'] if isinstance(row,dict) else row[0]
    return state
