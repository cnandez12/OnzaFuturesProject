"""Read-only web rows reconciled from alerts and versioned candle evidence."""
import threading
import time
from datetime import datetime,timezone
from audit_reporting import AUDIT_SQL, build_report
from presentation_config import RISK_PER_TRADE

_lock=threading.Lock()
_cache=(None,[])
_integrity={}
_open_notes={}


def recovered_rows(cur):
    global _cache,_integrity,_open_notes
    with _lock:
        cur.execute("SELECT COALESCE(MAX(id),0) AS latest,COUNT(*) FILTER(WHERE state='pending') AS pending,MAX(applied_at) AS applied FROM tv_events")
        version=dict(cur.fetchone())
        cur.execute("SELECT COALESCE(MAX(revision),0) AS revision FROM web_audit.evidence")
        version["web_revision"]=cur.fetchone()["revision"]
        cur.execute("SELECT last_completed_at FROM web_audit.health WHERE id=1")
        health=cur.fetchone();version["web_completed"]=health["last_completed_at"] if health else None
        if version==_cache[0]:return _cache[1]
        cur.execute(AUDIT_SQL)
        report=build_report(cur.fetchall(),mode="partial_be",risk_override=RISK_PER_TRADE)
        _integrity=dict(report["integrity"],web_revision=version["web_revision"],automatic_reconciliation=report["automatic_reconciliation"])
        if report["integrity"]["math_errors"]:raise RuntimeError("La verificación matemática del histórico requiere revisión")
        _open_notes={int(r["signal_pk"]):r.get("integrity_note") for r in report["rows"] if not r["closed"] and r.get("signal_pk")}
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
    with _lock:
        result=dict(_integrity)
        auto=dict(result.get("automatic_reconciliation") or {})
        completed=auto.get("last_completed_at")
        if auto.get("enabled") and (not completed or (datetime.now(timezone.utc)-datetime.fromisoformat(completed)).total_seconds()>240):auto["status"]="stale"
        result["automatic_reconciliation"]=auto
        return result


def open_note_for_record(record_id):
    auto=integrity_status().get("automatic_reconciliation",{})
    if auto.get("enabled") and auto.get("status")=="stale":return "Conciliación automática de mercado pendiente; rendimiento en revisión"
    with _lock:return _open_notes.get(record_id)
