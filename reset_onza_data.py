"""Vaciado explícito de datos Onza. Requiere detener web y todos los workers."""
import argparse
import json
import os
from pathlib import Path

import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

TABLES = ("tv_events", "tv_signals", "trades", "sim_track_record",
          "daily_profits", "weekly_profits", "monthly_profits",
          "telegram_channel_state", "telegram_free_selections", "telegram_free_seen",
          "telegram_publications")


def reset_database(conn, *, workers_stopped=False):
    if not workers_stopped:
        raise RuntimeError("Detener receptor y todos los workers antes del vaciado")
    with conn:
        with conn.cursor() as cur:
            cur.execute("SET LOCAL lock_timeout = '5s'")
            cur.execute("SELECT project FROM public.onza_project_meta")
            if {row[0] for row in cur.fetchall()} != {"onza-futures"}:
                raise RuntimeError("La base no es exclusiva de Onza Futures")
            cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public'")
            actual = {row[0] for row in cur.fetchall()}
            if actual != set(TABLES) | {"onza_project_meta"}:
                raise RuntimeError("Esquema inesperado: revisar tablas antes de borrar")
            before = {}
            for table in TABLES:
                cur.execute(sql.SQL("SELECT count(*) FROM public.{}").format(sql.Identifier(table)))
                before[table] = cur.fetchone()[0]
            names = sql.SQL(", ").join(sql.SQL("public.{}").format(sql.Identifier(t)) for t in TABLES)
            cur.execute(sql.SQL("TRUNCATE TABLE {} RESTART IDENTITY").format(names))
            cur.execute("ALTER SEQUENCE public.bitunix_card_rotation_seq RESTART WITH 1")
            for table in TABLES:
                cur.execute(sql.SQL("SELECT count(*) FROM public.{}").format(sql.Identifier(table)))
                if cur.fetchone()[0] != 0:
                    raise RuntimeError("No se pudo verificar el vaciado")
    return before


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true")
    parser.add_argument("--workers-stopped", action="store_true")
    args = parser.parse_args()
    if not args.execute or not args.workers_stopped:
        raise SystemExit("Requiere --execute --workers-stopped tras detener receptor y workers en Railway")
    load_dotenv(Path(__file__).with_name(".env"))
    url = os.getenv("DATABASE_URL")
    if not url:
        raise SystemExit("DATABASE_URL no configurada")
    conn = psycopg2.connect(url, connect_timeout=5)
    try:
        counts = reset_database(conn, workers_stopped=True)
    finally:
        conn.close()
    print(json.dumps({"estado": "vaciado confirmado", "filas_eliminadas": counts}))


if __name__ == "__main__":
    main()
