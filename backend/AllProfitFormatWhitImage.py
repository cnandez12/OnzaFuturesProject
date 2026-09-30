import asyncio
import os
import re
import time
import json
import math
import base64
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, Optional
import pytz
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool
from pathlib import Path
from telethon import TelegramClient, events
from telethon.sessions import StringSession
import unicodedata
import requests
import websockets

from FreeChannel import FreeChannelConfig, FreeChannelService, format_free_signal_message

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ── Variables de entorno obligatorias. ───────────────────────────────────────

def require_env(name):
    val = os.getenv(name)
    if not val:
        raise SystemExit(f"FATAL: Variable de entorno '{name}' no está definida.")
    return val

API_ID                = require_env("API_ID")
API_HASH              = require_env("API_HASH")
SOURCE_CHANNEL_ID     = int(require_env("SOURCE_CHANNEL_ID"))
SOURCE_CHANNEL_ID_2   = int(require_env("SOURCE_CHANNEL_ID_2"))
DESTINATION_CHANNEL_ID = int(require_env("DESTINATION_CHANNEL_ID"))

# ── Variables de entorno opcionales ─────────────────────────────────────────

UTC_TZ            = pytz.timezone('UTC')
LEVERAGE          = int(os.getenv("LEVERAGE", "20"))
DEBUG_MODE        = os.getenv("DEBUG_MODE", "False").lower() == "true"
BREAKEVEN         = os.getenv("BREAKEVEN", "False").lower() == "true"
IMAGE_SERVER_URL  = os.getenv("IMAGE_SERVER_URL", "")

# ── WEBHOOKS: todos los clientes (CSF, Bitunix, marcas, Onza, futuros) se ────
# configuran desde ConfigWebhoock.json. Ver load_webhook_clients().
webhook_clients: list = []   # poblado por load_webhook_clients() en main()

USDT_PER_TRADE    = float(os.getenv("USDT_PER_TRADE", "20"))
ACCOUNT_BALANCE   = float(os.getenv("ACCOUNT_BALANCE", "1000"))


def normalize_distribution_symbol(value) -> str:
    """Normaliza BTCUSDT, BTC/USDT o BTCUSD.P a la clave interna BTCUSDT."""
    symbol = re.sub(r"[^A-Z0-9]", "", str(value or "").upper())
    if symbol.endswith("USDP"):
        symbol = symbol[:-4] + "USDT"
    return symbol


def parse_onza_free_blacklist(raw_value) -> frozenset:
    """Lee símbolos separados por coma, punto y coma o espacios."""
    return frozenset(
        normalized
        for item in re.split(r"[,;\s]+", str(raw_value or ""))
        if (normalized := normalize_distribution_symbol(item))
    )


ONZA_FREE_BLACKLIST = parse_onza_free_blacklist(
    os.getenv("ONZA_FREE_BLACKLIST", "")
)


def is_onza_free_blacklisted(symbol) -> bool:
    """Regla compartida por Onza y el futuro canal Free."""
    return normalize_distribution_symbol(symbol) in ONZA_FREE_BLACKLIST


# Distribución de TPs: 40% - 40% - 20%
TP_DIST = [0.40, 0.40, 0.20]

# ── Whitelist de tablas ──────────────────────────────────────────────────────

VALID_PROFIT_TABLES  = {"daily_profits", "weekly_profits", "monthly_profits"}
VALID_FILLED_TARGETS = {"tp1", "tp2", "tp3", "sl"}

def validate_table_name(table_name):
    if table_name not in VALID_PROFIT_TABLES:
        raise ValueError(f"Nombre de tabla inválido: {table_name}")
    return table_name

# ── Plantillas de mensajes ───────────────────────────────────────────────────

NEW_TRADE_TEMPLATE = (
    "\U0001F514**New Trade by Onza Futures**\U0001F514\n\n"
    "**#{pair} {direction}**\n\n"
    "{signal_emoji} **Leverage X{leverage}**\n"
    "\u26a1 **Entry Price: {entry_price}**\n"
    "{tp_lines}\n"
    "\u26d4 **Stoploss: {stop_loss}**\n\n"
    "\U0001F6A8**Onza Futures**\U0001F6A8"
)
TP_RESPONSE_TEMPLATE = (
    "#{pair} {signal_type}\n"
    "✅ Target {target_num} Achieved ✅\n"
    "💰 Profit: {profit} 💰\n"
    "⏳ Duration: {duration}"
)
TP_FINAL_TEMPLATE = (
    "#{pair} {signal_type}\n"
    "✅ Target 3 Achieved 😎😎😎 ✅\n"
    "💰 Total Profit: {profit} 💰💰💰\n"
    "⏳ Duration: {duration}"
)
SL_FINAL_TEMPLATE = (
    "#{pair} {signal_type}\n"
    "❌ Closed at Stoploss 😔\n"
    "📉 Total Loss: {loss} 📉\n"
    "⏳ Duration: {duration}"
)
BE_TEMPLATE = (
    "#{pair} {signal_type}\n"
    "⚖️ Breakeven — SL moved to Entry ⚖️\n"
    "💰 Partial Profit: {profit} 💰\n"
    "⏳ Duration: {duration}"
)

# ── Plantillas Multi-Marca ────────────────────────────────────────────────────

# -- Premium Academy Futures --------------------------------------------------
PREMIUM_ACADEMY_TRADE_TEMPLATE = (
    "🏛️ **PREMIUM ACADEMY FUTURES** 🏛️\n"
    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    "📊 **NUEVA SEÑAL DE TRADING**\n\n"
    "📌 **Par:** #{pair}\n"
    "{signal_emoji} **Posición:** {direction}\n\n"
    "💼 **Apalancamiento:** ×{leverage}\n"
    "⚡ **Precio de Entrada:** {entry_price}\n\n"
    "🎯 **Take Profit 1 ➤** {tp1}\n"
    "🎯 **Take Profit 2 ➤** {tp2}\n"
    "🎯 **Take Profit 3 ➤** {tp3}\n\n"
    "🛡️ **Stop Loss:** {stop_loss}\n"
    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    "⚠️ _Gestiona tu riesgo en todo momento_\n"
    "🎓 **Premium Academy Futures**"
)
PREMIUM_ACADEMY_TP_TEMPLATE = (
    "🏛️ **PREMIUM ACADEMY FUTURES**\n\n"
    "#{pair} | {direction}\n"
    "✅ **¡Take Profit {tp_num} Alcanzado!** ✅\n\n"
    "💰 **Ganancia:** {profit}\n"
    "⏳ **Duración:** {duration}\n\n"
    "🎓 **Premium Academy Futures**"
)
PREMIUM_ACADEMY_TP_FINAL_TEMPLATE = (
    "🏛️ **PREMIUM ACADEMY FUTURES**\n\n"
    "#{pair} | {direction}\n"
    "🏆 **¡Máximo Objetivo Alcanzado!** 🏆\n\n"
    "💰 **Ganancia Total:** {profit} 🎉\n"
    "⏳ **Duración:** {duration}\n\n"
    "🎓 **Premium Academy Futures**"
)
PREMIUM_ACADEMY_SL_TEMPLATE = (
    "🏛️ **PREMIUM ACADEMY FUTURES**\n\n"
    "#{pair} | {direction}\n"
    "❌ **Stop Loss Activado** ❌\n\n"
    "📉 **Resultado:** {loss}\n"
    "⏳ **Duración:** {duration}\n\n"
    "⚠️ _El riesgo controlado es la base del éxito_\n"
    "🎓 **Premium Academy Futures**"
)
PREMIUM_ACADEMY_BE_TEMPLATE = (
    "🏛️ **PREMIUM ACADEMY FUTURES**\n\n"
    "#{pair} | {direction}\n"
    "⚖️ **Breakeven — SL movido a entrada** ⚖️\n\n"
    "💰 **Resultado:** {profit}\n"
    "⏳ **Duración:** {duration}\n\n"
    "🎓 **Premium Academy Futures**"
)

# -- Crypto Rise --------------------------------------------------------------
CRYPTO_RISE_TRADE_TEMPLATE = (
    "◆◆ **CRYPTO RISE** ◆◆\n"
    "⚡ **SEÑAL ACTIVA** ⚡\n"
    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    "🌊 **#{pair}** | {signal_emoji} **{direction_upper}** | **×{leverage}**\n\n"
    "📍 **Entrada:** {entry_price}\n\n"
    "🎯 **TP 1 —** {tp1}\n"
    "🎯 **TP 2 —** {tp2}\n"
    "🎯 **TP 3 —** {tp3}\n\n"
    "🔴 **Stop Loss:** {stop_loss}\n"
    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    "📊 _Análisis técnico confirmado_\n"
    "🚀 **CRYPTO RISE** — Trade Intelligence"
)
CRYPTO_RISE_TP_TEMPLATE = (
    "◆◆ **CRYPTO RISE** ◆◆\n\n"
    "#{pair} | {direction}\n"
    "🎯 **TARGET {tp_num} HIT** ✅\n\n"
    "📈 **Profit:** {profit}\n"
    "⏱ **Duración:** {duration}\n\n"
    "🚀 **CRYPTO RISE** — Trade Intelligence"
)
CRYPTO_RISE_TP_FINAL_TEMPLATE = (
    "◆◆ **CRYPTO RISE** ◆◆\n\n"
    "#{pair} | {direction}\n"
    "🏆 **ALL TARGETS HIT** 🏆🚀\n\n"
    "📈 **Total Profit:** {profit} 💎\n"
    "⏱ **Duración:** {duration}\n\n"
    "🚀 **CRYPTO RISE** — Trade Intelligence"
)
CRYPTO_RISE_SL_TEMPLATE = (
    "◆◆ **CRYPTO RISE** ◆◆\n\n"
    "#{pair} | {direction}\n"
    "🛑 **STOP LOSS HIT** ❌\n\n"
    "📉 **Resultado:** {loss}\n"
    "⏱ **Duración:** {duration}\n\n"
    "🚀 **CRYPTO RISE** — Trade Intelligence"
)
CRYPTO_RISE_BE_TEMPLATE = (
    "◆◆ **CRYPTO RISE** ◆◆\n\n"
    "#{pair} | {direction}\n"
    "⚖️ **BREAKEVEN EXIT** ⚖️\n\n"
    "💰 **Resultado:** {profit}\n"
    "⏱ **Duración:** {duration}\n\n"
    "🚀 **CRYPTO RISE** — Trade Intelligence"
)

# ── Pool de conexiones ───────────────────────────────────────────────────────

db_pool = None
telegram_client = None  # referencia global al cliente Telegram
free_channel_service = None

def log_message(level, message, context=None, debug_only=False):
    if debug_only and not DEBUG_MODE:
        return
    timestamp = datetime.now(UTC_TZ).replace(microsecond=0).strftime('%Y-%m-%d %H:%M:%S')
    context_str = f"[{context}] " if context else ""
    print(f"[{timestamp}] {level} {context_str}{message}")

def init_db_pool():
    global db_pool
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        log_message("ERROR", "DATABASE_URL no está definida")
        return
    for attempt in range(1, 31):
        try:
            db_pool = SimpleConnectionPool(1, 10, dsn=database_url)
            conn = db_pool.getconn()
            try:
                with conn.cursor() as cur:
                    cur.execute("SET timezone = 'UTC'")
                conn.commit()
            finally:
                db_pool.putconn(conn)
            log_message("INFO", "Conexión a PostgreSQL establecida")
            return
        except psycopg2.Error as e:
            log_message("ERROR", f"Intento {attempt}/30 - DB: {e}")
            if attempt == 30:
                return
            time.sleep(2)

def ensure_db_pool():
    global db_pool
    if db_pool is None:
        init_db_pool()
    if db_pool is not None:
        try:
            conn = db_pool.getconn()
            try:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
            finally:
                db_pool.putconn(conn)
        except Exception:
            try:
                db_pool.closeall()
            except Exception:
                pass
            db_pool = None
            init_db_pool()

def execute_db_query(query, params=(), fetch=False, fetchone=False):
    ensure_db_pool()
    if db_pool is None:
        return None
    conn = None
    try:
        conn = db_pool.getconn()
    except Exception as e:
        log_message("ERROR", f"Error obteniendo conexión: {e}")
        return None
    try:
        cursor_factory = RealDictCursor if (fetch or fetchone) else None
        with conn.cursor(cursor_factory=cursor_factory) as cur:
            cur.execute(query, params)
            if fetch:
                return cur.fetchall()
            if fetchone:
                return cur.fetchone()
            conn.commit()
            return True
    except psycopg2.Error as e:
        log_message("ERROR", f"Error en consulta: {e}")
        try:
            conn.rollback()
        except Exception:
            pass
        return None
    finally:
        if conn is not None:
            try:
                db_pool.putconn(conn)
            except Exception:
                pass

# ── Estado global ────────────────────────────────────────────────────────────

class TradeState:
    def __init__(self):
        self.message_id_map      = {}  # str(src_msg_id) → dst_msg_id
        self.signal_targets_map  = {}  # str(src_msg_id) → signal data
        self.recent_messages     = {}
        self.daily_profits       = {}
        self.weekly_profits      = {}
        self.monthly_profits     = {}

state = TradeState()

# ── Multi-Brand: marca secundaria (bot token) ────────────────────────────────

@dataclass
class SecondaryBrand:
    id:                  str
    name:                str
    destination_channel: int
    template:            str

secondary_brands:   list = []
brands_bot_client        = None  # único cliente Telethon bot compartido entre todas las marcas
_brands_bot_token:  str  = ""    # token leído en load_secondary_brands, cliente creado en main()
_brand_reply_ids:   dict = {}    # str(src_msg_id) → {brand_id: sent_msg_id} para reply threading

# ── SimTrade: trade activo en el simulador ───────────────────────────────────

@dataclass
class SimTrade:
    msg_id:          str
    pair:            str    # "BTCUSDT" (para Binance WS)
    formatted_pair:  str    # "BTC/USDT" (para Telegram)
    direction:       str    # "Long" o "Short"
    entry:           float
    tp1:             float
    tp2:             float
    tp3:             float
    stop_loss:       float
    qty_total:       float  # contratos totales (notional / entry)
    sent_message_id: int    # ID del mensaje en el canal destino
    timestamp:       datetime
    tp1_filled:      bool  = False
    tp2_filled:      bool  = False
    tp3_filled:      bool  = False
    be_active:       bool  = False
    current_sl:      float = 0.0   # puede moverse a entry si BE activo
    pnl_accumulated: float = 0.0   # PnL acumulado en USDT (TPs anteriores)
    closing:         bool  = False # guard anti-doble-cierre (WS vs Closing fuente)

    def __post_init__(self):
        if self.current_sl == 0.0:
            self.current_sl = self.stop_loss

    @property
    def qty_remaining(self) -> float:
        qty = self.qty_total
        if self.tp1_filled:
            qty -= self.qty_total * TP_DIST[0]
        if self.tp2_filled:
            qty -= self.qty_total * TP_DIST[1]
        return max(qty, 0.0)

    @property
    def is_long(self) -> bool:
        return self.direction.lower() == "long"

    def calc_pnl(self, fill_price: float, qty: float):
        """Retorna (pnl_usdt, pnl_pct) para la qty dada al fill_price."""
        if self.is_long:
            pnl_usdt = (fill_price - self.entry) * qty
            pnl_pct  = ((fill_price - self.entry) / self.entry) * 100 * LEVERAGE
        else:
            pnl_usdt = (self.entry - fill_price) * qty
            pnl_pct  = ((self.entry - fill_price) / self.entry) * 100 * LEVERAGE
        return pnl_usdt, pnl_pct

# Balance simulado — se actualiza con cada trade cerrado
sim_balance: float = ACCOUNT_BALANCE

# Diccionario de trades activos en el simulador
sim_trades: Dict[str, SimTrade] = {}

# Precios de TP parciales para el track record
tp_fill_prices: Dict[str, Dict[int, float]] = {}  # msg_id → {1: price, 2: price, 3: price}
latest_prices:  Dict[str, float] = {}              # symbol → último precio recibido del WS

# ── DB helpers ───────────────────────────────────────────────────────────────

def init_db():
    queries = [
        """CREATE TABLE IF NOT EXISTS message_state (
            key VARCHAR PRIMARY KEY,
            message_id_map JSONB,
            signal_targets_map JSONB
        )""",
        """CREATE TABLE IF NOT EXISTS daily_profits (
            key VARCHAR PRIMARY KEY,
            value TEXT,
            gain_date TIMESTAMP WITH TIME ZONE,
            Close BOOLEAN DEFAULT FALSE
        )""",
        """CREATE TABLE IF NOT EXISTS weekly_profits (
            key VARCHAR PRIMARY KEY,
            value TEXT,
            gain_date TIMESTAMP WITH TIME ZONE,
            Close BOOLEAN DEFAULT FALSE
        )""",
        """CREATE TABLE IF NOT EXISTS monthly_profits (
            key VARCHAR PRIMARY KEY,
            value TEXT,
            gain_date TIMESTAMP WITH TIME ZONE,
            Close BOOLEAN DEFAULT FALSE
        )""",
        """CREATE TABLE IF NOT EXISTS trades (
            message_id BIGINT PRIMARY KEY,
            date TIMESTAMP WITH TIME ZONE,
            pair VARCHAR,
            leverage INTEGER,
            entry VARCHAR,
            side VARCHAR,
            tp1 VARCHAR,
            tp2 VARCHAR,
            tp3 VARCHAR,
            stop_loss VARCHAR,
            trade_pl VARCHAR,
            duration VARCHAR,
            tp1_filled BOOLEAN DEFAULT FALSE,
            tp2_filled BOOLEAN DEFAULT FALSE,
            tp3_filled BOOLEAN DEFAULT FALSE,
            sl_filled BOOLEAN DEFAULT FALSE,
            Close BOOLEAN DEFAULT FALSE,
            be_active BOOLEAN DEFAULT FALSE,
            current_sl VARCHAR,
            pnl_accumulated DECIMAL(10,4) DEFAULT 0
        )""",
        "ALTER TABLE trades ADD COLUMN IF NOT EXISTS be_active BOOLEAN DEFAULT FALSE",
        "ALTER TABLE trades ADD COLUMN IF NOT EXISTS current_sl VARCHAR",
        "ALTER TABLE trades ADD COLUMN IF NOT EXISTS pnl_accumulated DECIMAL(10,4) DEFAULT 0",
        "ALTER TABLE trades ADD COLUMN IF NOT EXISTS tp1_fill_price VARCHAR",
        "ALTER TABLE trades ADD COLUMN IF NOT EXISTS tp2_fill_price VARCHAR",
        "CREATE INDEX IF NOT EXISTS idx_daily_profits_gain_date   ON daily_profits   (gain_date)",
        "CREATE INDEX IF NOT EXISTS idx_weekly_profits_gain_date  ON weekly_profits  (gain_date)",
        "CREATE INDEX IF NOT EXISTS idx_monthly_profits_gain_date ON monthly_profits (gain_date)",
        """CREATE TABLE IF NOT EXISTS sim_track_record (
            id              SERIAL PRIMARY KEY,
            symbol          VARCHAR,
            direction       VARCHAR,
            entry_price     DECIMAL(20,8),
            exit_price      DECIMAL(20,8),
            stop_loss       DECIMAL(20,8),
            tp1             DECIMAL(20,8),
            tp2             DECIMAL(20,8),
            tp3             DECIMAL(20,8),
            hit_tp1         BOOLEAN DEFAULT FALSE,
            hit_tp2         BOOLEAN DEFAULT FALSE,
            hit_tp3         BOOLEAN DEFAULT FALSE,
            tp1_exit_price  DECIMAL(20,8),
            tp2_exit_price  DECIMAL(20,8),
            tp3_exit_price  DECIMAL(20,8),
            tp1_profit_pct  DECIMAL(10,4),
            tp2_profit_pct  DECIMAL(10,4),
            tp3_profit_pct  DECIMAL(10,4),
            final_profit_pct DECIMAL(10,4),
            final_profit_usdt DECIMAL(10,4),
            close_reason    VARCHAR,
            balance_before  DECIMAL(12,4),
            balance_after   DECIMAL(12,4),
            margin_used     DECIMAL(10,4),
            leverage        INTEGER,
            duration        VARCHAR,
            opened_at       TIMESTAMP WITH TIME ZONE,
            closed_at       TIMESTAMP WITH TIME ZONE
        )""",
        "CREATE INDEX IF NOT EXISTS idx_sim_track_symbol    ON sim_track_record (symbol)",
        "CREATE INDEX IF NOT EXISTS idx_sim_track_opened_at ON sim_track_record (opened_at)",
        "CREATE INDEX IF NOT EXISTS idx_sim_track_direction ON sim_track_record (direction)",
        "ALTER TABLE sim_track_record ADD COLUMN IF NOT EXISTS tp3_profit_pct DECIMAL(10,4)",
    ]
    for query in queries:
        if not execute_db_query(query):
            log_message("ERROR", "Error inicializando tablas")
            return
    log_message("INFO", "Tablas inicializadas")

def normalize_timestamp(dt):
    if not dt:
        return None
    dt = dt.replace(microsecond=0)
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def format_duration(start_time, end_time):
    if not start_time or not end_time:
        return "Unknown Duration"
    try:
        if isinstance(start_time, str):
            start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S').replace(tzinfo=UTC_TZ)
        if isinstance(end_time, str):
            end_time = datetime.strptime(end_time, '%Y-%m-%d %H:%M:%S').replace(tzinfo=UTC_TZ)
    except ValueError:
        return "Unknown Duration"
    delta = end_time - start_time
    if delta.total_seconds() < 0:
        return "Invalid Duration"
    days  = delta.days
    hours, rem = divmod(delta.seconds, 3600)
    minutes, _ = divmod(rem, 60)
    parts = []
    if days    > 0:            parts.append(f"{days} Days")
    if hours   > 0 or days > 0: parts.append(f"{hours} Hours")
    parts.append(f"{minutes} Minutes")
    return " ".join(parts)

def load_state():
    result = execute_db_query(
        "SELECT * FROM message_state WHERE key = 'state'", fetchone=True
    )
    if result:
        state.message_id_map.update(
            {str(k): v for k, v in result['message_id_map'].items()}
        )
        state.signal_targets_map.update(
            {str(k): v for k, v in result['signal_targets_map'].items()}
        )
    for table in VALID_PROFIT_TABLES:
        rows = execute_db_query(
            f"SELECT * FROM {validate_table_name(table)}", fetch=True
        )
        if rows:
            getattr(state, table).update({r['key']: r['value'] for r in rows})
    log_message("INFO", "Estado cargado desde DB")

def save_state():
    """Persiste solo los mapas de estado (1 query).
    Las tablas de profits se guardan individualmente en update_profit_records()
    cuando cada TP/SL se dispara — re-escribirlas aquí era redundante y causaba
    demoras de ~50s con cientos de entries acumulados."""
    execute_db_query(
        """INSERT INTO message_state (key, message_id_map, signal_targets_map)
           VALUES (%s, %s, %s)
           ON CONFLICT (key) DO UPDATE
           SET message_id_map = EXCLUDED.message_id_map,
               signal_targets_map = EXCLUDED.signal_targets_map""",
        ('state', json.dumps(state.message_id_map), json.dumps(state.signal_targets_map))
    )

def save_trade_to_db(message_id, pair, leverage, entry, side, tp1, tp2, tp3, stop_loss, date):
    if date is None:
        date = datetime.now(UTC_TZ).replace(microsecond=0)
    execute_db_query(
        """INSERT INTO trades (
               message_id, date, pair, leverage, entry, side,
               tp1, tp2, tp3, stop_loss,
               tp1_filled, tp2_filled, tp3_filled, sl_filled, Close
           ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
           ON CONFLICT (message_id) DO NOTHING""",
        (message_id, date, pair, leverage,
         str(entry) if entry else None, side,
         str(tp1) if tp1 else None,
         str(tp2) if tp2 else None,
         str(tp3) if tp3 else None,
         str(stop_loss) if stop_loss else None,
         False, False, False, False, False)
    )
    log_message("INFO", f"[DB] Trade guardado: {pair}")

def update_trade_in_db(message_id, trade_pl, duration,
                        filled_target=None, close_trade=False):
    if not execute_db_query(
        "SELECT message_id FROM trades WHERE message_id = %s",
        (message_id,), fetchone=True
    ):
        return
    query  = "UPDATE trades SET trade_pl = %s, duration = %s"
    params = [str(trade_pl), duration]
    if filled_target and filled_target in VALID_FILLED_TARGETS:
        query += f", {filled_target}_filled = TRUE"
    if close_trade:
        query += ", Close = TRUE"
    query += " WHERE message_id = %s"
    params.append(message_id)
    execute_db_query(query, params)
    log_message("INFO",
        f"[DB] Trade {message_id} → target={filled_target} close={close_trade} P/L={trade_pl}")

def update_sim_state_in_db(message_id, pnl_accumulated=None, be_active=None,
                            current_sl=None, tp1_fill_price=None, tp2_fill_price=None):
    """Persiste el estado vivo del SimTrade en la tabla trades para que el dashboard lo lea."""
    parts, params = [], []
    if pnl_accumulated is not None:
        parts.append("pnl_accumulated = %s")
        params.append(round(float(pnl_accumulated), 4))
    if be_active is not None:
        parts.append("be_active = %s")
        params.append(bool(be_active))
    if current_sl is not None:
        parts.append("current_sl = %s")
        params.append(str(current_sl))
    if tp1_fill_price is not None:
        parts.append("tp1_fill_price = %s")
        params.append(str(tp1_fill_price))
    if tp2_fill_price is not None:
        parts.append("tp2_fill_price = %s")
        params.append(str(tp2_fill_price))
    if not parts:
        return
    params.append(message_id)
    execute_db_query(f"UPDATE trades SET {', '.join(parts)} WHERE message_id = %s", params)

def update_profit_records(symbol, direction, profit_or_loss,
                           message_id, reply_to_msg_id, close_trade=False):
    try:
        profit_val = float(profit_or_loss.replace('%', ''))
    except ValueError:
        profit_val = 0.0
    profit_entry = (
        f"✅ {symbol} {direction} {profit_or_loss}" if profit_val >= 0
        else f"❌ {symbol} {direction} {profit_or_loss}"
    )
    key = str(reply_to_msg_id if reply_to_msg_id else message_id)
    now = datetime.now(UTC_TZ).replace(microsecond=0)
    for table in VALID_PROFIT_TABLES:
        validated = validate_table_name(table)
        execute_db_query(
            f"""INSERT INTO {validated} (key, value, gain_date, Close)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (key) DO UPDATE
                SET value = EXCLUDED.value,
                    gain_date = EXCLUDED.gain_date,
                    Close = EXCLUDED.Close""",
            (key, profit_entry, now, close_trade)
        )
        getattr(state, table)[key] = profit_entry

def save_sim_track_record(sim: SimTrade, close_reason: str,
                           exit_price: float, final_profit_pct: float,
                           final_profit_usdt: float,
                           balance_before: float, balance_after: float):
    """Guarda el trade cerrado en sim_track_record (historial completo del simulador)."""
    global tp_fill_prices
    fills = tp_fill_prices.get(sim.msg_id, {})
    now   = datetime.now(UTC_TZ).replace(microsecond=0)
    dur   = format_duration(sim.timestamp, now)

    # PnL parciales por TP
    def tp_pct(tp_num):
        p = fills.get(tp_num)
        if p is None:
            return None
        pnl_usdt, _ = sim.calc_pnl(p, sim.qty_total * TP_DIST[tp_num - 1])
        return round((pnl_usdt / USDT_PER_TRADE) * 100, 4)

    execute_db_query(
        """INSERT INTO sim_track_record (
            symbol, direction,
            entry_price, exit_price, stop_loss,
            tp1, tp2, tp3,
            hit_tp1, hit_tp2, hit_tp3,
            tp1_exit_price, tp2_exit_price, tp3_exit_price,
            tp1_profit_pct, tp2_profit_pct, tp3_profit_pct,
            final_profit_pct,
            final_profit_usdt, close_reason,
            balance_before, balance_after, margin_used, leverage,
            duration, opened_at, closed_at
        ) VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
        )""",
        (
            sim.pair, sim.direction,
            sim.entry, exit_price, sim.stop_loss,
            sim.tp1, sim.tp2, sim.tp3,
            sim.tp1_filled, sim.tp2_filled, sim.tp3_filled,
            fills.get(1), fills.get(2), fills.get(3),
            tp_pct(1), tp_pct(2), tp_pct(3),
            round(final_profit_pct, 4),
            round(final_profit_usdt, 4), close_reason,
            round(balance_before, 4), round(balance_after, 4),
            USDT_PER_TRADE, LEVERAGE, dur,
            sim.timestamp, now
        )
    )
    tp_fill_prices.pop(sim.msg_id, None)
    log_message("INFO",
        f"[TrackRecord] {sim.pair} {sim.direction} → {close_reason} "
        f"| P/L={final_profit_pct:+.2f}% ({final_profit_usdt:+.4f} USDT) "
        f"| Balance: {balance_before:.2f} → {balance_after:.2f}",
        context=f"Signal:{sim.msg_id}")

def load_active_sim_trades():
    """Recarga trades abiertos desde DB al reiniciar (reanuda el tracking WS)."""
    rows = execute_db_query(
        "SELECT * FROM trades WHERE Close = FALSE", fetch=True
    )
    if not rows:
        return
    for t in rows:
        try:
            entry     = float(t['entry'])
            notional  = USDT_PER_TRADE * LEVERAGE
            qty_total = notional / entry
            raw_pair  = t['pair'].replace('/', '')  # "BTC/USDT" → "BTCUSDT"

            sim = SimTrade(
                msg_id          = str(t['message_id']),
                pair            = raw_pair,
                formatted_pair  = t['pair'],
                direction       = t['side'],
                entry           = entry,
                tp1             = float(t['tp1']) if t['tp1'] else 0.0,
                tp2             = float(t['tp2']) if t['tp2'] else 0.0,
                tp3             = float(t['tp3']) if t['tp3'] else 0.0,
                stop_loss       = float(t['stop_loss']) if t['stop_loss'] else 0.0,
                qty_total       = qty_total,
                sent_message_id = state.message_id_map.get(str(t['message_id']), 0),
                timestamp       = t['date'] if t['date'] else datetime.now(UTC_TZ),
                tp1_filled      = t['tp1_filled'],
                tp2_filled      = t['tp2_filled'],
                tp3_filled      = t['tp3_filled'],
                pnl_accumulated = float(t['pnl_accumulated']) if t.get('pnl_accumulated') else 0.0,
                be_active       = bool(t.get('be_active', False)),
                current_sl      = float(t['current_sl']) if t.get('current_sl') else 0.0,
            )
            # Si be_active está en DB úsalo; si no, inferir por BREAKEVEN+tp1_filled
            if not sim.be_active and BREAKEVEN and sim.tp1_filled:
                sim.current_sl = sim.entry
                sim.be_active  = True

            sim_trades[str(t['message_id'])] = sim

            # Restaurar tp_fill_prices desde DB para que TP3 calcule % correctos tras reinicio
            mid_str = str(t['message_id'])
            if t.get('tp1_fill_price') and t['tp1_filled']:
                if mid_str not in tp_fill_prices:
                    tp_fill_prices[mid_str] = {}
                tp_fill_prices[mid_str][1] = float(t['tp1_fill_price'])
                log_message("INFO", f"[RESTORE] tp_fill_prices[{mid_str}][1] = {t['tp1_fill_price']}")
            if t.get('tp2_fill_price') and t['tp2_filled']:
                if mid_str not in tp_fill_prices:
                    tp_fill_prices[mid_str] = {}
                tp_fill_prices[mid_str][2] = float(t['tp2_fill_price'])
                log_message("INFO", f"[RESTORE] tp_fill_prices[{mid_str}][2] = {t['tp2_fill_price']}")

            log_message("INFO", f"[RESTORE] {sim.pair} {sim.direction} entry={entry}")
        except Exception as e:
            log_message("ERROR", f"Error restaurando trade {t['message_id']}: {e}")
    log_message("INFO", f"[RESTORE] {len(sim_trades)} trade(s) activos en tracking")

# ── Imagen ───────────────────────────────────────────────────────────────────

async def send_image(inf):
    image_data = {
        'type':     inf["typeEntry"],
        'leverage': inf["leverage"],
        'symbol':   inf["symbol"],
        'entry':    inf["entry"],
        'mark':     inf["mark"],
        'profit':   inf["profit"],
        'profit_usdt': inf.get("profit_usdt"),
        'usdt_per_trade': inf.get("usdt_per_trade", USDT_PER_TRADE),
    }
    headers = {'Content-Type': 'application/json'}
    try:
        response = await asyncio.to_thread(
            requests.post,
            IMAGE_SERVER_URL,
            data=json.dumps(image_data),
            headers=headers,
            timeout=15
        )
        if response.status_code == 200:
            base64_image = response.json()['image'].split(",")[1]
            image_binary = base64.b64decode(base64_image)
            image_path   = Path(f"temp_image_{uuid.uuid4().hex[:8]}.jpg")
            image_path.write_bytes(image_binary)
            return str(image_path)
        else:
            log_message("ERROR", f"Fallo imagen. Status: {response.status_code}")
            return ""
    except Exception as e:
        log_message("ERROR", f"Error servidor imágenes: {e}")
        return ""

# ── Handlers de TP y SL (disparados por Binance WS) ─────────────────────────

async def handle_tp(msg_id: str, sim: SimTrade, tp_num: int, fill_price: float):
    """Procesa un TP fill: calcula PnL, actualiza estado, envía mensaje + imagen."""
    if sim.closing or (tp_num == 1 and sim.tp1_filled) or (tp_num == 2 and sim.tp2_filled) or (tp_num == 3 and sim.tp3_filled):
        return
    if tp_num == 3:
        sim.closing = True
    dist = TP_DIST[tp_num - 1]
    qty  = sim.qty_total * dist
    pnl_usdt, _ = sim.calc_pnl(fill_price, qty)
    realized_pct = (pnl_usdt / USDT_PER_TRADE) * 100
    sim.pnl_accumulated += pnl_usdt
    log_message("INFO",
        f"[TP{tp_num}] {sim.pair} @ {fill_price} → {realized_pct:+.2f}% ({pnl_usdt:+.4f} USDT)")

    # Registrar precio de fill para track record — persiste en DB para sobrevivir reinicios
    if msg_id not in tp_fill_prices:
        tp_fill_prices[msg_id] = {}
    tp_fill_prices[msg_id][tp_num] = fill_price
    if tp_num == 1:
        update_sim_state_in_db(int(msg_id), tp1_fill_price=fill_price)
    elif tp_num == 2:
        update_sim_state_in_db(int(msg_id), tp2_fill_price=fill_price)

    # Actualizar estado del sim
    if tp_num == 1:
        sim.tp1_filled = True
        if BREAKEVEN:
            sim.current_sl = sim.entry
            sim.be_active  = True
            update_sim_state_in_db(int(msg_id), be_active=True, current_sl=sim.entry)
            log_message("INFO", f"BE activado → SL movido a entry={sim.entry}", context=f"Signal:{msg_id}")
    elif tp_num == 2:
        sim.tp2_filled = True
    elif tp_num == 3:
        sim.tp3_filled = True

    # Persistir pnl_accumulated para que el dashboard lo vea en tiempo real
    update_sim_state_in_db(int(msg_id), pnl_accumulated=sim.pnl_accumulated)

    # Formato de P&L
    pnl_str  = f"{realized_pct:+.2f}%"
    duration = format_duration(sim.timestamp, datetime.now(UTC_TZ).replace(microsecond=0))
    is_final = tp_num == 3
    # Mensaje
    if is_final:
        # total_pct derivado del USDT acumulado real — respeta el 40/40/20 correctamente.
        # Nunca sumar los 3 pct individuales: cada uno es "como si toda la posición cerrara",
        # ignorando que el 40% ya cerró en TP1, el 40% en TP2 y solo el 20% queda en TP3.
        total_usdt = sim.pnl_accumulated          # TP1+TP2+TP3 ya acumulados arriba
        total_pct  = (total_usdt / USDT_PER_TRADE) * 100
        total_str  = f"+{total_pct:.2f}%" if total_pct >= 0 else f"{total_pct:.2f}%"
        text = TP_FINAL_TEMPLATE.format(
            pair        = sim.formatted_pair,
            signal_type = sim.direction,
            profit      = total_str,
            duration    = duration,
        )
    else:
        text = TP_RESPONSE_TEMPLATE.format(
            pair        = sim.formatted_pair,
            signal_type = sim.direction,
            target_num  = tp_num,
            profit      = pnl_str,
            duration    = duration,
        )

    filled_target = f"tp{tp_num}"
    recorded_result = total_str if is_final else pnl_str
    update_trade_in_db(int(msg_id), recorded_result, duration, filled_target, is_final)
    update_profit_records(sim.formatted_pair, sim.direction, recorded_result,
                          int(msg_id), int(msg_id), is_final)

    # Imagen
    image_data = {
        "typeEntry":      sim.direction,
        "leverage":       LEVERAGE,
        "symbol":         sim.formatted_pair,
        "entry":          sim.entry,
        "mark":           fill_price,
        "profit":         recorded_result,
        "profit_usdt":    sim.pnl_accumulated if is_final else pnl_usdt,
        "message_id":     msg_id,
        "usdt_per_trade": USDT_PER_TRADE,
    }
    image_path = await send_image(image_data)

    reply_to = sim.sent_message_id or None
    private_result_message = None
    if telegram_client:
        if image_path:
            private_result_message = await telegram_client.send_file(
                DESTINATION_CHANNEL_ID, image_path,
                caption=text, reply_to=reply_to, link_preview=False
            )
            Path(image_path).unlink(missing_ok=True)
        else:
            private_result_message = await telegram_client.send_message(
                DESTINATION_CHANNEL_ID, text,
                reply_to=reply_to, link_preview=False
            )

    if is_final:
        global sim_balance
        balance_before = sim_balance
        # PnL total acumulado en USDT
        total_usdt = sim.pnl_accumulated  # ya incluye TP3 (se sumó arriba)
        sim_balance = sim_balance + total_usdt
        save_sim_track_record(
            sim, close_reason="TP3",
            exit_price=fill_price,
            final_profit_pct=total_pct,   # (pnl_accumulated / USDT_PER_TRADE) * 100
            final_profit_usdt=total_usdt,
            balance_before=balance_before,
            balance_after=sim_balance,
        )
        sim_trades.pop(msg_id, None)
        log_message("INFO",
            f"[CLOSE/TP3] {sim.pair} net={total_pct:+.2f}% | Balance ${balance_before:.2f}→${sim_balance:.2f}")
    else:
        log_message("INFO", f"[TP{tp_num}] {sim.pair} parcial @ {fill_price}")

    save_state()

    # ── ONZA_FUTURES: emitir tp{n} (price = nivel del TP, roi positivo) ──
    tp_price = (sim.tp1, sim.tp2, sim.tp3)[tp_num - 1]
    await asyncio.to_thread(dispatch_onza_signal, sim, f"tp{tp_num}", tp_price, _onza_roi(sim, tp_price))

    # ── CANAL FREE: seguimiento acumulado 40/40/20 y promoción de TP3 ──
    if free_channel_service:
        await free_channel_service.publish_tp(
            sim, tp_num, fill_price, sim.pnl_accumulated,
            USDT_PER_TRADE, duration,
            private_message_id=(
                private_result_message.id if private_result_message else None
            ),
            private_channel_id=DESTINATION_CHANNEL_ID,
        )

    # ── MULTI-BRAND: notificar TP a marcas secundarias ───────────────────────
    if secondary_brands:
        _tp_display_pnl = total_str if is_final else pnl_str
        asyncio.create_task(fanout_tp_result(sim, tp_num, _tp_display_pnl, duration, is_final, image_data))

async def handle_sl(msg_id: str, sim: SimTrade, fill_price: float):
    """Procesa un SL hit: calcula PnL total, envía mensaje + imagen, cierra trade."""
    # Guard anti-doble-cierre: si otro camino (WS/Closing fuente) ya lo está cerrando, salir.
    if sim.closing:
        return
    sim.closing = True

    qty_rem       = sim.qty_remaining
    pnl_usdt, pnl_pct = sim.calc_pnl(fill_price, qty_rem)
    total_pnl_pct = pnl_pct  # pérdida en el tramo restante

    # Si había TPs anteriores acumulados, el net puede ser positivo
    # pnl_accumulated está en USDT → convertir a % sobre margen inicial
    margin_inicial = USDT_PER_TRADE  # $20 de margen
    net_pct = ((sim.pnl_accumulated + pnl_usdt) / margin_inicial) * 100
    net_str = f"+{net_pct:.2f}%" if net_pct >= 0 else f"{net_pct:.2f}%"

    duration = format_duration(sim.timestamp, datetime.now(UTC_TZ).replace(microsecond=0))

    text = SL_FINAL_TEMPLATE.format(
        pair        = sim.formatted_pair,
        signal_type = sim.direction,
        loss        = net_str,
        duration    = duration,
    )

    update_trade_in_db(int(msg_id), net_str, duration, "sl", True)
    update_profit_records(sim.formatted_pair, sim.direction, net_str,
                          int(msg_id), int(msg_id), True)

    image_data = {
        "typeEntry":      sim.direction,
        "leverage":       LEVERAGE,
        "symbol":         sim.formatted_pair,
        "entry":          sim.entry,
        "mark":           fill_price,
        "profit":         net_str,
        "profit_usdt":    sim.pnl_accumulated + pnl_usdt,
        "message_id":     msg_id,
        "usdt_per_trade": USDT_PER_TRADE,
    }
    image_path = await send_image(image_data)

    reply_to = sim.sent_message_id or None
    if telegram_client:
        if image_path:
            await telegram_client.send_file(
                DESTINATION_CHANNEL_ID, image_path,
                caption=text, reply_to=reply_to, link_preview=False
            )
            Path(image_path).unlink(missing_ok=True)
        else:
            await telegram_client.send_message(
                DESTINATION_CHANNEL_ID, text,
                reply_to=reply_to, link_preview=False
            )

    global sim_balance
    balance_before = sim_balance
    sim_balance = sim_balance + (sim.pnl_accumulated + pnl_usdt)
    save_sim_track_record(
        sim, close_reason="SL",
        exit_price=fill_price,
        final_profit_pct=net_pct,
        final_profit_usdt=sim.pnl_accumulated + pnl_usdt,
        balance_before=balance_before,
        balance_after=sim_balance,
    )
    sim_trades.pop(msg_id, None)
    log_message("INFO",
        f"[CLOSE/SL] {sim.pair} {net_str} | Balance ${balance_before:.2f}→${sim_balance:.2f}")
    save_state()

    # ── ONZA_FUTURES: emitir 'sl' (price = fill, roi negativo) ──
    await asyncio.to_thread(dispatch_onza_signal, sim, "sl", fill_price, _onza_roi(sim, fill_price))

    # ── CANAL FREE: cierre de la posición restante, respetando TP previos ──
    if free_channel_service:
        free_close_reason = "BREAKEVEN" if sim.be_active else "SL"
        await free_channel_service.publish_close(
            sim, fill_price, sim.pnl_accumulated + pnl_usdt,
            USDT_PER_TRADE, duration, free_close_reason
        )

    # ── MULTI-BRAND: notificar SL a marcas secundarias ───────────────────────
    if secondary_brands:
        asyncio.create_task(fanout_sl_result(sim, net_str, duration, image_data))

# ── Binance Mark Price WebSocket ─────────────────────────────────────────────

async def handle_forced_close(msg_text: str):
    """
    Cierre forzado por 'Closing LONG/SHORT' del canal fuente.
    Parsea Symbol y Price. Detecta tipo por emoji antes de Closing:
      ⚖️ Closing → Breakeven
      🎯 Closing → Full TP
      Sin emoji  → evalúa PnL
    """
    sym_match = re.search(r"Symbol:\s*([\w]+USDT)", msg_text)
    if not sym_match:
        log_message("WARNING", "[FORCED] Closing sin Symbol — ignorado")
        return
    raw_pair = sym_match.group(1)

    # ── Notificar a todos los webhooks 'standard' para cerrar trades reales ───
    await asyncio.to_thread(dispatch_close_webhooks, raw_pair)

    price_match = re.search(
        r"(?:💰\s*Price|Price)\s*:?\s*([\d\.]+)", msg_text
    )

    sim_entry = None
    for mid, sim in list(sim_trades.items()):
        if sim.pair == raw_pair:
            sim_entry = (mid, sim)
            break

    if not sim_entry:
        log_message("INFO", f"[FORCED] {raw_pair} no está en tracking (ya cerrado)")
        return

    mid, sim = sim_entry

    # Guard anti-doble-cierre: si el WS u otro camino ya lo está cerrando, salir.
    if sim.closing:
        log_message("INFO", f"[FORCED] {raw_pair} ya en cierre — ignorado")
        return
    sim.closing = True

    if price_match:
        price = float(price_match.group(1))
    else:
        price = latest_prices.get(sim.pair) or sim.entry

    # Detectar razón por emoji (con respaldo por texto, por si se pierde el emoji)
    if re.search(r"⚖️\s*Closing|Breakeven\s+exit", msg_text, re.IGNORECASE):
        close_reason = "BREAKEVEN"
    elif re.search(r"🎯\s*Closing|Full\s+Take\s+Profit|Maximum\s+target\s+reached", msg_text, re.IGNORECASE):
        close_reason = "Closed"
    else:
        fl_test, _ = sim.calc_pnl(price, sim.qty_remaining)
        net_test = sim.pnl_accumulated + fl_test
        if net_test > 0:
            close_reason = "Closed"
        elif abs(net_test) < (USDT_PER_TRADE * 0.005):
            close_reason = "BREAKEVEN"
        else:
            close_reason = "SL_FORCED"

    fl_usdt, fl_pct = sim.calc_pnl(price, sim.qty_remaining)
    net_usdt = sim.pnl_accumulated + fl_usdt
    net_pct  = (net_usdt / USDT_PER_TRADE) * 100
    net_str  = f"{net_pct:+.2f}%"
    duration = format_duration(sim.timestamp, datetime.now(UTC_TZ).replace(microsecond=0))

    if close_reason == "BREAKEVEN":
        text = (
            f"#{sim.formatted_pair} {sim.direction}\n"
            f"⚖️ Breakeven — cerrado en entry\n"
            f"💰 Net: {net_str}\n⏳ {duration}"
        )
    elif close_reason == "Closed":
        text = TP_FINAL_TEMPLATE.format(
            pair=sim.formatted_pair, signal_type=sim.direction,
            profit=net_str, duration=duration,
        )
    else:
        text = SL_FINAL_TEMPLATE.format(
            pair=sim.formatted_pair, signal_type=sim.direction,
            loss=net_str, duration=duration,
        )

    update_trade_in_db(int(mid), net_str, duration,
                       "sl" if close_reason == "SL_FORCED" else "tp3", True)
    update_profit_records(sim.formatted_pair, sim.direction, net_str, int(mid), int(mid), True)

    global sim_balance
    balance_before = sim_balance
    sim_balance += net_usdt
    save_sim_track_record(
        sim, close_reason=close_reason,
        exit_price=price, final_profit_pct=net_pct,
        final_profit_usdt=net_usdt,
        balance_before=balance_before, balance_after=sim_balance,
    )

    image_data = {
        "typeEntry":      sim.direction, "leverage": LEVERAGE,
        "symbol":         sim.formatted_pair, "entry": sim.entry,
        "mark":           price, "profit": net_str, "profit_usdt": net_usdt,
        "message_id": mid,
        "usdt_per_trade": USDT_PER_TRADE,
    }
    image_path = await send_image(image_data)
    reply_to = sim.sent_message_id or None
    if telegram_client:
        if image_path:
            await telegram_client.send_file(
                DESTINATION_CHANNEL_ID, image_path,
                caption=text, reply_to=reply_to, link_preview=False
            )
            Path(image_path).unlink(missing_ok=True)
        else:
            await telegram_client.send_message(
                DESTINATION_CHANNEL_ID, text,
                reply_to=reply_to, link_preview=False
            )

    sim_trades.pop(mid, None)
    log_message("INFO",
        f"[FORCED/{close_reason}] {sim.pair} {net_str} | Balance ${balance_before:.2f}->>${sim_balance:.2f}")
    save_state()

    # ── ONZA_FUTURES: emitir 'close' (final_roi estilo FB AI SCANNER) ──
    await asyncio.to_thread(dispatch_onza_close, sim, price)

    # ── CANAL FREE: replicar el cierre real de una señal seleccionada ──
    if free_channel_service:
        await free_channel_service.publish_close(
            sim, price, net_usdt, USDT_PER_TRADE, duration, close_reason
        )

    # ── MULTI-BRAND: notificar cierre forzado a marcas secundarias ───────────
    if secondary_brands:
        asyncio.create_task(fanout_forced_close_result(sim, net_str, duration, close_reason, image_data))


class BinanceMarkPriceWS:
    """
    Conecta al stream global de mark prices de Binance Futures.
    Mismo endpoint que usa el servidor CSF.
    Reconecta automáticamente con backoff.
    """
    WS_URL = "wss://fstream.binance.com/market/ws/!markPrice@arr@1s"

    def __init__(self):
        self._running = False
        self._task: Optional[asyncio.Task] = None

    async def start(self):
        self._running = True
        self._task = asyncio.create_task(self._run())
        log_message("INFO", "[WS] Binance mark price stream iniciando...")

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()

    async def _run(self):
        backoff = 1
        while self._running:
            try:
                async with websockets.connect(
                    self.WS_URL,
                    ping_interval=20,
                    ping_timeout=30,
                    close_timeout=10,
                ) as ws:
                    log_message("INFO", "[WS] ✅ Conectado a Binance mark price stream")
                    backoff = 1
                    async for raw in ws:
                        if not self._running:
                            break
                        await self._on_message(raw)
            except asyncio.CancelledError:
                break
            except Exception as e:
                if self._running:
                    log_message("WARNING", f"[WS] ❌ Desconectado. Reconectando en {backoff}s...")
                    await asyncio.sleep(backoff)
                    backoff = min(backoff * 2, 30)

    async def _on_message(self, raw: str):
        """
        WS: actualiza latest_prices siempre.
        Solo dispara TP1/TP2 si hay trades activos.
        TP3, SL y BE los cierra el canal fuente.
        """
        try:
            data = json.loads(raw)
        except Exception:
            return
        if not isinstance(data, list):
            return

        # Actualizar precios globales SIEMPRE (para /now y handle_forced_close)
        prices = {item["s"]: float(item["p"]) for item in data if "s" in item and "p" in item}
        latest_prices.update(prices)

        if not sim_trades:
            return

        for msg_id, sim in list(sim_trades.items()):
            price = prices.get(sim.pair)
            if price is None:
                continue

            is_long = sim.is_long

            # ── Comprobar SL ─────────────────────────────────────────────────
            sl_hit = (price <= sim.current_sl) if is_long else (price >= sim.current_sl)
            if sl_hit:
                await handle_sl(msg_id, sim, price)
                continue

            # ── Comprobar TPs en orden ────────────────────────────────────────
            if not sim.tp1_filled:
                tp_hit = (price >= sim.tp1) if is_long else (price <= sim.tp1)
                if tp_hit:
                    await handle_tp(msg_id, sim, 1, price)
                    continue

            if sim.tp1_filled and not sim.tp2_filled:
                tp_hit = (price >= sim.tp2) if is_long else (price <= sim.tp2)
                if tp_hit:
                    await handle_tp(msg_id, sim, 2, price)
                    continue

            if sim.tp2_filled and not sim.tp3_filled:
                tp_hit = (price >= sim.tp3) if is_long else (price <= sim.tp3)
                if tp_hit:
                    await handle_tp(msg_id, sim, 3, price)
                    continue

# Instancia global del WS
binance_ws = BinanceMarkPriceWS()

# ════════════════════════════════════════════════════════════════════════════
# WEBHOOKS — registro unificado vía ConfigWebhoock.json
# ────────────────────────────────────────────────────────────────────────────
# Cada destino declara su propio "format":
#   · "standard" → CryptoPilot AI: entrada con secret/symbol/side/entry/
#                  stop_loss/take_profits/leverage; cierre con action="close".
#   · "onza"     → esquema FB AI SCANNER (entry/tp1/tp2/tp3/sl/close).
# Cualquier texto "env:NOMBRE" se resuelve contra una variable de entorno.
# Los secretos de destinos standard no deben escribirse en el JSON.
#
# El cierre standard se envía únicamente cuando llega el mensaje explícito
# "Closing LONG/SHORT" del canal fuente. Los TP/SL detectados por WebSocket no
# generan otro cierre, para evitar duplicar órdenes en los motores.
# ════════════════════════════════════════════════════════════════════════════
def _resolve_cfg_value(value):
    """Resuelve 'env:NOMBRE' contra el entorno; deja cualquier otro valor intacto."""
    if isinstance(value, str) and value.startswith("env:"):
        return os.getenv(value[4:], "")
    return value

def _resolve_cfg_bool(value):
    resolved = _resolve_cfg_value(value)
    if isinstance(resolved, bool):
        return resolved
    return str(resolved).lower() == "true"

def load_webhook_clients():
    """Carga ConfigWebhoock.json y puebla webhook_clients con los clientes activos."""
    global webhook_clients
    webhook_clients = []
    cfg_file = Path("ConfigWebhoock.json")
    if not cfg_file.exists():
        log_message("WARNING", "[WEBHOOKS] ConfigWebhoock.json no encontrado — ningún webhook activo")
        return
    try:
        data = json.loads(cfg_file.read_text(encoding="utf-8"))
        for w in data.get("webhooks", []):
            name = w.get("name", w.get("id", "?"))
            if not _resolve_cfg_bool(w.get("active", False)):
                continue
            url = _resolve_cfg_value(w.get("url", ""))
            if not url:
                log_message("WARNING", f"[WEBHOOKS] '{name}': sin url — omitido")
                continue
            webhook_format = w.get("format", "standard")
            secret = _resolve_cfg_value(w.get("secret", ""))
            api_key = _resolve_cfg_value(w.get("api_key", ""))
            if webhook_format == "standard" and not secret:
                log_message(
                    "ERROR",
                    f"[WEBHOOKS] '{name}': falta el secreto configurado — destino omitido",
                )
                continue
            close_url = _resolve_cfg_value(w.get("close_url", ""))
            if not close_url and "/webhook" in url:
                close_url = url.replace("/webhook", "/webhook/close")
            webhook_clients.append({
                "id":        w.get("id", "?"),
                "name":      name,
                "format":    webhook_format,
                "url":       url,
                "close_url": close_url,
                "secret":    secret,
                "api_key":   api_key,
                "timeframe": _resolve_cfg_value(w.get("timeframe", "15M")) or "15M",
                "message":   w.get("message", ""),
            })
        if webhook_clients:
            names = [c["name"] for c in webhook_clients]
            log_message("INFO", f"[WEBHOOKS] {len(webhook_clients)} cliente(s) activo(s): {names}")
        else:
            log_message("WARNING", "[WEBHOOKS] ConfigWebhoock.json cargado pero sin clientes activos")
    except Exception as e:
        log_message("ERROR", f"[WEBHOOKS] Error cargando ConfigWebhoock.json: {e}")

# ── Formato "standard" (CSF) ──────────────────────────────────────────────────

def _post_standard_entry(client: dict, pair: str, direction: str, entry: float,
                          stop_loss: float, tp_levels: list):
    payload = {
        "secret":       client["secret"],
        "symbol":       pair,
        "side":         "BUY" if direction.lower() == "long" else "SELL",
        "entry":        entry,
        "stop_loss":    stop_loss,
        "take_profits": [float(tp) for tp in tp_levels],
        "leverage":     LEVERAGE,
    }
    try:
        resp = requests.post(client["url"], json=payload, timeout=10)
        if resp.status_code in (200, 201):
            log_message("INFO", f"[{client['name']}] Webhook enviado → {resp.status_code}")
        else:
            log_message("WARNING", f"[{client['name']}] Respondió {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        log_message("ERROR", f"[{client['name']}] Error enviando webhook: {e}")

def _post_standard_close(client: dict, pair: str):
    if not client.get("close_url"):
        return
    payload = {"secret": client["secret"], "symbol": pair, "action": "close"}
    try:
        resp = requests.post(client["close_url"], json=payload, timeout=10)
        if resp.status_code in (200, 201):
            log_message("INFO", f"[{client['name']}] Webhook CLOSE enviado → {pair} → {resp.status_code}")
        else:
            log_message("WARNING", f"[{client['name']}] CLOSE respondió {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        log_message("ERROR", f"[{client['name']}] Error enviando webhook CLOSE: {e}")

def dispatch_entry_webhooks(pair: str, direction: str, entry: float,
                             stop_loss: float, tp_levels: list):
    """Envía la señal de entrada a todos los clientes 'standard' activos."""
    for client in webhook_clients:
        if client["format"] == "standard":
            _post_standard_entry(client, pair, direction, entry, stop_loss, tp_levels)

def dispatch_close_webhooks(pair: str):
    """
    Envía el cierre a todos los clientes 'standard' activos.
    Llamar SIEMPRE que una operación se cierre por completo:
    TP3 final, SL, o cierre forzado por el canal fuente.
    """
    for client in webhook_clients:
        if client["format"] == "standard":
            _post_standard_close(client, pair)

# ── Formato "onza" (FB AI SCANNER) ────────────────────────────────────────────
# Esquema con 6 eventos (entry/tp1/tp2/tp3/sl/close) a una sola URL por cliente.
#   · symbol  → "BTCUSD.P" (estilo ticker TradingView)
#   · signalId→ "{symbol}_{timeframe}_{epoch_ms}" (estable entre reinicios)
#   · roi     → con apalancamiento; SL negativo, TP positivo, close = final_roi

def _onza_symbol(pair: str) -> str:
    """BTCUSDT → BTCUSD.P"""
    base = pair[:-4] if pair.endswith("USDT") else pair
    return f"{base}USD.P"

def _onza_signal_id(client: dict, sim) -> str:
    """{symbol}_{tf}_{epoch_ms}; usa el timestamp de apertura → estable tras reinicios."""
    ms = int(sim.timestamp.timestamp() * 1000)
    return f"{_onza_symbol(sim.pair)}_{client['timeframe']}_{ms}"

def _onza_roi(sim, price: float) -> float:
    """ROI direccional con apalancamiento (+ a favor, - en contra)."""
    if sim.is_long:
        move = (price - sim.entry) / sim.entry
    else:
        move = (sim.entry - price) / sim.entry
    return round(move * 100 * LEVERAGE, 2)

def _post_onza_event(client: dict, payload: dict):
    try:
        resp = requests.post(client["url"], json=payload, timeout=10)
        if resp.status_code in (200, 201):
            log_message("INFO", f"[{client['name']}] {payload.get('typeSignal')} {payload.get('symbol')} → {resp.status_code}")
        else:
            log_message("WARNING", f"[{client['name']}] {payload.get('typeSignal')} respondió {resp.status_code}: {resp.text[:150]}")
    except Exception as e:
        log_message("ERROR", f"[{client['name']}] Error enviando {payload.get('typeSignal')}: {e}")

def _skip_onza_event_if_blacklisted(sim, event_name: str) -> bool:
    if not is_onza_free_blacklisted(sim.pair):
        return False
    symbol = normalize_distribution_symbol(sim.pair)
    log_message(
        "INFO",
        f"[ONZA/FREE BLACKLIST] {symbol}: evento {event_name} omitido para Onza",
        context=f"Signal:{sim.msg_id}",
    )
    return True


def dispatch_onza_entry(sim):
    """Envía entry a Onza salvo que el símbolo esté excluido para Onza/Free."""
    if _skip_onza_event_if_blacklisted(sim, "entry"):
        return
    take_profits = []
    for tp in (sim.tp1, sim.tp2, sim.tp3):
        if tp and tp > 0:
            take_profits.append({"price": tp, "roi": _onza_roi(sim, tp)})
    for client in webhook_clients:
        if client["format"] != "onza":
            continue
        payload = {
            "signalId":    _onza_signal_id(client, sim),
            "typeSignal":  "entry",
            "symbol":      _onza_symbol(sim.pair),
            "direction":   "LONG" if sim.is_long else "SHORT",
            "entry":       sim.entry,
            "leverage":    LEVERAGE,
            "stopLoss":    {"price": sim.stop_loss, "roi": _onza_roi(sim, sim.stop_loss)},
            "takeProfits": take_profits,
            "timeframe":   client["timeframe"],
            "message":     client["message"],
            "apiKey":      client["api_key"],
        }
        _post_onza_event(client, payload)

def dispatch_onza_signal(sim, type_signal: str, price: float, roi: float):
    """Envía TP/SL/close a Onza salvo que el símbolo esté excluido para Onza/Free."""
    if _skip_onza_event_if_blacklisted(sim, type_signal):
        return
    for client in webhook_clients:
        if client["format"] != "onza":
            continue
        payload = {
            "signalId":   _onza_signal_id(client, sim),
            "typeSignal": type_signal,
            "symbol":     _onza_symbol(sim.pair),
            "direction":  "LONG" if sim.is_long else "SHORT",
            "entry":      sim.entry,
            "price":      price,
            "roi":        round(roi, 2),
            "leverage":   LEVERAGE,
            "timeframe":  client["timeframe"],
            "message":    client["message"],
            "apiKey":     client["api_key"],
        }
        _post_onza_event(client, payload)

def dispatch_onza_close(sim, price: float):
    """typeSignal='close' con final_roi = max(last_tp_roi, floating) si hubo TP."""
    floating = _onza_roi(sim, price)
    if   sim.tp3_filled: last_tp = _onza_roi(sim, sim.tp3)
    elif sim.tp2_filled: last_tp = _onza_roi(sim, sim.tp2)
    elif sim.tp1_filled: last_tp = _onza_roi(sim, sim.tp1)
    else:                last_tp = 0.0
    final_roi = max(last_tp, floating) if last_tp > 0 else floating
    dispatch_onza_signal(sim, "close", price, final_roi)


# ── Multi-Brand: carga de configuración y funciones de fan-out ───────────────

def load_secondary_brands():
    """Carga marcas secundarias desde brands.json. Un solo bot token para todos los canales."""
    global secondary_brands, _brands_bot_token
    brands_file = Path("brands.json")
    if not brands_file.exists():
        log_message("INFO", "[BRAND] brands.json no encontrado — solo marca principal activa")
        return
    try:
        data = json.loads(brands_file.read_text(encoding="utf-8"))
        token_env = data.get("bot_token_env", "BRANDS_BOT_TOKEN")
        _brands_bot_token = os.getenv(token_env, "")
        if not _brands_bot_token:
            log_message("WARNING",
                f"[BRAND] {token_env} no configurado en .env — marcas secundarias inactivas")
            return
        for b in data.get("brands", []):
            if not b.get("active", True):
                continue
            ch_id = os.getenv(b.get("channel_env", ""))
            if not ch_id:
                log_message("WARNING",
                    f"[BRAND] '{b.get('name')}': channel_env no configurado en .env — omitida")
                continue
            secondary_brands.append(SecondaryBrand(
                id=b["id"],
                name=b["name"],
                destination_channel=int(ch_id),
                template=b.get("template", "default"),
            ))
        log_message("INFO",
            f"[BRAND] {len(secondary_brands)} marca(s) secundaria(s): "
            f"{[b.name for b in secondary_brands]}")
    except Exception as e:
        log_message("ERROR", f"[BRAND] Error cargando brands.json: {e}")


def _brand_format_signal(brand: SecondaryBrand, formatted_pair: str, direction: str,
                          entry_price: str, tp_levels: list, stop_loss: str) -> str:
    signal_emoji    = "🟢" if direction == "Long" else "🔴"
    direction_upper = direction.upper()
    tp1 = tp_levels[0] if len(tp_levels) > 0 else "—"
    tp2 = tp_levels[1] if len(tp_levels) > 1 else "—"
    tp3 = tp_levels[2] if len(tp_levels) > 2 else "—"
    sl  = stop_loss if stop_loss else "—"
    if brand.template == "premium_academy":
        return PREMIUM_ACADEMY_TRADE_TEMPLATE.format(
            pair=formatted_pair, direction=direction, signal_emoji=signal_emoji,
            leverage=LEVERAGE, entry_price=entry_price,
            tp1=tp1, tp2=tp2, tp3=tp3, stop_loss=sl,
        )
    if brand.template == "crypto_rise":
        return CRYPTO_RISE_TRADE_TEMPLATE.format(
            pair=formatted_pair, direction_upper=direction_upper, signal_emoji=signal_emoji,
            leverage=LEVERAGE, entry_price=entry_price,
            tp1=tp1, tp2=tp2, tp3=tp3, stop_loss=sl,
        )
    return ""


def _brand_format_tp(brand: SecondaryBrand, sim: SimTrade,
                     tp_num: int, pnl_str: str, duration: str, is_final: bool) -> str:
    if brand.template == "premium_academy":
        if is_final:
            return PREMIUM_ACADEMY_TP_FINAL_TEMPLATE.format(
                pair=sim.formatted_pair, direction=sim.direction,
                profit=pnl_str, duration=duration,
            )
        return PREMIUM_ACADEMY_TP_TEMPLATE.format(
            pair=sim.formatted_pair, direction=sim.direction,
            tp_num=tp_num, profit=pnl_str, duration=duration,
        )
    if brand.template == "crypto_rise":
        if is_final:
            return CRYPTO_RISE_TP_FINAL_TEMPLATE.format(
                pair=sim.formatted_pair, direction=sim.direction,
                profit=pnl_str, duration=duration,
            )
        return CRYPTO_RISE_TP_TEMPLATE.format(
            pair=sim.formatted_pair, direction=sim.direction,
            tp_num=tp_num, profit=pnl_str, duration=duration,
        )
    return ""


def _brand_format_sl(brand: SecondaryBrand, sim: SimTrade,
                     net_str: str, duration: str) -> str:
    if brand.template == "premium_academy":
        return PREMIUM_ACADEMY_SL_TEMPLATE.format(
            pair=sim.formatted_pair, direction=sim.direction,
            loss=net_str, duration=duration,
        )
    if brand.template == "crypto_rise":
        return CRYPTO_RISE_SL_TEMPLATE.format(
            pair=sim.formatted_pair, direction=sim.direction,
            loss=net_str, duration=duration,
        )
    return ""


def _brand_format_forced_close(brand: SecondaryBrand, sim: SimTrade,
                                net_str: str, duration: str, close_reason: str) -> str:
    if close_reason == "BREAKEVEN":
        if brand.template == "premium_academy":
            return PREMIUM_ACADEMY_BE_TEMPLATE.format(
                pair=sim.formatted_pair, direction=sim.direction,
                profit=net_str, duration=duration,
            )
        if brand.template == "crypto_rise":
            return CRYPTO_RISE_BE_TEMPLATE.format(
                pair=sim.formatted_pair, direction=sim.direction,
                profit=net_str, duration=duration,
            )
    if close_reason == "Closed":
        return _brand_format_tp(brand, sim, 3, net_str, duration, is_final=True)
    return _brand_format_sl(brand, sim, net_str, duration)


async def fanout_signal(src_msg_id: str, formatted_pair: str, direction: str,
                        entry_price: str, tp_levels: list, stop_loss: str):
    """Envía la nueva señal a todos los canales de marcas secundarias usando el bot compartido."""
    if not brands_bot_client:
        return
    for brand in secondary_brands:
        try:
            text = _brand_format_signal(brand, formatted_pair, direction,
                                        entry_price, tp_levels, stop_loss)
            if text:
                sent = await brands_bot_client.send_message(
                    brand.destination_channel, text, link_preview=False
                )
                # Guardar msg_id para usar como reply_to en TP/SL posteriores
                _brand_reply_ids.setdefault(src_msg_id, {})[brand.id] = sent.id
                log_message("INFO", f"[BRAND] Señal → {brand.name} ({formatted_pair})")
        except Exception as e:
            log_message("ERROR", f"[BRAND] Error enviando señal a {brand.name}: {e}")


async def fanout_tp_result(sim: SimTrade, tp_num: int, pnl_str: str,
                           duration: str, is_final: bool, image_data: dict):
    """Envía el resultado de TP + imagen a todos los canales de marcas secundarias."""
    if not brands_bot_client:
        return
    image_path = await send_image(image_data)
    reply_map  = _brand_reply_ids.get(sim.msg_id, {})
    for brand in secondary_brands:
        try:
            text = _brand_format_tp(brand, sim, tp_num, pnl_str, duration, is_final)
            if not text:
                continue
            reply_to = reply_map.get(brand.id)
            if image_path:
                await brands_bot_client.send_file(
                    brand.destination_channel, image_path,
                    caption=text, reply_to=reply_to, link_preview=False
                )
            else:
                await brands_bot_client.send_message(
                    brand.destination_channel, text,
                    reply_to=reply_to, link_preview=False
                )
            log_message("INFO", f"[BRAND] TP{tp_num} → {brand.name} ({sim.formatted_pair})")
        except Exception as e:
            log_message("ERROR", f"[BRAND] Error enviando TP{tp_num} a {brand.name}: {e}")
    if image_path:
        Path(image_path).unlink(missing_ok=True)
    if is_final:
        _brand_reply_ids.pop(sim.msg_id, None)


async def fanout_sl_result(sim: SimTrade, net_str: str, duration: str, image_data: dict):
    """Envía el resultado de SL + imagen a todos los canales de marcas secundarias."""
    if not brands_bot_client:
        return
    image_path = await send_image(image_data)
    reply_map  = _brand_reply_ids.get(sim.msg_id, {})
    for brand in secondary_brands:
        try:
            text = _brand_format_sl(brand, sim, net_str, duration)
            if not text:
                continue
            reply_to = reply_map.get(brand.id)
            if image_path:
                await brands_bot_client.send_file(
                    brand.destination_channel, image_path,
                    caption=text, reply_to=reply_to, link_preview=False
                )
            else:
                await brands_bot_client.send_message(
                    brand.destination_channel, text,
                    reply_to=reply_to, link_preview=False
                )
            log_message("INFO", f"[BRAND] SL → {brand.name} ({sim.formatted_pair})")
        except Exception as e:
            log_message("ERROR", f"[BRAND] Error enviando SL a {brand.name}: {e}")
    if image_path:
        Path(image_path).unlink(missing_ok=True)
    _brand_reply_ids.pop(sim.msg_id, None)


async def fanout_forced_close_result(sim: SimTrade, net_str: str, duration: str,
                                     close_reason: str, image_data: dict):
    """Envía el resultado de cierre forzado + imagen a todos los canales de marcas secundarias."""
    if not brands_bot_client:
        return
    image_path = await send_image(image_data)
    reply_map  = _brand_reply_ids.get(sim.msg_id, {})
    for brand in secondary_brands:
        try:
            text = _brand_format_forced_close(brand, sim, net_str, duration, close_reason)
            if not text:
                continue
            reply_to = reply_map.get(brand.id)
            if image_path:
                await brands_bot_client.send_file(
                    brand.destination_channel, image_path,
                    caption=text, reply_to=reply_to, link_preview=False
                )
            else:
                await brands_bot_client.send_message(
                    brand.destination_channel, text,
                    reply_to=reply_to, link_preview=False
                )
            log_message("INFO",
                f"[BRAND] Cierre ({close_reason}) → {brand.name} ({sim.formatted_pair})")
        except Exception as e:
            log_message("ERROR", f"[BRAND] Error enviando cierre a {brand.name}: {e}")
    if image_path:
        Path(image_path).unlink(missing_ok=True)
    _brand_reply_ids.pop(sim.msg_id, None)


# ── Parser de nuevas señales (sin cambios respecto al original) ───────────────

def normalize_digits_and_punctuation(text):
    normalized = ""
    for char in text:
        if char.isdigit():
            try:
                normalized += str(unicodedata.digit(char))
            except (ValueError, TypeError):
                normalized += char
        elif unicodedata.category(char) == "Po":
            if char in ("．", "｡", "。", "﹒", "｡", "․", "‧", "ㆍ", "·"):
                normalized += "."
            elif char in ("，", "､", "﹐", "‚", "،", "､"):
                normalized += ","
            else:
                normalized += char
        else:
            normalized += char
    return normalized

def format_message(text, message_id=None):
    log_message("DEBUG", f"Texto recibido: '{text}'", context=f"Signal:{message_id}", debug_only=True)
    direction_match = re.search(
        r"Opening\s+(LONG|SHORT)",
        text, re.IGNORECASE
    )
    if not direction_match:
        log_message("INFO", "Ignorado: no contiene 'Opening LONG/SHORT'", context=f"Signal:{message_id}")
        return None
    direction    = direction_match.group(1).capitalize()
    signal_emoji = "🟢" if direction == "Long" else "🔵"

    pair_match = re.search(r"Symbol:\s*([\w]+USDT)", text)
    if not pair_match:
        log_message("ERROR", "No se encontró Symbol", context=f"Signal:{message_id}")
        return None
    pair           = pair_match.group(1)
    formatted_pair = f"{pair[:-4]}/{pair[-4:]}"

    # Entry: acepta con o sin emojis: "💰 Price: X", "➡️ Entry: X", "Price: X", "Entry: X"
    entry_match = re.search(
        r"(?:💰\s*|➡️\s*)?(?:Price|Entry)(?:\s*around)?\s*:?\s*([\d\.]+)", text
    )
    if not entry_match:
        log_message("ERROR", "No se encontró Entry Price", context=f"Signal:{message_id}")
        return None
    entry_price = entry_match.group(1)

    tp_levels = []
    for i in range(1, 4):
        tp_val = None
        for pat in [
            rf"TP{i}\s*:\s*([\d\.]+)",
            rf"TP{i}\s*~\s*([\d\.]+)",
            rf"TP{i}\s*-\s*([\d\.]+)",
            rf"TP{i}[:\s~\-]+([\d\.]+)",
        ]:
            m = re.search(pat, text)
            if m:
                tp_val = m.group(1)
                break
        if tp_val:
            tp_levels.append(tp_val)
    if len(tp_levels) != 3:
        log_message("ERROR", f"Se esperaban 3 TPs, se encontraron {len(tp_levels)}", context=f"Signal:{message_id}")
        return None

    # SL: acepta "🛑 SL: X", "🛑 Stop Loss: X", "SL: X"
    sl_match = re.search(
        r"(?:🛑\s*(?:SL|Stop\s*Loss)|Stop\s*Loss\s*:|SL\s*:)\s*([\d\.]+)", text
    )
    stop_loss = sl_match.group(1) if sl_match else None

    signal_id = f"{pair}_{direction}_{datetime.now(UTC_TZ).strftime('%d_%m_%Y_%H_%M')}"
    timestamp = datetime.now(UTC_TZ)
    tp_lines  = "\n".join(
        f"\U0001F3AF **Take Profit #{i+1}: {tp}**"
        for i, tp in enumerate(tp_levels)
    )
    formatted = NEW_TRADE_TEMPLATE.format(
        pair=formatted_pair, direction=direction,
        signal_emoji=signal_emoji, leverage=LEVERAGE, entry_price=entry_price,
        tp_lines=tp_lines, stop_loss=stop_loss if stop_loss else "null"
    )
    return formatted, tp_levels, direction, stop_loss, signal_id, pair, formatted_pair, timestamp, entry_price

def validate_signal(direction, entry_price, tp_levels, stop_loss, message_id=None):
    """Exige precios positivos y finitos, tres TPs ordenados y un SL protector."""
    context = f"Signal:{message_id}" if message_id is not None else ""
    if direction.lower() not in ("long", "short"):
        return False, "Dirección inválida"
    if len(tp_levels) != 3 or stop_loss is None or str(stop_loss).strip() == "":
        return False, "Se requieren tres TPs y un Stop Loss"
    try:
        entry_f = float(entry_price)
        tps = [float(tp) for tp in tp_levels]
        sl_f = float(stop_loss)
    except (TypeError, ValueError):
        return False, "Precio no numérico"
    if any(not math.isfinite(x) or x <= 0 for x in [entry_f, *tps, sl_f]):
        return False, "Los precios deben ser positivos y finitos"
    is_long = direction.lower() == "long"
    valid_order = (sl_f < entry_f < tps[0] < tps[1] < tps[2]) if is_long else (tps[2] < tps[1] < tps[0] < entry_f < sl_f)
    if not valid_order:
        reason = "TPs o SL no ordenados según la dirección"
        log_message("WARNING", f"Señal RECHAZADA: {reason}", context=context)
        return False, reason
    return True, ""

# ── Handler de mensajes Telegram (solo nuevas señales) ───────────────────────

def source_message_key(event) -> int:
    """Reserva IDs negativos para el segundo canal y evita colisiones entre chats."""
    def raw_channel_id(value):
        value = abs(int(value))
        return value - 10**12 if value >= 10**12 else value

    peer = getattr(event.message, "peer_id", None)
    chat_id = getattr(peer, "channel_id", None) or event.chat_id
    is_second_source = raw_channel_id(chat_id) == raw_channel_id(SOURCE_CHANNEL_ID_2)
    source_id = int(event.message.id)
    return -source_id if is_second_source else source_id

async def message_handler(event, client):
    msg = event.message
    if not msg.text:
        return
    if msg.grouped_id is not None:
        return

    # ── Detectar cierre forzado desde canal fuente ──────────────────────────
    if re.search(r"Closing\s+(?:LONG|SHORT)", msg.text, re.IGNORECASE):
        sym_m = re.search(r"Symbol:\s*([\w]+USDT)", msg.text)
        sym_log = sym_m.group(1) if sym_m else "?"
        # El cierre por TP3 (🎯 Full Take Profit) lo maneja el WebSocket.
        # Procesarlo aquí duplicaría la señal → IGNORAR este tipo de Closing.
        if re.search(r"🎯\s*Closing|Full\s+Take\s+Profit|Maximum\s+target\s+reached",
                     msg.text, re.IGNORECASE):
            log_message("INFO", f"[FORCED] Full TP de {sym_log} ignorado — el WS cierra el TP3")
            return
        # Cualquier otro Closing (⚖️ Breakeven exit, etc.) sí se ejecuta.
        log_message("INFO", f"[FORCED] Closing {sym_log}")
        await handle_forced_close(msg.text)
        return

    # ── Ignorar otras actualizaciones del canal fuente ──────────────────────
    update_keywords = [
        "Partial Close", "Full Take Profit", "Stop Loss hit",
        "cancelled", "target achieved before", "all entry targets"
    ]
    if any(kw.lower() in msg.text.lower() for kw in update_keywords):
        return  # actualización ignorada, WS la maneja

    signal_key = source_message_key(event)
    context = f"Signal:{event.chat_id}:{msg.id}"
    log_message("INFO", f"Nueva señal recibida: msg_id={msg.id}", context=context)

    try:
        result = format_message(msg.text, signal_key)
        if not result:
            return
        formatted_text, tp_levels, direction, stop_loss, signal_id, \
            pair, formatted_pair, timestamp, entry_price = result

        # ── 1) VALIDAR coherencia dirección vs TPs/SL ────────────────────────
        valid, reason = validate_signal(direction, entry_price, tp_levels, stop_loss, signal_key)
        if not valid:
            return

        entry_f = float(entry_price)
        if str(signal_key) in sim_trades or execute_db_query(
            "SELECT message_id FROM trades WHERE message_id = %s",
            (signal_key,), fetchone=True
        ):
            log_message("INFO", "Señal duplicada ignorada", context=context)
            return

        # ── 2) WEBHOOKS (formato estándar, ConfigWebhoock.json) — PRIMERO ────
        #    El trade real se ejecuta aquí; cada segundo cuenta.
        await asyncio.to_thread(
            dispatch_entry_webhooks,
            pair, direction, entry_f,
            float(stop_loss) if stop_loss else 0.0,
            tp_levels
        )

        # ── 3) Cancelar SimTrade anterior del mismo par (si existe) ──────────
        for mid in list(sim_trades.keys()):
            if sim_trades[mid].pair == pair:
                old = sim_trades.pop(mid)
                old.closing = True
                log_message("INFO",
                    f"[CANCEL] SimTrade {pair} (msg_id={mid}) reemplazado por nueva señal",
                    context=context)
                execute_db_query(
                    "UPDATE trades SET close = TRUE WHERE message_id = %s",
                    (int(mid),)
                )
                break

        # ── 4) Enviar mensaje al canal destino ───────────────────────────────
        sent_msg = await client.send_message(
            DESTINATION_CHANNEL_ID, formatted_text, link_preview=False
        )
        log_message("INFO", f"Señal enviada al canal: {formatted_pair}", context=context)

        # ── 4.5) FANOUT: enviar señal a marcas secundarias ───────────────────
        if secondary_brands:
            asyncio.create_task(fanout_signal(
                str(signal_key), formatted_pair, direction, entry_price, tp_levels, stop_loss
            ))

        # ── 5) Crear SimTrade e iniciar tracking WS ──────────────────────────
        try:
            notional   = USDT_PER_TRADE * LEVERAGE
            qty_total  = notional / entry_f
            sim = SimTrade(
                msg_id          = str(signal_key),
                pair            = pair,          # "BTCUSDT"
                formatted_pair  = formatted_pair,# "BTC/USDT"
                direction       = direction,
                entry           = entry_f,
                tp1             = float(tp_levels[0]),
                tp2             = float(tp_levels[1]),
                tp3             = float(tp_levels[2]),
                stop_loss       = float(stop_loss) if stop_loss else 0.0,
                qty_total       = qty_total,
                sent_message_id = sent_msg.id,
                timestamp       = timestamp,
            )
            sim_trades[str(signal_key)] = sim
            log_message("INFO",
                f"[TRACK] {pair} {direction} entry={entry_f} TP1={sim.tp1} TP2={sim.tp2} TP3={sim.tp3} SL={sim.stop_loss}")
            # Persistir antes de ceder el control al WS o enviar eventos externos.
            await _persist_signal(
                signal_key, sent_msg.id, formatted_pair, direction,
                entry_price, tp_levels, stop_loss, timestamp, pair, signal_id
            )
            # ── ONZA_FUTURES: emitir 'entry' (aislado, no afecta al webhook CSF) ──
            await asyncio.to_thread(dispatch_onza_entry, sim)
            # Selección previa al resultado: máximo diario configurable (2 o 3).
            if free_channel_service:
                await free_channel_service.maybe_publish_signal(sim)
        except Exception as e:
            log_message("ERROR", f"Error creando SimTrade: {e}", context=context)
            return

    except Exception as e:
        log_message("ERROR", f"Error procesando señal: {e}", context=context)


async def _persist_signal(msg_id, sent_msg_id, formatted_pair, direction,
                          entry_price, tp_levels, stop_loss, timestamp, pair, signal_id):
    """Persiste la señal en DB sin bloquear el handler principal."""
    try:
        save_trade_to_db(
            message_id = msg_id,
            pair       = formatted_pair,
            leverage   = LEVERAGE,
            entry      = entry_price,
            side       = direction,
            tp1        = tp_levels[0] if tp_levels else None,
            tp2        = tp_levels[1] if len(tp_levels) > 1 else None,
            tp3        = tp_levels[2] if len(tp_levels) > 2 else None,
            stop_loss  = stop_loss,
            date       = timestamp,
        )
        state.message_id_map[str(msg_id)] = sent_msg_id
        state.signal_targets_map[str(msg_id)] = {
            "targets":   tp_levels,
            "direction": direction,
            "stop_loss": stop_loss,
            "signal_id": signal_id,
            "timestamp": normalize_timestamp(timestamp),
            "pair":      pair,
        }
        state.signal_targets_map = {
            k: v for k, v in state.signal_targets_map.items()
            if not (v.get("pair") == pair and k != str(msg_id))
        }
        save_state()
    except Exception as e:
        log_message("ERROR", f"[PERSIST] Error guardando señal en DB: {e}")

# ── Handler de comandos ──────────────────────────────────────────────────────

async def send_long_message(client, chat_id, text, max_length=4096):
    if len(text) <= max_length:
        await client.send_message(chat_id, text, link_preview=False)
        return
    lines   = text.split('\n')
    parts   = []
    current = ""
    for line in lines:
        if len(current) + len(line) + 1 <= max_length:
            current += line + '\n'
        else:
            parts.append(current)
            current = line + '\n'
    if current:
        parts.append(current)
    for part in parts:
        await client.send_message(chat_id, part, link_preview=False)

async def command_handler(event, client):
    command = event.message.text.strip().lower()
    now     = datetime.now(UTC_TZ).replace(microsecond=0)
    if command == "/d":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_report(now, "daily"))
    elif command == "/w":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_report(now, "weekly"))
    elif command == "/m":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_report(now, "monthly"))
    elif command == "/dn":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_report(now, "daily", normalize=True))
    elif command == "/wn":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_report(now, "weekly", normalize=True))
    elif command == "/open":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_open_trades())
    elif command == "/sim":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_sim_status())
    elif command == "/now":
        if sim_trades and not latest_prices:
            await send_long_message(client, DESTINATION_CHANNEL_ID,
                "⏳ WS aún sin precios, espera unos segundos e intenta de nuevo.")
        else:
            await send_long_message(client, DESTINATION_CHANNEL_ID, format_now_report())
    elif command == "/stats":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_sim_stats())
    elif command == "/balance":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_sim_balance())
    elif command == "/history":
        await send_long_message(client, DESTINATION_CHANNEL_ID, format_sim_history(limit=20))
    elif command == "/commands":
        cmds = (
            "📋 **Available Commands** 📋\n\n"
            "/D       - Reporte diario\n"
            "/W       - Reporte semanal\n"
            "/M       - Reporte mensual\n"
            "/DN      - Reporte diario normalizado\n"
            "/WN      - Reporte semanal normalizado\n"
            "/Open    - Trades abiertos\n"
            "/Now     - PnL flotante en tiempo real\n"
            "/Sim     - Estado del simulador WS\n"
            "/Stats   - Estadísticas del simulador\n"
            "/Balance - Balance actual de la cuenta simulada\n"
            "/History - Últimos 20 trades del historial\n"
            "/Commands - Esta lista"
        )
        await send_long_message(client, DESTINATION_CHANNEL_ID, cmds)

async def brand_command_handler(event, brand: SecondaryBrand):
    """Handler de comandos para canales de marcas secundarias (responde al canal correcto)."""
    command = event.message.text.strip().lower()
    now     = datetime.now(UTC_TZ).replace(microsecond=0)
    ch      = brand.destination_channel
    if command == "/d":
        await send_long_message(brands_bot_client, ch, format_report(now, "daily"))
    elif command == "/w":
        await send_long_message(brands_bot_client, ch, format_report(now, "weekly"))
    elif command == "/m":
        await send_long_message(brands_bot_client, ch, format_report(now, "monthly"))
    elif command == "/dn":
        await send_long_message(brands_bot_client, ch, format_report(now, "daily", normalize=True))
    elif command == "/wn":
        await send_long_message(brands_bot_client, ch, format_report(now, "weekly", normalize=True))
    elif command == "/open":
        await send_long_message(brands_bot_client, ch, format_open_trades())
    elif command == "/sim":
        await send_long_message(brands_bot_client, ch, format_sim_status())
    elif command == "/now":
        if sim_trades and not latest_prices:
            await send_long_message(brands_bot_client, ch,
                "⏳ WS aún sin precios, espera unos segundos e intenta de nuevo.")
        else:
            await send_long_message(brands_bot_client, ch, format_now_report())
    elif command == "/stats":
        await send_long_message(brands_bot_client, ch, format_sim_stats())
    elif command == "/balance":
        await send_long_message(brands_bot_client, ch, format_sim_balance())
    elif command == "/history":
        await send_long_message(brands_bot_client, ch, format_sim_history(limit=20))
    elif command == "/commands":
        cmds = (
            "📋 **Available Commands** 📋\n\n"
            "/D       - Reporte diario\n"
            "/W       - Reporte semanal\n"
            "/M       - Reporte mensual\n"
            "/DN      - Reporte diario normalizado\n"
            "/WN      - Reporte semanal normalizado\n"
            "/Open    - Trades abiertos\n"
            "/Now     - PnL flotante en tiempo real\n"
            "/Sim     - Estado del simulador WS\n"
            "/Stats   - Estadísticas del simulador\n"
            "/Balance - Balance actual de la cuenta simulada\n"
            "/History - Últimos 20 trades del historial\n"
            "/Commands - Esta lista"
        )
        await send_long_message(brands_bot_client, ch, cmds)

# ── Reportes ─────────────────────────────────────────────────────────────────

def format_report(now, report_type, normalize=False):
    now = now.replace(microsecond=0)
    if report_type == "daily":
        title      = f"Daily Report {now.strftime('%d/%m/%Y')}"
        start_date = now.replace(hour=0, minute=0, second=0)
        table      = "daily_profits"
    elif report_type == "weekly":
        start_date = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0)
        title      = f"Weekly Report {start_date.strftime('%d/%m/%Y')} - {now.strftime('%d/%m/%Y')}"
        table      = "weekly_profits"
    else:
        start_date = now.replace(day=1, hour=0, minute=0, second=0)
        title      = f"Monthly Report {start_date.strftime('%d/%m/%Y')} - {now.strftime('%d/%m/%Y')}"
        table      = "monthly_profits"
    if normalize:
        title += " (Normalized)"

    validated    = validate_table_name(table)
    report       = f"♻️ {title} ♻️\n\n"
    total_profit = 0.0
    won = lost    = 0
    trades = execute_db_query(
        f"SELECT key, value, gain_date FROM {validated} "
        f"WHERE gain_date >= %s AND gain_date <= %s AND Close = TRUE ORDER BY gain_date",
        (start_date, now), fetch=True
    )
    if trades:
        for t in trades:
            try:
                pv = float(t['value'].split()[-1].replace('%', ''))
                if normalize:
                    pv /= LEVERAGE
                    report += f"{'✅' if pv >= 0 else '❌'} {' '.join(t['value'].split()[:-1])} {pv:+.2f}%\n"
                else:
                    report += f"{t['value']}\n"
                total_profit += pv
                if pv >= 0:
                    won += 1
                else:
                    lost += 1
            except ValueError:
                pass
    total  = won + lost
    acc    = (won / total * 100) if total > 0 else 0.0
    report += f"\nTotal {report_type.capitalize()} Profit: {total_profit:+.2f}%\n"
    report += f"Won: {won} | Lost: {lost} | Accuracy: {acc:.2f}%"
    return report

def format_open_trades():
    now    = datetime.now(UTC_TZ).replace(microsecond=0)
    report = f"♻️ Open Trades {now.strftime('%d/%m/%Y %H:%M')} ♻️\n\n"
    trades = execute_db_query(
        "SELECT pair, side FROM trades WHERE Close = FALSE ORDER BY date", fetch=True
    )
    if not trades:
        report += "No open trades.\n"
    else:
        for t in trades:
            emoji   = "🟢" if t['side'].lower() == "long" else "🔵"
            report += f"{emoji} {t['pair']} {t['side']}\n"
    report += f"\nTotal: {len(trades) if trades else 0}"
    return report

def format_sim_status():
    """Muestra el estado actual del simulador WS."""
    if not sim_trades:
        return "🤖 **Simulador** — Sin trades activos en tracking."
    lines = ["🤖 **Simulador WS activo**\n"]
    for mid, sim in sim_trades.items():
        be_str = " | BE activo" if sim.be_active else ""
        tps_ok = f"TP1={'✅' if sim.tp1_filled else '⬜'} TP2={'✅' if sim.tp2_filled else '⬜'} TP3={'⬜'}"
        lines.append(
            f"• {sim.pair} {sim.direction} entry={sim.entry}{be_str}\n"
            f"  {tps_ok} SL={sim.current_sl:.5f}\n"
            f"  PnL acum: {sim.pnl_accumulated:.4f} USDT"
        )
    return "\n".join(lines)

def format_sim_balance() -> str:
    """Balance real de la simulación — muestra si la estrategia está funcionando."""
    pnl_total = sim_balance - ACCOUNT_BALANCE
    pnl_pct   = (pnl_total / ACCOUNT_BALANCE) * 100
    emoji     = "📈" if pnl_total >= 0 else "📉"

    # P&L flotante de posiciones abiertas
    open_net = 0.0
    open_count = 0
    for sim in sim_trades.values():
        price = latest_prices.get(sim.pair)
        if price:
            fl_usdt, _ = sim.calc_pnl(price, sim.qty_remaining)
            open_net += sim.pnl_accumulated + fl_usdt
            open_count += 1

    balance_with_open = sim_balance + open_net
    open_str = (
        f"\n💹 P&L flotante ({open_count} pos.): {open_net:+.4f} USDT"
        f"\n📊 Balance si cierran ahora: ${balance_with_open:.2f}"
    ) if open_count > 0 else ""

    return (
        f"{emoji} **Simulación — ¿Funciona la estrategia?**\n\n"
        f"💰 Balance inicial:  ${ACCOUNT_BALANCE:.2f}\n"
        f"💼 Balance actual:   ${sim_balance:.2f}\n"
        f"{'📈' if pnl_total >= 0 else '📉'} **P&L realizado: {'+'if pnl_total>=0 else ''}{pnl_total:.2f} USDT ({pnl_pct:+.2f}%)**"
        f"{open_str}\n"
        f"\n💵 Margen por trade: ${USDT_PER_TRADE:.2f} × X{LEVERAGE}"
        f"\n📋 Ver historial: /history | Estadísticas: /stats"
    )

def format_sim_stats() -> str:
    """Estadísticas completas del simulador desde la DB."""
    rows = execute_db_query(
        "SELECT * FROM sim_track_record ORDER BY opened_at DESC", fetch=True
    )
    if not rows:
        return "📊 **Simulador** — Sin historial todavía."

    total      = len(rows)
    wins       = sum(1 for r in rows if (r['final_profit_pct'] or 0) > 0)
    losses     = sum(1 for r in rows if (r['final_profit_pct'] or 0) < 0)
    breakevens = sum(1 for r in rows if (r['final_profit_pct'] or 0) == 0)
    win_rate   = (wins / total * 100) if total > 0 else 0.0
    total_pct  = sum(float(r['final_profit_pct'] or 0) for r in rows)
    total_usdt = sum(float(r['final_profit_usdt'] or 0) for r in rows)
    avg_win    = (sum(float(r['final_profit_pct'] or 0) for r in rows if (r['final_profit_pct'] or 0) > 0) / wins) if wins > 0 else 0
    avg_loss   = (sum(float(r['final_profit_pct'] or 0) for r in rows if (r['final_profit_pct'] or 0) < 0) / losses) if losses > 0 else 0

    # Por close_reason
    reasons = {}
    for r in rows:
        cr = r['close_reason'] or 'OTHER'
        reasons[cr] = reasons.get(cr, 0) + 1

    reasons_str = " | ".join(f"{k}:{v}" for k,v in sorted(reasons.items()))

    return (
        f"📊 **Simulador — Estadísticas**\n\n"
        f"🔢 Total trades: {total}\n"
        f"✅ Ganados: {wins} | ❌ Perdidos: {losses} | ⚖️ BE: {breakevens}\n"
        f"🎯 Win Rate: {win_rate:.1f}%\n"
        f"📈 P/L total: {total_pct:+.2f}% ({total_usdt:+.4f} USDT)\n"
        f"📊 Avg ganancia: {avg_win:+.2f}% | Avg pérdida: {avg_loss:+.2f}%\n"
        f"💰 Balance: ${ACCOUNT_BALANCE:.2f} → ${sim_balance:.2f}\n"
        f"🏷️ Cierres: {reasons_str}"
    )

def format_sim_history(limit: int = 20) -> str:
    """Últimos N trades del historial del simulador."""
    rows = execute_db_query(
        "SELECT * FROM sim_track_record ORDER BY closed_at DESC LIMIT %s",
        (limit,), fetch=True
    )
    if not rows:
        return "📋 **Historial** — Sin registros todavía."

    lines = [f"📋 **Últimos {limit} trades del simulador**\n"]
    for r in rows:
        pnl   = float(r['final_profit_pct'] or 0)
        usdt  = float(r['final_profit_usdt'] or 0)
        emoji = "✅" if pnl > 0 else ("❌" if pnl < 0 else "⚖️")
        date  = r['closed_at'].strftime('%d/%m %H:%M') if r['closed_at'] else "?"
        tp_str = f"TP{'1' if r['hit_tp1'] else ''}{'2' if r['hit_tp2'] else ''}{'3' if r['hit_tp3'] else ''}"
        lines.append(
            f"{emoji} **{r['symbol']}** {r['direction']} | "
            f"{pnl:+.2f}% ({usdt:+.4f} USDT) | "
            f"{r['close_reason']} {tp_str} | {date}"
        )
    lines.append(f"\n💰 Balance actual: ${sim_balance:.2f}")
    return "\n".join(lines)

def format_now_report() -> str:
    """P&L real en tiempo real — muestra cuánto está ganando/perdiendo la simulación."""
    if not sim_trades:
        return "📊 Sin posiciones abiertas."

    now_str = datetime.now(UTC_TZ).strftime("%d/%m/%Y %H:%M UTC")
    lines   = [f"📊 **Simulación en tiempo real** — {now_str}", ""]
    total_net    = 0.0
    total_margin = 0.0

    for mid, sim in sim_trades.items():
        price   = latest_prices.get(sim.pair)
        fl_usdt = 0.0
        if price:
            fl_usdt, _ = sim.calc_pnl(price, sim.qty_remaining)

        net_usdt = sim.pnl_accumulated + fl_usdt
        net_pct  = (net_usdt / USDT_PER_TRADE) * 100
        pnl_icon = "🟢" if net_usdt >= 0 else "🔴"
        dir_icon = "↑ LONG" if sim.is_long else "↓ SHORT"

        be_str = " ⚖️BE" if sim.be_active else ""
        price_str = f"${price:,.4f}" if price else "sin precio"

        # TPs alcanzados
        tps = ""
        if sim.tp1_filled: tps += "✅TP1 "
        if sim.tp2_filled: tps += "✅TP2 "
        if not sim.tp1_filled and not sim.tp2_filled: tps = "⬜TP1 ⬜TP2"

        lines.append(
            f"{pnl_icon} **{sim.formatted_pair}** {dir_icon}{be_str}\n"
            f"   Precio: {price_str} | Entry: ${sim.entry:,.4f}\n"
            f"   {tps.strip()}\n"
            f"   Margen: ${USDT_PER_TRADE:.0f} | **P&L: {net_pct:+.2f}% ({net_usdt:+.4f} USDT)**"
        )
        total_net    += net_usdt
        total_margin += USDT_PER_TRADE

    total_pct = (total_net / total_margin * 100) if total_margin else 0
    net_icon  = "🟢" if total_net >= 0 else "🔴"
    lines.append("")
    lines.append("─" * 36)
    lines.append(
        f"{net_icon} **Net total: {total_pct:+.2f}%  ({total_net:+.4f} USDT)**\n"
        f"   Margen abierto: ${total_margin:.0f}  |  Balance sim: ${sim_balance:.2f}"
    )
    return "\n".join(lines)


def fmtprice(p) -> str:
    """Formatea precio según magnitud."""
    if p is None:
        return "—"
    f = float(p)
    if f >= 1000: return f"{f:,.2f}"
    if f >= 1:    return f"{f:.4f}"
    return f"{f:.6f}"


def clear_table(table_name):
    validated = validate_table_name(table_name)
    execute_db_query(f"DELETE FROM {validated}")
    getattr(state, table_name).clear()

async def pin_message_safe(client, chat_id, message_id):
    try:
        await client.pin_message(chat_id, message_id, notify=False)
    except Exception as e:
        log_message("ERROR", f"Error pineando {message_id}: {e}")

async def _fanout_report_to_brands(report_text: str):
    """Envía reportes automáticos a todos los canales de marcas secundarias y los pinea."""
    if not secondary_brands or not brands_bot_client:
        return
    for brand in secondary_brands:
        try:
            msg = await brands_bot_client.send_message(
                brand.destination_channel, report_text, link_preview=False
            )
            await pin_message_safe(brands_bot_client, brand.destination_channel, msg.id)
        except Exception as e:
            log_message("ERROR", f"[BRAND] Error enviando reporte a {brand.name}: {e}")

async def send_reports(client):
    last_daily = last_weekly = last_monthly = None
    while True:
        now = datetime.now(UTC_TZ).replace(microsecond=0)
        state.recent_messages = {
            k: v for k, v in state.recent_messages.items()
            if time.time() - v[0] <= 3600
        }
        cur_date  = now.date()
        is_sunday = now.weekday() == 6
        is_last   = (now + timedelta(days=1)).day == 1
        if now.hour == 23 and now.minute == 59:
            if last_daily != cur_date:
                _rpt = format_report(now, "daily")
                msg = await client.send_message(
                    DESTINATION_CHANNEL_ID, _rpt, link_preview=False
                )
                await pin_message_safe(client, DESTINATION_CHANNEL_ID, msg.id)
                await _fanout_report_to_brands(_rpt)
                if free_channel_service:
                    await free_channel_service.publish_positive_daily(now)
                last_daily = cur_date
            if is_sunday:
                wk = (now - timedelta(days=now.weekday())).date()
                if last_weekly != wk:
                    _rpt = format_report(now, "weekly")
                    msg = await client.send_message(
                        DESTINATION_CHANNEL_ID, _rpt, link_preview=False
                    )
                    await pin_message_safe(client, DESTINATION_CHANNEL_ID, msg.id)
                    await _fanout_report_to_brands(_rpt)
                    last_weekly = wk
            if is_last:
                mo = now.replace(day=1).date()
                if last_monthly != mo:
                    _rpt = format_report(now, "monthly")
                    msg = await client.send_message(
                        DESTINATION_CHANNEL_ID, _rpt, link_preview=False
                    )
                    await pin_message_safe(client, DESTINATION_CHANNEL_ID, msg.id)
                    await _fanout_report_to_brands(_rpt)
                    last_monthly = mo
        if now.hour == 0 and now.minute == 0:
            clear_table("daily_profits")
            if now.weekday() == 0:
                clear_table("weekly_profits")
            if now.day == 1:
                clear_table("monthly_profits")
        await asyncio.sleep(10)

# ── Main ─────────────────────────────────────────────────────────────────────

async def main():
    global telegram_client, brands_bot_client, free_channel_service
    log_message("INFO", f"LEVERAGE={LEVERAGE} | BREAKEVEN={BREAKEVEN} | USDT_PER_TRADE={USDT_PER_TRADE}")
    blacklist_label = ", ".join(sorted(ONZA_FREE_BLACKLIST)) or "vacía"
    log_message("INFO", f"[ONZA/FREE BLACKLIST] {blacklist_label}")
    log_message("INFO", f"[IMAGE]   SERVER={'ON  → ' + IMAGE_SERVER_URL if IMAGE_SERVER_URL else 'OFF'}")
    init_db_pool()
    init_db()
    load_state()
    load_active_sim_trades()
    load_secondary_brands()
    load_webhook_clients()
    for _c in webhook_clients:
        log_message("INFO", f"[WEBHOOK] {_c['name']} ({_c['format']}) ON → {_c['url']}")

    # Restaurar balance simulado desde el último registro
    last_balance = execute_db_query(
        "SELECT balance_after FROM sim_track_record ORDER BY closed_at DESC LIMIT 1",
        fetchone=True
    )
    if last_balance and last_balance.get('balance_after'):
        global sim_balance
        sim_balance = float(last_balance['balance_after'])
        log_message("INFO", f"Balance simulado restaurado: ${sim_balance:.2f}")

    session_string = os.getenv("TELEGRAM_STRING_SESSION")
    session = StringSession(session_string) if session_string else os.getenv("SESSION_NAME", "BotSession")
    async with TelegramClient(session, API_ID, API_HASH) as client:
        telegram_client = client

        # ── CANAL FREE: misma sesión, canal independiente y estado persistente ──
        try:
            free_config = FreeChannelConfig.from_env(
                leverage=LEVERAGE, existing_image_url=IMAGE_SERVER_URL
            )
            if free_config.enabled:
                candidate = FreeChannelService(
                    free_config, client, execute_db_query, log_message,
                    is_onza_free_blacklisted
                )
                if candidate.ensure_schema():
                    free_channel_service = candidate
                    log_message(
                        "INFO",
                        f"[FREE] ON → canal={free_config.channel_id} | "
                        f"señales/semana={free_config.weekly_limit} | "
                        f"cuenta USD {free_config.account_balance:.2f} | "
                        f"margen USD {free_config.margin_per_trade:.2f}"
                    )
            else:
                log_message("INFO", "[FREE] OFF → FREE_CHANNEL_ID no configurado")
        except Exception as exc:
            free_channel_service = None
            log_message("ERROR", f"[FREE] Configuración inválida: {exc}")

        # ── MULTI-BRAND: conectar bot compartido para todas las marcas secundarias ─
        if secondary_brands and _brands_bot_token:
            try:
                brands_bot_client = TelegramClient(StringSession(), API_ID, API_HASH)
                await brands_bot_client.start(bot_token=_brands_bot_token)
                log_message("INFO",
                    f"[BRAND] Bot compartido conectado — "
                    f"{len(secondary_brands)} marca(s): {[b.name for b in secondary_brands]}")
                # Registrar handler de comandos por cada canal de marca secundaria
                _cmd_pattern = re.compile(
                    r'^/(d|w|m|dn|wn|open|sim|now|stats|balance|history|commands)$',
                    re.IGNORECASE
                )
                for brand in secondary_brands:
                    brands_bot_client.add_event_handler(
                        lambda ev, b=brand: brand_command_handler(ev, b),
                        events.NewMessage(chats=[brand.destination_channel], pattern=_cmd_pattern)
                    )
                    log_message("INFO",
                        f"[BRAND] Comandos registrados → {brand.name} (ch={brand.destination_channel})")
            except Exception as e:
                log_message("ERROR", f"[BRAND] Error iniciando bot compartido: {e}")
                brands_bot_client = None

        log_message("INFO", f"[BOT] ✅ Activo | Canales: {SOURCE_CHANNEL_ID}, {SOURCE_CHANNEL_ID_2} | Trades activos: {len(sim_trades)}")

        # Telegram handlers
        client.add_event_handler(
            lambda ev: message_handler(ev, client),
            events.NewMessage(chats=[SOURCE_CHANNEL_ID, SOURCE_CHANNEL_ID_2])
        )
        client.add_event_handler(
            lambda ev: command_handler(ev, client),
            events.NewMessage(
                chats=[DESTINATION_CHANNEL_ID],
                pattern=re.compile(
                    r'^/(d|w|m|dn|wn|open|sim|now|stats|balance|history|commands)$',
                    re.IGNORECASE
                )
            )
        )

        # Iniciar WS de Binance y reportes en background
        await binance_ws.start()
        asyncio.create_task(send_reports(client))

        await client.run_until_disconnected()

if __name__ == "__main__":
    asyncio.run(main())