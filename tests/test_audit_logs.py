import io
import json
import os
import unittest
from contextlib import redirect_stdout
from unittest.mock import Mock, patch

import requests
from audit_log import audit
from onza_delivery import post_onza, post_telegram


class AuditLogTests(unittest.TestCase):
    def test_payload_secrets_and_message_are_not_logged(self):
        output = io.StringIO()
        with redirect_stdout(output):
            audit("TV VALIDADO", {"signalId": "sample", "apiKey": "SECRET",
                                  "message": "SECRET", "symbol": "BTCUSD.P"}, 1)
        row = json.loads(output.getvalue())
        self.assertEqual(row["evento"], 1)
        self.assertEqual(row["signalId"], "sample")
        self.assertNotIn("SECRET", output.getvalue())
        self.assertTrue(row["hora"].endswith("-05:00"))

    def test_onza_timeout_phase_is_recorded(self):
        for error, phase in ((requests.ConnectTimeout, "conexion"), (requests.ReadTimeout, "lectura")):
            with patch.dict(os.environ, {"ONZA_API_KEY": "SECRET"}), \
                 patch("onza_delivery.requests.post", side_effect=error("SECRET")):
                status, detail = post_onza({})
            self.assertEqual(status, "unknown")
            self.assertIn(phase, detail)
            self.assertNotIn("SECRET", detail)

    def test_telegram_http_200_without_ok_is_not_delivery(self):
        payload = {"symbol": "BTCUSD.P", "direction": "LONG", "typeSignal": "entry",
                   "timeframe": "30M", "leverage": 20, "entry": 100,
                   "takeProfits": [], "stopLoss": {"price": 98}, "signalId": "sample"}
        response = Mock(status_code=200)
        response.json.return_value = {"ok": False}
        with patch.dict(os.environ, {"TELEGRAM_BOT_TOKEN": "SECRET", "DESTINATION_CHANNEL_ID": "-1"}), \
             patch("onza_delivery.requests.post", return_value=response):
            self.assertEqual(post_telegram(payload, None)[0], "failed")
