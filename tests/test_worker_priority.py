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
    def test_local_processing_waits_until_onza_attempt_finishes(self):
        cursor = Cursor({})
        with patch.object(worker, "connect", return_value=Connection(cursor)):
            self.assertEqual(worker.apply_pending(), 0)
        self.assertIn("onza_status IN ('delivered', 'failed', 'unknown')", cursor.sql[0])

    def test_telegram_claim_requires_confirmed_onza_delivery(self):
        event = {"id": 7, "signal_id": "s", "event_type": "entry",
                 "payload": {}, "onza_status": "delivered", "telegram_status": "pending"}
        cursor = Cursor(event)
        with patch.dict(os.environ, {"TELEGRAM_BOT_TOKEN": "test", "DESTINATION_CHANNEL_ID": "-1"}), \
             patch.object(worker, "connect", return_value=Connection(cursor)):
            claimed = worker.claim_delivery("telegram")
        self.assertIsNotNone(claimed)
        self.assertFalse(claimed[2])
        self.assertTrue(claimed[3])
        self.assertIn("telegram_status='pending' AND onza_status='delivered'", cursor.sql[0])

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


if __name__ == "__main__":
    unittest.main()
