import copy,unittest
from test_audit_reporting import ledger
from audit_reporting import build_report
from web_integrity import quote_issue
class WebReconciliationTests(unittest.TestCase):
 def rows(self):
  rows=ledger('tp2','tp3')
  rows[0]['payload']['takeProfits']=[{'price':101},{'price':102},{'price':103}]
  rows[0]['signal_pk']=1
  for e in rows:
   e['recorded_pnl']=None
   if e['event_type']!='entry':e['state']='pending';e['applied_at']=None;e['payload'].update(direction='LONG',entry=100)
  return rows
 def test_received_tp3_recovers_web_only_and_marks_inferred_tp1(self):
  rows=self.rows();before=copy.deepcopy(rows);report=build_report(rows,mode='partial_be',risk_override=250)
  self.assertEqual(rows,before);r=report['rows'][0]
  self.assertTrue(r['closed']);self.assertEqual(r['pnl_usdt'],225);self.assertEqual(r['remaining_fraction'],0)
  self.assertEqual(r['reconstruction']['inferred_targets'],['tp1']);self.assertEqual(r['reconciliation_status'],'reconstructed')
  self.assertEqual(r['legs'][0]['basis'],'target_inferred_from_later_tp')
 def test_mismatched_target_is_not_fabricated_as_a_close(self):
  rows=self.rows();rows[-1]['payload']['price']=102.99
  r=build_report(rows,mode='partial_be',risk_override=250)['rows'][0]
  self.assertFalse(r['closed']);self.assertIsNone(r['reconstruction']);self.assertTrue(r['integrity_note'])
 def test_wrong_parent_direction_is_not_recovered(self):
  rows=self.rows();rows[-1]['payload']['direction']='SHORT'
  self.assertFalse(build_report(rows,mode='partial_be',risk_override=250)['rows'][0]['closed'])
 def test_quote_cannot_credit_returns_beyond_unrecorded_targets_or_stop(self):
  p={'direction':'LONG','entry_price':100,'original_stop':98,'targets':[101,102,103],'max_tp':0}
  self.assertIn('TP3',quote_issue(p,104));self.assertIn('stop',quote_issue(p,97));self.assertIsNone(quote_issue(p,100.5))
  p.update(max_tp=1,be_activated=True);self.assertIn('stop',quote_issue(p,99.5));self.assertIsNone(quote_issue(p,None))
