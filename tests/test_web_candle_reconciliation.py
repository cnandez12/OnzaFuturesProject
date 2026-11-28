import copy
import unittest
from datetime import timedelta
from unittest.mock import patch
from test_audit_reporting import ledger
from audit_reporting import build_report
from web_candle_reconciliation import fingerprint

class CandleReconciliationTests(unittest.TestCase):
 def record(self,source,kind,price,minute=5):
  at=source[0]["received_at"]+timedelta(minutes=minute)
  return {"fingerprint":fingerprint(source),"as_of":int(at.timestamp()*1000),"source":"Bitunix Futures LAST_PRICE",
          "observations":[{"kind":kind,"price":price,"bar":{"time":int(at.timestamp()*1000),"high":price,"low":price},"ambiguous":False}]}
 def report(self,source,record,mode="partial_be",filters=None):
  with patch("web_candle_reconciliation.EVIDENCE",{source[0]["signal_id"]:record}):
   return build_report(source,mode=mode,risk_override=250,filters=filters)
 def test_be_exits_only_remaining_quantity_without_changing_saved_events(self):
  source=ledger("tp1");before=copy.deepcopy(source)
  result=self.report(source,self.record(source,"sl",100))["rows"][0]
  self.assertEqual(source,before);self.assertEqual(result["pnl_usdt"],50)
  self.assertEqual(result["close_reason"],"BE_OBSERVED");self.assertEqual(result["remaining_fraction"],0)
  self.assertEqual(result["legs"][-1]["fraction"],.6);self.assertFalse(result["be_fill_verified"])
 def test_direct_stop_remains_exactly_fixed_risk(self):
  source=ledger();result=self.report(source,self.record(source,"sl",98))["rows"][0]
  self.assertEqual(result["pnl_usdt"],-250);self.assertEqual(result["close_reason"],"SL")
 def test_missing_tp_updates_open_remainder_and_enables_be(self):
  source=ledger();result=self.report(source,self.record(source,"tp1",101))["rows"][0]
  self.assertFalse(result["closed"]);self.assertTrue(result["be_activated"])
  self.assertEqual(result["remaining_fraction"],.6);self.assertEqual(result["recorded_partial_pnl_usdt"],50)
 def test_new_or_changed_source_event_invalidates_snapshot(self):
  source=ledger("tp1");record=self.record(source,"sl",100)
  changed=copy.deepcopy(source);changed[0]["payload"]["entry"]=100.1
  self.assertIsNone(self.report(changed,record)["rows"][0]["reconstruction"])
  changed=copy.deepcopy(source);changed[-1]["state"]="pending"
  self.assertIsNone(self.report(changed,record)["rows"][0]["reconstruction"])
 def test_non_be_modes_keep_alert_only_evidence(self):
  source=ledger("tp1");record=self.record(source,"sl",100)
  for mode in ("partial_no_be","max_tp"):
   row=self.report(source,record,mode)["rows"][0]
   self.assertFalse(row["closed"]);self.assertIsNone(row["reconstruction"])
 def test_closed_filter_uses_selected_scenario(self):
  source=ledger("tp1");record=self.record(source,"sl",100)
  self.assertEqual(len(self.report(source,record,filters={"status":"closed"})["rows"]),1)
  self.assertEqual(len(self.report(source,record,filters={"status":"open"})["rows"]),0)
 def test_already_recorded_terminal_is_not_duplicated(self):
  source=ledger("tp1","sl");record=self.record(source,"sl",100)
  self.assertIsNone(self.report(source,record)["rows"][0]["reconstruction"])

 def test_be_before_later_recorded_tp2_does_not_credit_tp2(self):
  source=ledger("tp1","tp2");at=source[1]["received_at"]+timedelta(seconds=10)
  record=self.record(source,"sl",100);record["observations"][0]["bar"]["time"]=int(at.timestamp()*1000)-60000
  row=self.report(source,record)["rows"][0]
  self.assertEqual(row["pnl_usdt"],50);self.assertEqual([l["kind"] for l in row["legs"]],["TP1","BE"])
 def test_market_tp2_replaces_later_alert_instead_of_duplicating_it(self):
  source=ledger("tp1","tp2");record=self.record(source,"tp2",102)
  row=self.report(source,record)["rows"][0]
  self.assertEqual([l["kind"] for l in row["legs"]],["TP1","TP2"]);self.assertEqual(row["remaining_fraction"],.2)
