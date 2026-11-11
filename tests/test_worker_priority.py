import os
import unittest
from unittest.mock import patch

import worker


class Cursor:
    def __init__(self, event):
        self.event = event
        self.sql = []
        self.params = []
        self.current = ""

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def execute(self, sql, _params=None):
        self.current = sql
        self.sql.append(sql)
        self.params.append(_params)

    def fetchall(self):
        if "FOR UPDATE SKIP LOCKED" in self.current:
            return [self.event]
        return []

    def fetchone(self):
        if "RETURNING image_sequence" in self.current:
            return {"image_sequence": None if self.event["event_type"] == "entry" else 1}
        if "FROM trades" in self.current:
            return {"margin_used": 20, "telegram_entry_message_id": 100, "telegram_chat_id": "-1"}
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
    def setUp(self):
        flag = patch.dict(os.environ, ONZA_ENABLED="true")
        flag.start()
        self.addCleanup(flag.stop)

    def test_confirmed_entry_saves_telegram_parent_for_same_signal(self):
        from telegram_delivery import TelegramDelivery
        cursor = Cursor({})
        payload = {"signalId": "signal-A", "typeSignal": "entry"}
        with patch.object(worker, "claim_delivery", return_value=(7, payload, None, None, None)), \
             patch.object(worker, "post_telegram", return_value=TelegramDelivery("delivered", "HTTP 200", 458, "-100123")), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            self.assertTrue(worker.deliver_one("telegram"))
        index = next(i for i, sql in enumerate(cursor.sql) if "UPDATE tv_signals" in sql)
        self.assertEqual(cursor.params[index], (458, "-100123", "signal-A"))
        self.assertIn("telegram_message_id", cursor.sql[0])

    def test_local_event_is_applied_without_downstream_http(self):
        event={"id":7,"payload":{"signalId":"s","typeSignal":"entry"},"received_at":None}
        cursor=Cursor(event)
        cursor.fetchall=lambda:[(7,)]
        cursor.fetchone=lambda:event
        with patch.object(worker,'connect',return_value=Connection(cursor)),patch.object(worker,'apply_event') as apply,patch.object(worker,'post_telegram') as telegram:
            self.assertEqual(worker.apply_pending(),1)
        apply.assert_called_once_with(cursor,event['payload'],None)
        telegram.assert_not_called()

    def test_retired_channel_cannot_be_reenabled_by_environment(self):
        with patch.dict(os.environ,ONZA_ENABLED='true',ONZA_API_KEY='test'),patch.object(worker,'connect') as database:
            with self.assertRaises(ValueError):worker.claim_delivery('onza')
        database.assert_not_called()

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
        self.assertNotIn("onza_started_at", cursor.sql[0])
        self.assertNotIn("interval '1 second'", cursor.sql[0])
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
                    self.assertEqual(claimed[0],7)
                    self.assertIn("state='applied' AND telegram_status='pending'", cursor.sql[0])
                    self.assertNotIn("AND onza_status=", cursor.sql[0])

    def test_retired_worker_role_exits_before_database_or_network(self):
        import sys
        with patch.object(sys,'argv',['worker.py','onza']),patch.object(worker,'connect') as database:
            with self.assertRaises(SystemExit):worker.main()
        database.assert_not_called()

    def test_result_claim_assigns_persistent_image_sequence(self):
        event = {"id": 8, "signal_id": "s", "event_type": "tp1",
                 "payload": {}, "onza_status": "delivered", "telegram_status": "pending"}
        cursor = Cursor(event)
        with patch.dict(os.environ, {"TELEGRAM_BOT_TOKEN": "test", "DESTINATION_CHANNEL_ID": "-1"}), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            claimed = worker.claim_delivery("telegram")
        self.assertEqual(claimed[3], 1)
        self.assertTrue(any("COALESCE(image_sequence, nextval('bitunix_card_rotation_seq'))" in sql
                            for sql in cursor.sql))


if __name__ == "__main__":
    unittest.main()
