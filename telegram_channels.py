"""English Free channel and daily highest-TP reports. Durable, separate from Onza."""
from __future__ import annotations

import os
import time
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from html import escape

import requests
from dotenv import load_dotenv
from psycopg2.extras import Json, RealDictCursor

from audit_log import audit, audit_wait

COLOMBIA = timezone(timedelta(hours=-5))
APP_URL = "https://apps.apple.com/app/id6768534887"
DEFAULT_FREE_CHANNEL = "-1004466702211"
CTA_EN = "📲 JOIN ONZA APP NOW 👇🏻\n" + APP_URL
CTA_ES = "📲 ENTRA A ONZA APP YA MISMO 👇🏻\n" + APP_URL


def roi(entry, price, direction, leverage=20):
    entry, price = Decimal(str(entry)), Decimal(str(price))
    return (price - entry) / entry * Decimal(str(leverage)) * 100 * (1 if direction == "LONG" else -1)


def highest_result(row):
    for n in (3, 2, 1):
        if row.get(f"hit_tp{n}"):
            price = row.get(f"tp{n}_exit_price") or row[f"tp{n}"]
            return f"TP{n}", roi(row["entry_price"], price, row["direction"], row["leverage"])
    label = "SL" if row["close_reason"] == "SL" else "CLOSE"
    return label, roi(row["entry_price"], row["exit_price"], row["direction"], row["leverage"])


def report_parts(rows, day, english=False, weekly=False):
    """Chunk long reports; summary is last and is the only pinned message."""
    lines, values, labels = [], [], []
    for row in rows:
        label, value = highest_result(row)
        values.append(value)
        labels.append(label)
        direction_icon = "🟢" if row["direction"] == "LONG" else "🔴"
        result_icon = "🏆" if label == "TP3" else "✅" if label.startswith("TP") else "🛑" if label == "SL" else "🔄"
        lines.append(f"{direction_icon} {row['symbol']} · {row['direction']}\n{result_icon} {label} · {value:+.2f}%\n")
    heading = ("📊 ONZA FUTURES · DAILY RESULTS" if english else "📊 ONZA FUTURES · CIERRE DEL DÍA") + f"\n📅 {day} · UTC\n"
    if weekly:
        heading = f"📊 ONZA FUTURES · WEEKLY RESULTS\n📅 {day} – {day + timedelta(days=6)} · UTC\n"
    chunks, current = [], heading
    for line in lines:
        if len(current) + len(line) > 3000:
            chunks.append(current + "\n\n" + (CTA_EN if english else CTA_ES))
            current = heading
        current += "\n" + line
    reached = sum(label.startswith("TP") for label in labels)
    stops = labels.count("SL")
    others = labels.count("CLOSE")
    rate = reached / len(values) * 100 if values else 0
    total = sum(values, Decimal(0))
    if english:
        summary = (f"\n━━━━━━━━━━━━━━━━━━\n📋 Closed trades: {len(rows)}\n✅ Reached a TP: {reached}"
                   f"\n❌ SL without TP: {stops}"
                   + (f"\n🔄 Other closes: {others}" if others else "")
                   + f"\n🎯 Highest-TP win rate: {rate:.2f}%\n📊 Sum of ROI per signal: {total:+.2f}%\n\n" + CTA_EN)
    else:
        summary = (f"\n━━━━━━━━━━━━━━━━━━\n📋 Operaciones cerradas: {len(rows)}\n✅ Con TP alcanzado: {reached}"
                   f"\n❌ SL sin TP: {stops}"
                   + (f"\n🔄 Otros cierres: {others}" if others else "")
                   + f"\n🎯 Efectividad por máximo TP: {rate:.2f}%\n📊 Suma de ROI por señal: {total:+.2f}%\n\n" + CTA_ES)
    if len(current + summary) > 3900:
        chunks.append(current + "\n\n" + (CTA_EN if english else CTA_ES))
        current = heading
    chunks.append(current + summary)
    return chunks


def duration_text(opened_at, event_time):
    minutes = max(0, int((event_time - opened_at).total_seconds() // 60))
    parts = []
    for value, unit in ((minutes // 1440, "day"), ((minutes % 1440) // 60, "hour"), (minutes % 60, "minute")):
        if value:
            parts.append(f"{value} {unit}{'s' if value != 1 else ''}")
    return " ".join(parts) or "0 minutes"


def free_text(payload, opened_at=None, event_time=None, margin_used=None):
    kind = payload["typeSignal"]
    header = f"⚡ ONZA FUTURES\n🪙 {payload['symbol']} · {payload['direction']} · {payload['timeframe']}"
    if kind == "entry":
        targets = "\n".join(f"🎯 TP{i}: {t['price']} · {roi(payload['entry'], t['price'], payload['direction'], payload['leverage']):+.2f}%"
                            for i, t in enumerate(payload["takeProfits"], 1))
        return (f"🎁 FREE SIGNAL · FULL ACCESS\n{header}\n⚙️ Leverage: {payload['leverage']}x"
                f"\nEntry price: {payload['entry']}\n{targets}\n🛑 Stop Loss: {payload['stopLoss']['price']}"
                "\n\nOne of our free weekly signals. Full levels included. Follow the updates below.\n\n" + CTA_EN)
    label = {"tp1": "✅ TP1 REACHED", "tp2": "✅ TP2 REACHED", "tp3": "🏆 TP3 REACHED",
             "sl": "🛑 STOP LOSS REACHED", "close": "🔄 TRADE CLOSED"}[kind]
    value = roi(payload["entry"], payload["price"], payload["direction"], payload["leverage"])
    identity = escape(f"{payload['symbol']} · {payload['direction']} · {payload['timeframe']}")
    body = (f"<b>{label}</b>\n⚡ <b>ONZA FUTURES</b>\n━━━━━━━━━━━━━━━━━━\n\n"
            f"🪙 <b>{identity}</b>\n📍 <b>Entry price:</b> {escape(str(payload['entry']))}"
            f"\n🎯 <b>Last price:</b> {escape(str(payload['price']))}\n📊 <b>ROI:</b> {value:+.2f}%")
    if margin_used is not None:
        body += f"\n💵 <b>P&amp;L:</b> {Decimal(str(margin_used)) * value / 100:+.2f} USDT"
    if opened_at and event_time:
        body += f"\n⏱️ <b>Duration:</b> {duration_text(opened_at,event_time)}"
    return body + "\n\n📲 <b>JOIN ONZA APP NOW</b> 👇🏻\n" + APP_URL


def masked_entry(payload):
    return ("🔔 <b>NEW SIGNAL · ONZA FUTURES</b>\n━━━━━━━━━━━━━━━━━━\n\n"
            f"🪙 <b>{escape(payload['symbol'])} · {escape(payload['timeframe'])}</b>\n"
            f"⚡ <b>Leverage: {payload['leverage']}x</b>\n"
            "🔒 <b>Direction: HIDDEN</b>\n📍 <b>Entry:</b> 🔒\n"
            "🎯 <b>TP1:</b> 🔒\n🎯 <b>TP2:</b> 🔒\n🎯 <b>TP3:</b> 🔒\n⛔ <b>SL:</b> 🔒\n\n"
            "🚀 <b>Unlock the full signal in Onza App</b>\n\n📲 <b>JOIN ONZA APP NOW</b> 👇🏻\n" + APP_URL)


def momentum(rows):
    stats = {d: [0, Decimal(0)] for d in ("LONG", "SHORT")}
    for row in rows:
        d = row["direction"]
        if d in stats:
            v = Decimal(str(row["final_profit_pct"] or 0))
            stats[d][0] += int(v > 0)
            stats[d][1] += v
    eligible = sorted((d for d in stats if stats[d][0] >= 2 and stats[d][1] > 0), key=lambda d: stats[d], reverse=True)
    return eligible[0] if eligible and (len(eligible) == 1 or stats[eligible[0]] != stats[eligible[1]]) else None


def enqueue(cur, key, chat, method, body, parent=None, pin=False):
    cur.execute("""INSERT INTO telegram_publications (job_key,chat_id,method,body,parent_key,pin_after)
                   VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT (job_key) DO NOTHING""",
                (key, str(chat), method, Json(body), parent, pin))


def plan_free(cur, channel):
    # Activation boundary prevents backfilling old signals when Free is first configured.
    key = "free_started:" + channel
    cur.execute("INSERT INTO telegram_channel_state (name,value) VALUES (%s,%s) ON CONFLICT DO NOTHING",
                (key, datetime.now(timezone.utc).isoformat()))
    cur.execute("SELECT value FROM telegram_channel_state WHERE name=%s", (key,))
    started = cur.fetchone()["value"]
    cur.execute("""SELECT e.*,s.telegram_chat_id,s.margin_used,t.date AS opened_at FROM tv_events e
                   JOIN tv_signals s ON s.signal_id=e.signal_id JOIN trades t ON t.message_id=s.id
                   WHERE e.state='applied' AND e.telegram_status='delivered' AND e.received_at >= %s::timestamptz
                     AND NOT EXISTS (SELECT 1 FROM telegram_free_seen f WHERE f.event_id=e.id AND f.chat_id=%s)
                   ORDER BY e.id LIMIT 100""", (started, channel))
    events = cur.fetchall()
    blacklist = {x.strip().upper().replace("USDT", "USD").removesuffix(".P") for x in os.getenv("ONZA_FREE_BLACKLIST", "").split(",") if x.strip()}
    for event in events:
        p, kind = event["payload"], event["event_type"]
        parent_key = f"free:{channel}:{p['signalId']}:entry"
        cur.execute("SELECT * FROM telegram_free_selections WHERE signal_id=%s AND chat_id=%s", (p["signalId"], channel))
        selected = cur.fetchone()
        if kind == "entry":
            day = datetime.now(COLOMBIA).date()
            monday = day - timedelta(days=day.weekday())
            cur.execute("SELECT count(*) AS n FROM telegram_free_selections WHERE chat_id=%s AND week_start=%s", (channel, monday))
            count = cur.fetchone()["n"]
            cur.execute("SELECT symbol,direction,final_profit_pct FROM sim_track_record WHERE closed_at <= %s ORDER BY closed_at DESC LIMIT 8", (event["received_at"],))
            dominant = momentum([r for r in cur.fetchall() if r["symbol"].replace("USDT", "USD").removesuffix(".P") not in blacklist])
            # Do not offer entries that have already progressed while the queue was offline.
            cur.execute("SELECT 1 FROM tv_events WHERE signal_id=%s AND event_type<>'entry' AND state='applied' LIMIT 1", (p["signalId"],))
            progressed = cur.fetchone()
            if count < 3 and dominant == p["direction"] and not progressed and p["symbol"].removesuffix(".P") not in blacklist:
                cur.execute("INSERT INTO telegram_free_selections (signal_id,chat_id,week_start) VALUES (%s,%s,%s)", (p["signalId"],channel,monday))
                enqueue(cur, parent_key, channel, "sendMessage", {"text": free_text(p)})
            else:
                enqueue(cur, parent_key, channel, "sendMessage", {"text": masked_entry(p), "parse_mode": "HTML"})
        else:
            cur.execute("SELECT 1 FROM telegram_publications WHERE job_key=%s", (parent_key,))
            if cur.fetchone():
                enqueue(cur, f"free:{channel}:{p['signalId']}:{kind}", channel, "copyMessage",
                        {"from_chat_id": event["telegram_chat_id"], "message_id": event["telegram_message_id"],
                         "caption": free_text(p,event["opened_at"],event["received_at"],event["margin_used"]),
                         "parse_mode": "HTML"}, parent=parent_key)

        cur.execute("INSERT INTO telegram_free_seen (event_id,chat_id) VALUES (%s,%s) ON CONFLICT DO NOTHING", (event["id"],channel))


def plan_daily(cur, main_channel, free_channel, now):
    # Persist the first day; catch up missed daily reports after restarts.
    key = "daily_next:" + main_channel
    today = now.astimezone(timezone.utc).date()
    cur.execute("INSERT INTO telegram_channel_state (name,value) VALUES (%s,%s) ON CONFLICT DO NOTHING", (key,str(today)))
    cur.execute("SELECT value FROM telegram_channel_state WHERE name=%s", (key,))
    day = datetime.fromisoformat(cur.fetchone()["value"]).date()
    if day >= today:
        return
    start = datetime.combine(day, datetime.min.time(), timezone.utc)
    end = start + timedelta(days=1)
    cur.execute("SELECT * FROM sim_track_record WHERE closed_at >= %s AND closed_at < %s ORDER BY closed_at,id", (start,end))
    rows = cur.fetchall()
    main_parts = report_parts(rows,day)
    for i, text in enumerate(main_parts):
        enqueue(cur,f"daily:{main_channel}:{day}:{i}",main_channel,"sendMessage",{"text":text},pin=i==len(main_parts)-1)
        if i:
            cur.execute("UPDATE telegram_publications SET requires_key=%s WHERE job_key=%s",
                        (f"daily:{main_channel}:{day}:{i-1}",f"daily:{main_channel}:{day}:{i}"))
    cur.execute("UPDATE telegram_channel_state SET value=%s WHERE name=%s", (str(day+timedelta(days=1)),key))


def plan_weekly(cur, channel, now):
    today = now.astimezone(timezone.utc).date()
    monday = today - timedelta(days=today.weekday())
    key = "weekly_next:" + channel
    cur.execute("INSERT INTO telegram_channel_state (name,value) VALUES (%s,%s) ON CONFLICT DO NOTHING", (key,str(monday)))
    cur.execute("SELECT value FROM telegram_channel_state WHERE name=%s", (key,))
    start_day = datetime.fromisoformat(cur.fetchone()["value"]).date()
    if start_day >= monday:
        return
    start = datetime.combine(start_day, datetime.min.time(), timezone.utc)
    end = start + timedelta(days=7)
    cur.execute("SELECT * FROM sim_track_record WHERE closed_at >= %s AND closed_at < %s ORDER BY closed_at,id", (start,end))
    parts = report_parts(cur.fetchall(),start_day,True,weekly=True)
    for i,text in enumerate(parts):
        job = f"weekly:{channel}:{start_day}:{i}"
        enqueue(cur,job,channel,"sendMessage",{"text":text})
        if i:
            cur.execute("UPDATE telegram_publications SET requires_key=%s WHERE job_key=%s",(f"weekly:{channel}:{start_day}:{i-1}",job))
    cur.execute("UPDATE telegram_channel_state SET value=%s WHERE name=%s",(str(start_day+timedelta(days=7)),key))


def call_telegram(method, body):
    try:
        response = requests.post(f"https://api.telegram.org/bot{os.environ['TELEGRAM_BOT_TOKEN']}/{method}",json=body,timeout=15)
        data = response.json()
        if response.status_code == 200 and isinstance(data,dict) and data.get("ok") is True:
            result = data.get("result")
            if method in ("pinChatMessage","unpinChatMessage"):
                return "delivered",None,"confirmed"
            if isinstance(result,dict) and type(result.get("message_id")) is int:
                return "delivered",result["message_id"],"confirmed"
        if response.status_code == 429:
            return "pending",None,"rate limited"
        return "failed",None,f"HTTP {response.status_code}"
    except (requests.RequestException,ValueError):
        return "unknown",None,"No confirmation; manual reconciliation required"


def deliver(conn):
    with conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""SELECT j.*,p.message_id AS parent_message FROM telegram_publications j
                LEFT JOIN telegram_publications p ON p.job_key=j.parent_key
                LEFT JOIN telegram_publications r ON r.job_key=j.requires_key
                WHERE j.status='pending' AND j.available_at <= now()
                  AND (j.parent_key IS NULL OR p.status='delivered')
                  AND (j.requires_key IS NULL OR r.status='delivered')
                ORDER BY j.id LIMIT 1 FOR UPDATE OF j SKIP LOCKED""")
            job = cur.fetchone()
            if not job:
                return False
            cur.execute("UPDATE telegram_publications SET status='sending' WHERE id=%s",(job["id"],))
    body = dict(job["body"],chat_id=job["chat_id"])
    if job["parent_message"]:
        body["reply_parameters"] = {"message_id":job["parent_message"],"allow_sending_without_reply":False}
    status,msg,detail = call_telegram(job["method"],body)
    with conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("UPDATE telegram_publications SET status=%s,message_id=%s,detail=%s,available_at=now()+interval '60 seconds' WHERE id=%s",(status,msg,detail,job["id"]))
            if status == "delivered" and job["pin_after"]:
                enqueue(cur,job["job_key"]+":pin",job["chat_id"],"pinChatMessage",{"message_id":msg,"disable_notification":True})
            if status == "delivered" and job["method"] == "pinChatMessage":
                # Track only confirmed pins; never remove unrelated pinned messages.
                cur.execute("SELECT value FROM telegram_channel_state WHERE name=%s",("pinned:"+job["chat_id"],))
                previous = cur.fetchone()
                if previous:
                    enqueue(cur,job["job_key"]+":unpin",job["chat_id"],"unpinChatMessage",{"message_id":int(previous["value"])})
                cur.execute("INSERT INTO telegram_channel_state(name,value) VALUES (%s,%s) ON CONFLICT(name) DO UPDATE SET value=excluded.value",("pinned:"+job["chat_id"],str(job["body"]["message_id"])))
    audit("TELEGRAM DISTRIBUCION",canal=job["chat_id"],publicacion=job["job_key"],estado=status,detalle=detail)
    return True


def main():
    load_dotenv()
    from worker import connect
    audit("WORKER INICIADO",canal="free y resumen diario")
    while True:
        conn = None
        try:
            if not os.getenv("TELEGRAM_BOT_TOKEN") or not os.getenv("DESTINATION_CHANNEL_ID"):
                time.sleep(5)
                continue
            main_channel = os.environ["DESTINATION_CHANNEL_ID"]
            free_channel = os.getenv("FREE_CHANNEL_ID", DEFAULT_FREE_CHANNEL).strip()
            if free_channel == main_channel:
                raise ValueError("FREE_CHANNEL_ID debe ser distinto del canal principal")
            conn = connect()
            with conn.cursor() as cur:
                cur.execute("SELECT pg_try_advisory_lock(173614710)")
                owner = cur.fetchone()[0]
            conn.commit()
            if owner:
                with conn:
                    with conn.cursor(cursor_factory=RealDictCursor) as cur:
                        if free_channel:
                            # Cancel unsent daily Free reports when switching to weekly.
                            cur.execute("UPDATE telegram_publications SET status='skipped',detail='Replaced by weekly report' WHERE chat_id=%s AND job_key LIKE %s AND status='pending'",(free_channel,f"daily:{free_channel}:%"))
                            plan_free(cur,free_channel)
                            plan_weekly(cur,free_channel,datetime.now(timezone.utc))
                        plan_daily(cur,main_channel,free_channel,datetime.now(timezone.utc))
                for _ in range(30):
                    if not deliver(conn):
                        break
        except Exception as exc:
            audit_wait("TELEGRAM DISTRIBUCION ERROR",error=type(exc).__name__)
        finally:
            if conn is not None:
                conn.close()
        time.sleep(2)


if __name__ == "__main__":
    main()
