"""Versioned market evidence for web scenarios. No network, writes, or delivery calls."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

_PATH=Path(__file__).with_name("web_candle_evidence.json")
EVIDENCE=json.loads(_PATH.read_text(encoding="utf-8")) if _PATH.exists() else {}

def fingerprint(events):
    fields=("symbol","direction","entry","timeframe","stopLoss","takeProfits","leverage")
    def stamp(x):return x.isoformat() if hasattr(x,"isoformat") else str(x).replace(" ","T")
    values=[]
    for e in sorted(events,key=lambda x:x["id"]):
        p=e["payload"]
        values.append([e["id"],e["event_type"],e.get("state","applied"),stamp(e["received_at"]),stamp(e.get("applied_at")),
                       {k:p[k] for k in fields if k in p},p.get("price")])
    return hashlib.sha256(json.dumps(values,sort_keys=True,default=str,separators=(",",":")).encode()).hexdigest()

def entry_fingerprint(events):
    entry=[e for e in events if e["event_type"]=="entry" and e.get("state","applied")=="applied"]
    return fingerprint(entry) if len(entry)==1 else None

def valid_record(record,events):
    if not record:return False
    if not record.get("entry_fingerprint"):return record.get("fingerprint")==fingerprint(events)
    anchors=[e for e in events if e["id"] in record.get("anchor_ids",[])]
    return (record["entry_fingerprint"]==entry_fingerprint(events) and
            len(anchors)==len(record.get("anchor_ids",[])) and
            fingerprint(anchors)==record.get("anchor_fingerprint"))

def supplement(signal_id,events,applied,mode):
    record=next((e.get("web_evidence") for e in events if e.get("web_evidence")),None) or EVIDENCE.get(signal_id)
    if mode!="partial_be" or not valid_record(record,events):return applied,None
    if not record.get("observations"):return applied,None
    closing=next((o for o in record["observations"] if o["kind"] in ("sl","close","tp3")),None)
    close_at=(closing.get("at",closing.get("bar",{}).get("time",0)+60000))/1000 if closing else float("inf")
    if any(e["event_type"] in ("sl","close","tp3") and e.get("state","applied")=="applied" and
           (e.get("applied_at") or e["received_at"]).timestamp()<=close_at for e in events):return applied,None
    initial=next(e for e in applied if e["event_type"]=="entry")
    extra=[]
    for i,o in enumerate(record["observations"]):
        at=datetime.fromtimestamp(o.get("at",o.get("bar",{}).get("time",0)+60000)/1000,timezone.utc)
        extra.append(dict(initial,id=1000000000+i,event_type=o["kind"],typeSignal=o["kind"],received_at=at,applied_at=None,
                          payload=dict(initial["payload"],price=o["price"]),basis=o.get("basis","market_candle_reference")))
    ambiguous=sum(bool(o.get("ambiguous")) for o in record["observations"])
    replaced={e["event_type"] for e in extra}
    retained=[e for e in applied if e["event_type"] not in replaced]
    return [*retained,*extra],{"kind":"market_candles","source":record.get("source","Bitunix Futures LAST_PRICE"),"as_of":record["as_of"],
        "received_pending_event_ids":[],"inferred_targets":[o["kind"] for o in record["observations"] if o["kind"].startswith("tp")],
        "precision":"1m","ambiguous_candles":ambiguous,
        "sync_status":record.get("sync_status","snapshot"),
        "note":"Escenario web conciliado con velas completas de 1 minuto de Bitunix y alertas registradas. Hora de cruce aproximada al fin de vela; stop prioritario ante cruce simultáneo. Una señal contraria del mismo activo y temporalidad termina el seguimiento. No confirma ejecución del broker."}
