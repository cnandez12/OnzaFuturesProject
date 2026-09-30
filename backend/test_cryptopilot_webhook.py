import json
import os
import sys
import types
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

for name, value in {
    "API_ID": "1",
    "API_HASH": "test",
    "SOURCE_CHANNEL_ID": "111",
    "SOURCE_CHANNEL_ID_2": "222",
    "DESTINATION_CHANNEL_ID": "333",
}.items():
    os.environ.setdefault(name, value)

try:
    import websockets
except ImportError:
    sys.modules["websockets"] = types.ModuleType("websockets")

import AllProfitFormatWhitImage as emitter


class CryptoPilotWebhookConfigTests(unittest.TestCase):
    def test_destination_is_enabled_and_uses_environment_secret(self):
        config = json.loads(Path("ConfigWebhoock.json").read_text(encoding="utf-8"))
        clients = {item["id"]: item for item in config["webhooks"]}
        client = clients["cryptopilot_ai"]

        self.assertTrue(client["active"])
        self.assertEqual(client["format"], "standard")
        self.assertEqual(
            client["url"],
            "https://trade.cryptopilot-ai.com/api/v1/signals/provider",
        )
        self.assertEqual(
            client["close_url"],
            "https://trade.cryptopilot-ai.com/api/v1/signals/provider/close",
        )
        self.assertEqual(client["secret"], "env:CRYPTOPILOT_WEBHOOK_SECRET")

    def test_standard_entry_payload_matches_backend_contract(self):
        client = {
            "name": "CryptoPilot AI",
            "url": "https://example.invalid/api/v1/signals/provider",
            "secret": "test-secret",
        }
        response = SimpleNamespace(status_code=201, text="")
        with patch.object(emitter.requests, "post", return_value=response) as post, patch.object(emitter, "log_message"):
            emitter._post_standard_entry(
                client, "BTCUSDT", "Long", 100.0, 95.0, [105.0, 110.0, 120.0]
            )

        post.assert_called_once_with(
            client["url"],
            json={
                "secret": "test-secret",
                "symbol": "BTCUSDT",
                "side": "BUY",
                "entry": 100.0,
                "stop_loss": 95.0,
                "take_profits": [105.0, 110.0, 120.0],
                "leverage": emitter.LEVERAGE,
            },
            timeout=10,
        )


if __name__ == "__main__":
    unittest.main()
