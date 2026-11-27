"""Read-only visibility policy for website live lists. Never changes the ledger."""
import logging
import re
import threading
import time
import requests

# Explicit user exclusion, independent of future catalogue changes.
LIVE_EXCLUDED = frozenset({"EPICUSDT"})
_lock = threading.Lock()
_catalogue = None
_checked_at = 0


def canonical(symbol):
    return re.sub(r"(?:USD\.P|USDT)$", "", str(symbol).upper().replace("/", "")) + "USDT"


def live_market_states(symbols):
    global _catalogue, _checked_at
    with _lock:
        if not _checked_at or time.monotonic() - _checked_at > 300:
            try:
                response = requests.get("https://fapi.bitunix.com/api/v1/futures/market/trading_pairs", timeout=2)
                response.raise_for_status()
                body = response.json()
                rows = body.get("data")
                if body.get("code") != 0 or not isinstance(rows, list) or not rows:
                    raise ValueError("Invalid trading catalogue")
                _catalogue = {r["symbol"]: r.get("symbolStatus") for r in rows if isinstance(r, dict) and r.get("symbol")}
            except (requests.RequestException, ValueError, TypeError):
                logging.getLogger(__name__).warning("Live market catalogue unavailable; retaining last known visibility")
            _checked_at = time.monotonic()
        catalogue = dict(_catalogue) if _catalogue is not None else None
    result = {}
    for raw in symbols:
        symbol = canonical(raw)
        status = catalogue.get(symbol, "NOT_LISTED") if catalogue is not None else "UNKNOWN"
        excluded = symbol in LIVE_EXCLUDED
        visible = not excluded and status in ("OPEN", "UNKNOWN", None)
        result[symbol] = {"visible": visible, "status": status,
                          "reason": "excluded_from_live" if excluded else "market_inactive" if not visible else None}
    return result
