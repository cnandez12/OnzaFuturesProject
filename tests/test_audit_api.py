import importlib
import sys
import types
import unittest
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from unittest.mock import patch

if "flask_cors" not in sys.modules:
    try:
        import flask_cors  # noqa: F401
    except ImportError:
        stub = types.ModuleType("flask_cors")
        stub.CORS = lambda *_args, **_kwargs: None
        sys.modules["flask_cors"] = stub

import app as receiver


dashboard_module = importlib.import_module("dashboard.app")
T0 = datetime(2026, 9, 28, tzinfo=timezone.utc)


class Cursor:
    def __init__(self, rows):
        self.rows = rows

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def execute(self, *_args):
        pass

    def fetchall(self):
        return self.rows


class Connection:
    def __init__(self, rows):
        self.rows = rows

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def cursor(self, **_kwargs):
        return Cursor(self.rows)


class AuditApiTests(unittest.TestCase):
    def setUp(self):
        self.client = receiver.app.test_client()

    def test_results_are_private_and_be_mode_uses_saved_margin(self):
        signal_id = "BTCUSD.P_15M_1790559000000"
        base = {"signal_id": signal_id, "exchange": "BINANCE",
                "margin_used": Decimal("20"), "be_activated_at": T0 + timedelta(minutes=1),
                "onza_status": "delivered"}
        payload = {"entry": 100, "leverage": 20, "direction": "LONG",
                   "symbol": "BTCUSD.P", "timeframe": "15M"}
        rows = [dict(base, id=1, event_type="entry", payload=payload,
                     received_at=T0, applied_at=T0),
                dict(base, id=2, event_type="tp1", payload={"price": 101},
                     received_at=T0 + timedelta(minutes=1),
                     applied_at=T0 + timedelta(minutes=1)),
                dict(base, id=3, event_type="sl", payload={"price": 98},
                     received_at=T0 + timedelta(minutes=2),
                     applied_at=T0 + timedelta(minutes=2))]
        with patch.object(dashboard_module, "SECRET_TOKEN", "audit-secret"), \
             patch.object(receiver, "database_connection", return_value=Connection(rows)):
            denied = self.client.get("/api/audit/results?mode=partial_be")
            accepted = self.client.get("/api/audit/results?mode=partial_be",
                                       headers={"X-Dashboard-Token": "audit-secret"})
        self.assertEqual(denied.status_code, 401)
        self.assertEqual(accepted.status_code, 200)
        self.assertEqual(accepted.json["rows"][0]["pnl_usdt"], 1.6)
        self.assertTrue(accepted.json["rows"][0]["be_activated"])
        self.assertFalse(accepted.json["rows"][0]["be_fill_verified"])
        self.assertEqual(accepted.json["summary"]["inferred"], 1)


if __name__ == "__main__":
    unittest.main()
