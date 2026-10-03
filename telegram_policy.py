"""Telegram presentation policy; raw events and Onza delivery stay unchanged."""

def closing_suppression(kind, related):
    if kind not in ("sl", "close"):
        return None
    applied = {row["event_type"] for row in related if row.get("state") == "applied"}
    for tp in ("tp3", "tp2", "tp1"):
        if tp in applied:
            return "Cierre omitido: conservar " + tp.upper() + " alcanzado"
    if kind == "close" and "sl" in applied:
        return "Close omitido: la señal ya tiene SL directo"
    return None


def suppression_for_signal(cur, signal_id, kind):
    if kind not in ("sl", "close"):
        return None
    cur.execute("SELECT event_type,state FROM tv_events WHERE signal_id=%s", (signal_id,))
    return closing_suppression(kind, cur.fetchall())
