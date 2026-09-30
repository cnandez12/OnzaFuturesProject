#!/bin/bash

# Script Python para verificar la conexión a PostgreSQL
check_postgres() {
    python3 - <<'END'
import os
import psycopg2
import time

max_attempts = 30
attempt = 1
while attempt <= max_attempts:
    try:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            print("Error: DATABASE_URL no está definida.")
            exit(1)
        print(f"Intentando conectar... (intento {attempt}/{max_attempts})")
        conn = psycopg2.connect(database_url)
        conn.close()
        print("PostgreSQL está listo!")
        exit(0)
    except Exception as e:
        print(f"Intento {attempt}/{max_attempts}: PostgreSQL no está listo. Error: {str(e)}")
        time.sleep(2)
        attempt += 1
print("Error: No se pudo conectar a PostgreSQL después de varios intentos.")
exit(1)
END
}

# Esperar a que PostgreSQL esté listo
check_postgres

# Iniciar los procesos
gunicorn ImageServer:app --bind 127.0.0.1:3000 &
GUNICORN_PID=$!

# El bot corre en primer plano — si muere, Railway detecta el crash y reinicia
python AllProfitFormatWhitImage.py
EXIT_CODE=$?

# Si llegamos aquí, el bot terminó — matar gunicorn y salir con el mismo código
kill $GUNICORN_PID 2>/dev/null
exit $EXIT_CODE