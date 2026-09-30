import unittest
from datetime import datetime, timezone
from decimal import Decimal

from onza_processing import _event


class Cursor:
    def __init__(self, trade):
        self.trade = trade
        self.calls = []

    def execute(self, sql, params=None):
        self.calls.append((sql, params))

    def fetchone(self):
        return self.trade


class BeActivationTests(unittest.TestCase):
    def test_tp1_saves_activation_without_moving_base_stop(self):
        trade = {"id": 10, "message_id": 10, "symbol": "BTCUSD.P",
                 "timeframe": "15M", "exchange": "BINANCE", "side": "LONG",
                 "leverage": 20, "entry": "100", "close": False,
                 "tp1": "101", "tp2": "102", "tp3": "103",
                 "tp1_filled": False, "tp2_filled": False, "tp3_filled": False,
                 "pnl_accumulated": Decimal("0"), "margin_used": Decimal("20")}
        payload = {"signalId": "BTCUSD.P_15M_1790559000000", "typeSignal": "tp1",
                   "symbol": "BTCUSD.P", "timeframe": "15M",
                   "sourceExchange": "BINANCE", "direction": "LONG",
                   "leverage": 20, "entry": 100, "price": 101}
        timestamp = datetime(2026, 9, 28, tzinfo=timezone.utc)
        cursor = Cursor(trade)
        _event(cursor, payload, timestamp)
        statements = [sql for sql, _ in cursor.calls]
        self.assertTrue(any("be_activated_at = COALESCE" in sql for sql in statements))
        self.assertFalse(any("current_sl" in sql for sql in statements))
        self.assertEqual(cursor.calls[-1][1][0], timestamp)


if __name__ == "__main__":
    unittest.main()
