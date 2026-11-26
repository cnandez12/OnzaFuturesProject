-- Base exclusiva de Onza Futures Project. Idempotente: setup_db.py lo aplica en cada despliegue.
-- Las tablas VORZA se crean aparte desde vorza_queue.py.
CREATE TABLE IF NOT EXISTS onza_project_meta (project TEXT PRIMARY KEY);
INSERT INTO onza_project_meta (project) VALUES ('onza-futures') ON CONFLICT DO NOTHING;

-- Estado de cada operación simulada (una fila por señal).
CREATE TABLE IF NOT EXISTS trades (
    message_id BIGINT PRIMARY KEY,
    date TIMESTAMPTZ,
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
    pnl_accumulated DECIMAL(18,8) DEFAULT 0,
    tp1_fill_price VARCHAR,
    tp2_fill_price VARCHAR,
    tp3_fill_price VARCHAR,
    source_exchange VARCHAR
);

-- Registro contable de cierres: parciales 40/40/20 con el stop original.
CREATE TABLE IF NOT EXISTS sim_track_record (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR,
    direction VARCHAR,
    entry_price DECIMAL(20,8),
    exit_price DECIMAL(20,8),
    stop_loss DECIMAL(20,8),
    tp1 DECIMAL(20,8),
    tp2 DECIMAL(20,8),
    tp3 DECIMAL(20,8),
    hit_tp1 BOOLEAN DEFAULT FALSE,
    hit_tp2 BOOLEAN DEFAULT FALSE,
    hit_tp3 BOOLEAN DEFAULT FALSE,
    tp1_exit_price DECIMAL(20,8),
    tp2_exit_price DECIMAL(20,8),
    tp3_exit_price DECIMAL(20,8),
    tp1_profit_pct DECIMAL(10,4),
    tp2_profit_pct DECIMAL(10,4),
    tp3_profit_pct DECIMAL(10,4),
    final_profit_pct DECIMAL(10,4),
    final_profit_usdt DECIMAL(18,8),
    close_reason VARCHAR,
    balance_before DECIMAL(18,8),
    balance_after DECIMAL(18,8),
    margin_used DECIMAL(18,8),
    leverage INTEGER,
    duration VARCHAR,
    opened_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tv_signals (
    id BIGSERIAL PRIMARY KEY,
    signal_id TEXT NOT NULL UNIQUE,
    symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    exchange TEXT NOT NULL,
    margin_used NUMERIC(18,8),
    be_activated_at TIMESTAMPTZ,
    be_stop_price NUMERIC(20,8),
    telegram_entry_message_id BIGINT,
    telegram_chat_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tv_signals ADD COLUMN IF NOT EXISTS be_activated_at TIMESTAMPTZ;
ALTER TABLE tv_signals ADD COLUMN IF NOT EXISTS be_stop_price NUMERIC(20,8);
ALTER TABLE tv_signals ADD COLUMN IF NOT EXISTS margin_used NUMERIC(18,8);
ALTER TABLE tv_signals ADD COLUMN IF NOT EXISTS telegram_entry_message_id BIGINT;
ALTER TABLE tv_signals ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Cola durable: cada alerta de TradingView, una sola vez por (señal, tipo).
-- Las instalaciones anteriores conservan además columnas onza_* del proveedor
-- retirado; son historial y el código ya no las lee ni las escribe.
CREATE TABLE IF NOT EXISTS tv_events (
    id BIGSERIAL PRIMARY KEY,
    signal_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    applied_at TIMESTAMPTZ,
    state TEXT NOT NULL DEFAULT 'pending',
    telegram_status TEXT NOT NULL DEFAULT 'pending',
    telegram_attempts INTEGER NOT NULL DEFAULT 0,
    telegram_next_attempt_at TIMESTAMPTZ,
    telegram_message_id BIGINT,
    telegram_result TEXT,
    image_sequence BIGINT,
    error TEXT,
    UNIQUE (signal_id, event_type)
);
ALTER TABLE tv_events ADD COLUMN IF NOT EXISTS image_sequence BIGINT;
ALTER TABLE tv_events ADD COLUMN IF NOT EXISTS telegram_message_id BIGINT;
ALTER TABLE tv_events ADD COLUMN IF NOT EXISTS telegram_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tv_events ADD COLUMN IF NOT EXISTS telegram_next_attempt_at TIMESTAMPTZ;
CREATE SEQUENCE IF NOT EXISTS bitunix_card_rotation_seq;

CREATE INDEX IF NOT EXISTS idx_tv_events_pending ON tv_events (id) WHERE state = 'pending';
CREATE INDEX IF NOT EXISTS idx_tv_events_delivery ON tv_events (id) WHERE state = 'applied';
CREATE INDEX IF NOT EXISTS idx_tv_events_telegram_queue ON tv_events (id)
    WHERE state = 'applied' AND telegram_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_tv_events_telegram_review ON tv_events (id)
    WHERE telegram_status IN ('sending', 'failed', 'unknown');
CREATE INDEX IF NOT EXISTS idx_sim_track_symbol ON sim_track_record (symbol);
CREATE INDEX IF NOT EXISTS idx_sim_track_opened_at ON sim_track_record (opened_at);
CREATE INDEX IF NOT EXISTS idx_sim_track_closed_at ON sim_track_record (closed_at);

-- Independent durable Telegram distribution; canal Free y resúmenes, aparte del canal principal.
CREATE TABLE IF NOT EXISTS telegram_channel_state (name TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS telegram_free_selections (
    signal_id TEXT NOT NULL, chat_id TEXT NOT NULL, week_start DATE NOT NULL,
    PRIMARY KEY (signal_id, chat_id)
);
CREATE TABLE IF NOT EXISTS telegram_free_seen (
    event_id BIGINT NOT NULL, chat_id TEXT NOT NULL, PRIMARY KEY (event_id,chat_id)
);
CREATE TABLE IF NOT EXISTS telegram_publications (
    id BIGSERIAL PRIMARY KEY, job_key TEXT UNIQUE NOT NULL, chat_id TEXT NOT NULL,
    method TEXT NOT NULL, body JSONB NOT NULL, parent_key TEXT, requires_key TEXT,
    pin_after BOOLEAN NOT NULL DEFAULT FALSE, status TEXT NOT NULL DEFAULT 'pending',
    message_id BIGINT, detail TEXT, available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    attempts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_telegram_publications_pending ON telegram_publications(id) WHERE status='pending';
ALTER TABLE telegram_publications ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0;

-- Auditoría: TP1 habilita BE en entrada; el trade base conserva su stop original.
-- Completa las señales anteriores a esa regla; no cambia nada si ya están al día.
UPDATE tv_signals s
SET be_activated_at = COALESCE(s.be_activated_at, tp.received_at),
    be_stop_price = (en.payload->>'entry')::numeric
FROM tv_events tp, tv_events en
WHERE tp.signal_id = s.signal_id AND tp.event_type = 'tp1' AND tp.state = 'applied'
  AND en.signal_id = s.signal_id AND en.event_type = 'entry' AND en.state = 'applied'
  AND (s.be_activated_at IS NULL OR s.be_stop_price IS DISTINCT FROM (en.payload->>'entry')::numeric);
