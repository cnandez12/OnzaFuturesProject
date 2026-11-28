"""Durable derived data in an isolated web_audit schema. Never writes source tables."""
import json
from psycopg2.extras import Json

SCHEMA="""
CREATE SCHEMA IF NOT EXISTS web_audit;
CREATE SEQUENCE IF NOT EXISTS web_audit.revision_seq;
CREATE TABLE IF NOT EXISTS web_audit.evidence (
 signal_id TEXT PRIMARY KEY, record JSONB NOT NULL,
 revision BIGINT NOT NULL DEFAULT nextval('web_audit.revision_seq'),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS web_audit.health (
 id INTEGER PRIMARY KEY CHECK(id=1), enabled BOOLEAN NOT NULL DEFAULT FALSE,
 activation_event_id BIGINT NOT NULL, heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 last_completed_at TIMESTAMPTZ, status TEXT NOT NULL DEFAULT 'warming', detail JSONB NOT NULL DEFAULT '{}'::jsonb
);
"""

def initialize(conn,activation_id):
    with conn:
        with conn.cursor() as cur:
            cur.execute(SCHEMA)
            cur.execute("INSERT INTO web_audit.health(id,activation_event_id) VALUES(1,%s) ON CONFLICT(id) DO NOTHING",(activation_id,))

def read_state(cur):
    cur.execute("SELECT signal_id,record FROM web_audit.evidence")
    records={r['signal_id']:r['record'] for r in cur.fetchall()}
    cur.execute("SELECT * FROM web_audit.health WHERE id=1")
    return records,dict(cur.fetchone() or {})

def publish(conn,records,status,detail):
    # One transaction makes the new state visible to both websites together.
    with conn:
        with conn.cursor() as cur:
            for sid,record in records.items():
                cur.execute("""INSERT INTO web_audit.evidence(signal_id,record) VALUES(%s,%s)
                  ON CONFLICT(signal_id) DO UPDATE SET record=EXCLUDED.record,
                    revision=nextval('web_audit.revision_seq'),updated_at=now()
                  WHERE web_audit.evidence.record IS DISTINCT FROM EXCLUDED.record""",(sid,Json(record)))
            cur.execute("""UPDATE web_audit.health SET heartbeat_at=now(),last_completed_at=now(),status=%s,detail=%s,enabled=TRUE WHERE id=1""",(status,Json(detail)))

def heartbeat(conn,status,detail):
    with conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE web_audit.health SET heartbeat_at=now(),status=%s,detail=%s,enabled=TRUE WHERE id=1",(status,Json(detail)))

SOURCE_SQL="""SELECT e.id,e.signal_id,e.event_type,e.payload,e.received_at,e.applied_at,e.state,
 s.id AS signal_pk,s.id IS NOT NULL AS signal_exists
 FROM public.tv_events e LEFT JOIN public.tv_signals s ON s.signal_id=e.signal_id
 ORDER BY e.received_at,e.id"""
