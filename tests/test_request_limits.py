"""El receptor de TradingView no debe quedarse sin hilos por culpa de las rutas lentas."""
import threading
import unittest
from unittest.mock import patch

from flask import Flask

import request_limits
from request_limits import SLOW_SLOTS, TTLCache, slow_route


class CacheTests(unittest.TestCase):
    def test_value_is_reused_until_it_expires(self):
        cache, calls = TTLCache(), []
        load = lambda: calls.append(1) or len(calls)
        with patch.object(request_limits.time, "monotonic", return_value=100.0):
            self.assertEqual(cache.get("k", 10, load), 1)
            self.assertEqual(cache.get("k", 10, load), 1)
        with patch.object(request_limits.time, "monotonic", return_value=111.0):
            self.assertEqual(cache.get("k", 10, load), 2)

    def test_errors_are_not_cached_and_do_not_block_the_next_caller(self):
        cache = TTLCache()
        def broken():
            raise ValueError("sin datos")
        with self.assertRaises(ValueError):
            cache.get("k", 10, broken)
        self.assertEqual(cache.get("k", 10, lambda: "ok"), "ok")

    def test_simultaneous_callers_share_one_load(self):
        cache, calls, started, release = TTLCache(), [], threading.Event(), threading.Event()
        def slow():
            calls.append(1)
            started.set()
            release.wait(5)
            return "valor"
        results = []
        workers = [threading.Thread(target=lambda: results.append(cache.get("k", 10, slow))) for _ in range(6)]
        for worker in workers:
            worker.start()
        self.assertTrue(started.wait(5))
        release.set()
        for worker in workers:
            worker.join(5)
        self.assertEqual(results, ["valor"] * 6)
        self.assertEqual(len(calls), 1)

    def test_size_is_bounded(self):
        cache = TTLCache(max_entries=3)
        for key in range(10):
            cache.get(key, 60, lambda: key)
        self.assertLessEqual(len(cache._entries), 3)
        self.assertEqual(cache._loading, {})


class SlowRouteTests(unittest.TestCase):
    def test_saturated_slow_routes_answer_busy_and_leave_fast_routes_free(self):
        app = Flask(__name__)
        entered, release = threading.Semaphore(0), threading.Event()

        @app.get("/lenta")
        @slow_route
        def lenta():
            entered.release()
            release.wait(5)
            return "ok"

        @app.get("/webhook")
        def rapida():
            return "recibido"

        statuses = []
        def call():
            statuses.append(app.test_client().get("/lenta").status_code)
        busy = [threading.Thread(target=call) for _ in range(SLOW_SLOTS)]
        for thread in busy:
            thread.start()
        for _ in range(SLOW_SLOTS):
            self.assertTrue(entered.acquire(timeout=5))
        try:
            rejected = app.test_client().get("/lenta")
            self.assertEqual(rejected.status_code, 503)
            self.assertEqual(rejected.headers["Retry-After"], "2")
            self.assertEqual(app.test_client().get("/webhook").status_code, 200)
        finally:
            release.set()
            for thread in busy:
                thread.join(5)
        self.assertEqual(statuses, [200] * SLOW_SLOTS)
        # Los cupos se devuelven: la siguiente petición lenta vuelve a entrar.
        self.assertEqual(app.test_client().get("/lenta").status_code, 200)

    def test_slot_is_released_when_the_view_fails(self):
        app = Flask(__name__)
        app.logger.disabled = True  # El fallo es intencional; sin traza en la salida de pruebas.

        @app.get("/falla")
        @slow_route
        def falla():
            raise RuntimeError("fallo")

        @app.get("/bien")
        @slow_route
        def bien():
            return "ok"

        for _ in range(SLOW_SLOTS + 2):
            self.assertEqual(app.test_client().get("/falla").status_code, 500)
        self.assertEqual(app.test_client().get("/bien").status_code, 200)


class ServerConfigTests(unittest.TestCase):
    def test_gunicorn_serves_with_more_threads_than_slow_slots(self):
        from pathlib import Path
        settings = {}
        exec(Path(request_limits.__file__).with_name("gunicorn.conf.py").read_text(encoding="utf-8"), settings)
        self.assertEqual(settings["worker_class"], "gthread")
        self.assertGreater(settings["threads"], SLOW_SLOTS)

    def test_dashboard_pool_is_thread_safe(self):
        from pathlib import Path
        source = (Path(request_limits.__file__).parent / "dashboard" / "app.py").read_text(encoding="utf-8")
        self.assertIn("ThreadedConnectionPool", source)
        self.assertNotIn("SimpleConnectionPool", source)


if __name__ == "__main__":
    unittest.main()
