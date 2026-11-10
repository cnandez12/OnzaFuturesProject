"""Independent durable VORZA queue, bounded retries and a shared publisher rate budget."""
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
    else:
        cur.execute("UPDATE vorza_control SET enabled=true,updated_at=now() WHERE id=1")


ENTRY_SQL = """SELECT e.id,e.signal_id,e.payload,e.received_at FROM tv_events e
 WHERE e.id >= (SELECT first_event_id FROM vorza_control WHERE id=1 AND enabled)
 AND e.event_type='entry' AND e.state='applied'
 AND NOT EXISTS(SELECT 1 FROM vorza_deliveries d WHERE d.event_id=e.id)
 ORDER BY e.id LIMIT 100"""


def claim(cur, rate):
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
    cur.execute("SELECT count(*) FROM vorza_attempts WHERE started_at > now()-interval '60 seconds'")
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
     recipients=%s,duplicate=%s,remote_expires_at=%s WHERE id=%s AND state='sending'""",
     (state,result.http,result.detail,state,delay,result.remote_id,result.uid,result.recipients,
      result.duplicate,result.expires_at,job['id']))
    if result.http==429:
        cur.execute("""UPDATE vorza_control SET rate_limited_until=GREATEST(COALESCE(rate_limited_until,now()),
         now()+%s*interval '1 second') WHERE id=1""",(max(60,result.retry_after),))
    return state
