import io
import unittest
from decimal import Decimal

from PIL import Image

from onza_contract import InvalidSignal, canonicalize, internal_pair
from onza_delivery import render_event_image
from onza_processing import pnl_piece


ENTRY = {
    "signalId": "VELVETUSDT.P_30M_1790559000000",
    "typeSignal": "entry",
    "symbol": "VELVETUSDT.P",
    "direction": "SHORT",
    "entry": 0.05793,
    "leverage": 20,
    "stopLoss": {"price": 0.0615, "roi": -123.0},
    "takeProfits": [
        {"price": 0.05682, "roi": 123.0},
        {"price": 0.05459, "roi": 123.0},
        {"price": 0.05126, "roi": 123.0},
    ],
    "timeframe": "30M",
    "message": "FB AI CRYPTOFUTURES SCANNER",
    "apiKey": "example-only",
}


class ContractTests(unittest.TestCase):
    def test_original_alert_is_normalized_to_onza_contract(self):
        result = canonicalize(ENTRY)
        self.assertEqual(result["signalId"], "VELVETUSD.P_30M_1790559000000")
        self.assertEqual(result["symbol"], "VELVETUSD.P")
        self.assertEqual(result["message"], "ONZA AI CRYPTOFUTURES")
        self.assertEqual(result["sourceExchange"], "BINANCE")
        self.assertEqual(internal_pair(result["symbol"]), "VELVETUSDT")
        self.assertNotIn("apiKey", result)
        self.assertLess(result["stopLoss"]["roi"], 0)
        self.assertTrue(all(tp["roi"] > 0 for tp in result["takeProfits"]))

    def test_event_uses_same_signal_id_and_recalculates_tp_roi(self):
        event = {
            "signalId": ENTRY["signalId"], "typeSignal": "tp1", "symbol": ENTRY["symbol"],
            "direction": ENTRY["direction"], "entry": ENTRY["entry"],
            "price": ENTRY["takeProfits"][0]["price"], "roi": 999,
            "leverage": 20, "timeframe": "30M",
        }
        result = canonicalize(event)
        self.assertEqual(result["signalId"], canonicalize(ENTRY)["signalId"])
        self.assertNotEqual(result["roi"], 999)

    def test_close_preserves_pine_accumulated_roi(self):
        event = {
            "signalId": ENTRY["signalId"], "typeSignal": "close", "symbol": ENTRY["symbol"],
            "direction": ENTRY["direction"], "entry": ENTRY["entry"],
            "price": ENTRY["entry"], "roi": 8.75,
            "leverage": 20, "timeframe": "30M",
        }
        self.assertEqual(canonicalize(event)["roi"], 8.75)

    def test_mismatched_signal_is_rejected(self):
        bad = dict(ENTRY, signalId="BTCUSDT.P_30M_1790559000000")
        with self.assertRaises(InvalidSignal):
            canonicalize(bad)

    def test_bybit_symbol_uses_requested_exchange(self):
        raw = dict(ENTRY, signalId="ETHUSDT.P_30M_1790559000000", symbol="ETHUSDT.P")
        self.assertEqual(canonicalize(raw)["sourceExchange"], "BYBIT")

    def test_partial_pnl_is_weighted(self):
        pnl = pnl_piece("LONG", Decimal("100"), Decimal("101"), 20,
                        Decimal("20"), Decimal("0.40"))
        self.assertEqual(pnl, Decimal("1.60000000"))
        remainder = pnl_piece("LONG", Decimal("100"), Decimal("98"), 20,
                              Decimal("20"), Decimal("0.60"))
        self.assertEqual(pnl + remainder, Decimal("-3.20000000"))

    def test_copied_image_template_renders(self):
        event = canonicalize({
            "signalId": ENTRY["signalId"], "typeSignal": "tp1", "symbol": ENTRY["symbol"],
            "direction": ENTRY["direction"], "entry": ENTRY["entry"],
            "price": ENTRY["takeProfits"][0]["price"], "roi": 1,
            "leverage": 20, "timeframe": "30M",
        })
        output = render_event_image(event, Decimal("1.23"), Decimal("6.15"))
        with Image.open(io.BytesIO(output)) as img:
            self.assertEqual(img.format, "JPEG")


if __name__ == "__main__":
    unittest.main()
