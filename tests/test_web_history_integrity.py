import copy
import unittest
from unittest.mock import patch
from test_audit_reporting import ledger
from audit_reporting import build_report
from web_history_integrity import summarize_integrity

class HistoryIntegrityTests(unittest.TestCase):
 def orphan(self,sid):
  e=ledger("tp1")[-1];e["signal_id"]=sid;e["state"]="pending";e["signal_exists"]=False
  return e
 def test_only_explicitly_archived_fragments_leave_pending_incidents(self):
  old=self.orphan("OLD");new=self.orphan("NEW");before=copy.deepcopy([old,new])
  with patch("web_history_integrity.KNOWN_GAPS",{"OLD":{"classification":"Archivado","origin_bar_utc":"2026-01-01T00:00:00+00:00"}}):
   result=build_report([old,new],mode="partial_be",risk_override=250)
  self.assertEqual([old,new],before);self.assertEqual(result["archive"]["groups"],1)
  self.assertEqual([i["signal_id"] for i in result["incidents"]],["NEW"])
  self.assertEqual(result["summary"]["signals"],0);self.assertEqual(result["summary"]["pnl_usdt"],0)
  self.assertEqual(result["integrity"]["status"],"review")
 def test_new_incomplete_entry_never_gets_assumed_levels(self):
  r=build_report([self.orphan("NEW")],mode="partial_be")["incidents"][0]
  self.assertFalse(r["recoverable"]);self.assertIn("Stop original",r["missing_fields"])
  self.assertNotIn("stopLoss",r["known_fields"])
 def test_math_gate_detects_corrupt_result_and_quantity(self):
  result=build_report(ledger("tp1","sl"),mode="partial_be",risk_override=250)
  self.assertEqual(result["integrity"]["status"],"ok")
  rows=copy.deepcopy(result["rows"]);rows[0]["pnl_usdt"]+=1
  self.assertEqual(summarize_integrity(rows,[])["status"],"error")
  rows=copy.deepcopy(result["rows"]);rows[0]["remaining_fraction"]=.5
  self.assertEqual(summarize_integrity(rows,[])["status"],"error")
 def test_archived_group_does_not_reappear_on_late_source_entry(self):
  source=ledger("tp1","sl");sid=source[0]["signal_id"]
  with patch("web_history_integrity.KNOWN_GAPS",{sid:{"classification":"Archivado","origin_bar_utc":"2026-01-01T00:00:00+00:00"}}):
   result=build_report(source,mode="partial_be",risk_override=250)
  self.assertEqual(len(result["rows"]),0);self.assertEqual(result["archive"]["groups"],1)
 def test_public_results_fail_closed_when_math_is_inconsistent(self):
  from public_results import project_public
  report=build_report(ledger("tp1","sl"),mode="partial_be",risk_override=250)
  report["integrity"]["math_errors"]=[{"reason":"test"}]
  with self.assertRaises(RuntimeError):project_public(report,10000)
