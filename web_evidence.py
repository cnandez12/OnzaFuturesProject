"""Reconcile received terminal TP3 evidence for web scenarios only. No writes or deliveries."""
from decimal import Decimal


def scenario_events(events):
    applied=[dict(e,typeSignal=e["event_type"]) for e in events if e.get("state","applied")=="applied"]
    entry=next((e for e in applied if e["event_type"]=="entry"),None)
    if not entry or any(e["event_type"] in ("tp3","sl","close") for e in applied):
        return applied,None
    initial=entry["payload"]
    pending=[e for e in events if e.get("state")=="pending" and e["event_type"] in ("tp1","tp2","tp3")]
    if not any(e["event_type"]=="tp3" for e in pending):return applied,None
    try:
        levels=[Decimal(str(t["price"])) for t in initial["takeProfits"]]
        if len(levels)!=3:return applied,None
        price=Decimal(str(initial["entry"]));side=initial["direction"]
        if side not in ("LONG","SHORT"):return applied,None
        sequence=[price,*levels]
        if not all(a<b if side=="LONG" else a>b for a,b in zip(sequence,sequence[1:])):return applied,None
        valid=[]
        for e in pending:
            p=e["payload"];n=int(e["event_type"][-1])
            if e["received_at"]<entry["received_at"]:continue
            if p.get("direction")!=side or Decimal(str(p.get("entry")))!=price:continue
            if Decimal(str(p["price"]))!=levels[n-1]:continue
            valid.append(e)
        if not any(e["event_type"]=="tp3" for e in valid):return applied,None
    except (KeyError,ValueError,TypeError,ArithmeticError):return applied,None
    recovered=[];inferred=[];seen={e["event_type"] for e in applied}
    for e in sorted(valid,key=lambda e:(e["received_at"],e["id"])):
        n=int(e["event_type"][-1])
        for i in range(1,n):
            kind=f"tp{i}"
            if kind not in seen:
                synthetic=dict(e,id=-e["id"]*10+i,event_type=kind,typeSignal=kind,applied_at=None,
                               payload=dict(e["payload"],price=str(levels[i-1])),basis="target_inferred_from_later_tp")
                applied.append(synthetic);seen.add(kind);inferred.append(kind)
        if e["event_type"] not in seen:
            applied.append(dict(e,typeSignal=e["event_type"],basis="received_pending_alert"));seen.add(e["event_type"]);recovered.append(e["id"])
    return applied,{"received_pending_event_ids":recovered,"inferred_targets":inferred,
                    "note":"TP3 recibido y pendiente de procesamiento; parciales faltantes reconstruidos a sus objetivos. No es confirmación de ejecución del broker."}
