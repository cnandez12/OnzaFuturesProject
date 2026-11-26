import json
import unittest
import requests
from urllib3.exceptions import MaxRetryError, NewConnectionError, ProtocolError
from telegram_diagnostics import transport_details


class DiagnosticsTests(unittest.TestCase):
    def test_only_errors_before_connection_are_safe(self):
        dns = requests.ConnectionError(MaxRetryError(None, "/SECRET", NewConnectionError(None, "SECRET")))
        for exc in (dns, requests.ConnectTimeout("SECRET")):
            details = transport_details(exc)
            self.assertTrue(details["reintento_seguro"])
            self.assertFalse(details["requiere_conciliacion"])
            self.assertEqual(details["fase"], "conexion")
            self.assertNotIn("SECRET", json.dumps(details))

    def test_lost_response_cannot_be_replayed(self):
        for exc in (requests.ReadTimeout("SECRET"), requests.ConnectionError(ProtocolError("SECRET")), requests.ConnectionError("SECRET")):
            details = transport_details(exc)
            self.assertFalse(details["reintento_seguro"])
            self.assertTrue(details["requiere_conciliacion"])
            self.assertNotIn("SECRET", json.dumps(details))

    def test_cycles_are_bounded(self):
        exc = requests.ConnectionError("SECRET")
        exc.__cause__ = exc
        self.assertEqual(transport_details(exc)["errores_transporte"], ["ConnectionError"])
