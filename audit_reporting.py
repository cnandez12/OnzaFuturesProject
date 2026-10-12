"""Auditoría independiente de las colas de envío y del estado base del trade."""
from collections import Counter, defaultdict
from datetime import date, datetime, timezone
from decimal import Decimal
from zoneinfo import ZoneInfo

from audit_scenarios import MODES, evaluate, summarize

AUDIT_SQL = """SELECT e.signal_id, s.id IS NOT NULL AS signal_exists,
    s.exchange, s.margin_used, s.be_activated_at,
    (to_jsonb(s)->>'be_stop_price')::numeric AS stored_be_stop_price,
    e.id,e.event_type,e.payload,e.received_at,e.applied_at,e.onza_status,e.state,e.error,
    r.final_profit_usdt AS recorded_pnl
    FROM tv_events e LEFT JOIN tv_signals s ON s.signal_id=e.signal_id
    LEFT JOIN trades t ON t.message_id=s.id
    LEFT JOIN LATERAL (
      SELECT final_profit_usdt FROM sim_track_record r
      WHERE r.opened_at=t.date AND r.symbol=t.pair
        AND r.entry_price=NULLIF(t.entry,'')::numeric
      ORDER BY r.id LIMIT 1
    ) r ON TRUE ORDER BY e.signal_id,e.applied_at,e.id"""


def public_event(e):
    # Never expose credentials from the immutable payload or delivery response.
    return {"id": e["id"], "type": e["event_type"], "state": e.get("state", "applied"),
            "price": e["payload"].get("price", e["payload"].get("entry")),
            "roi_pct": e["payload"].get("roi"), "onza_status": e["onza_status"],
            "received_at": e["received_at"].isoformat(),
            "applied_at": e["applied_at"].isoformat() if e.get("applied_at") else None}


def build_report(event_rows, *, mode, fallback_margin="20", filters=None):
    filters = filters or {}
    start = date.fromisoformat(filters["from"]) if filters.get("from") else None
    end = date.fromisoformat(filters["to"]) if filters.get("to") else None
    if start and end and start > end:
        raise ValueError("El inicio del período debe ser anterior al fin")
    status = filters.get("status") or "all"
    if status not in ("all", "closed", "open"):
        raise ValueError("Estado de auditoría inválido")
    search = filters.get("search", "").strip().upper()
    grouped = defaultdict(list)
    for e in event_rows:
        grouped[e["signal_id"]].append(e)
    rows, incidents = [], []
    comparison_rows = {key: [] for key in MODES}
    for sid, events in grouped.items():
        events.sort(key=lambda e: (e["received_at"], e["id"]))
        raw = [public_event(e) for e in events]
        applied = [dict(e, typeSignal=e["event_type"]) for e in events if e.get("state", "applied") == "applied"]
        entry = next((e for e in applied if e["event_type"] == "entry"), None)
        if entry is None or not events[0].get("signal_exists", True):
            incidents.append({"signal_id": sid, "symbol": events[0]["payload"].get("symbol"),
                              "reason": "Sin entrada aplicada asociada; no se calcula P&L", "events": raw})
            continue
        meta = entry
        margin = meta.get("margin_used") if meta.get("margin_used") is not None else fallback_margin
        try:
            scenarios = {key: evaluate(sid, applied, mode=key, margin=margin,
                                      be_activated_at=meta.get("be_activated_at")) for key in sorted(MODES)}
        except (ValueError, KeyError, ArithmeticError) as exc:
            incidents.append({"signal_id": sid, "symbol": entry["payload"].get("symbol"),
                              "reason": "Registro incompleto o inconsistente: " + str(exc), "events": raw})
            continue
        baseline = scenarios["partial_no_be"]
        day = entry["received_at"].astimezone(ZoneInfo("America/Bogota")).date()
        if start and day < start or end and day > end:
            continue
        if status != "all" and baseline["closed"] != (status == "closed"):
            continue
        if search and search not in (sid + " " + baseline["symbol"] + " " + baseline["direction"] + " " + str(meta.get("exchange"))).upper():
            continue
        result = dict(scenarios[mode])
        recorded = meta.get("recorded_pnl")
        difference = (round(float(Decimal(str(baseline["pnl_usdt"])) - Decimal(str(recorded))), 2)
                      if baseline["closed"] and recorded is not None else None)
        result.update({"source_exchange": meta.get("exchange"), "margin_recorded": meta.get("margin_used") is not None,
                       "be_persisted": meta.get("be_activated_at") is not None,
                       "stored_be_stop_price": float(meta["stored_be_stop_price"]) if meta.get("stored_be_stop_price") is not None else None,
                       "onza_delivery": "delivered" if all(e["onza_status"] == "delivered" for e in events) else "pending_or_review",
                       "delivery_counts": dict(Counter(e["onza_status"] for e in events)),
                       "recorded_pnl_usdt": round(float(recorded), 2) if recorded is not None else None,
                       "reconciliation_difference_usdt": difference,
                       "reconciliation_status": "match" if difference == 0 else "mismatch" if difference is not None else "missing_record" if baseline["closed"] else "open",
                       "events": raw, "scenarios": scenarios})
        rows.append(result)
        for key in MODES:
            comparison_rows[key].append(scenarios[key])
    rows.sort(key=lambda r: (r["received_at"], r["signal_id"]), reverse=True)
    comparison = {key: summarize(value, key) for key, value in comparison_rows.items()}
    reconciled = [r for r in rows if r["reconciliation_status"] == "match"]
    return {"version": 2, "as_of": datetime.now(timezone.utc).isoformat(), "filters": filters,
            "summary": comparison[mode], "comparison": comparison, "rows": rows,
            "coverage": {"events_total": len(event_rows), "states": dict(Counter(e.get("state", "applied") for e in event_rows)),
                         "signals_total": sum(any(e["event_type"] == "entry" and e.get("state", "applied") == "applied" for e in es) for es in grouped.values()),
                         "incidents": len(incidents), "incident_events": sum(len(i["events"]) for i in incidents),
                         "selected_signals": len(rows)},
            "reconciliation": {"matched": len(reconciled), "mismatched": sum(r["reconciliation_status"] == "mismatch" for r in rows),
                               "missing": sum(r["reconciliation_status"] == "missing_record" for r in rows),
                               "difference_usdt": round(sum(r["reconciliation_difference_usdt"] or 0 for r in rows), 2)},
            "incidents": incidents,
            "policy": {"be": "TP1 activa automáticamente el stop en entrada sobre el remanente; se aplica solo en partial_be.",
                       "be_exit": "Una salida adversa después de TP1 simula BE en entrada. El evento no proporciona la hora exacta del cruce.",
                       "max_tp": "Proyección retrospectiva del 100% del margen al máximo TP registrado; sin TP usa el cierre original.",
                       "population": "Filtros por fecha de entrada en Colombia. Las tres estrategias usan las mismas señales.",
                       "costs": "P&L bruto de simulación; no incluye comisiones, funding ni deslizamiento."}}
