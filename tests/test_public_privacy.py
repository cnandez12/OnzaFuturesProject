import copy
import unittest
from public_results import project_public
from audit_reporting import build_report
from test_audit_reporting import ledger


class PublicPrivacyTests(unittest.TestCase):
    def report(self):
        report = build_report(ledger('tp1'), mode='partial_be')
        base = report['rows'][0]
        report['rows'] = []
        for i in range(7):
            row = copy.deepcopy(base)
            row.update(signal_id=f'ACTIVE_{i}', received_at=f'2026-10-{i+1:02d}T00:00:00Z')
            report['rows'].append(row)
        closed = copy.deepcopy(build_report(ledger('tp1','sl'), mode='partial_be')['rows'][0])
        closed['signal_id'] = 'CLOSED'
        report['rows'].append(closed)
        return report

    def test_only_four_newest_active_examples_contain_levels(self):
        report = self.report()
        snapshot = copy.deepcopy(report)
        public = project_public(report,1000)
        visible = {r['signal_id'] for r in public['signals'] if not r['closed'] and r['prices_visible']}
        self.assertEqual(visible, {'ACTIVE_3','ACTIVE_4','ACTIVE_5','ACTIVE_6'})
        for row in public['signals']:
            if row['visibility'] != 'protected':
                continue
            for key in ('entry_price','original_stop','targets','be_stop_price','be_activated_at',
                        'legs','recorded_partial_pnl_usdt','margin_used','leverage','remaining_fraction','roi_pct','pnl_usdt'):
                self.assertNotIn(key, row)
        self.assertEqual(report,snapshot)

    def test_closed_history_and_totals_are_preserved(self):
        report=self.report()
        public=project_public(report,1000)
        closed=next(r for r in public['signals'] if r['closed'])
        self.assertTrue(closed['prices_visible'])
        self.assertEqual(closed['entry_price'],100)
        self.assertEqual(public['summary'],report['summary'])
        self.assertEqual(public['return_pct'],round(report['summary']['pnl_usdt']/10,2))

    def test_preview_selection_is_independent_of_response_order(self):
        report=self.report()
        first=project_public(report,1000)
        report['rows'].reverse()
        second=project_public(report,1000)
        ids=lambda p:{r['signal_id'] for r in p['signals'] if r['visibility']=='preview'}
        self.assertEqual(ids(first),ids(second))
