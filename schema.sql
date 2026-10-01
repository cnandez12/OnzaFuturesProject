-- Base exclusiva de Onza Futures Project. No ejecutar en la base del proyecto original.
CREATE TABLE IF NOT EXISTS onza_project_meta (project TEXT PRIMARY KEY);
INSERT INTO onza_project_meta (project) VALUES ('onza-futures') ON CONFLICT DO NOTHING;

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
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Idempotente para instalaciones existentes de este proyecto.
ALTER TABLE tv_signals ADD COLUMN IF NOT EXISTS be_activated_at TIMESTAMPTZ;
ALTER TABLE tv_signals ADD COLUMN IF NOT EXISTS margin_used NUMERIC(18,8);

CREATE TABLE IF NOT EXISTS tv_events (
    id BIGSERIAL PRIMARY KEY,
    signal_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    applied_at TIMESTAMPTZ,
    state TEXT NOT NULL DEFAULT 'pending',
    onza_status TEXT NOT NULL DEFAULT 'pending',
    onza_started_at TIMESTAMPTZ,
    onza_finished_at TIMESTAMPTZ,
    telegram_status TEXT NOT NULL DEFAULT 'pending',
    image_sequence BIGINT,
    onza_result TEXT,
    telegram_result TEXT,
    error TEXT,
    UNIQUE (signal_id, event_type)
);
ALTER TABLE tv_events ADD COLUMN IF NOT EXISTS onza_started_at TIMESTAMPTZ;
ALTER TABLE tv_events ADD COLUMN IF NOT EXISTS onza_finished_at TIMESTAMPTZ;
ALTER TABLE tv_events ADD COLUMN IF NOT EXISTS image_sequence BIGINT;
CREATE SEQUENCE IF NOT EXISTS bitunix_card_rotation_seq;

CREATE INDEX IF NOT EXISTS idx_tv_events_pending ON tv_events (id) WHERE state = 'pending';
CREATE INDEX IF NOT EXISTS idx_tv_events_delivery ON tv_events (id) WHERE state = 'applied';
CREATE INDEX IF NOT EXISTS idx_tv_events_onza_queue ON tv_events (id)
    WHERE onza_status = 'pending' AND state IN ('pending', 'applied');
CREATE INDEX IF NOT EXISTS idx_sim_track_symbol ON sim_track_record (symbol);
CREATE INDEX IF NOT EXISTS idx_sim_track_opened_at ON sim_track_record (opened_at);
CREATE INDEX IF NOT EXISTS idx_sim_track_closed_at ON sim_track_record (closed_at);

CREATE TABLE IF NOT EXISTS daily_profits (key VARCHAR PRIMARY KEY, value TEXT, gain_date TIMESTAMPTZ, Close BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS weekly_profits (key VARCHAR PRIMARY KEY, value TEXT, gain_date TIMESTAMPTZ, Close BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS monthly_profits (key VARCHAR PRIMARY KEY, value TEXT, gain_date TIMESTAMPTZ, Close BOOLEAN DEFAULT FALSE);
