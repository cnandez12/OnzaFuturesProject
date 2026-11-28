"""Price/ledger consistency checks for presentation; crossing a quote never invents fills."""
import math


def quote_issue(row, mark):
    if row.get("integrity_note"):return row["integrity_note"]
    if row.get("closed") or mark is None:return None
    try:
        mark=float(mark)
        if not math.isfinite(mark) or mark<=0:return None
        side=str(row.get("direction",row.get("side",""))).upper()
        if side not in ("LONG","SHORT"):return None
        long=side=="LONG";highest=int(row.get("max_tp") or 0)
        hits=[bool(row.get(f"hit_tp{i}") or row.get(f"tp{i}_filled") or highest>=i) for i in (1,2,3)]
        if hits[2]:return "TP3 registrado sin cierre conciliado"
        targets=row.get("targets") or [row.get(f"tp{i}") for i in (1,2,3)]
        for i in (2,1,0):
            target=float(targets[i] or 0)
            if target>0 and not hits[i] and (mark>=target if long else mark<=target):
                return f"Precio alcanza TP{i+1}; falta conciliar la actualización"
        entry=row.get("entry_price",row.get("entry"))
        be=row.get("be_active") or row.get("be_activated")
        stop=float((entry if be else row.get("current_sl") or row.get("original_stop") or row.get("stop_loss")) or 0)
        if stop>0 and (mark<=stop if long else mark>=stop):return "Precio alcanza el stop del escenario; salida sin conciliar"
    except (ValueError,TypeError,IndexError):return "Niveles insuficientes para validar el estado"
    return None
