"""Herramienta de revisión manual y ruta de salud de Telegram. Sin red ni base real."""
import unittest
from unittest.mock import patch

import requests

import app as receiver
import telegram_channels as tc
import telegram_review as review
from telegram_http import FAILED, PAUSE, RETRY, explicit_rejection, never_sent


class Cursor:
    def __init__(self, rows=(), rowcount=1, one=None):
        self.rows, self.rowcount, self.one = list(rows), rowcount, one
        self.calls = []

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def execute(self, sql, params=None):
        self.calls.append((sql, params))

    def fetchall(self):
        return self.rows

    def fetchone(self):
        return self.one


class Connection:
    def __init__(self, cursor):
        self.saved = cursor

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def cursor(self, **_kwargs):
        return self.saved

    def close(self):
        pass


class ClassificationTests(unittest.TestCase):
    def test_only_explicit_rejections_that_can_recover_are_repeated(self):
        self.assertEqual(explicit_rejection(429, {"parameters": {"retry_after": 9}}), (PAUSE, 9))
        self.assertEqual(explicit_rejection(429, {}), (PAUSE, 60))
        self.assertEqual(explicit_rejection(403, {}), (PAUSE, 60))
        self.assertEqual(explicit_rejection(500, {}), (RETRY, 0))
        self.assertEqual(explicit_rejection(400, {}), (FAILED, 0))

    def test_never_sent_requires_proof_that_the_request_did_not_leave(self):
        from urllib3.exceptions import MaxRetryError, NewConnectionError, ProtocolError
        refused = requests.ConnectionError(MaxRetryError(None, "/", NewConnectionError(None, "x")))
        dropped = requests.ConnectionError(ProtocolError("Connection aborted"))
        self.assertTrue(never_sent(refused))
        self.assertTrue(never_sent(requests.ConnectTimeout()))
        for ambiguous in (dropped, requests.ReadTimeout(), requests.ConnectionError(), ValueError()):
            self.assertFalse(never_sent(ambiguous), type(ambiguous).__name__)

    @patch.dict("os.environ", {"TELEGRAM_BOT_TOKEN": "test"})
    def test_free_channel_uses_the_same_rules(self):
        from unittest.mock import MagicMock
        from urllib3.exceptions import MaxRetryError, NewConnectionError
        def answer(code, body):
            response = MagicMock(status_code=code)
            response.json.return_value = body
            return response
        cases = [(answer(502, {"ok": False}), "retry"), (answer(429, {"ok": False}), "pending"),
                 (answer(403, {"ok": False}), "pending"), (answer(400, {"ok": False}), "failed"),
                 (answer(502, {"raro": 1}), "unknown"), (answer(200, {"ok": True, "result": {}}), "unknown")]
        for response, expected in cases:
            with self.subTest(code=response.status_code, expected=expected), \
                 patch("telegram_channels.requests.post", return_value=response):
                self.assertEqual(tc.call_telegram("sendMessage", {})[0], expected)
        refused = requests.ConnectionError(MaxRetryError(None, "/", NewConnectionError(None, "x")))
        with patch("telegram_channels.requests.post", side_effect=refused):
            self.assertEqual(tc.call_telegram("sendMessage", {})[0], "pending")


class ReviewToolTests(unittest.TestCase):
    def test_listing_names_what_needs_a_decision(self):
        cursor = Cursor(rows=[{"id": 7, "signal_id": "BTCUSD.P_15M_1", "event_type": "tp1",
                               "status": "unknown", "detail": None, "job_key": "free:x", "method": "copyMessage"}])
        lines = review.listing(cursor)
        self.assertIn("evento 7", lines[0])
        self.assertIn("unknown", lines[0])
        self.assertIn("publicacion 7", lines[1])
        self.assertTrue(all("SELECT" in sql for sql, _ in cursor.calls))

    def test_retry_only_touches_events_that_are_stuck(self):
        cursor = Cursor(rowcount=1)
        self.assertTrue(review.retry_event(cursor, 7))
        sql, params = cursor.calls[0]
        self.assertIn("telegram_status='pending'", sql)
        self.assertIn("telegram_attempts=0", sql)
        self.assertEqual(params, (7, ("failed", "unknown", "sending")))
        self.assertFalse(review.retry_event(Cursor(rowcount=0), 8))

    def test_confirming_an_entry_links_later_results_to_its_message(self):
        cursor = Cursor(one={"signal_id": "s1", "event_type": "entry"})
        self.assertTrue(review.confirm_event(cursor, 7, 458, "-100123"))
        self.assertIn("telegram_status='delivered'", cursor.calls[0][0])
        self.assertEqual(cursor.calls[1][1], (458, "-100123", "s1"))
        result = Cursor(one={"signal_id": "s1", "event_type": "tp1"})
        self.assertTrue(review.confirm_event(result, 8, 459, "-100123"))
        self.assertEqual(len(result.calls), 1)
        self.assertFalse(review.confirm_event(Cursor(one=None), 9, 1, "-1"))

    def test_publication_actions_require_a_stuck_row(self):
        self.assertTrue(review.retry_publication(Cursor(rowcount=1), 3))
        self.assertFalse(review.confirm_publication(Cursor(rowcount=0), 3, 10))

    def test_discard_marks_old_stuck_rows_as_skipped_in_both_queues(self):
        cursor = Cursor(rowcount=4)
        self.assertEqual(review.discard_stale(cursor, 24), (4, 4))
        updates = [(sql, params) for sql, params in cursor.calls if sql.startswith("UPDATE")]
        self.assertEqual(len(updates), 2)
        for sql, params in updates:
            self.assertIn("'skipped'", sql)
            self.assertIn("interval '1 hour'", sql)
            self.assertEqual(params[1:], (("pending", "sending", "failed", "unknown"), 24))
        self.assertIn("state='applied'", updates[0][0])
        self.assertFalse(any("DELETE" in sql for sql, _ in cursor.calls))

    def test_discard_refuses_recent_rows_that_may_be_in_flight(self):
        cursor = Cursor()
        with self.assertRaises(ValueError):
            review.discard_stale(cursor, 0)
        self.assertEqual(cursor.calls, [])

    def test_counting_before_discard_changes_nothing(self):
        cursor = Cursor(rows=[{"status": "unknown", "total": 53}])
        self.assertEqual(review.stale_counts(cursor, 24)["principal"], {"unknown": 53})
        self.assertTrue(all(sql.startswith("SELECT") for sql, _ in cursor.calls))

    def test_tool_never_talks_to_telegram(self):
        from pathlib import Path
        source = Path(review.__file__).read_text(encoding="utf-8")
        self.assertNotIn("import requests", source)
        self.assertNotIn("api.telegram.org", source)


class TelegramHealthTests(unittest.TestCase):
    def health(self, rows):
        with patch.object(receiver, "database_connection", return_value=Connection(Cursor(rows=rows))):
            return receiver.app.test_client().get("/health/telegram")

    def test_route_is_open_and_quiet_queue_is_ok(self):
        with patch.dict("os.environ", {"DASHBOARD_TOKEN": ""}):
            response = self.health([("principal", "pending", 2, 30), ("principal", "sending", 1, 5)])
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["status"], "ok")
        self.assertEqual(response.json["queues"]["principal"]["pending"], {"total": 2, "oldest_seconds": 30})

    def test_stuck_publications_ask_for_attention(self):
        for rows in ([("principal", "failed", 1, 10)], [("distribucion", "unknown", 1, 10)],
                     [("principal", "sending", 1, 600)], [("principal", "pending", 4, 3600)]):
            with self.subTest(rows=rows):
                self.assertEqual(self.health(rows).json["status"], "attention")

    def test_database_failure_is_reported_as_unavailable(self):
        with patch.object(receiver, "database_connection", side_effect=RuntimeError("sin base")):
            self.assertEqual(receiver.app.test_client().get("/health/telegram").status_code, 503)


if __name__ == "__main__":
    unittest.main()
