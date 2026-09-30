#!/usr/bin/env python3
"""
clone_db.py — Clona una base de datos PostgreSQL completa a otra.

Copia:
  - Estructura (tablas, índices, secuencias, constraints, enums, funciones)
  - Datos (todas las filas de todas las tablas)
  - Orden correcto respetando foreign keys

Uso:
  pip install psycopg2-binary
  python clone_db.py

Configura SOURCE_DATABASE_URL y DEST_DATABASE_URL en el entorno.
"""

import os
import psycopg2
import psycopg2.extras
import sys
from datetime import datetime

# ══════════════════════════════════════════════════════════════════
# CONFIGURACIÓN — variables de entorno obligatorias
# ══════════════════════════════════════════════════════════════════

ORIGEN = os.getenv("SOURCE_DATABASE_URL", "")
DESTINO = os.getenv("DEST_DATABASE_URL", "")

# ══════════════════════════════════════════════════════════════════

def log(msg, level="INFO"):
    ts = datetime.now().strftime("%H:%M:%S")
    prefix = {"INFO": "✅", "WARN": "⚠️ ", "ERR": "❌", "HEAD": "═══"}.get(level, "  ")
    print(f"[{ts}] {prefix} {msg}")

def connect(url, name):
    try:
        conn = psycopg2.connect(url)
        conn.autocommit = False
        log(f"Conectado a {name}")
        return conn
    except Exception as e:
        log(f"No se pudo conectar a {name}: {e}", "ERR")
        sys.exit(1)

def get_schema_sql(cur):
    """Obtiene el SQL completo del schema usando pg_dump lógico."""
    # Obtener todos los enums
    cur.execute("""
        SELECT n.nspname, t.typname,
               array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
        GROUP BY n.nspname, t.typname
        ORDER BY t.typname
    """)
    enums = cur.fetchall()

    # Obtener tablas en orden topológico (respetando FK)
    cur.execute("""
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename
    """)
    tables = [r[0] for r in cur.fetchall()]

    # Obtener secuencias
    cur.execute("""
        SELECT sequence_name FROM information_schema.sequences
        WHERE sequence_schema = 'public'
    """)
    sequences = [r[0] for r in cur.fetchall()]

    return enums, tables, sequences

def get_table_ddl(cur, table):
    """Genera el CREATE TABLE completo para una tabla."""
    # Columnas
    cur.execute("""
        SELECT
            c.column_name,
            c.data_type,
            c.udt_name,
            c.character_maximum_length,
            c.numeric_precision,
            c.numeric_scale,
            c.is_nullable,
            c.column_default,
            c.ordinal_position
        FROM information_schema.columns c
        WHERE c.table_schema = 'public' AND c.table_name = %s
        ORDER BY c.ordinal_position
    """, (table,))
    cols = cur.fetchall()

    col_defs = []
    for col in cols:
        name, dtype, udt, max_len, num_prec, num_scale, nullable, default, _ = col

        # Tipo de columna
        if dtype == 'USER-DEFINED':
            col_type = udt  # enum o tipo custom
        elif dtype == 'character varying':
            col_type = f"VARCHAR({max_len})" if max_len else "VARCHAR"
        elif dtype == 'character':
            col_type = f"CHAR({max_len})" if max_len else "CHAR"
        elif dtype == 'numeric':
            if num_prec and num_scale:
                col_type = f"NUMERIC({num_prec},{num_scale})"
            else:
                col_type = "NUMERIC"
        elif dtype == 'ARRAY':
            col_type = udt.lstrip('_') + '[]'
        elif dtype == 'integer' and default and 'nextval' in str(default):
            col_type = 'SERIAL'
        else:
            col_type = dtype.upper()

        null_str = "" if nullable == 'YES' else " NOT NULL"

        # Default (omitir si es SERIAL)
        default_str = ""
        if default and col_type != 'SERIAL':
            default_str = f" DEFAULT {default}"

        col_defs.append(f'    "{name}" {col_type}{null_str}{default_str}')

    # Primary keys
    cur.execute("""
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema = 'public'
            AND tc.table_name = %s
        ORDER BY kcu.ordinal_position
    """, (table,))
    pk_cols = [r[0] for r in cur.fetchall()]
    if pk_cols:
        pk_str = ', '.join(f'"{c}"' for c in pk_cols)
        col_defs.append(f'    PRIMARY KEY ({pk_str})')

    ddl = f'CREATE TABLE IF NOT EXISTS "{table}" (\n'
    ddl += ',\n'.join(col_defs)
    ddl += '\n);'
    return ddl

def get_indexes(cur, table):
    """Obtiene los índices de una tabla (excluyendo PK que ya se creó)."""
    cur.execute("""
        SELECT indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
            AND tablename = %s
            AND indexname NOT IN (
                SELECT constraint_name
                FROM information_schema.table_constraints
                WHERE constraint_type = 'PRIMARY KEY'
                    AND table_name = %s
            )
    """, (table, table))
    return [r[0] for r in cur.fetchall()]

def get_foreign_keys(cur, table):
    """Obtiene las FK de una tabla."""
    cur.execute("""
        SELECT
            tc.constraint_name,
            kcu.column_name,
            ccu.table_name AS foreign_table,
            ccu.column_name AS foreign_column,
            rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
        JOIN information_schema.referential_constraints rc
            ON rc.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
            AND tc.table_name = %s
    """, (table,))
    return cur.fetchall()

def get_unique_constraints(cur, table):
    """Obtiene las constraints UNIQUE de una tabla."""
    cur.execute("""
        SELECT tc.constraint_name, kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'UNIQUE'
            AND tc.table_schema = 'public'
            AND tc.table_name = %s
        ORDER BY tc.constraint_name, kcu.ordinal_position
    """, (table,))
    rows = cur.fetchall()
    # Agrupar por constraint
    constraints = {}
    for cname, col in rows:
        constraints.setdefault(cname, []).append(col)
    return constraints

def topological_sort(tables, fk_map):
    """Ordena tablas respetando dependencias FK."""
    visited = set()
    order   = []

    def visit(t):
        if t in visited:
            return
        visited.add(t)
        for dep in fk_map.get(t, []):
            if dep != t and dep in tables:
                visit(dep)
        order.append(t)

    for t in tables:
        visit(t)
    return order

def copy_table_data(cur_src, cur_dst, table):
    """Copia todas las filas de una tabla."""
    import json as _json
    # Registrar adaptador JSON para columnas JSONB/JSON
    psycopg2.extras.register_default_jsonb(cur_dst.connection, loads=_json.loads)
    from psycopg2.extras import Json
    def adapt_row(row):
        return tuple(Json(v) if isinstance(v, (dict, list)) else v for v in row)

    cur_src.execute(f'SELECT COUNT(*) FROM "{table}"')
    total = cur_src.fetchone()[0]

    if total == 0:
        log(f"  {table}: vacía, saltando")
        return 0

    # Obtener columnas
    cur_src.execute(f'SELECT * FROM "{table}" LIMIT 0')
    col_names = [desc[0] for desc in cur_src.description]
    cols_quoted = ', '.join(f'"{c}"' for c in col_names)
    placeholders = ', '.join(['%s'] * len(col_names))

    # Leer e insertar en batches
    cur_src.execute(f'SELECT {cols_quoted} FROM "{table}"')
    batch_size = 500
    inserted = 0

    while True:
        rows = cur_src.fetchmany(batch_size)
        if not rows:
            break
        try:
            adapted = [adapt_row(r) for r in rows]
            psycopg2.extras.execute_values(
                cur_dst,
                f'INSERT INTO "{table}" ({cols_quoted}) VALUES %s ON CONFLICT DO NOTHING',
                adapted,
                page_size=batch_size
            )
            inserted += len(rows)
        except Exception as e:
            log(f"  Error insertando en {table}: {e}", "WARN")
            raise

    log(f"  {table}: {inserted}/{total} filas copiadas")
    return inserted

def reset_sequences(cur_dst, tables):
    """Reinicia las secuencias para que los auto-increment queden correctos."""
    for table in tables:
        try:
            cur_dst.execute(f"""
                SELECT column_name, column_default
                FROM information_schema.columns
                WHERE table_schema = 'public'
                    AND table_name = %s
                    AND column_default LIKE 'nextval%%'
            """, (table,))
            seq_cols = cur_dst.fetchall()
            for col, default in seq_cols:
                cur_dst.execute(f'SELECT MAX("{col}") FROM "{table}"')
                max_val = cur_dst.fetchone()[0]
                if max_val is not None:
                    # Extraer nombre de secuencia del default
                    seq_name = default.split("'")[1]
                    cur_dst.execute(f"SELECT setval('{seq_name}', {max_val})")
        except Exception:
            pass

# ══════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════

def main():
    log("CLONACIÓN DE BASE DE DATOS", "HEAD")
    log(f"Origen:  {ORIGEN.split('@')[-1]}")
    log(f"Destino: {DESTINO.split('@')[-1]}")
    print()

    # Conectar
    if not ORIGEN or not DESTINO:
        raise SystemExit("Configure SOURCE_DATABASE_URL y DEST_DATABASE_URL antes de clonar.")
    src = connect(ORIGEN,  "ORIGEN")
    dst = connect(DESTINO, "DESTINO")
    cur_src = src.cursor()
    cur_dst = dst.cursor()

    # ── 1. SCHEMA ──────────────────────────────────────────────────
    log("PASO 1: Clonando estructura (schema)...", "HEAD")

    enums, tables, sequences = get_schema_sql(cur_src)

    # Crear enums
    log(f"Creando {len(enums)} enums...")
    for schema, name, labels in enums:
        try:
            labels_sql = ", ".join(f"'{l}'" for l in labels)
            cur_dst.execute(f"DROP TYPE IF EXISTS {name} CASCADE")
            cur_dst.execute(f"CREATE TYPE {name} AS ENUM ({labels_sql})")
            log(f"  ENUM {name}: {labels}")
        except Exception as e:
            log(f"  ENUM {name}: {e}", "WARN")

    dst.commit()

    # Obtener FK map para orden topológico
    fk_map = {}
    for table in tables:
        fks = get_foreign_keys(cur_src, table)
        fk_map[table] = [fk[2] for fk in fks]  # foreign tables

    sorted_tables = topological_sort(tables, fk_map)
    log(f"Orden de creación: {' → '.join(sorted_tables)}")

    # Crear tablas
    log(f"Creando {len(sorted_tables)} tablas...")
    for table in sorted_tables:
        try:
            ddl = get_table_ddl(cur_src, table)
            cur_dst.execute(ddl)
            log(f"  Tabla '{table}' creada")
        except Exception as e:
            log(f"  Tabla '{table}': {e}", "WARN")

    dst.commit()

    # Crear índices (sin FK aún)
    log("Creando índices...")
    for table in sorted_tables:
        idxs = get_indexes(cur_src, table)
        for idx_sql in idxs:
            try:
                idx_sql_if = idx_sql.replace("CREATE INDEX", "CREATE INDEX IF NOT EXISTS") \
                                    .replace("CREATE UNIQUE INDEX", "CREATE UNIQUE INDEX IF NOT EXISTS")
                cur_dst.execute(idx_sql_if)
            except Exception as e:
                log(f"  Índice en {table}: {e}", "WARN")

    dst.commit()

    # ── 2. DATOS ───────────────────────────────────────────────────
    print()
    log("PASO 2: Copiando datos...", "HEAD")

    # Deshabilitar triggers temporalmente para FK
    cur_dst.execute("SET session_replication_role = 'replica'")

    total_rows = 0
    for table in sorted_tables:
        try:
            rows = copy_table_data(cur_src, cur_dst, table)
            total_rows += rows
        except Exception as e:
            log(f"  Error en {table}: {e}", "ERR")
            dst.rollback()
            cur_dst.execute("SET session_replication_role = 'origin'")
            continue

    dst.commit()
    cur_dst.execute("SET session_replication_role = 'origin'")
    dst.commit()

    log(f"Total filas copiadas: {total_rows}")

    # ── 3. FOREIGN KEYS ────────────────────────────────────────────
    print()
    log("PASO 3: Agregando Foreign Keys...", "HEAD")

    for table in sorted_tables:
        fks = get_foreign_keys(cur_src, table)
        for cname, col, ftable, fcol, del_rule in fks:
            on_delete = f"ON DELETE {del_rule}" if del_rule and del_rule != 'NO ACTION' else ""
            try:
                cur_dst.execute(f"""
                    ALTER TABLE "{table}"
                    ADD CONSTRAINT "{cname}"
                    FOREIGN KEY ("{col}") REFERENCES "{ftable}" ("{fcol}")
                    {on_delete}
                """)
                log(f"  FK: {table}.{col} → {ftable}.{fcol}")
            except Exception as e:
                log(f"  FK {cname}: {e}", "WARN")

    # Constraints UNIQUE
    for table in sorted_tables:
        uniques = get_unique_constraints(cur_src, table)
        for cname, cols in uniques.items():
            cols_sql = ', '.join(f'"{c}"' for c in cols)
            try:
                cur_dst.execute(f"""
                    ALTER TABLE "{table}"
                    ADD CONSTRAINT "{cname}" UNIQUE ({cols_sql})
                """)
            except Exception:
                pass  # Ya existe

    dst.commit()

    # ── 4. SECUENCIAS ──────────────────────────────────────────────
    print()
    log("PASO 4: Actualizando secuencias (auto-increment)...", "HEAD")
    reset_sequences(cur_dst, sorted_tables)
    dst.commit()
    log("Secuencias actualizadas")

    # ── RESUMEN ────────────────────────────────────────────────────
    print()
    log("CLONACIÓN COMPLETADA", "HEAD")
    log(f"Tablas clonadas: {len(sorted_tables)}")
    log(f"Filas copiadas:  {total_rows}")

    cur_src.close()
    cur_dst.close()
    src.close()
    dst.close()

if __name__ == "__main__":
    main()