import os
import sys
import types
import unittest
from unittest.mock import Mock, patch

# La instalación de producción incluye flask-cors; el entorno de pruebas local
# no lo tiene y ALLOWED_ORIGINS está vacío, así que se puede omitir en este test.
if "flask_cors" not in sys.modules:
    try:
        import flask_cors  # noqa: F401
    except ImportError:
        stub = types.ModuleType("flask_cors")
        stub.CORS = lambda *_args, **_kwargs: None
        sys.modules["flask_cors"] = stub

import app as receiver


class Cursor:
    def __init__(self):
        self.sql = ""

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def execute(self, sql, _params=None):
        self.sql = sql

    def fetchone(self):
        if "onza_project_meta" in self.sql:
            return (1,)
        if "RETURNING id" in self.sql:
            return (41,)
        raise AssertionError(self.sql)


class Connection:
    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def cursor(self):
        return Cursor()


ENTRY = {
    "signalId": "BTCUSDT.P_15M_1790559000000",
    "typeSignal": "entry", "symbol": "BTCUSDT.P", "direction": "LONG",
    "entry": 100, "leverage": 20,
    "stopLoss": {"price": 98, "roi": -40},
    "takeProfits": [
        {"price": 101, "roi": 20},
        {"price": 102, "roi": 40},
        {"price": 103, "roi": 60},
    ],
    "timeframe": "15M", "apiKey": "test-key",
}


class WebhookTests(unittest.TestCase):
    def setUp(self):
        self.client = receiver.app.test_client()

    def test_accepts_and_queues_without_downstream_http(self):
        with patch.dict(os.environ, {"TRADINGVIEW_API_KEY": "test-key"}), \
             patch.object(receiver, "database_connection", return_value=Connection()):
            response = self.client.post("/webhook/tradingview", json=ENTRY)
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json["signalId"], "BTCUSD.P_15M_1790559000000")

    def test_copied_dashboard_is_served_with_onza_brand(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Onza Futures", response.data)

    def test_rejects_wrong_key_before_db_access(self):
        with patch.dict(os.environ, {"TRADINGVIEW_API_KEY": "different"}), \
             patch.object(receiver, "database_connection") as database:
            response = self.client.post("/webhook/tradingview", json=ENTRY)
        self.assertEqual(response.status_code, 401)
        database.assert_not_called()

    def test_onza_key_is_never_accepted_as_tradingview_key(self):
        with patch.dict(os.environ, {"TRADINGVIEW_API_KEY": "", "ONZA_API_KEY": "onza-secret"}), \
             patch.object(receiver, "database_connection") as database:
            response = self.client.post("/webhook/tradingview", json=ENTRY)
        self.assertEqual(response.status_code, 503)
        database.assert_not_called()

    def test_rejects_invalid_target_order(self):
        bad = dict(ENTRY, takeProfits=[{"price": 99}, {"price": 102}, {"price": 103}])
        with patch.dict(os.environ, {"TRADINGVIEW_API_KEY": "test-key"}):
            response = self.client.post("/webhook/tradingview", json=bad)
        self.assertEqual(response.status_code, 422)

    def test_bitunix_mark_proxy_uses_requested_symbols(self):
        market = Mock()
        market.json.return_value = {"code": 0, "data": [
            {"symbol": "BTCUSDT", "markPrice": "83000.1"}]}
        with patch.object(receiver.requests, "get", return_value=market) as get:
            response = self.client.get("/api/bitunix/tickers?symbols=BTCUSDT")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json[0]["markPrice"], "83000.1")
        self.assertEqual(get.call_args.kwargs["params"], {"symbols": "BTCUSDT"})

    def test_bitunix_market_proxy_rejects_invalid_symbol(self):
        with patch.object(receiver.requests, "get") as get:
            response = self.client.get("/api/bitunix/tickers?symbols=BTCUSDT;BAD")
        self.assertEqual(response.status_code, 400)
        get.assert_not_called()


if __name__ == "__main__":
    unittest.main()
