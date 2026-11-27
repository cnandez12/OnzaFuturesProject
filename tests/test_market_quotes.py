import unittest
from unittest.mock import Mock,patch
import app as receiver
from public_results import public_market_marks,_mark_cache

class MarketQuoteTests(unittest.TestCase):
 def setUp(self):
  receiver.response_cache.clear();_mark_cache.clear()
 def test_unknown_symbol_cannot_poison_other_quotes(self):
  response=Mock();response.json.return_value={'code':0,'data':[{'symbol':'APEUSDT','markPrice':'0.07'},{'symbol':'BTCUSDT','markPrice':'60000'}]}
  with patch.object(receiver.requests,'get',return_value=response) as get:
   r=receiver.app.test_client().get('/api/bitunix/tickers?symbols=APEUSDT,UNKNOWNUSDT',base_url='https://cryptopilotai.up.railway.app')
   self.assertEqual(r.status_code,200);self.assertEqual([x['symbol'] for x in r.json],['APEUSDT'])
   self.assertEqual(get.call_args.kwargs['params'],{})
   r=receiver.app.test_client().get('/api/bitunix/tickers?symbols=BTCUSDT',base_url='https://cryptopilotai.up.railway.app')
   self.assertEqual(r.json[0]['symbol'],'BTCUSDT');self.assertEqual(get.call_count,1)
 def test_public_marks_filter_catalogue_without_sending_invalid_symbols(self):
  response=Mock();response.json.return_value={'code':0,'data':[{'symbol':'APEUSDT','markPrice':'0.07'},{'symbol':'BTCUSDT','markPrice':'60000'}]}
  with patch('public_results.requests.get',return_value=response) as get:
   marks,stamp=public_market_marks(['APEUSD.P','UNKNOWNUSD.P'])
   self.assertEqual(marks,{'APEUSDT':.07});self.assertIsNotNone(stamp)
   self.assertEqual(get.call_args.kwargs['params'],{})

 def test_unavailable_candles_expose_provider_code_and_log_context(self):
  response=Mock();response.json.return_value={'code':20015,'data':None}
  with patch.object(receiver.requests,'get',return_value=response), self.assertLogs(receiver.app.logger,level='WARNING') as logs:
   r=receiver.app.test_client().get('/api/bitunix/kline?symbol=EPICUSDT&interval=15m&startTime=1000&endTime=2000',base_url='https://cryptopilotai.up.railway.app')
  self.assertEqual(r.status_code,502)
  self.assertEqual(r.json['code'],'market_unavailable')
  self.assertEqual(r.json['upstream_code'],20015)
  self.assertIn('symbol=EPICUSDT',logs.output[0])
