#!/usr/bin/env python3
"""Read-only reconciliation of dashboard monthly performance.

Uses DATABASE_URL and INITIAL_BALANCE from the environment. It never writes to
PostgreSQL. Add --compare-public to compare reconstructed coverage with the
public source used by BackfillSignals.py.
"""
import argparse
import json
import os
import urllib.request
from collections import OrderedDict
from datetime import datetime, timezone
from decimal import Decimal

import psycopg2

PUBLIC_URL = "https://server.smart-crypto-signals.com/api/public/trading-history"
DEFAULT_CUTOFF = "2026-05-21T00:00:00+00:00"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--compare-public", action="store_true")
    parser.add_argument("--cutoff", default=DEFAULT_CUTOFF)
    return parser.parse_args()


def parse_public_ts(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00")) if value else None


def main():
    args = parse_args()
    dsn = os.getenv("DATABASE_URL", "")
    if not dsn:
        raise SystemExit("DATABASE_URL no configurada")
    initial = Decimal(os.getenv("INITIAL_BALANCE", "1000"))
    cutoff = datetime.fromisoformat(args.cutoff)
    if cutoff.tzinfo is None:
        cutoff = cutoff.replace(tzinfo=timezone.utc)

    try:
        conn = psycopg2.connect(dsn, connect_timeout=15)
    except psycopg2.Error as exc:
        raise SystemExit(f"No fue posible abrir la conexión de solo lectura: {exc}") from None
    conn.set_session(readonly=True, autocommit=True)
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, symbol, opened_at, closed_at, final_profit_usdt,
                   CASE WHEN closed_at < %s THEN 'reconstructed' ELSE 'bot' END AS source
            FROM sim_track_record
            ORDER BY closed_at ASC NULLS LAST, id ASC
        """, (cutoff,))
        rows = cur.fetchall()
    conn.close()

    monthly = OrderedDict()
    running = initial
    invalid_date = invalid_pnl = 0
    business_keys = set()
    possible_duplicates = 0
    reconstructed = bot = 0
    for _, symbol, opened_at, closed_at, raw_pnl, source in rows:
        key = (symbol, opened_at)
        if key in business_keys:
            possible_duplicates += 1
        business_keys.add(key)
        if closed_at is None:
            invalid_date += 1
            continue
        if raw_pnl is None:
            invalid_pnl += 1
            pnl = Decimal("0")
        else:
            pnl = Decimal(str(raw_pnl))
        month_key = closed_at.strftime("%Y-%m")
        if month_key not in monthly:
            monthly[month_key] = {"start": running, "pnl": Decimal("0"), "count": 0}
        monthly[month_key]["pnl"] += pnl
        monthly[month_key]["count"] += 1
        running += pnl
        reconstructed += source == "reconstructed"
        bot += source == "bot"

    print("MONTH,TRADES,START_USDT,PNL_USDT,END_USDT,MONTH_RETURN_PCT")
    compounded = Decimal("1")
    for key, data in monthly.items():
        start = data["start"]
        end = start + data["pnl"]
        pct = data["pnl"] / start * 100 if start else Decimal("NaN")
        compounded *= Decimal("1") + pct / 100
        print(f"{key},{data['count']},{start:.2f},{data['pnl']:+.2f},{end:.2f},{pct:+.6f}")

    product_final = initial * compounded
    print(f"\nInitial: {initial:.2f}")
    print(f"Final: {running:.2f}")
    print(f"Reconciled product: {product_final:.2f}")
    print(f"Difference: {product_final-running:+.8f}")
    print(f"Rows: {len(rows)} | bot: {bot} | reconstructed: {reconstructed}")
    print(f"Invalid date: {invalid_date} | invalid P&L: {invalid_pnl} | possible duplicates: {possible_duplicates}")

    if args.compare_public:
        with urllib.request.urlopen(PUBLIC_URL, timeout=60) as response:
            public = json.loads(response.read().decode("utf-8"))
        eligible = [s for s in public if parse_public_ts(s.get("closedAt")) and parse_public_ts(s["closedAt"]) < cutoff]
        usable = [s for s in eligible if s.get("entryPrice") not in (None, "") and s.get("exitPrice") not in (None, "")]
        unique = {(s.get("symbol"), s.get("openedAt")) for s in usable}
        print(f"Public before cutoff: {len(eligible)} | usable: {len(usable)} | unique usable: {len(unique)}")
        print(f"Coverage difference vs stored reconstructed: {len(unique)-reconstructed:+d}")


if __name__ == "__main__":
    main()
