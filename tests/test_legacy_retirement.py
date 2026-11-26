"""El proveedor antiguo y la copia del motor anterior no deben volver al repositorio."""
from pathlib import Path
import unittest
from unittest.mock import patch

import worker

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = [path for path in ROOT.glob('*.py')] + [ROOT / 'start.sh', ROOT / '.env.example']


class LegacyRetirementTests(unittest.TestCase):
    def test_retired_files_and_folders_are_gone(self):
        for name in ['onza_delivery.py', 'onza_queue.py', 'onza_control.py', 'retire_legacy_delivery.py',
                     'reset_onza_data.py', 'backend', 'runtime.env.example', 'vorza.env.example']:
            self.assertFalse((ROOT / name).exists(), name)
        self.assertFalse(hasattr(worker, 'post_onza'))

    def test_runtime_source_has_no_retired_host_key_or_status(self):
        for path in RUNTIME:
            source = path.read_text(encoding='utf8')
            for retired in ('api.onza.tech', 'ONZA_API_KEY', 'ONZA_WEBHOOK_URL', 'ONZA_ENABLED',
                            'onza_status', 'onza_result'):
                self.assertNotIn(retired, source, f'{path.name}: {retired}')

    def test_card_assets_live_outside_the_removed_folder(self):
        import bitunix_card
        self.assertTrue(bitunix_card.LOGO.is_file())
        for name in ('arial.ttf', 'arialbd.ttf'):
            self.assertTrue((bitunix_card.FONTS / name).is_file(), name)

    def test_worker_only_accepts_current_roles(self):
        import sys
        with patch.object(sys, 'argv', ['worker.py', 'onza']), patch.object(worker, 'connect') as database:
            with self.assertRaises(SystemExit):
                worker.main()
        database.assert_not_called()

    def test_retired_health_route_does_not_exist(self):
        import app
        with patch.dict('os.environ', {'DASHBOARD_TOKEN': 'clave-panel'}):
            response = app.app.test_client().get('/health/onza', auth=('onza', 'clave-panel'))
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()
