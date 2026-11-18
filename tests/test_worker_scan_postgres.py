"""Regression against session-local TEMP rows. Never sends HTTP or updates public data."""
import os
import unittest
from unittest.mock import patch
import psycopg2
from psycopg2.extras import Json
import worker
from onza_processing import DeferredEvent


@unittest.skipUnless(os.getenv('WORKER_TEST_DATABASE_URL'), 'PostgreSQL TEMP opt-in')
class WorkerScanSQLTests(unittest.TestCase):
    def setUp(self):
        self.conn = psycopg2.connect(os.environ['WORKER_TEST_DATABASE_URL'], connect_timeout=5)
        self.addCleanup(self.conn.close)
        with self.conn, self.conn.cursor() as cur:
            cur.execute("""CREATE TEMP TABLE tv_events (
                id bigint PRIMARY KEY, payload jsonb, received_at timestamptz DEFAULT now(),
                state text DEFAULT 'pending', applied_at timestamptz,
                telegram_status text DEFAULT 'pending', onza_status text DEFAULT 'skipped', error text)""")
            cur.execute("SELECT relpersistence FROM pg_class WHERE oid='tv_events'::regclass")
            self.assertEqual(cur.fetchone()[0], 't')
        self.addCleanup(patch.stopall)
        patch.object(worker, '_process_after_id', 0).start()
        patch.object(worker, 'connect', return_value=self.conn).start()
        patch.object(worker, 'audit').start()
        patch.object(worker, 'audit_wait').start()

    def event(self, n, kind='entry'):
        with self.conn, self.conn.cursor() as cur:
            cur.execute('INSERT INTO tv_events(id,payload) VALUES (%s,%s)',
                        (n, Json({'signalId': str(n), 'typeSignal': kind})))

    def state(self, n):
        with self.conn, self.conn.cursor() as cur:
            cur.execute('SELECT state,telegram_status,onza_status FROM tv_events WHERE id=%s', (n,))
            return cur.fetchone()

    def test_fifty_orphans_do_not_starve_new_entry_and_wrap_retries_dependency(self):
        for n in range(1, 51):
            self.event(n, 'tp1')
        self.event(51)
        ready = set()
        calls = []
        def apply(cur, payload, stamp):
            n = int(payload['signalId'])
            calls.append(n)
            if payload['typeSignal'] != 'entry' and n not in ready:
                raise DeferredEvent('Esperando la entrada')
            ready.add(1)
        with patch.object(worker, 'apply_event', side_effect=apply), patch.object(worker, 'post_telegram') as http:
            self.assertEqual(worker.apply_pending(), 0)
            self.assertEqual(worker.apply_pending(), 1)
            self.assertEqual(self.state(51), ('applied', 'pending', 'skipped'))
            self.assertEqual(worker.apply_pending(), 1)
            self.assertEqual(self.state(1), ('applied', 'pending', 'skipped'))
            self.assertEqual(self.state(2), ('pending', 'pending', 'skipped'))
            self.assertEqual(calls.count(51), 1)
            http.assert_not_called()

    def test_lower_id_dependency_is_retried_after_entry_in_later_batch(self):
        self.event(1, 'tp1')
        self.event(2)
        entry_ready = False
        def apply(cur, payload, stamp):
            nonlocal entry_ready
            if payload['typeSignal'] == 'entry':
                entry_ready = True
            elif not entry_ready:
                raise DeferredEvent('Esperando la entrada')
        with patch.object(worker, 'apply_event', side_effect=apply):
            self.assertEqual(worker.apply_pending(limit=1), 0)
            self.assertEqual(worker.apply_pending(limit=1), 1)
            self.assertEqual(worker.apply_pending(limit=1), 1)
        self.assertEqual(self.state(1)[0], 'applied')

    def test_empty_queue_then_new_entry_and_invalid_batch(self):
        self.assertEqual(worker.apply_pending(), 0)
        self.event(100)
        with patch.object(worker, 'apply_event') as apply:
            self.assertEqual(worker.apply_pending(), 1)
            self.assertEqual(worker.apply_pending(), 0)
            self.event(101)
            self.assertEqual(worker.apply_pending(), 1)
            self.assertEqual(apply.call_count, 2)
        with self.assertRaises(ValueError):
            worker.apply_pending(limit=0)

    def test_restart_revisits_pending_without_reapplying_confirmed_event(self):
        self.event(1)
        self.event(2)
        with patch.object(worker, 'apply_event') as apply:
            self.assertEqual(worker.apply_pending(limit=1), 1)
            worker._process_after_id = 0
            self.assertEqual(worker.apply_pending(limit=1), 1)
            self.assertEqual(apply.call_count, 2)


if __name__ == '__main__':
    unittest.main()
