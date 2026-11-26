import os
import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import Mock, patch

import requests

from onza_contract import canonicalize
from telegram_delivery import post_telegram


class DeliveryTests(unittest.TestCase):
    def setUp(self):
        self.payload = canonicalize({
            "signalId": "ETHUSDT.P_1H_1790559000000",
            "typeSignal": "entry", "symbol": "ETHUSDT.P", "direction": "LONG",
            "entry": 100, "leverage": 20,
            "stopLoss": {"price": 98, "roi": -40},
            "takeProfits": [{"price": 101}, {"price": 102}, {"price": 103}],
            "timeframe": "1H",
        })

    def test_only_the_telegram_channel_exists(self):
        import worker
        with patch.object(worker,'connect') as database:
            with self.assertRaises(ValueError):worker.claim_delivery('otro')
        database.assert_not_called()

    def post(self, **mock):
        with patch.dict(os.environ, TELEGRAM_BOT_TOKEN="test", DESTINATION_CHANNEL_ID="-1"), \
             patch("telegram_delivery.requests.post", **mock):
            return post_telegram(self.payload, None)

    def test_no_connection_is_repeated_because_nothing_was_sent(self):
        from urllib3.exceptions import MaxRetryError, NewConnectionError
        unreachable = requests.ConnectionError(MaxRetryError(None, "/", NewConnectionError(None, "sin red")))
        for error in (unreachable, requests.ConnectTimeout()):
            with self.subTest(error=type(error).__name__):
                result = self.post(side_effect=error)
                self.assertEqual(result.status, "pending")
                self.assertGreater(result.retry_after, 0)
                self.assertFalse(result.retry)

    def test_broken_connection_after_sending_is_never_repeated_automatically(self):
        for error in (requests.ConnectionError("Connection aborted"), requests.ReadTimeout()):
            with self.subTest(error=type(error).__name__):
                self.assertEqual(self.post(side_effect=error).status, "unknown")

    def test_server_error_with_explicit_rejection_is_retried_with_a_limit(self):
        response = Mock(status_code=502)
        response.json.return_value = {"ok": False, "error_code": 502}
        result = self.post(return_value=response)
        self.assertEqual((result.status, result.retry, result.retry_after), ("pending", True, 0))

    def test_missing_permission_pauses_the_channel_instead_of_burning_events(self):
        for code in (401, 403):
            with self.subTest(code=code):
                response = Mock(status_code=code)
                response.json.return_value = {"ok": False}
                result = self.post(return_value=response)
                self.assertEqual((result.status, result.retry), ("pending", False))
                self.assertEqual(result.retry_after, 60)

    def test_bad_request_and_unreadable_answers_are_not_repeated(self):
        rejected = Mock(status_code=400)
        rejected.json.return_value = {"ok": False}
        self.assertEqual(self.post(return_value=rejected).status, "failed")
        gateway = Mock(status_code=502)
        gateway.json.side_effect = ValueError()
        self.assertEqual(self.post(return_value=gateway).status, "unknown")
        vague = Mock(status_code=500)
        vague.json.return_value = {"error": "x"}
        self.assertEqual(self.post(return_value=vague).status, "unknown")

    def test_telegram_429_waits_for_server_deadline_with_safe_fallback(self):
        for params, expected in [({"retry_after": 77},77), ({"retry_after": True},60), ({},60), (None,60)]:
            with self.subTest(parameters=params):
                response = Mock(status_code=429)
                response.json.return_value = {"ok": False, "parameters": params}
                with patch.dict(os.environ, TELEGRAM_BOT_TOKEN="test", DESTINATION_CHANNEL_ID="-1"), \
                     patch("telegram_delivery.requests.post", return_value=response):
                    result = post_telegram(self.payload, None)
                self.assertEqual(result.status, "pending")
                self.assertEqual(result.retry_after, expected)
                self.assertIsNone(result.message_id)

    def test_main_tp_captions_match_approved_example(self):
        opened = datetime(2026,10,2,12,0,tzinfo=timezone.utc)
        for kind in ("tp1", "tp2", "tp3"):
            payload = dict(symbol="APEUSD.P",direction="LONG",timeframe="1H",entry=0.16,
                           price=0.1738,leverage=20,typeSignal=kind,signalId="test")
            trade = dict(date=opened,margin_used=5000,telegram_entry_message_id=12,telegram_chat_id="-1")
            response = Mock(status_code=200)
            response.json.return_value = {"ok":True,"result":{"message_id":13,"chat":{"id":-1}}}
            with patch.dict(os.environ,{"TELEGRAM_BOT_TOKEN":"test","DESTINATION_CHANNEL_ID":"-1"}), \
                 patch("telegram_delivery.render_event_image",return_value=b"image"), \
                 patch("telegram_delivery.requests.post",return_value=response) as post:
                result = post_telegram(payload,trade,event_time=opened+timedelta(minutes=93))
            self.assertEqual(result.status,"delivered")
            data = post.call_args.kwargs["data"]
            self.assertEqual(data["parse_mode"],"HTML")
            caption = data["caption"]
            for text in (kind.upper()+" REACHED", "+172.50%", "+8625.00 USDT", "1 hour 33 minutes", "JOIN VORZA APP NOW"):
                self.assertIn(text,caption)
            self.assertNotIn("Source:",caption)
            self.assertNotIn("Theoretical",caption)


if __name__ == "__main__":
    unittest.main()
