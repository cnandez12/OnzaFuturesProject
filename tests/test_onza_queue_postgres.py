"""Regression tests use connection-local TEMP tables only; no webhook calls."""
import os
import unittest

import psycopg2
from psycopg2.extras import RealDictCursor, Json

from onza_queue import CLAIM_SQL, POLICY_SCHEMA


@unittest.skipUnless(os.getenv('ONZA_QUEUE_TEST_DATABASE_URL'), 'PostgreSQL TEMP-table test opt-in')
class LiveQueueTests(unittest.TestCase):
    def setUp(self):
        self.conn = psycopg2.connect(os.environ['ONZA_QUEUE_TEST_DATABASE_URL'], connect_timeout=5)
        self.addCleanup(self.conn.close)
        self.cur = self.conn.cursor(cursor_factory=RealDictCursor)
        self.cur.execute('SET LOCAL statement_timeout=10000')
        self.cur.execute('''CREATE TEMP TABLE tv_events (
            id bigint PRIMARY KEY, signal_id text, event_type text, payload jsonb,
            received_at timestamptz DEFAULT now(), state text DEFAULT 'applied',
            onza_status text DEFAULT 'pending', telegram_status text DEFAULT 'pending')''')
        self.policy_sql = POLICY_SCHEMA.replace('CREATE TABLE IF NOT EXISTS', 'CREATE TEMP TABLE IF NOT EXISTS')

    def event(self, n, sid, kind='entry', status='pending'):
        self.cur.execute('INSERT INTO tv_events(id,signal_id,event_type,payload,onza_status) VALUES (%s,%s,%s,%s,%s)',
                         (n, sid, kind, Json({'signalId':sid, 'typeSignal':kind}), status))

    def boundary(self):
        self.cur.execute(self.policy_sql)
        self.cur.execute('SELECT first_event_id FROM onza_delivery_policy WHERE id=1')
        return self.cur.fetchone()['first_event_id']

    def candidates(self):
        self.cur.execute(CLAIM_SQL)
        return [r['id'] for r in self.cur.fetchall()]

    def test_more_than_500_blocked_updates_do_not_hide_ready_entry(self):
        self.boundary()
        for i in range(1, 652):
            self.event(i, 'blocked', 'tp2')
        self.event(1000, 'blocked', status='unknown')
        self.event(2000, 'fresh')
        self.assertEqual(self.candidates(), [2000])

    def test_cutoff_is_persistent_and_never_replays_old_signal(self):
        self.event(40, 'historical')
        self.assertEqual(self.boundary(), 41)
        self.event(41, 'historical', 'tp1')
        self.event(42, 'fresh')
        self.assertEqual(self.boundary(), 41)
        self.assertEqual(self.candidates(), [42])

    def test_no_confirmation_no_tp_but_other_signal_can_advance(self):
        self.boundary()
        self.event(1, 'a', status='unknown')
        self.event(2, 'a', 'tp1')
        self.event(3, 'b', status='delivered')
        self.event(4, 'b', 'tp1')
        self.event(5, 'b', 'tp2')
        self.assertEqual(self.candidates(), [4])
        self.cur.execute("UPDATE tv_events SET onza_status='delivered' WHERE id=4")
        self.assertEqual(self.candidates(), [5])

    def test_risk_exit_does_not_wait_for_uncertain_tp(self):
        self.boundary()
        self.event(1, 'a', status='delivered')
        self.event(2, 'a', 'tp1', 'unknown')
        self.event(3, 'a', 'sl')
        self.assertEqual(self.candidates(), [3])

    def test_uncertain_terminal_blocks_other_exit_without_replay(self):
        self.boundary()
        self.event(1, 'a', status='delivered')
        self.event(2, 'a', 'sl', 'unknown')
        self.event(3, 'a', 'close')
        self.event(4, 'independent')
        self.assertEqual(self.candidates(), [4])

    def test_missing_policy_row_fails_closed(self):
        self.boundary()
        self.cur.execute('DELETE FROM onza_delivery_policy')
        self.event(1, 'fresh')
        self.assertEqual(self.candidates(), [])


if __name__ == '__main__':
    unittest.main()
