"""Serve the public product website on its dedicated host only."""
import os
from pathlib import Path

from flask import abort, request, send_from_directory

PUBLIC_FILES = frozenset({
    'index.html', 'app.js', 'chart-adapter.js', 'fb-chart.js', 'experience.js',
    'premium.js', 'style.css', 'design.css', 'premium.css', 'chart-page.css',
    'onza-logo.png', 'vendor/lightweight-charts.js',
    'vendor/LICENSE-lightweight-charts.txt', 'vendor/MOTION-LICENSE.txt',
    'vendor/THREE-LICENSE.txt',
})
PUBLIC_ENDPOINTS = frozenset({
    '/api/public/results', '/api/public/tickers', '/api/public/candles',
})


def install_public_website(app):
    directory = Path(__file__).resolve().parent / 'public-site'

    @app.before_request
    def public_host_only():
        hosts = {host.strip().lower() for host in os.getenv(
            'PUBLIC_WEBSITE_HOSTS', 'trade-onzafutures.up.railway.app'
        ).split(',') if host.strip()}
        host = request.host.partition(':')[0].lower()
        if host not in hosts:
            return None
        if request.path in PUBLIC_ENDPOINTS:
            if request.method not in {'GET', 'HEAD', 'OPTIONS'}:
                abort(405)
            return None
        filename = 'index.html' if request.path == '/' else request.path.lstrip('/')
        if filename not in PUBLIC_FILES:
            abort(404)
        if request.method not in {'GET', 'HEAD'}:
            abort(405)
        response = send_from_directory(directory, filename)
        # Revalidate the entry page so updates never retain an old app shell.
        response.headers['Cache-Control'] = 'no-cache' if filename == 'index.html' else 'public, max-age=3600'
        return response
