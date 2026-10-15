import copy
import unittest
from unittest.mock import Mock, patch
from audit_reporting import build_report
from public_results import project_public, public_market_marks, _mark_cache
from test_audit_reporting import ledger


class FeaturedSelectionTests(unittest.TestCase):
    def active(self,name,tp=0,direction='LONG'):
        row=copy.deepcopy(build_report(ledger('tp1'),mode='partial_be')['rows'][0])
        row.update(signal_id=name,symbol=name+'USD.P',direction=direction,max_tp=tp,
                   entry_price=100,margin_used=100,leverage=1,remaining_fraction=1-tp*.4,
                   scenario_partial_pnl_usdt=tp*4,recorded_partial_pnl_usdt=tp*4,
                   received_at='2026-10-15T00:00:00Z')
        return row

    def closed(self,name,pnl,day):
        row=copy.deepcopy(build_report(ledger('tp1','sl'),mode='partial_be')['rows'][0])
        row.update(signal_id=name,pnl_usdt=pnl,roi_pct=pnl,closed_at=f'2026-10-{day:02d}T00:00:00Z')
        return row

    def report(self,rows):
        report=build_report(ledger('tp1','sl'),mode='partial_be')
        report['rows']=rows
        return report

    def test_tp_priority_then_positive_remainder_for_long_and_short(self):
        rows=[self.active('P',2),self.active('Q',1),self.active('L'),self.active('S',direction='SHORT'),self.active('N')]
        public=project_public(self.report(rows),1000,{'PUSDT':102,'QUSDT':103,'LUSDT':105,'SUSDT':94,'NUSDT':90})
        self.assertEqual(public['featured_signal_ids'],['P','Q','S','L'])
        negative=next(r for r in public['signals'] if r['signal_id']=='N')
        self.assertFalse(negative['prices_visible'])
        self.assertNotIn('entry_price',negative)
        self.assertNotIn('open_performance',negative)
        short=next(r for r in public['signals'] if r['signal_id']=='S')
        self.assertEqual(short['open_performance']['pnl_usdt'],6)

    def test_selection_rotates_when_quotes_change_and_old_levels_are_removed(self):
        rows=[self.active(c) for c in 'ABCDE']
        report=self.report(rows);snapshot=copy.deepcopy(report)
        first=project_public(report,1000,{c+'USDT':101+i for i,c in enumerate('ABCDE')})
        second=project_public(report,1000,{'AUSDT':120,'BUSDT':110,'CUSDT':105,'DUSDT':104,'EUSDT':90})
        self.assertEqual(first['featured_signal_ids'],['E','D','C','B'])
        self.assertEqual(second['featured_signal_ids'],['A','B','C','D'])
        self.assertNotIn('targets',next(r for r in second['signals'] if r['signal_id']=='E'))
        self.assertEqual(report,snapshot)

    def test_fallback_is_recent_profitable_closed_history_and_totals_stay_complete(self):
        report=self.report([self.active('A',1),self.closed('OLD',30,11),self.closed('NEW',3,14),
                            self.closed('RECENT',2,15),self.closed('LOSS',-10,15)])
        public=project_public(report,1000)
        self.assertEqual(public['featured_signal_ids'],['A','RECENT','NEW','OLD'])
        self.assertTrue(next(r for r in public['signals'] if r['signal_id']=='RECENT')['closed'])
        self.assertEqual(public['summary'],report['summary'])
        self.assertEqual(len(public['signals']),5)
        self.assertEqual(next(r for r in public['signals'] if r['signal_id']=='LOSS')['pnl_usdt'],-10)

    def test_missing_or_invalid_quotes_never_make_untargeted_active_rows_positive(self):
        report=self.report([self.active('A'),self.active('B'),self.active('TP',1),self.closed('CLOSED',1,14)])
        public=project_public(report,1000,{'AUSDT':float('nan'),'BUSDT':0})
        self.assertEqual(public['featured_signal_ids'],['TP','CLOSED'])
        self.assertIsNone(next(r for r in public['signals'] if r['signal_id']=='TP')['open_performance'])

    def test_ranking_uses_realized_partials_plus_remaining_position(self):
        row=self.active('A',1)
        public=project_public(self.report([row]),1000,{'AUSDT':105})
        performance=public['signals'][0]['open_performance']
        self.assertEqual(performance['pnl_usdt'],7)
        self.assertEqual(performance['roi_pct'],7)

    def test_mark_quotes_are_cached_and_failure_returns_no_invented_prices(self):
        _mark_cache.clear()
        response=Mock();response.json.return_value={'code':0,'data':[{'symbol':'BTCUSDT','markPrice':'105','lastPrice':'104'}]}
        with patch('public_results.requests.get',return_value=response) as fetch:
            first=public_market_marks(['BTCUSD.P']);second=public_market_marks(['BTCUSD.P'])
        self.assertEqual(first[0],{'BTCUSDT':105});self.assertEqual(first,second)
        self.assertEqual(fetch.call_count,1)
        _mark_cache.clear()
        from requests import RequestException
        with patch('public_results.requests.get',side_effect=RequestException):
            self.assertEqual(public_market_marks(['BTCUSD.P']),({},None))
        _mark_cache.clear()
