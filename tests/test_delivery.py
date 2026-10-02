import os
import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import Mock, patch

import requests

from onza_contract import canonicalize
from onza_delivery import post_onza, post_telegram


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

    def test_outbound_is_exact_onza_contract_without_exchange_metadata(self):
        with patch.dict(os.environ, {"ONZA_API_KEY": "secret-for-test"}), \
             patch("onza_delivery.requests.post", return_value=Mock(status_code=200)) as post:
            result = post_onza(self.payload)
        self.assertEqual(result[0], "delivered")
        sent = post.call_args.kwargs["json"]
        self.assertEqual(sent["symbol"], "ETHUSD.P")
        self.assertEqual(sent["message"], "ONZA AI CRYPTOFUTURES")
        self.assertEqual(sent["apiKey"], "secret-for-test")
        self.assertNotIn("sourceExchange", sent)

    def test_timeout_is_ambiguous_and_not_reported_as_rejected(self):
        with patch.dict(os.environ, {"ONZA_API_KEY": "secret-for-test"}), \
             patch("onza_delivery.requests.post", side_effect=requests.Timeout):
            status, _ = post_onza(self.payload)
        self.assertEqual(status, "unknown")

    def test_main_tp_captions_match_approved_example(self):
        opened = datetime(2026,10,2,12,0,tzinfo=timezone.utc)
        for kind in ("tp1", "tp2", "tp3"):
            payload = dict(symbol="APEUSD.P",direction="LONG",timeframe="1H",entry=0.16,
                           price=0.1738,leverage=20,typeSignal=kind,signalId="test")
            trade = dict(date=opened,margin_used=5000,telegram_entry_message_id=12,telegram_chat_id="-1")
            response = Mock(status_code=200)
            response.json.return_value = {"ok":True,"result":{"message_id":13,"chat":{"id":-1}}}
            with patch.dict(os.environ,{"TELEGRAM_BOT_TOKEN":"test","DESTINATION_CHANNEL_ID":"-1"}), \
                 patch("onza_delivery.render_event_image",return_value=b"image"), \
                 patch("onza_delivery.requests.post",return_value=response) as post:
                result = post_telegram(payload,trade,event_time=opened+timedelta(minutes=93))
            self.assertEqual(result.status,"delivered")
            data = post.call_args.kwargs["data"]
            self.assertEqual(data["parse_mode"],"HTML")
            caption = data["caption"]
            for text in (kind.upper()+" REACHED", "+172.50%", "+8625.00 USDT", "1 hour 33 minutes", "id6768534887"):
                self.assertIn(text,caption)
            self.assertNotIn("Source:",caption)
            self.assertNotIn("Theoretical",caption)


if __name__ == "__main__":
    unittest.main()
