import unittest
from datetime import date, datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock, patch

import requests
import telegram_channels as tc


def closed(**extra):
    row = dict(symbol="BTCUSDT", direction="LONG", entry_price=100, exit_price=98,
               leverage=20, hit_tp1=True, hit_tp2=True, hit_tp3=False,
               tp1=101, tp2=105.25, tp3=107.5, close_reason="SL")
    row.update(extra)
    return row


class ChannelTests(unittest.TestCase):
    def test_tp2_then_sl_retains_highest_tp_not_partial_pnl(self):
        label, value = tc.highest_result(closed(final_profit_pct=-12))
        self.assertEqual((label,value),("TP2",Decimal("105.00")))

    def test_short_roi_uses_entry_denominator(self):
        self.assertEqual(tc.highest_result(closed(direction="SHORT",tp2=94.75))[1],Decimal("105.00"))

    def test_stop_without_tp_and_opposite_close_are_distinct(self):
        row = closed(hit_tp1=False,hit_tp2=False)
        self.assertEqual(tc.highest_result(row),("SL",Decimal(-40)))
        row.update(close_reason="SIGNAL_OPPOSITE",exit_price=100)
        self.assertEqual(tc.highest_result(row),("CLOSE",Decimal(0)))

    def test_report_english_cta_and_no_false_account_return(self):
        text = tc.report_parts([closed()],date(2026,10,2),True)[0]
        self.assertIn("TP2 · +105.00%",text)
        self.assertIn("Sum of ROI per signal",text)
        self.assertIn(tc.APP_URL,text)
        self.assertNotIn("Ganadas",text)

    def test_empty_and_large_reports_fit_telegram(self):
        empty = tc.report_parts([],date(2026,10,2),True)[0]
        self.assertIn("Closed trades: 0",empty)
        parts = tc.report_parts([closed() for _ in range(500)],date(2026,10,2),True)
        self.assertGreater(len(parts),1)
        self.assertTrue(all(len(p)<4096 and tc.APP_URL in p for p in parts))
        self.assertEqual(sum(p.count("BTCUSDT · LONG") for p in parts),500)

    def test_momentum_requires_two_wins_positive_net_and_no_tie(self):
        self.assertIsNone(tc.momentum([]))
        rows = [dict(direction="LONG",final_profit_pct=10)]*2
        self.assertEqual(tc.momentum(rows),"LONG")
        self.assertIsNone(tc.momentum(rows+[dict(direction="SHORT",final_profit_pct=10)]*2))

    def test_free_text_english_and_duration(self):
        payload = dict(typeSignal="tp2",symbol="ETHUSD.P",direction="SHORT",timeframe="1H",entry=100,price=95,leverage=20)
        text = tc.free_text(payload,datetime(2026,10,1,tzinfo=timezone.utc),datetime(2026,10,2,tzinfo=timezone.utc))
        self.assertIn("TP2 REACHED",text)
        self.assertIn("+100.00%",text)
        self.assertIn("1 day",text)
        self.assertLess(len(text),1024)
        self.assertNotIn("Source:",text)
        self.assertNotIn("Theoretical",text)
        self.assertIn("<b>ROI:</b>",text)

    @patch.dict("os.environ",{"TELEGRAM_BOT_TOKEN":"test"})
    @patch("telegram_channels.requests.post")
    def test_copy_message_confirmed_and_timeout_not_retried(self,post):
        post.return_value = MagicMock(status_code=200)
        post.return_value.json.return_value = {"ok":True,"result":{"message_id":123}}
        self.assertEqual(tc.call_telegram("copyMessage",{})[:2],("delivered",123))
        post.side_effect = requests.ReadTimeout()
        self.assertEqual(tc.call_telegram("copyMessage",{})[0],"unknown")

    def test_daily_queries_closed_at_utc_and_waits_for_main(self):
        cur = MagicMock()
        cur.fetchone.return_value = {"value":"2026-10-01"}
        cur.fetchall.return_value = [closed()]
        tc.plan_daily(cur,"main","free",datetime(2026,10,2,0,0,tzinfo=timezone.utc))
        calls = cur.execute.call_args_list
        query = next(c for c in calls if "SELECT * FROM sim_track_record" in c.args[0])
        self.assertEqual(query.args[1][0].astimezone(timezone.utc).hour,0)
        self.assertEqual(query.args[1][1].astimezone(timezone.utc).day,2)
        self.assertTrue(any("requires_key" in c.args[0] for c in calls))

    def test_no_report_before_utc_day_ends(self):
        cur = MagicMock()
        cur.fetchone.return_value = {"value":"2026-10-01"}
        tc.plan_daily(cur,"main","free",datetime(2026,10,1,23,59,tzinfo=timezone.utc))
        self.assertFalse(any("sim_track_record" in c.args[0] for c in cur.execute.call_args_list))


if __name__ == "__main__":
    unittest.main()
