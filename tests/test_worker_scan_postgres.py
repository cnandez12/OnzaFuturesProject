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
                telegram_status text DEFAULT 'pending', onza_status text DEFAULT 'skipped', error text,
                telegram_result text, telegram_message_id bigint, signal_id text, event_type text, image_sequence bigint)""")
            cur.execute("CREATE TEMP TABLE telegram_channel_state(name text PRIMARY KEY,value text NOT NULL)")
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

    def test_telegram_429_persists_pause_and_prevents_next_http(self):
        from telegram_delivery import TelegramDelivery
        from telegram_rate import defer
        self.event(100)
        payload = {"signalId": "100", "typeSignal": "entry"}
        with patch.object(worker, "claim_delivery", return_value=(100,payload,None,None,None)), \
             patch.object(worker, "post_telegram", return_value=TelegramDelivery("pending","HTTP 429",retry_after=77)):
            self.assertTrue(worker.deliver_one("telegram"))
        self.assertEqual(self.state(100)[1], "pending")
        with self.conn, self.conn.cursor() as cur:
            defer(cur, 4)  # A concurrent success must never shorten the 429 cooldown.
            cur.execute("SELECT value::timestamptz > now()+interval '60 seconds' FROM telegram_channel_state WHERE name='main_retry_after'")
            self.assertTrue(cur.fetchone()[0])
        with patch.dict(os.environ, TELEGRAM_BOT_TOKEN="test", DESTINATION_CHANNEL_ID="-1"), \
             patch.object(worker, "post_telegram") as http:
            self.assertFalse(worker.deliver_one("telegram"))
            http.assert_not_called()

    def test_confirmed_and_ambiguous_messages_are_not_claimed_after_cooldown(self):
        for n, status in [(1,'delivered'),(2,'unknown'),(3,'sending'),(4,'failed')]:
            self.event(n)
            with self.conn, self.conn.cursor() as cur:
                cur.execute("UPDATE tv_events SET state='applied',telegram_status=%s WHERE id=%s", (status,n))
        with patch.dict(os.environ, TELEGRAM_BOT_TOKEN="test", DESTINATION_CHANNEL_ID="-1"):
            self.assertIsNone(worker.claim_delivery('telegram'))
        for n, status in [(1,'delivered'),(2,'unknown'),(3,'sending'),(4,'failed')]:
            self.assertEqual(self.state(n)[1],status)

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
