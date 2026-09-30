import os
import sys
import types
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

for name, value in {
    "API_ID": "1", "API_HASH": "test", "SOURCE_CHANNEL_ID": "111",
    "SOURCE_CHANNEL_ID_2": "222", "DESTINATION_CHANNEL_ID": "333",
}.items():
    os.environ.setdefault(name, value)

# The installed runtime may omit this optional import during local unit tests.
try:
    import websockets
except ImportError:
    sys.modules["websockets"] = types.ModuleType("websockets")

import AllProfitFormatWhitImage as m


def trade(direction="Long"):
    return m.SimTrade(
        msg_id="1", pair="BTCUSDT", formatted_pair="BTC/USDT",
        direction=direction, entry=100.0, tp1=105.0, tp2=110.0,
        tp3=120.0, stop_loss=95.0 if direction == "Long" else 105.0,
        qty_total=4.0, sent_message_id=1,
        timestamp=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )


class SignalValidationTests(unittest.TestCase):
    def test_requires_protective_stop_and_ordered_targets(self):
        self.assertTrue(m.validate_signal("Long", 100, [105, 110, 120], 95)[0])
        self.assertTrue(m.validate_signal("Short", 100, [95, 90, 85], 105)[0])
        self.assertFalse(m.validate_signal("Short", 100, [95, 90, 85], None)[0])
        self.assertFalse(m.validate_signal("Long", 100, [120, 105, 110], 95)[0])
        self.assertFalse(m.validate_signal("Long", 0, [105, 110, 120], 95)[0])

    def test_source_ids_are_distinct_even_for_same_telegram_message_id(self):
        def event(channel):
            return SimpleNamespace(message=SimpleNamespace(id=7, peer_id=SimpleNamespace(channel_id=channel)), chat_id=-(10**12 + channel))
        first = abs(m.SOURCE_CHANNEL_ID)
        second = abs(m.SOURCE_CHANNEL_ID_2)
        self.assertEqual(m.source_message_key(event(first)), 7)
        self.assertEqual(m.source_message_key(event(second)), -7)


class TradeMathTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        log_patcher = patch.object(m, "log_message")
        log_patcher.start()
        self.addCleanup(log_patcher.stop)
        self.old_balance = m.sim_balance
        self.old_trades = m.sim_trades
        self.old_fills = m.tp_fill_prices
        self.old_brands = m.secondary_brands
        self.old_telegram = m.telegram_client
        m.sim_balance = 1000.0
        m.sim_trades = {}
        m.tp_fill_prices = {}
        m.secondary_brands = []
        m.telegram_client = None

    def tearDown(self):
        m.sim_balance = self.old_balance
        m.sim_trades = self.old_trades
        m.tp_fill_prices = self.old_fills
        m.secondary_brands = self.old_brands
        m.telegram_client = self.old_telegram

    async def test_tp3_persists_weighted_total(self):
        s = trade()
        s.tp1_filled = s.tp2_filled = True
        s.pnl_accumulated = 24.0
        m.sim_trades[s.msg_id] = s
        with patch.object(m, "update_sim_state_in_db"), patch.object(m, "update_trade_in_db") as update_trade, patch.object(m, "update_profit_records") as update_profit, patch.object(m, "save_sim_track_record") as track, patch.object(m, "save_state"), patch.object(m, "send_image", new=AsyncMock(return_value="")) as image, patch.object(m, "dispatch_onza_signal"):
            await m.handle_tp(s.msg_id, s, 3, 120.0)
        self.assertEqual(update_trade.call_args.args[1], "+200.00%")
        self.assertEqual(update_profit.call_args.args[2], "+200.00%")
        self.assertEqual(track.call_args.kwargs["final_profit_usdt"], 40.0)
        self.assertEqual(image.call_args.args[0]["profit_usdt"], 40.0)
        self.assertEqual(m.sim_balance, 1040.0)

    async def test_breakeven_stops_only_remaining_quantity(self):
        s = trade()
        m.sim_trades[s.msg_id] = s
        with patch.object(m, "BREAKEVEN", True), patch.object(m, "update_sim_state_in_db"), patch.object(m, "update_trade_in_db") as update_trade, patch.object(m, "update_profit_records"), patch.object(m, "save_sim_track_record") as track, patch.object(m, "save_state"), patch.object(m, "send_image", new=AsyncMock(return_value="")), patch.object(m, "dispatch_onza_signal"):
            await m.handle_tp(s.msg_id, s, 1, 105.0)
            self.assertEqual(s.current_sl, 100.0)
            self.assertEqual(s.qty_remaining, 2.4)
            self.assertEqual(update_trade.call_args.args[1], "+40.00%")
            await m.handle_sl(s.msg_id, s, 100.0)
        self.assertEqual(track.call_args.kwargs["final_profit_usdt"], 8.0)
        self.assertEqual(m.sim_balance, 1008.0)

    async def test_image_request_carries_exact_partial_usdt(self):
        import json
        captured = {}
        def fake_post(url, **kwargs):
            captured.update(json.loads(kwargs["data"]))
            return SimpleNamespace(status_code=400)
        info = {"typeEntry": "Long", "leverage": 20, "symbol": "BTC/USDT", "entry": 100,
                "mark": 105, "profit": "+40.00%", "profit_usdt": 8.0, "usdt_per_trade": 20.0}
        with patch.object(m.requests, "post", side_effect=fake_post):
            await m.send_image(info)
        self.assertEqual(captured["profit_usdt"], 8.0)
        self.assertEqual(captured["usdt_per_trade"], 20.0)


class OnzaCompatibilityTests(unittest.TestCase):
    def test_payload_shape_and_existing_close_roi_are_unchanged(self):
        s = trade()
        client = {"format": "onza", "name": "test", "url": "https://example.invalid", "api_key": "test", "timeframe": "15M", "message": "test"}
        captured = []
        with patch.object(m, "ONZA_FREE_BLACKLIST", frozenset()), patch.object(m, "webhook_clients", [client]), patch.object(m, "_post_onza_event", side_effect=lambda c, payload: captured.append(payload.copy())):
            m.dispatch_onza_entry(s)
            for kind, price in (("tp1", 105.0), ("tp2", 110.0), ("tp3", 120.0), ("sl", 95.0)):
                m.dispatch_onza_signal(s, kind, price, m._onza_roi(s, price))
            s.tp1_filled = True
            s.pnl_accumulated = 8.0
            m.dispatch_onza_close(s, 90.0)
        self.assertEqual([p["typeSignal"] for p in captured], ["entry", "tp1", "tp2", "tp3", "sl", "close"])
        self.assertEqual(len({p["signalId"] for p in captured}), 1)
        self.assertEqual(captured[-1]["roi"], 100.0)  # Deliberately left unchanged for Onza.
        self.assertEqual(set(captured[-1]), {"signalId", "typeSignal", "symbol", "direction", "entry", "price", "roi", "leverage", "timeframe", "message", "apiKey"})

    def test_blacklist_accepts_common_symbol_formats(self):
        parsed = m.parse_onza_free_blacklist(" FILUSDT, btc/usdt; ETHUSD.P  ")
        self.assertEqual(parsed, frozenset({"FILUSDT", "BTCUSDT", "ETHUSDT"}))
        with patch.object(m, "ONZA_FREE_BLACKLIST", parsed):
            self.assertTrue(m.is_onza_free_blacklisted("FIL/USDT"))
            self.assertTrue(m.is_onza_free_blacklisted("ETHUSD.P"))
            self.assertFalse(m.is_onza_free_blacklisted("SOLUSDT"))

    def test_blacklisted_symbol_never_reaches_any_onza_event(self):
        s = trade()
        s.pair = "FILUSDT"
        s.formatted_pair = "FIL/USDT"
        client = {"format": "onza", "name": "test", "url": "https://example.invalid", "api_key": "test", "timeframe": "15M", "message": "test"}
        captured = []
        with patch.object(m, "ONZA_FREE_BLACKLIST", frozenset({"FILUSDT"})), patch.object(m, "webhook_clients", [client]), patch.object(m, "_post_onza_event", side_effect=lambda c, payload: captured.append(payload.copy())), patch.object(m, "log_message"):
            m.dispatch_onza_entry(s)
            for kind, price in (("tp1", 105.0), ("tp2", 110.0), ("tp3", 120.0), ("sl", 95.0)):
                m.dispatch_onza_signal(s, kind, price, m._onza_roi(s, price))
            m.dispatch_onza_close(s, 100.0)
        self.assertEqual(captured, [])

    def test_blacklist_does_not_block_standard_webhooks(self):
        client = {"format": "standard", "name": "main", "url": "https://example.invalid", "secret": "test"}
        with patch.object(m, "ONZA_FREE_BLACKLIST", frozenset({"FILUSDT"})), patch.object(m, "webhook_clients", [client]), patch.object(m, "_post_standard_entry") as post:
            m.dispatch_entry_webhooks("FILUSDT", "Long", 100.0, 95.0, [105.0, 110.0, 120.0])
        post.assert_called_once_with(client, "FILUSDT", "Long", 100.0, 95.0, [105.0, 110.0, 120.0])


if __name__ == "__main__":
    unittest.main()


class BrandingAndFreeFormatTests(unittest.TestCase):
    def test_private_signal_uses_onza_futures_brand(self):
        message = m.NEW_TRADE_TEMPLATE.format(
            pair="BTC/USDT",
            direction="Long",
            signal_emoji="🟢",
            leverage=20,
            entry_price="84000",
            tp_lines="🎯 **Take Profit #1: 84500**",
            stop_loss="83000",
        )
        self.assertIn("Onza Futures", message)
        self.assertNotIn("FB Futures AI", message)

    def test_free_signal_is_complete_and_ends_with_onza_app(self):
        message = m.format_free_signal_message(
            "BTC/USDT",
            "Long",
            20,
            "84000",
            ["84500", "85000", "86000"],
            "83000",
        )
        self.assertIn("NUEVA SEÑAL GRATUITA", message)
        self.assertIn("BTCUSD", message)
        self.assertIn("TP1", message)
        self.assertIn("TP2", message)
        self.assertIn("TP3", message)
        self.assertIn("STOP LOSS", message)
        self.assertIn("ENTRA A ONZA APP YA MISMO", message)
        self.assertIn("https://apps.apple.com/app/id6768534887", message)
        self.assertIn("ONZA FUTURES", message)
        self.assertNotIn("Detectada por Onza Filters", message)
        self.assertTrue(message.endswith("https://apps.apple.com/app/id6768534887"))
