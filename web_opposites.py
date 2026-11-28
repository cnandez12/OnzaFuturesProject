"""Opposite-signal exits for the web model only. No deliveries or source mutations."""
from datetime import datetime,timezone
from decimal import Decimal
from web_history_integrity import is_archived
from presentation_config import risk_margin

def first_opposites(events):
    entries=[]
    for e in events:
        if e["event_type"]!="entry" or e.get("state")!="applied" or is_archived(e["signal_id"]):continue
        try:
            p=e["payload"];risk_margin(p)
            if not isinstance(p["symbol"],str) or not isinstance(p["timeframe"],str):continue
            levels=[Decimal(str(t["price"])) for t in p["takeProfits"]]
            sequence=[Decimal(str(p["entry"])),*levels]
            if len(levels)!=3 or not all(a<b if p["direction"]=="LONG" else a>b for a,b in zip(sequence,sequence[1:])):continue
        except (ValueError,KeyError,TypeError,ArithmeticError):continue
        entries.append(e)
    entries.sort(key=lambda e:(e["received_at"],e["id"]))
    result={};waiting={}
    for entry in entries:
        p=entry["payload"];key=(p["symbol"].replace("USD.P","USDT"),p["timeframe"].upper())
        prior=waiting.setdefault(key,[])
        kept=[]
        for old in prior:
            if old["payload"]["direction"]!=p["direction"]:result[old["signal_id"]]=entry
            else:kept.append(old)
        waiting[key]=[*kept,entry]
    return result

def apply_opposite(applied,opposite,original):
    if not opposite:return applied,None
    # Existing persisted exits are authoritative; the automatic evidence worker
    # can supersede a later one only when it has verified an earlier web exit.
    if any(e["event_type"] in ("tp3","sl","close") and e.get("state")=="applied" for e in original):return applied,None
    at=opposite["received_at"]
    moment=lambda e:e.get("applied_at") or e["received_at"]
    if any(e["event_type"] in ("tp3","sl","close") and moment(e)<=at for e in applied):return applied,None
    entry=next(e for e in applied if e["event_type"]=="entry")
    initial=entry["payload"];price=Decimal(str(opposite["payload"]["entry"]))
    stop=Decimal(str(initial["stopLoss"]["price"]));long=initial["direction"]=="LONG"
    retained=[e for e in applied if e["event_type"]=="entry" or moment(e)<=at]
    reached_tp1=any(e["event_type"]=="tp1" for e in retained)
    # Ideal stop execution is part of this theoretical model (no slippage).
    stopped=not reached_tp1 and (price<=stop if long else price>=stop)
    kind="sl" if stopped else "close"
    event=dict(entry,id=2000000000+opposite["id"],event_type=kind,typeSignal=kind,received_at=at,applied_at=None,
        payload=dict(initial,price=float(stop if stopped else price)),basis="opposite_signal_stop_reference" if stopped else "opposite_signal_reference")
    return [*retained,event],{"kind":"opposite_signal","received_pending_event_ids":[],"inferred_targets":[],
        "opposite_signal_id":opposite["signal_id"],"as_of":int(at.timestamp()*1000),"precision":"alert",
        "note":"Cierre web por señal contraria del mismo activo y temporalidad. Precio de referencia: entrada de la nueva señal; se conserva el stop/BE del escenario. No confirma un fill del broker."}
