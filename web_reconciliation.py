"""Read-only web rows reconciled from alerts and versioned candle evidence."""
import threading
import time
from audit_reporting import AUDIT_SQL, build_report
from presentation_config import RISK_PER_TRADE

_lock=threading.Lock()
_cache=(None,[])
_integrity={}


def recovered_rows(cur):
    global _cache,_integrity
    with _lock:
        cur.execute("SELECT COALESCE(MAX(id),0) AS latest,COUNT(*) FILTER(WHERE state='pending') AS pending,MAX(applied_at) AS applied FROM tv_events")
        version=dict(cur.fetchone())
        if version==_cache[0]:return _cache[1]
        cur.execute(AUDIT_SQL)
        report=build_report(cur.fetchall(),mode="partial_be",risk_override=RISK_PER_TRADE)
        _integrity=report["integrity"]
        if report["integrity"]["math_errors"]:raise RuntimeError("La verificación matemática del histórico requiere revisión")
        records=[]
        for row in report["rows"]:
            if not row["reconstruction"] or not row.get("signal_pk"):continue
            targets=row["targets"];legs={l["kind"]:l for l in row["legs"]}
            record={"id":-int(row["signal_pk"]),"signal_pk":int(row["signal_pk"]),"reconstruction_note":row["reconstruction"]["note"],"symbol":row["symbol"].replace("USD.P","USDT"),
                    "direction":row["direction"],"entry_price":row["entry_price"],"exit_price":row["exit_price"],
                    "stop_loss":row["original_stop"],"margin_used":row["margin_used"],"leverage":int(row["leverage"]),
                    "final_profit_usdt":row["pnl_usdt"],"final_profit_pct":row["roi_pct"],
                    "close_reason":row["close_reason"],"opened_at":row["received_at"],"closed_at":row["closed_at"],"duration":"Reconstruido"}
            for i in (1,2,3):
                leg=legs.get(f"TP{i}");record.update({f"tp{i}":targets[i-1],f"hit_tp{i}":bool(leg),
                     f"tp{i}_exit_price":leg["price"] if leg else None,f"tp{i}_profit_pct":leg["roi_pct"] if leg else None})
            records.append(record)
        _cache=(version,records)
        return records


def note_for_record(record_id):
    for row in _cache[1]:
        if row["id"]==record_id or (not row["closed_at"] and row["signal_pk"]==record_id):return row["reconstruction_note"]
    return None


def integrity_status():
    with _lock:return dict(_integrity)
