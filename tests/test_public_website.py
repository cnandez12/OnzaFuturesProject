import unittest
from unittest.mock import patch

import app as receiver


class PublicWebsiteTests(unittest.TestCase):
    def setUp(self):
        self.client = receiver.app.test_client()
        self.origin = 'https://trade-onzafutures.up.railway.app'

    def get(self, path, **kwargs):
        response = self.client.get(path, **kwargs)
        self.addCleanup(response.close)
        return response

    def test_public_home_is_product_site_and_head_is_supported(self):
        response = self.get('/', base_url=self.origin)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'id="equity"', response.data)
        self.assertIn(b'Aviso de riesgo.', response.data)
        self.assertEqual(response.headers['Cache-Control'], 'no-cache')
        response = self.client.head('/', base_url=self.origin)
        self.addCleanup(response.close)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'')

    def test_only_public_assets_are_served(self):
        for path in ('/app.js', '/onza-logo.png', '/vendor/lightweight-charts.js'):
            self.assertEqual(self.get(path, base_url=self.origin).status_code, 200)
        for path in ('/source/package.json', '/README.md', '/chart-tests.cjs',
                     '/.env', '/../app.py', '/static/js/audit.js'):
            self.assertEqual(self.get(path, base_url=self.origin).status_code, 404)

    def test_internal_api_and_webhook_are_not_dispatched_on_public_host(self):
        with patch.object(receiver, 'database_connection') as db:
            for path in ('/api/audit/results', '/api/sim/open', '/health/onza', '/api/public/unknown'):
                self.assertEqual(self.get(path, base_url=self.origin).status_code, 404)
            self.assertEqual(self.client.post('/webhook/tradingview', base_url=self.origin, json={}).status_code, 404)
            db.assert_not_called()

    def test_original_host_keeps_existing_routes(self):
        with receiver.app.test_request_context('/', base_url='https://onzafuturesproject-production.up.railway.app'):
            self.assertIsNone(receiver.app.preprocess_request())
        with receiver.app.test_request_context('/webhook/tradingview', method='POST', base_url='https://onzafuturesproject-production.up.railway.app'):
            self.assertIsNone(receiver.app.preprocess_request())

    def test_public_api_remains_read_only_and_available(self):
        with patch('public_results.load_public', return_value={'signals': []}) as load:
            response = self.get('/api/public/results', base_url=self.origin)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {'signals': []})
            self.assertEqual(self.client.post('/api/public/results', base_url=self.origin).status_code, 405)
            self.assertEqual(load.call_count, 1)

    def test_extra_host_can_be_configured_without_catching_other_hosts(self):
        with patch.dict('os.environ', {'PUBLIC_WEBSITE_HOSTS': 'trade-onzafutures.up.railway.app, trade.onzafutures.com'}):
            self.assertEqual(self.get('/', base_url='https://trade.onzafutures.com').status_code, 200)
            with receiver.app.test_request_context('/', base_url='https://trade.onzafutures.com.attacker.example'):
                self.assertIsNone(receiver.app.preprocess_request())


if __name__ == '__main__':
    unittest.main()
