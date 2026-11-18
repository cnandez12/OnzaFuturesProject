"""Main Telegram channel pacing and explicit-429 cooldown, persisted across restarts."""

KEY = "main_retry_after"
SPACING_SECONDS = 4


def ready(cur):
    # Serializes claims, including replicas overlapping during a deployment.
    cur.execute("SELECT pg_advisory_xact_lock(191118201)")
    cur.execute("""SELECT 1 FROM telegram_channel_state
        WHERE name=%s AND value::timestamptz > now()""", (KEY,))
    return cur.fetchone() is None


def defer(cur, seconds):
    cur.execute("""INSERT INTO telegram_channel_state(name,value)
        VALUES (%s,(now()+%s * interval '1 second')::text)
        ON CONFLICT(name) DO UPDATE SET value=GREATEST(
            telegram_channel_state.value::timestamptz,EXCLUDED.value::timestamptz)::text""",
        (KEY, seconds))
