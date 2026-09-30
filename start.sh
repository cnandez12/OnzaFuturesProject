#!/usr/bin/env bash
set -euo pipefail

python setup_db.py
python worker.py onza &
ONZA_PID=$!
python worker.py process &
PROCESS_PID=$!
python worker.py telegram &
TELEGRAM_PID=$!
gunicorn app:app --bind "0.0.0.0:${PORT:-5000}" --workers 2 --timeout 30 &
WEB_PID=$!

cleanup() {
  kill "$ONZA_PID" "$PROCESS_PID" "$TELEGRAM_PID" "$WEB_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM
wait -n "$ONZA_PID" "$PROCESS_PID" "$TELEGRAM_PID" "$WEB_PID"
