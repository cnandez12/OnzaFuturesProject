import os
import unittest
from unittest.mock import patch, Mock
import psycopg2
from onza_control import onza_enabled, configure_onza, CONTROL_SCHEMA
from onza_queue import POLICY_SCHEMA, CLAIM_SQL
from onza_delivery import post_onza, post_telegram
import worker

class SwitchTests(unittest.TestCase):
    def test_only_explicit_true_enables(self):
        for value, expected in [("true",True),(" TRUE ",True),("false",False),("0",False),("",False),("invalid",False)]:
            with patch.dict(os.environ,ONZA_ENABLED=value):
                self.assertEqual(onza_enabled(),expected)
        with patch.dict(os.environ,{},clear=True):self.assertFalse(onza_enabled())

    def test_disabled_never_claims_or_sends_even_with_key(self):
        with patch.dict(os.environ,ONZA_ENABLED="false",ONZA_API_KEY="0"), patch('worker.connect') as db, patch('onza_delivery.requests.post') as http:
            self.assertIsNone(worker.claim_delivery('onza'))
            self.assertEqual(post_onza({})[0],'skipped')
            db.assert_not_called();http.assert_not_called()

    def test_telegram_still_sends_with_onza_disabled(self):
        response=Mock(status_code=200)
        response.json.return_value={'ok':True,'result':{'message_id':123,'chat':{'id':-1}}}
        payload={'typeSignal':'entry','symbol':'BTCUSD.P','direction':'LONG','timeframe':'1H','leverage':20,'entry':100,'takeProfits':[{'price':101,'roi':20}],'stopLoss':{'price':99},'signalId':'test'}
        with patch.dict(os.environ,ONZA_ENABLED='false',TELEGRAM_BOT_TOKEN='dummy',DESTINATION_CHANNEL_ID='-1'),patch('onza_delivery.requests.post',return_value=response) as http:
            self.assertEqual(post_telegram(payload,None).status,'delivered')
            self.assertIn('/sendMessage',http.call_args.args[0])

@unittest.skipUnless(os.getenv('ONZA_QUEUE_TEST_DATABASE_URL'),'PostgreSQL TEMP-table test opt-in')
class PauseResumeSQLTests(unittest.TestCase):
    def setUp(self):
        self.conn=psycopg2.connect(os.environ['ONZA_QUEUE_TEST_DATABASE_URL'],connect_timeout=5)
        self.addCleanup(self.conn.close)
        self.cur=self.conn.cursor()
        self.cur.execute('SET LOCAL statement_timeout=10000')
        self.cur.execute("""CREATE TEMP TABLE tv_events(id bigint PRIMARY KEY,signal_id text,event_type text,payload jsonb,received_at timestamptz DEFAULT now(),state text DEFAULT 'applied',onza_status text DEFAULT 'pending',onza_result text,telegram_status text DEFAULT 'pending')""")
        self.cur.execute(POLICY_SCHEMA.replace('CREATE TABLE IF NOT EXISTS','CREATE TEMP TABLE IF NOT EXISTS'))
        self.cur.execute(CONTROL_SCHEMA.replace('CREATE TABLE IF NOT EXISTS','CREATE TEMP TABLE IF NOT EXISTS'))

    def event(self,n,sid,kind='entry',status='pending'):
        self.cur.execute('INSERT INTO tv_events(id,signal_id,event_type,onza_status) VALUES (%s,%s,%s,%s)',(n,sid,kind,status))

    def test_pause_resume_excludes_backlog_but_preserves_other_channels(self):
        configure_onza(self.cur,True)
        self.event(1,'before');self.event(2,'done',status='delivered');self.event(3,'ambiguous',status='unknown')
        configure_onza(self.cur,False)
        self.event(4,'during') # includes worker downtime / old producers
        configure_onza(self.cur,True)
        self.event(5,'after');self.event(6,'during','tp1')
        self.cur.execute(CLAIM_SQL)
        self.assertEqual([r[0] for r in self.cur.fetchall()],[5])
        self.cur.execute('SELECT id,onza_status,state,telegram_status FROM tv_events ORDER BY id')
        rows=self.cur.fetchall()
        self.assertEqual([r[1] for r in rows[:4]],['skipped','delivered','unknown','skipped'])
        self.assertTrue(all(r[2:] == ('applied','pending') for r in rows))

    def test_enabled_restart_keeps_new_queue(self):
        configure_onza(self.cur,True);self.event(1,'live')
        configure_onza(self.cur,True)
        self.cur.execute(CLAIM_SQL)
        self.assertEqual([r[0] for r in self.cur.fetchall()],[1])

    def test_paused_restart_advances_boundary(self):
        configure_onza(self.cur,False);self.event(1,'paused')
        configure_onza(self.cur,False)
        self.cur.execute('SELECT onza_status FROM tv_events WHERE id=1')
        self.assertEqual(self.cur.fetchone()[0],'skipped')
        self.cur.execute('SELECT first_event_id FROM onza_delivery_policy WHERE id=1')
        self.assertEqual(self.cur.fetchone()[0],2)
