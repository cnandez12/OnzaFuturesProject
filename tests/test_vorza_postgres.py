"""Only connection-local TEMP tables; no HTTP or modifications to production rows."""
import os
import unittest
from unittest.mock import patch
from datetime import datetime,timezone
import psycopg2
from psycopg2.extras import RealDictCursor,Json
from vorza_queue import SCHEMA,configure,claim,finish,ENTRY_SQL
from vorza_delivery import Result,settings
import vorza_worker

@unittest.skipUnless(os.getenv('VORZA_TEST_DATABASE_URL'),'PostgreSQL TEMP-table opt-in')
class VorzaQueueSQLTests(unittest.TestCase):
    def setUp(self):
        self.conn=psycopg2.connect(os.environ['VORZA_TEST_DATABASE_URL'],connect_timeout=5)
        self.addCleanup(self.conn.close)
        self.cur=self.conn.cursor(cursor_factory=RealDictCursor)
        self.cur.execute('SET LOCAL statement_timeout=10000')
        self.cur.execute("""CREATE TEMP TABLE tv_events(id bigint PRIMARY KEY,signal_id text,event_type text,
         state text DEFAULT 'applied',payload jsonb,received_at timestamptz DEFAULT now(),
         telegram_status text DEFAULT 'pending',onza_status text DEFAULT 'skipped')""")
        self.cur.execute(SCHEMA.replace('CREATE TABLE IF NOT EXISTS','CREATE TEMP TABLE IF NOT EXISTS'))
        configure(self.cur,True)

    def event(self,n,sid,kind='entry'):
        self.cur.execute('INSERT INTO tv_events(id,signal_id,event_type) VALUES (%s,%s,%s)',(n,sid,kind))

    def job(self,n,sid='live',state='pending'):
        self.cur.execute("""INSERT INTO vorza_deliveries(event_id,external_id,payload,deadline,state)
         VALUES (%s,%s,%s,now()+interval '20 minutes',%s) RETURNING id""",(n,sid,Json({'external_id':sid}),state))
        return self.cur.fetchone()['id']

    def test_new_signal_cutoff_preserves_history_and_channels(self):
        self.event(1,'history');configure(self.cur,False);self.event(2,'paused')
        configure(self.cur,True);self.event(3,'new')
        self.cur.execute(ENTRY_SQL)
        self.assertEqual([r['id'] for r in self.cur.fetchall()],[3])
        self.cur.execute('SELECT state,telegram_status,onza_status FROM tv_events')
        self.assertTrue(all(tuple(r.values())==('applied','pending','skipped') for r in self.cur.fetchall()))

    def test_pause_skips_only_unfinished_jobs_and_resume_never_replays(self):
        self.job(1,'queued');self.job(2,'inflight','sending');self.job(3,'done','delivered')
        configure(self.cur,False);configure(self.cur,True)
        self.cur.execute('SELECT state FROM vorza_deliveries ORDER BY id')
        self.assertEqual([r['state'] for r in self.cur.fetchall()],['skipped','skipped','delivered'])
        self.assertIsNone(claim(self.cur,20))

    def test_enabled_restart_preserves_queue_and_claim_is_exclusive(self):
        self.job(1);configure(self.cur,True)
        first=claim(self.cur,20);self.assertEqual(first['attempts'],1)
        self.assertIsNone(claim(self.cur,20))

    def test_rate_budget_is_persistent(self):
        for n in range(21):self.job(n+1,str(n))
        for n in range(20):self.assertIsNotNone(claim(self.cur,20))
        self.assertIsNone(claim(self.cur,20))
        self.cur.execute('SELECT count(*) FROM vorza_attempts');self.assertEqual(self.cur.fetchone()['count'],20)

    def test_429_blocks_other_jobs_and_schedules_retry(self):
        self.job(1,'one');self.job(2,'two');job=claim(self.cur,20)
        self.assertEqual(finish(self.cur,job,Result('retry','limited',429,retry_after=90)),'retry')
        self.assertIsNone(claim(self.cur,20))
        self.cur.execute('SELECT next_attempt_at>now() AS waiting FROM vorza_deliveries WHERE id=%s',(job['id'],))
        self.assertTrue(self.cur.fetchone()['waiting'])

    def test_timeouts_retry_same_body_but_stop_at_max(self):
        self.job(1);first=claim(self.cur,20);original=first['payload']
        finish(self.cur,first,Result('retry','timeout'))
        self.cur.execute("UPDATE vorza_deliveries SET next_attempt_at=now(),attempts=5")
        retry=claim(self.cur,20);self.assertEqual(retry['payload'],original)
        self.assertEqual(finish(self.cur,retry,Result('retry','timeout')),'unknown')
        self.assertIsNone(claim(self.cur,20))

    def test_deadline_expiry_prevents_http_candidate(self):
        self.job(1);self.cur.execute("UPDATE vorza_deliveries SET deadline=now()-interval '1 second'")
        self.assertIsNone(claim(self.cur,20))
        self.cur.execute('SELECT state FROM vorza_deliveries');self.assertEqual(self.cur.fetchone()['state'],'expired')

    def test_advanced_signal_is_not_published_as_new(self):
        self.event(1,'live');self.event(2,'live','tp1');self.job(1)
        self.assertIsNone(claim(self.cur,20))
        self.cur.execute('SELECT state FROM vorza_deliveries');self.assertEqual(self.cur.fetchone()['state'],'skipped')

    def test_interrupted_sending_recovers_same_id(self):
        self.job(1);first=claim(self.cur,20)
        self.cur.execute("UPDATE vorza_deliveries SET started_at=now()-interval '61 seconds'")
        recovered=claim(self.cur,20)
        self.assertEqual(recovered['id'],first['id']);self.assertEqual(recovered['external_id'],first['external_id'])
        self.assertEqual(recovered['attempts'],2)

    def test_ack_and_attempt_history_persist_without_secret(self):
        self.job(1);job=claim(self.cur,20)
        result=Result('delivered','Publicado',200,'128','3f6c2a9e-8d4b-4c1e-9a77-0b52d1e4f310',3,True,'2026-11-10T18:00:00+00:00')
        finish(self.cur,job,result)
        self.cur.execute('SELECT state,remote_id,recipients,duplicate FROM vorza_deliveries')
        self.assertEqual(tuple(self.cur.fetchone().values()),('delivered','128',3,True))
        self.cur.execute('SELECT count(*) FROM vorza_attempts WHERE finished_at IS NOT NULL')
        self.assertEqual(self.cur.fetchone()['count'],1)

    def test_enqueue_is_idempotent_and_snapshot_contains_no_key(self):
        from onza_contract import canonicalize
        payload=canonicalize({'signalId':'BTCUSD.P_15M_1790559000000','typeSignal':'entry','symbol':'BTCUSD.P','direction':'LONG','entry':100,'leverage':20,'stopLoss':{'price':98},'takeProfits':[{'price':101},{'price':102},{'price':103}],'timeframe':'15M'})
        self.cur.execute("INSERT INTO tv_events(id,signal_id,event_type,payload) VALUES (1,%s,'entry',%s)",(payload['signalId'],Json(payload)))
        with patch.dict(os.environ,VORZA_SIGNAL_KEY='test-secret',VORZA_COMPANY=''):
            cfg=settings()
        with patch.object(vorza_worker,'connect',return_value=self.conn):
            vorza_worker.enqueue(cfg);vorza_worker.enqueue(cfg)
        self.cur.execute('SELECT payload FROM vorza_deliveries')
        rows=self.cur.fetchall();self.assertEqual(len(rows),1)
        self.assertEqual(rows[0]['payload']['external_id'],payload['signalId'])
        self.assertNotIn('test-secret',str(rows));self.assertNotIn('company',rows[0]['payload'])

    def test_unapplied_entries_never_reach_publish_queue(self):
        self.event(1,'waiting');self.cur.execute("UPDATE tv_events SET state='pending'")
        self.cur.execute(ENTRY_SQL);self.assertEqual(self.cur.fetchall(),[])
