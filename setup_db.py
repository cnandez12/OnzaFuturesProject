"""Inicializa únicamente la base nueva indicada por DATABASE_URL."""

import os
from pathlib import Path

import psycopg2
from dotenv import load_dotenv

load_dotenv()


def main():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise SystemExit("DATABASE_URL no configurada")
    schema = Path(__file__).with_name("schema.sql").read_text(encoding="utf-8")
    with psycopg2.connect(url, connect_timeout=5) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT to_regclass('public.trades'), to_regclass('public.onza_project_meta')")
            trades_exists, marker_exists = cur.fetchone()
            if trades_exists and not marker_exists:
                raise SystemExit("La base ya contiene trades de otro proyecto; configura una base exclusiva para Onza")
            if marker_exists:
                cur.execute("SELECT 1 FROM onza_project_meta WHERE project = 'onza-futures'")
                if cur.fetchone() is None:
                    raise SystemExit("La base pertenece a otro proyecto")
            cur.execute(schema)
    print("Esquema Onza listo")


if __name__ == "__main__":
    main()
