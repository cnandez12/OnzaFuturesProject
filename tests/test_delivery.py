import os
import unittest
from unittest.mock import Mock, patch

import requests

from onza_contract import canonicalize
from onza_delivery import post_onza


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


if __name__ == "__main__":
    unittest.main()
