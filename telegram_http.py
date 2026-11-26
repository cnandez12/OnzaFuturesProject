"""Lectura común de los resultados de la API de Telegram: qué se puede repetir y qué no.

Regla del proyecto: si no se sabe si Telegram publicó, no se repite solo.
Aquí se separan los casos en que SÍ se sabe que no publicó.
"""

from __future__ import annotations

import requests
from urllib3.exceptions import ConnectTimeoutError, NewConnectionError

PAUSE = "pause"    # Nada publicado; afecta a todo el bot o canal. Esperar y repetir sin límite.
RETRY = "retry"    # Nada publicado; fallo del servidor para este mensaje. Repetir con límite.
FAILED = "failed"  # Rechazo definitivo de este mensaje. Requiere revisión.

NETWORK_PAUSE_SECONDS = 15
ACCESS_PAUSE_SECONDS = 60
MAX_ATTEMPTS = 6


def never_sent(exc: BaseException) -> bool:
    """Cierto solo si la petición no llegó a salir: sin conexión o sin DNS."""
    if isinstance(exc, requests.ConnectTimeout):
        return True
    if isinstance(exc, requests.ConnectionError) and exc.args:
        return isinstance(getattr(exc.args[0], "reason", None),
                          (NewConnectionError, ConnectTimeoutError))
    return False


def explicit_rejection(status_code: int, body: dict) -> tuple[str, int]:
    """Clasifica una respuesta con ok=false. Devuelve (clase, segundos de espera)."""
    if status_code == 429:
        parameters = body.get("parameters")
        wait = parameters.get("retry_after") if isinstance(parameters, dict) else None
        return PAUSE, wait if type(wait) is int and 0 < wait <= 2147483647 else 60
    if status_code in (401, 403):
        return PAUSE, ACCESS_PAUSE_SECONDS
    if 500 <= status_code <= 599:
        return RETRY, 0
    return FAILED, 0
