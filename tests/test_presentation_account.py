import copy
import unittest
from decimal import Decimal
from audit_reporting import build_report
from test_audit_reporting import ledger
from dashboard.presentation import project_sql
from presentation_config import INITIAL_CAPITAL,TRADE_MARGIN

class PresentationAccountTests(unittest.TestCase):
    def test_presentation_margin_does_not_modify_source_or_reconciliation(self):
        source=ledger('tp1','sl');before=copy.deepcopy(source)
        r=build_report(source,mode='partial_be',margin_override=TRADE_MARGIN)
        self.assertEqual(source,before)
        self.assertEqual(r['rows'][0]['margin_used'],250)
        self.assertEqual(r['rows'][0]['source_margin_used'],20)
        self.assertEqual(r['rows'][0]['pnl_usdt'],20)
        self.assertEqual(r['reconciliation']['mismatched'],0)
        self.assertEqual(r['rows'][0]['recorded_pnl_usdt'],-3.2)
        self.assertEqual(INITIAL_CAPITAL,Decimal('10000'))

    def test_delivery_queries_are_never_projected(self):
        for sql in ('SELECT * FROM tv_events','SELECT * FROM vorza_deliveries','SELECT * FROM telegram_publications'):
            self.assertEqual(project_sql(sql,(),5000),(sql,()))

    def test_web_queries_use_select_only_projection(self):
        for sql in ('SELECT final_profit_usdt FROM sim_track_record','SELECT pnl_accumulated FROM trades'):
            projected,_=project_sql(sql,(),5000)
            self.assertTrue(projected.startswith('WITH '))
            self.assertNotIn('UPDATE ',projected)
            self.assertNotIn('INSERT ',projected)
            self.assertNotIn('DELETE ',projected)

    def test_fixed_risk_direct_stop_is_250_for_both_sides_and_distances(self):
        from presentation_config import risk_margin
        from audit_scenarios import evaluate
        from test_audit_scenarios import events
        for side in ('LONG','SHORT'):
            for gap in ('0.25','2','20'):
                es=events('sl',direction=side)
                stop=Decimal('100')+(Decimal(gap) if side=='SHORT' else -Decimal(gap))
                es[0]['payload']['stopLoss']={'price':str(stop)}
                es[-1]['payload']['price']=str(stop)
                margin=risk_margin(es[0]['payload'])
                result=evaluate('x',es,mode='partial_be',margin=margin)
                self.assertEqual(result['pnl_usdt'],-250)

    def test_fixed_risk_partials_and_be_preserve_original_reconciliation(self):
        source=ledger('tp1','sl');before=copy.deepcopy(source)
        report=build_report(source,mode='partial_be',risk_override=Decimal('250'))
        self.assertEqual(source,before)
        row=report['rows'][0]
        self.assertEqual(row['pnl_usdt'],50)
        self.assertEqual(row['risk_usdt'],250)
        self.assertEqual(row['margin_used'],625)
        self.assertEqual(row['recorded_pnl_usdt'],-3.2)
        self.assertEqual(row['reconciliation_status'],'match')
        self.assertEqual(row['remaining_fraction'],0)

    def test_fixed_risk_requires_a_valid_original_stop(self):
        from presentation_config import risk_margin
        for stop in (100,101,0):
            with self.assertRaises(ValueError):risk_margin({'entry':100,'leverage':20,'direction':'LONG','stopLoss':{'price':stop}})
