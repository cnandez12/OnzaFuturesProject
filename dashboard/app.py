import os
import time
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, date
import json

load_dotenv()

app = Flask(__name__)

# CORS: solo si el origen está explícitamente configurado vía ALLOWED_ORIGINS
_allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
if _allowed_origins:
    CORS(app, origins=_allowed_origins)

# ── Config ──────────────────────────────────────────────────────────────────

DATABASE_URL    = os.getenv("DATABASE_URL", "")
INITIAL_BALANCE = float(os.getenv("INITIAL_BALANCE", "1000"))
MARGIN_PER_TRADE = float(os.getenv("MARGIN_PER_TRADE", "20"))
LEVERAGE        = int(os.getenv("LEVERAGE", "20"))
DASHBOARD_TITLE = "Onza Futures | Señales de TradingView"

db_pool = None

# ── DB ───────────────────────────────────────────────────────────────────────

def init_db_pool(attempts=10, delay=2):
    global db_pool
    if not DATABASE_URL:
        print("WARNING: DATABASE_URL no configurada")
        return
    for attempt in range(1, attempts + 1):
        try:
            db_pool = SimpleConnectionPool(1, 5, dsn=DATABASE_URL)
            conn = db_pool.getconn()
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
            db_pool.putconn(conn)
            print("PostgreSQL conectado")
            return
        except Exception as e:
            print(f"Intento {attempt}/{attempts} - DB error: {e}")
            db_pool = None
            if attempt == attempts:
                print("ERROR: No se pudo conectar a la DB")
            elif delay:
                time.sleep(delay)


def _reset_pool():
    """Descarta el pool actual para forzar una reconexión limpia."""
    global db_pool
    try:
        if db_pool:
            db_pool.closeall()
    except Exception:
        pass
    db_pool = None


def ensure_pool():
    """Garantiza un pool vivo; reintenta una vez si está caído."""
    global db_pool
    if db_pool is None:
        init_db_pool(attempts=1, delay=0)
    return db_pool is not None


def query(sql, params=(), fetch_all=False, fetch_one=False):
    global db_pool
    if not ensure_pool():
        return None
    conn = None
    broken = False
    try:
        conn = db_pool.getconn()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params)
            if fetch_all:
                return cur.fetchall()
            if fetch_one:
                return cur.fetchone()
            conn.commit()
            return True
    except (psycopg2.InterfaceError, psycopg2.OperationalError) as e:
        # Conexión caída (Railway recicló Postgres, idle timeout, etc.):
        # descartar la conexión muerta y resetear el pool para reconectar.
        print(f"DB connection lost: {e}")
        broken = True
        return None
    except Exception as e:
        print(f"DB query error: {e}")
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass
        return None
    finally:
        if conn is not None:
            try:
                db_pool.putconn(conn, close=broken)
            except Exception:
                pass
        if broken:
            _reset_pool()


# ── JSON encoder para Decimal y datetime ─────────────────────────────────────

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '__float__'):
            return float(obj)
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

# Flask 2.3+ compatible JSON config (replaces deprecated app.json_encoder)
from flask.json.provider import DefaultJSONProvider
class CustomJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if hasattr(obj, '__float__'):
            return float(obj)
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

app.json_provider_class = CustomJSONProvider
app.json = CustomJSONProvider(app)


@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


def rows_to_list(rows):
    if not rows:
        return []
    result = []
    for row in rows:
        d = dict(row)
        for k, v in d.items():
            if hasattr(v, '__float__'):
                d[k] = float(v)
            elif isinstance(v, (datetime, date)):
                d[k] = v.isoformat()
        result.append(d)
    return result


# ── Dashboard público ────────────────────────────────────────────────────────

def check_auth():
    # Dashboard de auditoría público por decisión expresa del propietario.
    # El receptor de TradingView valida su propia TRADINGVIEW_API_KEY.
    return True


# ── Rutas HTML ────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template(
        "dashboard.html",
        title=DASHBOARD_TITLE,
        initial_balance=INITIAL_BALANCE,
        margin=MARGIN_PER_TRADE,
        leverage=LEVERAGE,
    )


# ── API: historial de trades cerrados ────────────────────────────────────────

@app.route("/api/sim/history")
def api_history():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    limit  = min(int(request.args.get("limit",  500)), 1000)
    offset = max(int(request.args.get("offset", 0)), 0)

    rows = query(
        """
        SELECT id, symbol, direction,
               entry_price, exit_price, stop_loss,
               tp1, tp2, tp3,
               hit_tp1, hit_tp2, hit_tp3,
               tp1_exit_price, tp2_exit_price, tp3_exit_price,
               tp1_profit_pct, tp2_profit_pct, tp3_profit_pct, final_profit_pct,
               final_profit_usdt, close_reason,
               balance_before,
               (%s + SUM(COALESCE(final_profit_usdt, 0))
                       OVER (ORDER BY closed_at ASC, id ASC)) AS balance_after,
               margin_used, leverage, duration,
               opened_at, closed_at,
               'bot' AS source
        FROM sim_track_record
        ORDER BY closed_at DESC, id DESC
        LIMIT %s OFFSET %s
        """,
        (INITIAL_BALANCE, limit, offset),
        fetch_all=True,
    )
    if rows is None:
        return jsonify({"error": "Database unavailable"}), 503
    return jsonify(rows_to_list(rows))


# ── API: estadísticas resumen ─────────────────────────────────────────────────

@app.route("/api/sim/stats")
def api_stats():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    row = query(
        """
        SELECT
            COUNT(*)                                                      AS total_trades,
            COUNT(*) FILTER (WHERE final_profit_usdt > 0)                AS wins,
            COUNT(*) FILTER (WHERE final_profit_usdt < 0)                AS losses,
            COUNT(*) FILTER (WHERE final_profit_usdt = 0)                AS breakevens,
            COALESCE(SUM(final_profit_usdt), 0)                          AS total_pnl_usdt,
            COALESCE(AVG((final_profit_usdt / NULLIF(margin_used,0)) * 100)
                FILTER (WHERE final_profit_usdt > 0), 0)                 AS avg_win_pct,
            COALESCE(AVG((final_profit_usdt / NULLIF(margin_used,0)) * 100)
                FILTER (WHERE final_profit_usdt < 0), 0)                 AS avg_loss_pct,
            COALESCE(MAX(final_profit_usdt), 0)                          AS best_trade_usdt,
            COALESCE(MIN(final_profit_usdt), 0)                          AS worst_trade_usdt,
            MAX(balance_after)                                            AS max_balance,
            MIN(balance_after)                                            AS min_balance,
            MAX(balance_after)                                            AS last_balance,
            (SELECT margin_used FROM sim_track_record ORDER BY closed_at DESC, id DESC LIMIT 1) AS last_recorded_margin
        FROM sim_track_record
        """,
        fetch_one=True,
    )
    if row is None:
        return jsonify({"error": "Database unavailable"}), 503
    result = rows_to_list([row])[0]
    # Opción B: el balance se deriva SIEMPRE de la suma de P&L de cada trade,
    # no del balance_after que escribe el bot (evita desfases por compounding/fees).
    result["last_balance"] = INITIAL_BALANCE + float(result.get("total_pnl_usdt") or 0)
    result["initial_balance"] = INITIAL_BALANCE
    result["margin_per_trade"] = MARGIN_PER_TRADE
    result["leverage"] = LEVERAGE
    return jsonify(result)


# ── API: posiciones abiertas (tabla trades) ───────────────────────────────────

@app.route("/api/sim/pulse")
def api_pulse():
    """Endpoint ultraligero — solo devuelve el conteo de trades y el último cierre.
    El dashboard lo consulta cada 10s para detectar trades nuevos sin cargar toda la DB."""
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401
    row = query(
        """SELECT
                  (SELECT COUNT(*) FROM sim_track_record) AS total,
                  (SELECT MAX(closed_at) FROM sim_track_record) AS last_closed,
                  (SELECT COUNT(*) FROM trades WHERE close = FALSE) AS open_count,
                  (SELECT md5(COALESCE(string_agg(concat_ws('|', message_id, pair,
                    tp1_filled, tp2_filled, tp3_filled, be_active, current_sl,
                    pnl_accumulated, tp1_fill_price, tp2_fill_price), ';' ORDER BY message_id), ''))
                   FROM trades WHERE close = FALSE) AS open_state
        """,
        fetch_one=True,
    )
    if row:
        return jsonify({
            "total":       int(row["total"] or 0),
            "last_closed": row["last_closed"].isoformat() if row["last_closed"] else None,
            "open_count":  int(row["open_count"] or 0),
            "open_state":  row["open_state"],
        })
    return jsonify({"error": "Database unavailable"}), 503


@app.route("/api/sim/open")
def api_open():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    rows = query(
        """
        SELECT message_id AS id, pair, side AS direction, source_exchange,
               %s AS margin_used, leverage,
               entry, stop_loss, tp1, tp2, tp3,
               tp1_filled, tp2_filled, tp3_filled, date,
               be_active,
               COALESCE(current_sl, stop_loss) AS current_sl,
               COALESCE(pnl_accumulated, 0)    AS pnl_accumulated
        FROM trades
        WHERE close = FALSE
        ORDER BY date DESC
        """,
        (MARGIN_PER_TRADE,),
        fetch_all=True,
    )
    if rows is None:
        return jsonify({"error": "Database unavailable"}), 503
    return jsonify(rows_to_list(rows))


# ── API: curva de balance (puntos para gráfico) ───────────────────────────────

@app.route("/api/sim/curve")
def api_curve():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    rows = query(
        """
        SELECT
            closed_at,
            symbol,
            direction,
            final_profit_pct,
            final_profit_usdt,
            (%s + SUM(COALESCE(final_profit_usdt, 0))
                    OVER (ORDER BY closed_at ASC, id ASC)) AS balance_after,
            close_reason
        FROM sim_track_record
        ORDER BY closed_at ASC
        """,
        (INITIAL_BALANCE,),
        fetch_all=True,
    )
    if rows is None:
        return jsonify({"error": "Database unavailable"}), 503
    return jsonify(rows_to_list(rows))


# ── API: distribución por símbolo ─────────────────────────────────────────────

@app.route("/api/sim/symbols")
def api_symbols():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    rows = query(
        """
        SELECT symbol,
               COUNT(*)                                               AS total,
               COUNT(*) FILTER (WHERE final_profit_usdt > 0)         AS wins,
               COUNT(*) FILTER (WHERE final_profit_usdt < 0)         AS losses,
               COALESCE(SUM(final_profit_usdt), 0)                   AS total_usdt,
               COALESCE(AVG((final_profit_usdt / NULLIF(margin_used,0)) * 100), 0) AS avg_pct
        FROM sim_track_record
        GROUP BY symbol
        ORDER BY total DESC
        LIMIT 20
        """,
        fetch_all=True,
    )
    if rows is None:
        return jsonify({"error": "Database unavailable"}), 503
    return jsonify(rows_to_list(rows))


# ── API: estadísticas por símbolo (en % real) para el panel del chart ─────────

@app.route("/api/chart/symbol_stats")
def api_chart_symbol_stats():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    symbol = request.args.get("symbol", "")
    if not symbol:
        return jsonify({"error": "symbol required"}), 400

    # Mismo criterio de normalización que /api/chart/signals
    symbol_slash = symbol if "/" in symbol else f"{symbol[:-4]}/{symbol[-4:]}" if len(symbol) > 4 else symbol
    symbol_raw   = symbol.replace("/", "")

    row = query(
        """
        SELECT
            COUNT(*)                                                                   AS total,
            COUNT(*) FILTER (WHERE final_profit_pct > 0)                                AS wins,
            COUNT(*) FILTER (WHERE final_profit_pct < 0)                                AS losses,
            COALESCE(SUM(final_profit_pct), 0)                                          AS total_pct,
            COALESCE(AVG(final_profit_pct), 0)                                          AS avg_pct,
            COALESCE(AVG(final_profit_pct) FILTER (WHERE final_profit_pct > 0), 0)      AS avg_win_pct,
            COALESCE(AVG(final_profit_pct) FILTER (WHERE final_profit_pct < 0), 0)      AS avg_loss_pct,
            COALESCE(MAX(final_profit_pct), 0)                                          AS best_pct,
            COALESCE(MIN(final_profit_pct), 0)                                          AS worst_pct,
            COALESCE(SUM(final_profit_pct) FILTER (WHERE final_profit_pct > 0), 0)      AS gross_win,
            COALESCE(ABS(SUM(final_profit_pct) FILTER (WHERE final_profit_pct < 0)), 0) AS gross_loss
        FROM sim_track_record
        WHERE symbol = %s OR symbol = %s
        """,
        (symbol_raw, symbol_slash),
        fetch_one=True,
    )
    if row is None:
        return jsonify({"error": "Database unavailable"}), 503
    return jsonify(rows_to_list([row])[0])


# ── API: pares disponibles para el chart ──────────────────────────────────────

@app.route("/api/chart/pairs")
def api_chart_pairs():
    """Pares únicos que existen en la DB (para el selector del chart)."""
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    rows = query(
        """
        SELECT DISTINCT ON (pair) pair, source_exchange FROM (
            SELECT REPLACE(pair, '/', '') AS pair, source_exchange, date
            FROM trades WHERE pair IS NOT NULL
        ) sub
        ORDER BY pair, date DESC
        """,
        fetch_all=True,
    )
    if rows is None:
        return jsonify({"error": "Database unavailable"}), 503
    return jsonify(rows_to_list(rows))


# ── API: señales para el chart (históricas + abiertas) ────────────────────────

@app.route("/api/chart/signals")
def api_chart_signals():
    """Devuelve señales cerradas + abiertas para un símbolo dado.
    Query params: symbol (requerido), from_ts, to_ts (opcionales, unix seconds)."""
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    symbol = request.args.get("symbol", "")
    if not symbol:
        return jsonify({"error": "symbol required"}), 400

    # Normalizar: "BTC/USDT" o "BTCUSDT" → ambos formatos
    symbol_slash = symbol if "/" in symbol else f"{symbol[:-4]}/{symbol[-4:]}" if len(symbol) > 4 else symbol
    symbol_raw   = symbol.replace("/", "")

    # ── Señales cerradas (sim_track_record) ──
    closed = query(
        """
        SELECT id, symbol, direction,
               entry_price, exit_price, stop_loss,
               tp1, tp2, tp3,
               hit_tp1, hit_tp2, hit_tp3,
               tp1_exit_price, tp2_exit_price, tp3_exit_price,
               final_profit_pct, final_profit_usdt,
               close_reason, opened_at, closed_at
        FROM sim_track_record
        WHERE symbol = %s OR symbol = %s
        ORDER BY opened_at DESC
        LIMIT 100
        """,
        (symbol_raw, symbol_slash),
        fetch_all=True,
    )

    # ── Señales abiertas (trades) ──
    open_trades = query(
        """
        SELECT message_id AS id, pair AS symbol, side AS direction,
               %s AS margin_used, leverage,
               entry AS entry_price, stop_loss,
               tp1, tp2, tp3,
               tp1_filled AS hit_tp1, tp2_filled AS hit_tp2, tp3_filled AS hit_tp3,
               be_active, current_sl, pnl_accumulated, date AS opened_at
        FROM trades
        WHERE close = FALSE AND (pair = %s OR pair = %s)
        ORDER BY date DESC
        """,
        (MARGIN_PER_TRADE, symbol_raw, symbol_slash),
        fetch_all=True,
    )
    if closed is None or open_trades is None:
        return jsonify({"error": "Database unavailable"}), 503

    return jsonify({
        "closed": rows_to_list(closed or []),
        "open":   rows_to_list(open_trades or []),
    })


# ── API: polling de cambios (para detectar nuevas señales) ────────────────────

@app.route("/api/chart/poll")
def api_chart_poll():
    """Endpoint ultraligero para detectar cambios — el chart lo llama cada 2-3 seg."""
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    symbol = request.args.get("symbol", "")
    symbol_slash = symbol if "/" in symbol else f"{symbol[:-4]}/{symbol[-4:]}" if len(symbol) > 4 else symbol
    symbol_raw   = symbol.replace("/", "")

    row = query(
        """
        SELECT
            (SELECT COUNT(*) FROM trades
             WHERE close = FALSE AND (pair = %s OR pair = %s)) AS open_count,
            (SELECT MAX(closed_at) FROM sim_track_record
             WHERE symbol = %s OR symbol = %s) AS last_closed,
            (SELECT MAX(date) FROM trades
             WHERE (pair = %s OR pair = %s)) AS last_opened,
            (SELECT md5(COALESCE(string_agg(concat_ws('|', message_id, pair,
                tp1_filled, tp2_filled, tp3_filled, be_active, current_sl,
                pnl_accumulated, tp1_fill_price, tp2_fill_price), ';' ORDER BY message_id), ''))
             FROM trades WHERE close = FALSE AND (pair = %s OR pair = %s)) AS open_state
        """,
        (symbol_raw, symbol_slash, symbol_raw, symbol_slash, symbol_raw, symbol_slash,
         symbol_raw, symbol_slash),
        fetch_one=True,
    )

    if row:
        return jsonify({
            "open_count":  int(row.get("open_count") or 0),
            "last_closed": row["last_closed"].isoformat() if row.get("last_closed") else None,
            "last_opened": row["last_opened"].isoformat() if row.get("last_opened") else None,
            "open_state": row["open_state"],
        })
    return jsonify({"error": "Database unavailable"}), 503


# ── Health ────────────────────────────────────────────────────────────────────

@app.route("/health")
def health():
    db_ok = False
    try:
        if db_pool is not None:
            db_ok = query("SELECT 1") is not None
    except Exception:
        db_ok = False
    status = "ok" if db_ok else "degraded"
    http_code = 200 if db_ok else 503
    return jsonify({"status": status, "db": db_ok}), http_code


# ── Init ──────────────────────────────────────────────────────────────────────

with app.app_context():
    init_db_pool()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
