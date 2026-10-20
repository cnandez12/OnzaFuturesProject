"""Candidate selection for live Onza delivery; never replays the old ledger."""

POLICY_SCHEMA = """
CREATE TABLE IF NOT EXISTS onza_delivery_policy (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    first_event_id BIGINT NOT NULL CHECK (first_event_id > 0),
    activated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Serialize the first boundary with event inserts; subsequent boots retain it.
LOCK TABLE tv_events IN SHARE MODE;
INSERT INTO onza_delivery_policy (id, first_event_id)
SELECT 1, COALESCE(MAX(id), 0) + 1 FROM tv_events
ON CONFLICT (id) DO NOTHING;
"""

# Eligibility is evaluated BEFORE LIMIT. Hundreds of waiting updates must not
# prevent an independent entry from being claimed. Python still validates prices
# and metadata before any HTTP request. Unknown/sending/failed are never replayed.
CLAIM_SQL = """
SELECT e.id, e.signal_id, e.event_type, e.payload, e.received_at,
       e.onza_status, e.telegram_status
FROM tv_events e
WHERE e.state IN ('pending', 'applied') AND e.onza_status='pending'
  AND e.id >= (SELECT first_event_id FROM onza_delivery_policy WHERE id=1)
  AND EXISTS (
      SELECT 1 FROM tv_events en
      WHERE en.signal_id=e.signal_id AND en.event_type='entry'
        AND en.id >= (SELECT first_event_id FROM onza_delivery_policy WHERE id=1)
  )
  AND NOT EXISTS (
      SELECT 1 FROM unnest(CASE e.event_type
          WHEN 'entry' THEN ARRAY[]::text[]
          WHEN 'tp1' THEN ARRAY['entry']
          WHEN 'tp2' THEN ARRAY['entry', 'tp1']
          WHEN 'tp3' THEN ARRAY['entry', 'tp1', 'tp2']
          ELSE ARRAY['entry'] END) AS required(kind)
      WHERE NOT EXISTS (
          SELECT 1 FROM tv_events prior
          WHERE prior.signal_id=e.signal_id AND prior.event_type=required.kind
            AND prior.onza_status='delivered'
      )
  )
  AND (e.event_type='entry' OR NOT EXISTS (
      SELECT 1 FROM tv_events terminal
      WHERE terminal.signal_id=e.signal_id
        AND terminal.event_type IN ('tp3', 'sl', 'close')
        AND terminal.event_type<>e.event_type
        AND terminal.onza_status IN ('sending', 'unknown', 'failed')
  ))
ORDER BY e.id LIMIT 500 FOR UPDATE SKIP LOCKED
"""
