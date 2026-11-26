import os
import unittest
from unittest.mock import patch

import worker
from telegram_delivery import TelegramDelivery


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


TELEGRAM_ENV = {"TELEGRAM_BOT_TOKEN": "test", "DESTINATION_CHANNEL_ID": "-1"}


class WorkerPriorityTests(unittest.TestCase):
    def deliver(self, result, payload=None):
        cursor = Cursor({})
        payload = payload or {"signalId": "signal-A", "typeSignal": "tp1"}
        with patch.object(worker, "claim_delivery", return_value=(7, payload, None, None, None)), \
             patch.object(worker, "post_telegram", return_value=result), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            self.assertTrue(worker.deliver_one("telegram"))
        return cursor

    def test_confirmed_entry_saves_telegram_parent_for_same_signal(self):
        cursor = self.deliver(TelegramDelivery("delivered", "HTTP 200", 458, "-100123"),
                              {"signalId": "signal-A", "typeSignal": "entry"})
        index = next(i for i, sql in enumerate(cursor.sql) if "UPDATE tv_signals" in sql)
        self.assertEqual(cursor.params[index], (458, "-100123", "signal-A"))
        self.assertIn("telegram_message_id", cursor.sql[0])
        # Una entrega confirmada no cuenta intentos ni programa otro envío.
        self.assertEqual(cursor.params[0], (458, "HTTP 200", False, 6, "delivered", False, 0, 7))

    def test_temporary_server_error_is_rescheduled_and_counts_an_attempt(self):
        cursor = self.deliver(TelegramDelivery("pending", "HTTP 502", retry=True))
        self.assertIn("telegram_next_attempt_at", cursor.sql[0])
        self.assertIn("THEN 'failed'", cursor.sql[0])
        self.assertEqual(cursor.params[0], (None, "HTTP 502", True, 6, "pending", True, 1, 7))
        self.assertFalse(any("telegram_channel_state" in sql for sql in cursor.sql))

    def test_channel_pause_keeps_the_event_pending_without_spending_attempts(self):
        cursor = self.deliver(TelegramDelivery("pending", "Sin conexion", retry_after=15))
        self.assertEqual(cursor.params[0], (None, "Sin conexion", False, 6, "pending", False, 0, 7))
        pause = next(i for i, sql in enumerate(cursor.sql) if "telegram_channel_state" in sql)
        self.assertEqual(cursor.params[pause][1], 15)

    def test_ambiguous_result_is_stored_as_is_for_manual_review(self):
        cursor = self.deliver(TelegramDelivery("unknown", "Tiempo de espera agotado"))
        self.assertEqual(cursor.params[0][2:7], (False, 6, "unknown", False, 0))

    def test_local_event_is_applied_without_downstream_http(self):
        event={"id":7,"payload":{"signalId":"s","typeSignal":"entry"},"received_at":None}
        cursor=Cursor(event)
        cursor.fetchall=lambda:[(7,)]
        cursor.fetchone=lambda:event
        with patch.object(worker,'connect',return_value=Connection(cursor)),patch.object(worker,'apply_event') as apply,patch.object(worker,'post_telegram') as telegram:
            self.assertEqual(worker.apply_pending(),1)
        apply.assert_called_once_with(cursor,event['payload'],None)
        telegram.assert_not_called()

    def test_telegram_preserves_local_predecessor_order(self):
        event = {"id": 8, "signal_id": "s", "event_type": "tp1",
                 "payload": {}, "telegram_status": "pending"}
        cursor = Cursor(event)
        cursor.fetchall = lambda: [event] if "FOR UPDATE SKIP LOCKED" in cursor.current else [
            {"event_type": "entry", "state": "applied", "telegram_status": "pending"}]
        with patch.dict(os.environ, TELEGRAM_ENV), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            self.assertIsNone(worker.claim_delivery("telegram"))

    def test_claim_takes_only_pending_events_whose_wait_has_ended(self):
        for kind in ("entry", "tp1", "tp2", "tp3", "sl"):
            with self.subTest(kind=kind):
                event = {"id": 7, "signal_id": "s", "event_type": kind,
                         "payload": {}, "telegram_status": "pending"}
                cursor = Cursor(event)
                with patch.dict(os.environ, TELEGRAM_ENV), \
                     patch.object(worker, "connect", return_value=Connection(cursor)):
                    claimed = worker.claim_delivery("telegram")
                self.assertIsNotNone(claimed)
                self.assertEqual(claimed[0],7)
                query = next(sql for sql in cursor.sql if "FOR UPDATE SKIP LOCKED" in sql)
                self.assertIn("state='applied' AND telegram_status='pending'", query)
                self.assertIn("telegram_next_attempt_at <= now()", query)

    def test_result_claim_assigns_persistent_image_sequence(self):
        event = {"id": 8, "signal_id": "s", "event_type": "tp1",
                 "payload": {}, "telegram_status": "pending"}
        cursor = Cursor(event)
        with patch.dict(os.environ, TELEGRAM_ENV), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            claimed = worker.claim_delivery("telegram")
        self.assertEqual(claimed[3], 1)
        self.assertTrue(any("COALESCE(image_sequence, nextval('bitunix_card_rotation_seq'))" in sql
                            for sql in cursor.sql))


if __name__ == "__main__":
    unittest.main()
