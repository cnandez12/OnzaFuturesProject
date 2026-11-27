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
        self.assertEqual(INITIAL_CAPITAL,Decimal('5000'))

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
