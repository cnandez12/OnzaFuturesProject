import unittest
from public_results import project_public
from audit_reporting import build_report
from test_audit_reporting import ledger
class PublicResultsTests(unittest.TestCase):
 def test_public_projection_is_fixed_be_and_excludes_internal_information(self):
  report=build_report(ledger('tp1','sl'),mode='partial_be')
  public=project_public(report,1000)
  self.assertEqual(public['return_pct'],.16)
  self.assertEqual(public['signals'][0]['pnl_usdt'],1.6)
  for key in ('events','scenarios','onza_delivery','delivery_counts','recorded_pnl_usdt','source_exchange'):
   self.assertNotIn(key,public['signals'][0])
  self.assertNotIn('incidents',public)
 def test_missing_capital_is_not_reported_as_a_return(self):
  self.assertIsNone(project_public(build_report(ledger('sl'),mode='partial_be'),0)['return_pct'])

class PublicApiTests(unittest.TestCase):
 def test_public_get_uses_readonly_connection_and_cors(self):
  from unittest.mock import patch
  from test_audit_api import Connection
  import app
  with patch.object(app,'database_connection',return_value=Connection(ledger('tp1','sl'))):
   response=app.app.test_client().get('/api/public/results')
  self.assertEqual(response.status_code,200)
  self.assertEqual(response.headers['Access-Control-Allow-Origin'],'*')
  self.assertEqual(response.json['signals'][0]['pnl_usdt'],1.6)
 def test_public_api_does_not_accept_mutating_requests(self):
  import app
  self.assertEqual(app.app.test_client().post('/api/public/results').status_code,405)
 def test_market_parameters_are_validated(self):
  import app
  self.assertEqual(app.app.test_client().get('/api/public/candles?symbol=INVALID').status_code,400)
