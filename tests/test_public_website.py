import unittest
from unittest.mock import patch

import app as receiver

PANEL_HOST = 'https://onzafuturesproject-production.up.railway.app'
PANEL = ('onza', 'clave-panel')


class PublicWebsiteTests(unittest.TestCase):
    def setUp(self):
        self.client = receiver.app.test_client()
        self.origin = 'https://trade-onzafutures.up.railway.app'
        token = patch.dict('os.environ', {'DASHBOARD_TOKEN': PANEL[1]})
        token.start()
        self.addCleanup(token.stop)
        receiver.response_cache.clear()

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

    def test_cryptopilot_public_domain_does_not_request_dashboard_password(self):
        # Railway may retain the old explicit variable during the domain migration.
        with patch.dict('os.environ', {'PUBLIC_WEBSITE_HOSTS': 'trade-onzafutures.up.railway.app'}):
            public = 'https://cryptopilotfutures.up.railway.app'
            for path in ('/', '/app.js', '/cryptopilot-logo.png'):
                response = self.get(path, base_url=public)
                self.assertEqual(response.status_code, 200)
                self.assertNotIn('WWW-Authenticate', response.headers)
            self.assertEqual(self.get('/api/sim/open', base_url=public).status_code, 404)
            self.assertEqual(self.get('/', base_url='https://cryptopilotai.up.railway.app').status_code, 401)

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
            # Ni siquiera con la contraseña correcta: el host público no expone el panel.
            self.assertEqual(self.get('/api/sim/open', base_url=self.origin, auth=PANEL).status_code, 404)
            self.assertEqual(self.client.post('/webhook/tradingview', base_url=self.origin, json={}).status_code, 404)
            db.assert_not_called()

    def test_panel_host_asks_for_the_password_and_keeps_the_webhook_open(self):
        for path in ('/', '/api/sim/open', '/api/audit/results', '/api/bitunix/tickers?symbols=BTCUSDT',
                     '/static/js/audit.js'):
            response = self.get(path, base_url=PANEL_HOST)
            self.assertEqual(response.status_code, 401, path)
            self.assertIn('Basic', response.headers['WWW-Authenticate'])
        self.assertEqual(self.get('/', base_url=PANEL_HOST, auth=('onza', 'otra')).status_code, 401)
        self.assertEqual(self.get('/', base_url=PANEL_HOST, auth=PANEL).status_code, 200)
        self.assertEqual(self.get('/', base_url=PANEL_HOST,
                                  headers={'Authorization': 'Bearer clave-panel'}).status_code, 200)
        with receiver.app.test_request_context('/webhook/tradingview', method='POST', base_url=PANEL_HOST):
            self.assertIsNone(receiver.app.preprocess_request())
        with receiver.app.test_request_context('/health', base_url=PANEL_HOST):
            self.assertIsNone(receiver.app.preprocess_request())

    def test_panel_stays_locked_when_no_password_is_configured(self):
        with patch.dict('os.environ', {'DASHBOARD_TOKEN': ''}):
            for auth in (None, ('onza', ''), PANEL):
                self.assertEqual(self.get('/api/sim/open', base_url=PANEL_HOST, auth=auth).status_code, 503)

    def test_public_api_remains_read_only_and_available(self):
        with patch('public_results.load_public', return_value={'signals': []}) as load:
            response = self.get('/api/public/results', base_url=self.origin)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {'signals': []})
            self.assertEqual(self.client.post('/api/public/results', base_url=self.origin).status_code, 405)
            self.assertEqual(load.call_count, 1)
            # El sitio publicado consulta esta API también desde el host del panel, sin contraseña.
            self.assertEqual(self.get('/api/public/results', base_url=PANEL_HOST).status_code, 200)
            self.assertEqual(load.call_count, 1)

    def test_extra_host_can_be_configured_without_catching_other_hosts(self):
        with patch.dict('os.environ', {'PUBLIC_WEBSITE_HOSTS': 'trade-onzafutures.up.railway.app, trade.onzafutures.com'}):
            self.assertEqual(self.get('/', base_url='https://trade.onzafutures.com').status_code, 200)
            # Un host parecido no es el sitio público: cae en el panel y pide contraseña.
            self.assertEqual(self.get('/', base_url='https://trade.onzafutures.com.attacker.example').status_code, 401)


if __name__ == '__main__':
    unittest.main()
