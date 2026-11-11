"""One-way retirement of historical delivery markers. No network or credentials."""
RETIRED_REASON = 'Integracion antigua retirada; sin publicador ni reenvios'


def retire(cur):
    cur.execute("UPDATE tv_events SET onza_status='skipped',onza_result=%s WHERE onza_status='pending'",(RETIRED_REASON,))
    cur.execute("SELECT to_regclass('public.onza_channel_control')")
    if cur.fetchone()[0]:
        cur.execute("UPDATE onza_channel_control SET enabled=false,updated_at=now() WHERE id=1")
