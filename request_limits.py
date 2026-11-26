"""Protege al receptor de TradingView de las rutas lentas del mismo proceso.

Cada proceso de gunicorn tiene 8 hilos (gunicorn.conf.py). Las rutas lentas
comparten SLOW_SLOTS, así que siempre quedan hilos libres para el webhook.
"""

from __future__ import annotations

import threading
import time
from functools import wraps

from flask import jsonify

SLOW_SLOTS = 4
_slow = threading.BoundedSemaphore(SLOW_SLOTS)


def slow_route(view):
    """Responde 503 de inmediato si ya hay SLOW_SLOTS peticiones lentas en curso."""
    @wraps(view)
    def limited(*args, **kwargs):
        if not _slow.acquire(blocking=False):
            response = jsonify(error="Servidor ocupado; reintenta en unos segundos")
            response.status_code = 503
            response.headers["Retry-After"] = "2"
            return response
        try:
            return view(*args, **kwargs)
        finally:
            _slow.release()
    return limited


class TTLCache:
    """Caché breve en memoria. Una sola carga simultánea por clave; los errores no se guardan."""

    def __init__(self, max_entries: int = 64):
        self._max = max_entries
        self._lock = threading.Lock()
        self._entries: dict = {}
        self._loading: dict = {}

    def _fresh(self, key, ttl):
        hit = self._entries.get(key)
        return hit if hit and time.monotonic() - hit[0] < ttl else None

    def get(self, key, ttl: float, loader):
        with self._lock:
            hit = self._fresh(key, ttl)
            if hit:
                return hit[1]
            gate = self._loading.setdefault(key, threading.Lock())
        with gate:
            with self._lock:
                hit = self._fresh(key, ttl)
                if hit:
                    return hit[1]
            try:
                value = loader()
                with self._lock:
                    while len(self._entries) >= self._max:
                        self._entries.pop(min(self._entries, key=lambda k: self._entries[k][0]))
                    self._entries[key] = (time.monotonic(), value)
                return value
            finally:
                with self._lock:
                    self._loading.pop(key, None)

    def clear(self):
        with self._lock:
            self._entries.clear()
