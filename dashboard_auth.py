"""Contraseña del panel interno y de sus APIs (HTTP Basic).

El panel muestra entrada, stop y objetivos de las señales activas. Sin
DASHBOARD_TOKEN queda bloqueado: nunca se sirve abierto por omisión.
El sitio público, su API de solo lectura, el webhook de TradingView (que
valida su propia clave) y las rutas de salud no pasan por esta contraseña.
"""

from __future__ import annotations

import hmac
import os

from flask import Response, jsonify, request

OPEN_PATHS = frozenset({
    "/health", "/health/vorza", "/health/telegram", "/webhook/tradingview",
})
OPEN_PREFIXES = ("/api/public/",)


def install_dashboard_auth(app):
    @app.before_request
    def require_dashboard_password():
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
            "WWW-Authenticate": 'Basic realm="Onza Futures", charset="UTF-8"',
            "Cache-Control": "no-store",
        })
