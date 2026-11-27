import copy,importlib,unittest
from unittest.mock import Mock,patch
import market_visibility as policy
from audit_reporting import build_report
from public_results import project_public
from test_audit_reporting import ledger

class LiveVisibilityTests(unittest.TestCase):
 def setUp(self):
  self.old=(policy._catalogue,policy._checked_at)
  policy._catalogue=None;policy._checked_at=0
 def tearDown(self):policy._catalogue,policy._checked_at=self.old
 def test_catalogue_filters_inactive_and_explicit_epic_with_cache(self):
  r=Mock();r.json.return_value={'code':0,'data':[{'symbol':'BTCUSDT','symbolStatus':'OPEN'},{'symbol':'EPICUSDT','symbolStatus':'OPEN'},{'symbol':'STOPUSDT','symbolStatus':'STOP'}]}
  with patch.object(policy.requests,'get',return_value=r) as get:
   states=policy.live_market_states(['BTC/USDT','EPICUSD.P','STOPUSDT','MISSINGUSDT'])
   policy.live_market_states(['BTCUSDT']);self.assertEqual(get.call_count,1)
  self.assertTrue(states['BTCUSDT']['visible'])
  self.assertFalse(states['EPICUSDT']['visible'])
  self.assertFalse(states['STOPUSDT']['visible'])
  self.assertFalse(states['MISSINGUSDT']['visible'])
 def test_catalogue_outage_does_not_hide_healthy_unknown_markets(self):
  with patch.object(policy.requests,'get',side_effect=policy.requests.ConnectionError):
   states=policy.live_market_states(['BTCUSDT','EPICUSDT'])
  self.assertTrue(states['BTCUSDT']['visible']);self.assertFalse(states['EPICUSDT']['visible'])
 def test_exclusion_preserves_all_history_and_financial_summary(self):
  report=build_report(ledger('tp1','sl'),mode='partial_be')
  report['rows'][0]['symbol']='EPICUSD.P';before=copy.deepcopy(report)
  public=project_public(report,5000)
  self.assertEqual(public['summary'],report['summary']);self.assertEqual(report,before)
  self.assertEqual(len(public['signals']),1);self.assertEqual(public['signals'][0]['pnl_usdt'],1.6)
  self.assertFalse(public['signals'][0]['live_eligible']);self.assertEqual(public['featured_signal_ids'],[])
 def test_only_explicit_live_endpoint_filters_open_records(self):
  panel=importlib.import_module('dashboard.app');rows=[{'id':1,'pair':'EPICUSDT'},{'id':2,'pair':'BTCUSDT'}]
  states={'EPICUSDT':{'visible':False},'BTCUSDT':{'visible':True}}
  with patch.object(panel,'query',return_value=rows),patch.object(panel,'live_market_states',return_value=states):
   with panel.app.test_request_context('/api/sim/open'):all_rows=panel.api_open().json
   with panel.app.test_request_context('/api/sim/open?live=1'):live=panel.api_open().json
  self.assertEqual(len(all_rows),2);self.assertEqual([r['pair'] for r in live],['BTCUSDT'])
