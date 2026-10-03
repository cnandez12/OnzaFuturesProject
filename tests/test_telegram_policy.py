import os
import unittest
from unittest.mock import patch, MagicMock
from telegram_policy import closing_suppression
import worker
from tests.test_worker_priority import Cursor, Connection

class TelegramPolicyTests(unittest.TestCase):
    def test_terminal_policy(self):
        for tp in ("tp1", "tp2", "tp3"):
            for kind in ("sl", "close"):
                with self.subTest(tp=tp, kind=kind):
                    self.assertIn(tp.upper(), closing_suppression(kind, [{"event_type":tp,"state":"applied"}]))
        self.assertIsNotNone(closing_suppression("close", [{"event_type":"sl","state":"applied"}]))
        for kind in ("entry", "tp1", "tp2", "tp3", "sl", "close"):
            self.assertIsNone(closing_suppression(kind, [{"event_type":"entry","state":"applied"}]))
        self.assertIsNone(closing_suppression("sl", [{"event_type":"tp1","state":"pending"}]))

    def test_premium_suppresses_before_render_or_send(self):
        for kind, previous in (("sl","tp1"),("close","tp2"),("close","sl")):
            event = dict(id=7,signal_id="s",event_type=kind,payload={},telegram_status="pending",onza_status="unknown")
            cursor = Cursor(event)
            cursor.fetchall = lambda: [event] if "FOR UPDATE SKIP LOCKED" in cursor.current else [dict(event_type=previous,state="applied")]
            with patch.dict(os.environ, TELEGRAM_BOT_TOKEN="test", DESTINATION_CHANNEL_ID="-1"), patch.object(worker,"connect",return_value=Connection(cursor)):
                self.assertIsNone(worker.claim_delivery("telegram"))
            self.assertTrue(any("telegram_status='skipped'" in sql for sql in cursor.sql))
            self.assertFalse(any("nextval" in sql for sql in cursor.sql))

    def test_free_pending_closure_never_calls_telegram(self):
        import telegram_channels as tc
        for previous in ("tp1", "tp2", "tp3", "sl"):
            cur = MagicMock()
            cur.fetchone.return_value = dict(id=9,job_key="free:-100:signal-A:close")
            cur.fetchall.return_value = [dict(event_type=previous,state="applied")]
            conn = MagicMock()
            conn.cursor.return_value.__enter__.return_value = cur
            with patch.object(tc,"call_telegram") as send:
                self.assertTrue(tc.deliver(conn))
                send.assert_not_called()
            self.assertTrue(any("status='skipped'" in call.args[0] for call in cur.execute.call_args_list))

if __name__ == "__main__":
    unittest.main()
