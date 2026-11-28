import ast
import copy
import unittest
from datetime import timedelta
from pathlib import Path
from unittest.mock import patch
from test_audit_reporting import ledger
from audit_reporting import build_report
from web_auto_engine import replay,MINUTE,MissingCandles,CandleReader,RoundBudget
from web_opposites import first_opposites
from web_reconciliation_worker import cycle

class AutoReconciliationTests(unittest.TestCase):
 def source(self):
  e=ledger()[0];e['signal_pk']=900;e['signal_exists']=True;e['payload']['takeProfits']=[{'price':101},{'price':102},{'price':103}]
  return [e]
 def ms(self,source,n):return int((source[0]['received_at']+timedelta(minutes=n)).timestamp()*1000)
 def reader(self,source,values):
  bars=[dict(time=self.ms(source,i+1),open=lo,low=lo,high=hi,close=hi) for i,(lo,hi) in enumerate(values)]
  return lambda symbol,interval,start,end:[b for b in bars if start<=b['time']<end]
 def report(self,source,record):
  rows=copy.deepcopy(source)
  for e in rows:e['web_evidence']=record
  return build_report(rows,mode='partial_be',risk_override=250)['rows'][0]
 def opposite(self,source,minutes=2.5,timeframe=None,price=100.8):
  e=copy.deepcopy(source[0]);e['id']=99;e['signal_id']='OTHER';e['signal_pk']=901;e['received_at']=e['applied_at']=source[0]['received_at']+timedelta(minutes=minutes)
  p=e['payload'];p.update(direction='SHORT',entry=price,stopLoss={'price':price+2},takeProfits=[{'price':price-1},{'price':price-2},{'price':price-3}])
  if timeframe:p['timeframe']=timeframe
  return e
 def test_missing_targets_are_recovered_with_exact_split(self):
  s=self.source();record=replay(s[0]['signal_id'],s,self.ms(s,4),self.reader(s,[(100.1,101.1),(101.2,102.1),(102.2,103.1)]))
  r=self.report(s,record)
  self.assertTrue(r['closed']);self.assertEqual(r['pnl_usdt'],225);self.assertEqual([l['fraction'] for l in r['legs']],[.4,.4,.2])
 def test_missing_be_exits_only_the_remaining_sixty_percent(self):
  s=self.source();record=replay(s[0]['signal_id'],s,self.ms(s,3),self.reader(s,[(100.1,101.1),(99.9,101.2)]))
  r=self.report(s,record);self.assertEqual(r['pnl_usdt'],50);self.assertEqual(r['close_reason'],'BE_OBSERVED');self.assertEqual(r['remaining_fraction'],0)
 def test_same_bar_original_stop_wins_over_targets(self):
  s=self.source();record=replay(s[0]['signal_id'],s,self.ms(s,2),self.reader(s,[(97,104)]))
  r=self.report(s,record);self.assertEqual(r['pnl_usdt'],-250);self.assertEqual(r['max_tp'],0)
 def test_same_bar_new_be_wins_before_second_target(self):
  s=self.source();record=replay(s[0]['signal_id'],s,self.ms(s,2),self.reader(s,[(99.9,103.1)]))
  r=self.report(s,record);self.assertEqual(r['pnl_usdt'],50);self.assertEqual(r['max_tp'],1)
 def test_opposite_without_tp_closes_entire_position_immediately(self):
  s=self.source();opp=self.opposite(s,minutes=.5,price=100.8)
  r=build_report([*s,opp],mode='partial_be',risk_override=250)['rows'][-1]
  self.assertTrue(r['closed']);self.assertEqual(r['pnl_usdt'],100);self.assertEqual(r['close_reason'],'SIGNAL_OPPOSITE')
 def test_opposite_in_other_timeframe_does_not_close_the_position(self):
  s=self.source();opp=self.opposite(s,timeframe='4H')
  self.assertNotIn(s[0]['signal_id'],first_opposites([*s,opp]))
 def test_opposite_after_tp1_keeps_realized_part_and_closes_remainder(self):
  s=self.source();opp=self.opposite(s);reader=self.reader(s,[(100.1,101.1),(100.5,101.5),(102.2,104)])
  calls=[]
  def bounded(symbol,interval,start,end):calls.append(end);return reader(symbol,interval,start,end)
  record=replay(s[0]['signal_id'],s,self.ms(s,5),bounded,opposite=opp)
  r=self.report(s,record);self.assertEqual(r['pnl_usdt'],110);self.assertEqual(r['close_reason'],'SIGNAL_OPPOSITE')
  self.assertTrue(all(end<=int(opp['received_at'].timestamp()*1000)//MINUTE*MINUTE for end in calls))
 def test_already_closed_position_stops_fetching_and_is_idempotent(self):
  s=self.source();record=replay(s[0]['signal_id'],s,self.ms(s,3),self.reader(s,[(100.1,101.1),(99.9,101.2)]))
  def forbidden(*args):raise AssertionError('No price reads after closure')
  self.assertEqual(replay(s[0]['signal_id'],s,self.ms(s,99),forbidden,record),record)
 def test_incremental_scan_resumes_at_last_completed_minute(self):
  s=self.source();reader=self.reader(s,[(100.1,100.5),(100.1,100.6),(100.1,101.1)])
  record=replay(s[0]['signal_id'],s,self.ms(s,3),reader)
  calls=[]
  def resumed(symbol,interval,start,end):calls.append(start);return reader(symbol,interval,start,end)
  replay(s[0]['signal_id'],s,self.ms(s,4),resumed,record)
  self.assertEqual(calls,[self.ms(s,3)])
 def test_coverage_gap_is_not_invented(self):
  s=self.source()
  with self.assertRaises(MissingCandles):replay(s[0]['signal_id'],s,self.ms(s,3),lambda *args:[])
 def test_budget_exhaustion_does_not_start_network(self):
  with patch('web_auto_engine.requests.get') as get:
   with self.assertRaises(RoundBudget):CandleReader(seconds=-1)('BTCUSDT','1m',1,2)
   get.assert_not_called()
 def test_new_worker_never_imports_delivery_or_webhook_processors(self):
  forbidden={'app','worker','onza_processing','vorza_worker','vorza_queue','telegram_channels','telegram_review'}
  for file in ('web_reconciliation_worker.py','web_auto_engine.py','web_auto_store.py','web_opposites.py'):
   tree=ast.parse(Path(file).read_text(encoding='utf-8'))
   names={n.module for n in ast.walk(tree) if isinstance(n,ast.ImportFrom)}|{a.name for n in ast.walk(tree) if isinstance(n,ast.Import) for a in n.names}
   self.assertFalse(names&forbidden,(file,names&forbidden))
