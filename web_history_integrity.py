"""Detect incomplete web history; never creates entries or sends events."""
import json
import math
from datetime import datetime,timezone
from decimal import Decimal
from pathlib import Path
KNOWN_GAPS=json.loads(Path(__file__).with_name("web_history_gaps.json").read_text(encoding="utf-8"))

def is_archived(sid):return sid in KNOWN_GAPS

def archived_ids():return sorted(KNOWN_GAPS)

def describe_gap(sid,events):
    known=KNOWN_GAPS.get(sid)
    payloads=[e["payload"] for e in events]
    fields={}
    for key in ("symbol","direction","timeframe","entry","leverage"):
        values={str(p[key]) for p in payloads if p.get(key) is not None}
        if len(values)==1:fields[key]=next(p[key] for p in payloads if p.get(key) is not None)
    has_entry=any(e["event_type"]=="entry" for e in events)
    return {"classification":known["classification"] if known else "Entrada pendiente de aplicar" if has_entry else "Nueva entrada ausente",
            "known_legacy":bool(known),"recoverable":False,"known_fields":fields,
            "missing_fields":["Evento original de entrada aplicado","Stop original","Tres objetivos originales","Hora de recepción de la entrada"],
            "required_evidence":"JSON original completo de entrada con el mismo signalId; no se deduce de un TP o de una vela.",
            "source_bar_at":known["origin_bar_utc"] if known else None}

def summarize_integrity(rows,incidents):
    errors=[]
    for r in rows:
        legs=r["legs"]
        try:
            fractions=sum(Decimal(str(l["fraction"])) for l in legs)
            if fractions<0 or fractions>1 or (r["closed"] and fractions!=1):raise ValueError("Fracciones inconsistentes")
            if abs(float(1-fractions)-r["remaining_fraction"])>1e-8:raise ValueError("Remanente inconsistente")
            expected=sum((Decimal(str(r["quantity_initial"]))*Decimal(str(l["fraction"]))*(Decimal(str(l["price"]))-Decimal(str(r["entry_price"]))) for l in legs),Decimal(0))
            if r["direction"]=="SHORT":expected=-expected
            actual=r["pnl_usdt"] if r["closed"] else r["scenario_partial_pnl_usdt"]
            if actual is None or not math.isfinite(float(actual)) or abs(float(expected)-actual)>.011:raise ValueError("Resultado inconsistente con los tramos")
        except (ValueError,TypeError,ArithmeticError) as exc:errors.append({"signal_id":r["signal_id"],"reason":str(exc)})
    new=[r for r in incidents if not r.get("known_legacy")]
    now=datetime.now(timezone.utc)
    urgent=[]
    for r in new:
        first=min(datetime.fromisoformat(e["received_at"]) for e in r["events"])
        if (now-first).total_seconds()>300:urgent.append(r["signal_id"])
    return {"status":"error" if errors else "review" if new else "ok","math_checked":len(rows),"math_errors":errors,
            "legacy_incomplete_groups":sum(bool(r.get("known_legacy")) for r in incidents),
            "new_incomplete_groups":len(new),"new_incomplete_older_than_5m":urgent,
            "policy":"Un grupo sin entrada válida se conserva como incidencia y queda fuera del P&L; nunca se completa por suposición."}
