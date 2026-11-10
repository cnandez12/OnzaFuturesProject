import os
import unittest
from unittest.mock import Mock,patch
import requests
from onza_contract import canonicalize
from vorza_delivery import enabled, settings, adapt, response_result, publish, Result, PUBLISH_URL

RAW={'signalId':'BTCUSD.P_15M_1790559000000','typeSignal':'entry','symbol':'BTCUSD.P','direction':'LONG','entry':100,'leverage':20,'stopLoss':{'price':98},'takeProfits':[{'price':101},{'price':102},{'price':103}],'timeframe':'15M'}

class VorzaContractTests(unittest.TestCase):
    def setUp(self):
        patcher=patch.dict(os.environ,{'VORZA_ENABLED':'true','VORZA_SIGNAL_KEY':'private-test-key','VORZA_COMPANY':'TEST_CO'},clear=True)
        patcher.start();self.addCleanup(patcher.stop)
        self.config=settings();self.payload=canonicalize(RAW);self.body=adapt(self.payload,self.config)
        self.ack={'data':{'signal_id':128,'uid':'3f6c2a9e-8d4b-4c1e-9a77-0b52d1e4f310','external_id':self.body['external_id'],'symbol':'BTCUSDT','side':'long','status':'active','expires_at':'2026-11-10T15:45:00+00:00','recipients':342,'duplicate':False}}

    def response(self,status=200,data=None,headers=None):
        return Mock(status_code=status,json=Mock(return_value=self.ack if data is None else data),headers=headers or {})

    def test_switch_defaults_off_and_only_true_enables(self):
        for value in ['false','0','', 'unexpected']:
            with patch.dict(os.environ,VORZA_ENABLED=value):self.assertFalse(enabled())
        with patch.dict(os.environ,{},clear=True):self.assertFalse(enabled())

    def test_missing_secret_audience_and_bad_configuration_fail_closed(self):
        for changes in [{'VORZA_SIGNAL_KEY':''},{'VORZA_SIGNAL_KEY':'0'},{'VORZA_COMPANY':'bad\ncompany'},{'VORZA_EXPIRES_MINUTES':'1441'},{'VORZA_RATE_PER_MINUTE':'21'},{'VORZA_ORDER_TYPE':'stop'},{'VORZA_PUBLISH_URL':'https://other.example/publish'}]:
            with self.subTest(changes=list(changes)),patch.dict(os.environ,changes):
                with self.assertRaises(ValueError):settings()

    def test_entry_exact_mapping_without_onza_secrets_or_fields(self):
        self.assertEqual(self.body['symbol'],'BTCUSDT');self.assertEqual(self.body['external_id'],self.payload['signalId'])
        self.assertEqual([self.body[k] for k in ['take_profit','take_profit_2','take_profit_3']],[101,102,103])
        self.assertEqual(self.body['stop_loss'],98);self.assertEqual(self.body['leverage'],20)
        self.assertEqual(self.body['company'],'TEST_CO')
        for key in ['apiKey','typeSignal','signalId','roi','sourceExchange','takeProfits']:
            self.assertNotIn(key,self.body)
        self.assertNotIn('private-test-key',str(self.body))

    def test_short_mapping_provider_and_limit(self):
        with patch.dict(os.environ,VORZA_PROVIDER_ID='12',VORZA_ORDER_TYPE='limit'):
            body=adapt(canonicalize(dict(RAW,direction='SHORT',stopLoss={'price':102},takeProfits=[{'price':99},{'price':98},{'price':97}])),settings())
        self.assertEqual(body['side'],'short');self.assertEqual(body['provider_id'],12);self.assertEqual(body['order_type'],'limit')

    def test_updates_and_bad_levels_never_become_publications(self):
        for event in ['tp1','tp2','tp3','sl','close']:
            with self.assertRaises(ValueError):adapt(dict(self.payload,typeSignal=event),self.config)
        with self.assertRaises(ValueError):adapt(dict(self.payload,stopLoss={'price':110}),self.config)
        with self.assertRaises(ValueError):adapt(dict(self.payload,signalId='x'*81),self.config)
        with self.assertRaises(ValueError):adapt(dict(self.payload,entry=float('inf')),self.config)

    def test_http_contract_and_header(self):
        http=Mock(return_value=self.response())
        result=publish(self.body,self.config.key,transport=http)
        self.assertEqual(result.state,'delivered')
        self.assertEqual(http.call_args.args[0],PUBLISH_URL)
        self.assertEqual(http.call_args.kwargs['headers']['X-Signal-Key'],'private-test-key')
        self.assertEqual(http.call_args.kwargs['timeout'],15);self.assertFalse(http.call_args.kwargs['allow_redirects'])
        self.assertEqual(http.call_args.kwargs['json'],self.body)

    def test_disabled_never_calls_transport(self):
        http=Mock()
        with patch.dict(os.environ,VORZA_ENABLED='false'):
            self.assertEqual(publish(self.body,self.config.key,transport=http).state,'skipped')
        http.assert_not_called()

    def test_duplicate_and_zero_recipients_are_saved_explicitly(self):
        data={'data':dict(self.ack['data'],duplicate=True,recipients=0,status='expired')}
        result=response_result(self.body,self.response(data=data))
        self.assertEqual(result.state,'delivered');self.assertTrue(result.duplicate);self.assertEqual(result.recipients,0)
        self.assertIn('sin destinatarios',result.detail)

    def test_invalid_ack_is_never_delivered(self):
        for changes in [{'external_id':'wrong'},{'symbol':'ETHUSDT'},{'side':'short'},{'signal_id':True},{'uid':'bad'},{'recipients':-1},{'duplicate':'false'},{'expires_at':'2026-11-10T15:00:00'},{'status':'expired'}]:
            result=response_result(self.body,self.response(data={'data':dict(self.ack['data'],**changes)}))
            self.assertEqual(result.state,'retry')
        response=self.response();response.json.side_effect=ValueError()
        self.assertEqual(response_result(self.body,response).state,'retry')

    def test_errors_are_classified_without_logging_response_secrets(self):
        for status in [400,401,404,302]:
            result=response_result(self.body,self.response(status,data={'error':{'code':'unauthorized','message':'private-test-key'}}))
            self.assertEqual(result.state,'failed');self.assertNotIn('private-test-key',result.detail)
        for status in [500,502,503,504]:
            self.assertEqual(response_result(self.body,self.response(status)).state,'retry')

    def test_rate_limit_waits_at_least_one_minute(self):
        for value,expected in [('2',60),('90',90),('',60)]:
            self.assertEqual(response_result(self.body,self.response(429,headers={'Retry-After':value})).retry_after,expected)

    def test_timeout_keeps_identity_and_does_not_leak_key(self):
        http=Mock(side_effect=requests.ReadTimeout('private-test-key'))
        result=publish(self.body,self.config.key,transport=http)
        self.assertEqual(result.state,'retry');self.assertEqual(http.call_count,1)
        self.assertNotIn('private-test-key',result.detail)

    def test_optional_company_provider_are_omitted_as_documented(self):
        with patch.dict(os.environ,VORZA_COMPANY='',VORZA_PROVIDER_ID='0'):
            body=adapt(self.payload,settings())
        self.assertNotIn('company',body);self.assertNotIn('provider_id',body)
