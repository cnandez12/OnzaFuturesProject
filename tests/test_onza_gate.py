import unittest

from worker import onza_gate


ENTRY = {"symbol": "BTCUSD.P", "timeframe": "15M", "sourceExchange": "BINANCE",
         "direction": "LONG", "leverage": 20, "entry": 100,
         "takeProfits": [{"price": 101}, {"price": 102}, {"price": 103}],
         "stopLoss": {"price": 98}}


def row(kind, status, payload):
    return {"event_type": kind, "onza_status": status, "payload": payload}


class OnzaGateTests(unittest.TestCase):
    def test_entry_can_be_dispatched_before_local_processing(self):
        ready, error = onza_gate(row("entry", "pending", ENTRY), [])
        self.assertTrue(ready)
        self.assertIsNone(error)

    def test_tp_waits_for_confirmed_entry(self):
        event = row("tp1", "pending", dict(ENTRY, price=101))
        self.assertEqual(onza_gate(event, []), (False, None))
        self.assertEqual(onza_gate(event, [row("entry", "pending", ENTRY)]), (False, None))
        self.assertEqual(onza_gate(event, [row("entry", "delivered", ENTRY)]), (True, None))

    def test_tp2_waits_for_tp1_and_bad_price_is_rejected(self):
        event = row("tp2", "pending", dict(ENTRY, price=102))
        prior = [row("entry", "delivered", ENTRY)]
        self.assertEqual(onza_gate(event, prior), (False, None))
        prior.append(row("tp1", "delivered", dict(ENTRY, price=101)))
        self.assertEqual(onza_gate(event, prior), (True, None))
        bad = row("tp2", "pending", dict(ENTRY, price=104))
        self.assertIn("Precio", onza_gate(bad, prior)[1])

    def test_risk_exit_is_not_blocked_by_ambiguous_tp(self):
        event = row("sl", "pending", dict(ENTRY, price=98))
        prior = [row("entry", "delivered", ENTRY),
                 row("tp1", "pending", dict(ENTRY, price=101))]
        self.assertEqual(onza_gate(event, prior), (True, None))

    def test_event_with_mismatched_entry_is_not_forwarded(self):
        event = row("tp1", "pending", dict(ENTRY, price=101, direction="SHORT"))
        ready, error = onza_gate(event, [row("entry", "delivered", ENTRY)])
        self.assertFalse(ready)
        self.assertIn("direction", error)


if __name__ == "__main__":
    unittest.main()
