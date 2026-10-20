import copy
import os
import unittest
from unittest.mock import Mock, patch

import requests
from onza_delivery import ONZA_URL, onza_ack, onza_endpoint, post_onza


class OnzaV2Tests(unittest.TestCase):
    def setUp(self):
        self.payload = {'signalId': 'BTCUSD.P_1H_123', 'typeSignal': 'entry', 'sourceExchange': 'BINANCE'}
        self.body = {'success': True, 'status': 'ACCEPTED', 'signalId': self.payload['signalId'],
                     'typeSignal': 'entry', 'id': '79624338499702784', 'receivedAt': '2026-10-20T17:18:41.647Z'}

    def response(self, body=None, status=200):
        return Mock(status_code=status, json=Mock(return_value=self.body if body is None else body))

    def test_default_and_existing_v1_override_both_target_v2(self):
        for url in ('', 'https://api.onza.tech/api/v1/webhooks/signal?source=TradingView', ONZA_URL):
            with self.subTest(url=url), patch.dict(os.environ, ONZA_WEBHOOK_URL=url):
                self.assertEqual(onza_endpoint(), ONZA_URL)

    def test_production_credential_is_preserved_in_body_and_redirects_disabled(self):
        original = copy.deepcopy(self.payload)
        with patch.dict(os.environ, ONZA_API_KEY='existing-v1-production-test-key', ONZA_WEBHOOK_URL=ONZA_URL), \
             patch('onza_delivery.requests.post', return_value=self.response()) as send:
            self.assertEqual(post_onza(self.payload)[0], 'delivered')
        self.assertEqual(send.call_args.args[0], ONZA_URL)
        self.assertEqual(send.call_args.kwargs['json']['apiKey'], 'existing-v1-production-test-key')
        self.assertNotIn('sourceExchange', send.call_args.kwargs['json'])
        self.assertFalse(send.call_args.kwargs['allow_redirects'])
        self.assertEqual(self.payload, original)

    def test_duplicate_acceptance_and_large_id_are_preserved(self):
        for status in ('ACCEPTED', 'ALREADY_PROCESSED'):
            for ident in ('79624338499702784', 79624338499702784):
                body = dict(self.body, status=status, id=ident)
                result, detail = onza_ack(self.payload, self.response(body))
                self.assertEqual(result, 'delivered')
                self.assertIn(str(ident), detail)
                self.assertIn(status, detail)

    def test_ignored_parent_is_not_delivered(self):
        self.assertEqual(onza_ack(self.payload, self.response(dict(self.body, status='IGNORED_PARENT_NOT_FOUND', id='0')))[0], 'failed')

    def test_invalid_or_uncorrelated_ack_is_not_delivered(self):
        updates = ({'signalId':'different'}, {'typeSignal':'tp1'}, {'success':False}, {'status':'QUEUED'},
                   {'id':0}, {'id':True}, {'id':1.2}, {'receivedAt':None}, {'receivedAt':'2026-10-20T17:00:00'},
                   {'receivedAt':'2026-10-20T12:00:00-05:00'})
        for changes in updates:
            with self.subTest(changes=changes):
                self.assertEqual(onza_ack(self.payload, self.response(dict(self.body, **changes)))[0], 'unknown')

    def test_non_json_and_http_errors_never_confirm_delivery(self):
        bad = self.response(); bad.json.side_effect = ValueError()
        self.assertEqual(onza_ack(self.payload, bad)[0], 'unknown')
        for status in (201, 302, 400, 401, 429, 500, 502, 503, 504):
            self.assertNotEqual(onza_ack(self.payload, self.response(status=status))[0], 'delivered')

    def test_timeout_does_not_retry_or_leak_credential(self):
        with patch.dict(os.environ, ONZA_API_KEY='not-for-logs', ONZA_WEBHOOK_URL=ONZA_URL), \
             patch('onza_delivery.requests.post', side_effect=requests.ReadTimeout()) as send:
            status, detail = post_onza(self.payload)
        self.assertEqual(status, 'unknown'); self.assertEqual(send.call_count, 1)
        self.assertNotIn('not-for-logs', detail)

    def test_dev_untrusted_and_insecure_destinations_are_blocked(self):
        urls = ('https://dev.api.onza.tech/api/v2/webhooks/signals', 'http://api.onza.tech/api/v2/webhooks/signals',
                'https://api.onza.tech.evil.example/api/v2/webhooks/signals')
        for url in urls:
            with self.subTest(url=url), patch.dict(os.environ, ONZA_API_KEY='test', ONZA_WEBHOOK_URL=url), \
                 patch('onza_delivery.requests.post') as send:
                self.assertEqual(post_onza(self.payload)[0], 'failed'); send.assert_not_called()


if __name__ == '__main__':
    unittest.main()
