"""Acceso público de consulta a CryptoPilot; autenticación para otras operaciones.

El hostname del dashboard expone sus páginas y APIs de lectura por decisión
explícita del propietario. El webhook conserva su autenticación independiente.
"""

from __future__ import annotations

import hmac
import os

from flask import Response, jsonify, request

OPEN_PATHS = frozenset({
    "/health", "/health/vorza", "/health/telegram", "/webhook/tradingview",
})
OPEN_PREFIXES = ("/api/public/",)
PUBLIC_DASHBOARD_HOSTS = frozenset({"cryptopilotai.up.railway.app"})
READ_ONLY_PREFIXES = ("/static/", "/api/sim/", "/api/chart/", "/api/audit/", "/api/bitunix/")


def install_dashboard_auth(app):
    @app.before_request
    def require_dashboard_password():
        host = request.host.partition(":")[0].lower()
        if (host in PUBLIC_DASHBOARD_HOSTS and request.method in {"GET", "HEAD"}
                and (request.path == "/" or request.path.startswith(READ_ONLY_PREFIXES))):
            return None
        if (request.path in OPEN_PATHS or request.path.startswith(OPEN_PREFIXES)
                or request.method == "OPTIONS"):
            return None
        expected = os.getenv("DASHBOARD_TOKEN", "")
        if not expected:
            return jsonify(error="Panel bloqueado: falta configurar DASHBOARD_TOKEN"), 503
        auth = request.authorization
        supplied = ""
        if auth is not None:
            # Navegador: cualquier usuario y el token como contraseña. Scripts: Bearer.
            supplied = (auth.password if auth.type == "basic" else auth.token) or ""
        if hmac.compare_digest(supplied.encode("utf-8"), expected.encode("utf-8")):
            return None
        return Response("Acceso restringido", 401, {
            "WWW-Authenticate": 'Basic realm="CryptoPilot AI", charset="UTF-8"',
            "Cache-Control": "no-store",
        })
