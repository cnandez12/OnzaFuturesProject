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

def supplement(signal_id,events,applied,mode):
    record=EVIDENCE.get(signal_id)
    if mode!="partial_be" or not record or record["fingerprint"]!=fingerprint(events):return applied,None
    if any(e["event_type"] in ("sl","close","tp3") for e in applied):return applied,None
    if not record.get("observations"):return applied,None
    initial=next(e for e in applied if e["event_type"]=="entry")
    extra=[]
    for i,o in enumerate(record["observations"]):
        at=datetime.fromtimestamp((o["bar"]["time"]+60000)/1000,timezone.utc)
        extra.append(dict(initial,id=1000000000+i,event_type=o["kind"],typeSignal=o["kind"],received_at=at,applied_at=None,
                          payload=dict(initial["payload"],price=o["price"]),basis="market_candle_reference"))
    ambiguous=sum(bool(o.get("ambiguous")) for o in record["observations"])
    return [*applied,*extra],{"kind":"market_candles","source":record.get("source","Bitunix Futures LAST_PRICE"),"as_of":record["as_of"],
        "received_pending_event_ids":[],"inferred_targets":[o["kind"] for o in record["observations"] if o["kind"].startswith("tp")],
        "precision":"1m","ambiguous_candles":ambiguous,
        "note":"Escenario conciliado con velas de 1 minuto de Bitunix desde el minuto completo posterior a la última alerta aplicada. Hora aproximada al fin de vela; stop prioritario ante cruce simultáneo. No confirma ejecución del broker."}
