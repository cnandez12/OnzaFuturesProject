import ast
import os
from pathlib import Path
import unittest
from unittest.mock import Mock,patch
import worker

ROOT=Path(__file__).resolve().parents[1]

class LegacyRetirementTests(unittest.TestCase):
    def test_sender_files_and_process_removed(self):
        for name in ['onza_delivery.py','onza_queue.py','onza_control.py','backend/test_onza_webhook.py']:
            self.assertFalse((ROOT/name).exists(),name)
        self.assertNotIn('worker.py onza',(ROOT/'start.sh').read_text(encoding='utf8'))
        self.assertFalse(hasattr(worker,'post_onza'))

    def test_legacy_environment_cannot_restore_worker(self):
        with patch.dict(os.environ,ONZA_ENABLED='true',ONZA_API_KEY='dummy'),patch.object(worker,'connect') as db:
            with self.assertRaises(ValueError):worker.claim_delivery('onza')
        db.assert_not_called()

    def test_archived_sink_cannot_call_http(self):
        source=(ROOT/'backend/AllProfitFormatWhitImage.py').read_text(encoding='utf8')
        node=next(n for n in ast.parse(source).body if isinstance(n,ast.FunctionDef) and n.name=='_post_onza_event')
        http=Mock()
        namespace={'requests':http}
        exec(compile(ast.Module(body=[node],type_ignores=[]),'retired_sink','exec'),namespace)
        self.assertIsNone(namespace['_post_onza_event']({'url':'unused'},{}))
        http.post.assert_not_called()

    def test_runtime_source_has_no_retired_host_or_key(self):
        for name in ['worker.py','app.py','telegram_delivery.py','start.sh','runtime.env.example']:
            source=(ROOT/name).read_text(encoding='utf8')
            self.assertNotIn('api.onza.tech',source)
            self.assertNotIn('ONZA_API_KEY',source)
            self.assertNotIn('ONZA_WEBHOOK_URL',source)

    def test_retired_health_route_does_not_exist(self):
        import app
        self.assertEqual(app.app.test_client().get('/health/onza').status_code,404)
