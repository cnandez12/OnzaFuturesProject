#!/usr/bin/env bash
# Instalación de un solo contenedor: esquema + los cuatro procesos.
# Si cualquiera termina, el contenedor sale y la plataforma lo reinicia completo.
set -euo pipefail

python setup_db.py
python vorza_worker.py &
VORZA_PID=$!
python worker.py process &
PROCESS_PID=$!
python worker.py telegram &
TELEGRAM_PID=$!
# Hilos y procesos del servidor web: gunicorn.conf.py.
gunicorn app:app --bind "0.0.0.0:${PORT:-5000}" &
WEB_PID=$!

cleanup() {
  kill "$VORZA_PID" "$PROCESS_PID" "$TELEGRAM_PID" "$WEB_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM
wait -n "$VORZA_PID" "$PROCESS_PID" "$TELEGRAM_PID" "$WEB_PID"
