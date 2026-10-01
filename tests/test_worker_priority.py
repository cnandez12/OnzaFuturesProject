import os
import unittest
from unittest.mock import patch

import worker


class Cursor:
    def __init__(self, event):
        self.event = event
        self.sql = []
        self.current = ""

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def execute(self, sql, _params=None):
        self.current = sql
        self.sql.append(sql)

    def fetchall(self):
        if "FOR UPDATE SKIP LOCKED" in self.current:
            return [self.event]
        return []

    def fetchone(self):
        if "RETURNING image_sequence" in self.current:
            return {"image_sequence": None if self.event["event_type"] == "entry" else 1}
        if "FROM trades" in self.current:
            return {"margin_used": 20}
        return None


class Connection:
    def __init__(self, cursor):
        self.saved_cursor = cursor

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def cursor(self, **_kwargs):
        return self.saved_cursor


class WorkerPriorityTests(unittest.TestCase):
    def test_local_event_is_applied_without_calling_onza(self):
        event = {"id": 7, "payload": {"signalId": "s", "typeSignal": "entry"}, "received_at": None}
        cursor = Cursor(event)
        cursor.fetchall = lambda: [(7,)]
        cursor.fetchone = lambda: event
        with patch.object(worker, "connect", return_value=Connection(cursor)), \
             patch.object(worker, "apply_event") as apply, \
             patch.object(worker, "post_onza") as onza:
            self.assertEqual(worker.apply_pending(), 1)
        apply.assert_called_once_with(cursor, event["payload"], None)
        onza.assert_not_called()
        self.assertTrue(any("state='applied'" in sql for sql in cursor.sql))

    def test_onza_rejection_does_not_reject_telegram_or_local_processing(self):
        event = {"id": 7, "signal_id": "s", "event_type": "entry",
                 "payload": {}, "onza_status": "pending", "telegram_status": "pending"}
        cursor = Cursor(event)
        with patch.dict(os.environ, {"ONZA_API_KEY": "test"}), \
             patch.object(worker, "connect", return_value=Connection(cursor)), \
             patch.object(worker, "onza_gate", return_value=(False, "Onza no acepta el evento")):
            self.assertIsNone(worker.claim_delivery("onza"))
        update = next(sql for sql in cursor.sql if "UPDATE tv_events" in sql)
        self.assertNotIn("state=", update)
        self.assertNotIn("telegram_status=", update)

    def test_telegram_preserves_local_predecessor_order(self):
        event = {"id": 8, "signal_id": "s", "event_type": "tp1",
                 "payload": {}, "onza_status": "unknown", "telegram_status": "pending"}
        cursor = Cursor(event)
        cursor.fetchall = lambda: [event] if "FOR UPDATE SKIP LOCKED" in cursor.current else [
            {"event_type": "entry", "state": "applied", "telegram_status": "pending"}]
        with patch.dict(os.environ, {"TELEGRAM_BOT_TOKEN": "test", "DESTINATION_CHANNEL_ID": "-1"}), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            self.assertIsNone(worker.claim_delivery("telegram"))

    def test_local_processing_has_bounded_priority_without_response_dependency(self):
        cursor = Cursor({})
        with patch.object(worker, "connect", return_value=Connection(cursor)):
            self.assertEqual(worker.apply_pending(), 0)
        self.assertIn("onza_started_at IS NOT NULL", cursor.sql[0])
        self.assertIn("interval '1 second'", cursor.sql[0])
        self.assertNotIn("onza_status", cursor.sql[0])

    def test_telegram_claim_is_independent_of_every_onza_status(self):
        for kind in ("entry", "tp1", "tp2", "tp3", "sl"):
            for status in ("pending", "sending", "unknown", "failed", "skipped", "delivered"):
                with self.subTest(kind=kind, status=status):
                    event = {"id": 7, "signal_id": "s", "event_type": kind,
                             "payload": {}, "onza_status": status, "telegram_status": "pending"}
                    cursor = Cursor(event)
                    with patch.dict(os.environ, {"TELEGRAM_BOT_TOKEN": "test", "DESTINATION_CHANNEL_ID": "-1"}), \
                         patch.object(worker, "connect", return_value=Connection(cursor)):
                        claimed = worker.claim_delivery("telegram")
                    self.assertIsNotNone(claimed)
                    self.assertFalse(claimed[2])
                    self.assertTrue(claimed[3])
                    self.assertIn("state='applied' AND telegram_status='pending'", cursor.sql[0])
                    self.assertNotIn("AND onza_status=", cursor.sql[0])

    def test_onza_claim_never_claims_telegram_in_same_worker(self):
        event = {"id": 7, "signal_id": "s", "event_type": "entry",
                 "payload": {}, "onza_status": "pending", "telegram_status": "pending"}
        cursor = Cursor(event)
        with patch.dict(os.environ, {"ONZA_API_KEY": "test"}), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            claimed = worker.claim_delivery("onza")
        self.assertTrue(claimed[2])
        self.assertFalse(claimed[3])
        self.assertIn("state IN ('pending', 'applied') AND onza_status='pending'", cursor.sql[0])

    def test_result_claim_assigns_persistent_image_sequence(self):
        event = {"id": 8, "signal_id": "s", "event_type": "tp1",
                 "payload": {}, "onza_status": "delivered", "telegram_status": "pending"}
        cursor = Cursor(event)
        with patch.dict(os.environ, {"TELEGRAM_BOT_TOKEN": "test", "DESTINATION_CHANNEL_ID": "-1"}), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            claimed = worker.claim_delivery("telegram")
        self.assertEqual(claimed[5], 1)
        self.assertTrue(any("COALESCE(image_sequence, nextval('bitunix_card_rotation_seq'))" in sql
                            for sql in cursor.sql))


if __name__ == "__main__":
    unittest.main()
