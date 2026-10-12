import json
import unittest
from datetime import timedelta
from decimal import Decimal

from audit_reporting import build_report
from audit_scenarios import evaluate, summarize
from test_audit_scenarios import events, T0


def ledger(*kinds):
    rows = []
    for e in events(*kinds):
        rows.append(dict(e, event_type=e['typeSignal'], applied_at=e['received_at'],
                         signal_id='BTCUSD.P_15M_1', exchange='BINANCE', margin_used=Decimal('20'),
                         signal_exists=True, state='applied', onza_status='delivered',
                         be_activated_at=None, stored_be_stop_price=None, recorded_pnl=Decimal('-3.2')))
    return rows


class RiskDetailsTests(unittest.TestCase):
    def test_tp1_enables_stop_at_entry_even_without_metadata(self):
        result = evaluate('a', events('tp1'), mode='partial_be', margin=20)
        self.assertTrue(result['be_activated'])
        self.assertTrue(result['be_applied'])
        self.assertEqual(result['be_stop_price'], 100)
        self.assertEqual(result['remaining_fraction'], .6)
        self.assertEqual(result['scenario_partial_pnl_usdt'], 1.6)
        self.assertIsNone(result['pnl_usdt'])

    def test_original_mode_keeps_rule_fact_but_does_not_apply_stop(self):
        result = evaluate('a', events('tp1', 'sl'), mode='partial_no_be', margin=20)
        self.assertTrue(result['be_activated'])
        self.assertFalse(result['be_applied'])
        self.assertEqual([l['fraction'] for l in result['legs']], [.4, .6])
        self.assertEqual([l['pnl_usdt'] for l in result['legs']], [1.6, -4.8])

    def test_close_at_entry_is_classified_as_be(self):
        es = events('tp1', 'close');es[-1]['payload']['price'] = 100
        result = evaluate('a', es, mode='partial_be', margin=20)
        self.assertEqual(result['close_reason'], 'BE_INFERRED')
        self.assertEqual(result['pnl_usdt'], 1.6)

    def test_observed_be_stops_only_remaining_and_does_not_credit_later_tp(self):
        result = evaluate('a', events('tp1', 'tp2', 'tp3'), mode='partial_be', margin=20,
                          be_hit_at=T0 + timedelta(minutes=2, seconds=30))
        self.assertEqual(result['pnl_usdt'], 1.6)
        self.assertEqual(result['max_tp'], 3)
        self.assertEqual([l['kind'] for l in result['legs']], ['TP1', 'BE'])

    def test_observed_gap_is_not_improved_to_entry(self):
        result = evaluate('a', events('tp1', 'sl'), mode='partial_be', margin=20,
                          be_hit_at=T0 + timedelta(minutes=2, seconds=30), be_hit_price=99)
        self.assertEqual(result['pnl_usdt'], -.8)

    def test_observation_before_tp1_does_not_enable_exit(self):
        result = evaluate('a', events('tp1', 'tp2', 'tp3'), mode='partial_be', margin=20,
                          be_hit_at=T0 + timedelta(minutes=1))
        self.assertFalse(result['be_observed'])
        self.assertEqual(result['pnl_usdt'], 7.2)

    def test_max_tp_waits_for_base_closure_and_handles_no_tp(self):
        opened = evaluate('a', events('tp1'), mode='max_tp', margin=20)
        self.assertFalse(opened['closed']);self.assertIsNone(opened['pnl_usdt'])
        closed = evaluate('a', events('sl'), mode='max_tp', margin=20)
        self.assertEqual(closed['pnl_usdt'], -8)
        closed = evaluate('a', events('tp1', 'sl'), mode='max_tp', margin=20)
        self.assertEqual(closed['pnl_usdt'], 4)
        self.assertEqual(closed['base_close_reason'], 'SL')

    def test_partial_contributions_have_initial_position_weights(self):
        result = evaluate('a', events('tp1', 'tp2', 'sl'), mode='partial_be', margin=20)
        self.assertEqual([l['fraction'] for l in result['legs']], [.4, .4, .2])
        self.assertAlmostEqual(sum(l['pnl_usdt'] for l in result['legs']), result['pnl_usdt'])

    def test_drawdown_follows_close_order_and_ignores_open_trades(self):
        rows=[]
        for index,(pnl,moment) in enumerate([(10,1),(-4,2),(-8,3),(5,4)]):
            row=evaluate(str(index),events('sl'),mode='partial_no_be',margin=20)
            row.update(pnl_usdt=pnl,closed_at=(T0+timedelta(minutes=moment)).isoformat())
            rows.append(row)
        rows.append(evaluate('open',events('tp1'),mode='partial_no_be',margin=20))
        s=summarize(list(reversed(rows)),'partial_no_be')
        self.assertEqual(s['pnl_usdt'],3)
        self.assertEqual(s['max_drawdown_usdt'],12)
        self.assertEqual(s['closed'],4)
        self.assertEqual(s['win_rate'],50)


class AuditReportingTests(unittest.TestCase):
    def test_complete_report_reconciles_and_compares_same_population(self):
        data=build_report(ledger('tp1','sl'),mode='partial_be')
        self.assertEqual(data['reconciliation']['matched'],1)
        self.assertEqual(data['summary']['pnl_usdt'],1.6)
        self.assertEqual(data['comparison']['partial_no_be']['pnl_usdt'],-3.2)
        self.assertEqual(data['comparison']['max_tp']['pnl_usdt'],4)
        self.assertEqual({s['signals'] for s in data['comparison'].values()},{1})

    def test_orphan_events_are_visible_but_never_assigned_invented_pnl(self):
        es=ledger('tp1','sl');orphan=dict(es[-1],id=88,signal_id='missing_entry',signal_exists=False,state='pending')
        data=build_report(es+[orphan],mode='partial_be')
        self.assertEqual(data['coverage']['events_total'],4)
        self.assertEqual(data['coverage']['states']['pending'],1)
        self.assertEqual(data['coverage']['incident_events'],1)
        self.assertEqual(data['incidents'][0]['signal_id'],'missing_entry')
        self.assertEqual(data['summary']['signals'],1)

    def test_payload_credentials_and_messages_are_not_exposed(self):
        es=ledger('tp1','sl');es[0]['payload'].update(apiKey='DO_NOT_EXPORT',message='PRIVATE_MESSAGE')
        serialized=json.dumps(build_report(es,mode='partial_be'))
        self.assertNotIn('DO_NOT_EXPORT',serialized);self.assertNotIn('PRIVATE_MESSAGE',serialized)

    def test_dates_use_colombia_entry_day_and_filters_apply_to_all_modes(self):
        es=ledger('tp1','sl')
        included=build_report(es,mode='partial_be',filters={'from':'2026-09-28','to':'2026-09-28','search':'LONG','status':'closed'})
        self.assertEqual(included['summary']['signals'],1)
        excluded=build_report(es,mode='partial_be',filters={'from':'2026-09-29'})
        self.assertEqual(excluded['summary']['signals'],0)
        self.assertTrue(all(s['signals']==0 for s in excluded['comparison'].values()))

    def test_invalid_date_and_status_are_rejected(self):
        for filters in ({'from':'broken'},{'status':'wrong'},{'from':'2026-10-12','to':'2026-10-01'}):
            with self.assertRaises(ValueError):build_report([],mode='partial_be',filters=filters)

    def test_missing_record_is_an_explicit_reconciliation_incident(self):
        es=ledger('tp1','sl')
        for e in es:e['recorded_pnl']=None
        self.assertEqual(build_report(es,mode='partial_be')['reconciliation']['missing'],1)

    def test_unapplied_tp_does_not_enable_be(self):
        es=ledger('tp1');es[1]['state']='pending'
        data=build_report(es,mode='partial_be')
        self.assertFalse(data['rows'][0]['be_activated'])
        self.assertEqual(data['coverage']['states']['pending'],1)

    def test_missing_tp_is_reported_and_does_not_crash_entire_report(self):
        es=ledger('tp2')
        data=build_report(es,mode='partial_be')
        self.assertEqual(data['summary']['signals'],0)
        self.assertEqual(data['coverage']['incidents'],1)


if __name__=='__main__':unittest.main()
