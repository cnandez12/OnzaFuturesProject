import unittest
from datetime import datetime, timedelta, timezone

from audit_scenarios import evaluate, summarize


T0 = datetime(2026, 9, 28, 20, 0, tzinfo=timezone.utc)


def events(*kinds, direction="LONG"):
    entry = 100
    levels = {"tp1": 101, "tp2": 102, "tp3": 103, "sl": 98, "close": 99}
    if direction == "SHORT":
        levels = {"tp1": 99, "tp2": 98, "tp3": 97, "sl": 102, "close": 101}
    out = [{"id": 1, "typeSignal": "entry", "received_at": T0,
            "payload": {"entry": entry, "leverage": 20, "direction": direction,
                        "symbol": "BTCUSD.P", "timeframe": "15M"}}]
    for index, kind in enumerate(kinds, 2):
        out.append({"id": index, "typeSignal": kind,
                    "received_at": T0 + timedelta(minutes=index),
                    "payload": {"price": levels[kind]}})
    return out


class AuditScenarioTests(unittest.TestCase):
    def calc(self, mode, *kinds, direction="LONG"):
        return evaluate("BTCUSD.P_15M_1", events(*kinds, direction=direction),
                        mode=mode, margin=20)

    def test_tp1_then_sl_does_not_apply_be_to_original_stop_mode(self):
        original = self.calc("partial_no_be", "tp1", "sl")
        protected = self.calc("partial_be", "tp1", "sl")
        self.assertEqual(original["pnl_usdt"], -3.2)
        self.assertEqual(protected["pnl_usdt"], 1.6)
        self.assertTrue(original["be_activated"])
        self.assertEqual(protected["quality"], "be_inferred_from_original_sl")

    def test_tp2_then_sl_only_protects_remaining_twenty_percent(self):
        self.assertEqual(self.calc("partial_no_be", "tp1", "tp2", "sl")["pnl_usdt"], 3.2)
        self.assertEqual(self.calc("partial_be", "tp1", "tp2", "sl")["pnl_usdt"], 4.8)

    def test_tp3_closes_all_parcels(self):
        result = self.calc("partial_be", "tp1", "tp2", "tp3")
        self.assertEqual(result["pnl_usdt"], 7.2)
        self.assertTrue(result["closed"])

    def test_max_tp_has_no_invented_profit(self):
        result = self.calc("max_tp", "tp1", "tp2", "tp3")
        self.assertEqual(result["max_tp"], 3)
        self.assertTrue(result["closed"])
        self.assertIsNone(result["pnl_usdt"])
        self.assertIsNone(summarize([result], "max_tp")["profit_factor"])

    def test_short_has_the_same_scenario_math(self):
        self.assertEqual(self.calc("partial_no_be", "tp1", "sl", direction="SHORT")["pnl_usdt"], -3.2)
        self.assertEqual(self.calc("partial_be", "tp1", "sl", direction="SHORT")["pnl_usdt"], 1.6)

    def test_open_trade_does_not_enter_realized_profit_factor(self):
        result = self.calc("partial_no_be", "tp1")
        self.assertFalse(result["closed"])
        self.assertIsNone(result["pnl_usdt"])
        self.assertEqual(summarize([result], "partial_no_be")["closed"], 0)


if __name__ == "__main__":
    unittest.main()
