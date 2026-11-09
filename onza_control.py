"""Explicit Onza switch and durable pause/resume boundary; other channels are independent."""
import os

PAUSED_REASON = "ONZA_ENABLED=false; excluido sin reenvio al reactivar"

def onza_enabled():
    # Fail closed: only an explicit true enables external deliveries.
    return os.getenv("ONZA_ENABLED", "false").strip().lower() == "true"

CONTROL_SCHEMA = """
CREATE TABLE IF NOT EXISTS onza_channel_control (
    id INTEGER PRIMARY KEY CHECK (id=1),
    enabled BOOLEAN NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""

def configure_onza(cur, enabled):
    """Called before workers start, in the same transaction as POLICY_SCHEMA.

    Advancing the existing floor excludes both events and their parent entries.
    Never reset failed/unknown/sending or touch local/Telegram state.
    """
    cur.execute("SELECT enabled FROM onza_channel_control WHERE id=1 FOR UPDATE")
    row = cur.fetchone()
    was_enabled = (row["enabled"] if isinstance(row, dict) else row[0]) if row else None
    if not enabled or was_enabled is not True:
        cur.execute("UPDATE onza_delivery_policy SET first_event_id=GREATEST(first_event_id, (SELECT COALESCE(MAX(id),0)+1 FROM tv_events)) WHERE id=1")
        cur.execute("""UPDATE tv_events SET onza_status='skipped', onza_result=%s
            WHERE onza_status='pending' AND id <
              (SELECT first_event_id FROM onza_delivery_policy WHERE id=1)""",
            (PAUSED_REASON if not enabled else "Corte de reactivacion Onza; acumulado excluido sin reenvio",))
    cur.execute("""INSERT INTO onza_channel_control (id,enabled) VALUES (1,%s)
        ON CONFLICT (id) DO UPDATE SET enabled=EXCLUDED.enabled,updated_at=now()""", (enabled,))
