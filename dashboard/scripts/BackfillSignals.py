#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Backfill de señales históricas → sim_track_record
==================================================

Toma las señales del endpoint público, reconstruye los campos que calcula tu
simulador (USDT, %, balance, duración, etc.) y las inserta en `sim_track_record`
EN ORDEN CRONOLÓGICO, igual que las que ya tienes.

REGLAS:
  - Solo inserta señales con closed_at ANTERIOR a CUTOFF (21 may 2026).
    Lo que ya hay del 21 en adelante NO se toca.
  - Es IDEMPOTENTE: si una señal ya existe (mismo symbol + opened_at), la salta.
    Puedes correrlo varias veces sin duplicar.
  - Modo de prueba por defecto: NO escribe nada.
  - BACKFILL_APPLY=true habilita la escritura explícitamente.

USO:
    export DATABASE_URL="postgresql://...."   # la misma del bot/dashboard
    python3 backfill_signals.py

Requisitos: psycopg2  (ya lo usas).  El HTTP usa la librería estándar (urllib).
"""

import os
import json
import urllib.request
from datetime import datetime, timezone
from decimal import Decimal

import psycopg2

# ── CONFIGURACIÓN ─────────────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "")
JSON_URL     = "https://server.smart-crypto-signals.com/api/public/trading-history"

DRY_RUN = os.getenv("BACKFILL_APPLY", "false").lower() != "true"  # escritura solo con autorización explícita
 
# Corte: solo señales CERRADAS antes de esta fecha (UTC). Lo del 21-may en adelante se respeta.
CUTOFF = datetime(2026, 5, 21, 0, 0, 0, tzinfo=timezone.utc)
 
# Mismos parámetros del simulador (.env del dashboard)
INITIAL_BALANCE = float(os.getenv("INITIAL_BALANCE", "1000"))
MARGIN          = float(os.getenv("MARGIN_PER_TRADE", "20"))
LEVERAGE        = int(os.getenv("LEVERAGE", "20"))
SPLITS          = [0.40, 0.40, 0.20]   # % de la posición que se cierra en TP1 / TP2 / restante
 
CLOSE_REASON_MAP = {"SL": "SL", "TP3": "TP3", "BREAKEVEN": "Closed"}
 
 
# ── UTILIDADES ────────────────────────────────────────────────────────────────
def fnum(v):
    """Convierte string/None a float (None → None)."""
    if v is None or v == "":
        return None
    return float(v)
 
 
def parse_ts(s):
    """ISO '2026-06-02T14:10:12.976Z' → datetime aware (UTC)."""
    if not s:
        return None
    return datetime.fromisoformat(s.replace("Z", "+00:00"))
 
 
def fmt_duration(opened, closed):
    """Devuelve 'X Hours Y Minutes' (formato del simulador)."""
    if not opened or not closed:
        return None
    total = int((closed - opened).total_seconds())
    h = total // 3600
    m = (total % 3600) // 60
    return f"{h} Hours {m} Minutes"
 
 
def simulate(sig):
    """
    Reconstruye el resultado del trade igual que el simulador:
    notional = margen × apalancamiento; cierres 40/40/20; el resto al exitPrice.
    Devuelve dict con usdt, pct y los pct/exit por TP.
    """
    entry  = fnum(sig["entryPrice"])
    exitp  = fnum(sig["exitPrice"])
    is_long = sig["direction"].upper() == "LONG"
 
    tps  = [fnum(sig.get("tp1")), fnum(sig.get("tp2")), fnum(sig.get("tp3"))]
    hits = [
        bool(sig.get("hitTp1")),
        bool(sig.get("hitTp2")),
        sig.get("closeReason") == "TP3",      # el JSON no trae hitTp3; se deriva del cierre
    ]
 
    notional = MARGIN * LEVERAGE
    qty      = notional / entry
    remainder = qty
    usdt = 0.0
 
    def leg_pnl(px, q):
        return (px - entry) * q if is_long else (entry - px) * q
 
    tp_profit_pct = [None, None, None]
    tp_exit_price = [None, None, None]
 
    for i in range(3):
        if hits[i] and tps[i]:
            portion = qty * SPLITS[i]
            usdt += leg_pnl(tps[i], portion)
            remainder -= portion
            tp_exit_price[i] = tps[i]
            move = (tps[i] - entry) / entry if is_long else (entry - tps[i]) / entry
            tp_profit_pct[i] = move * 100 * LEVERAGE
 
    # porción no cerrada en TP → se cierra al precio de salida final
    if remainder > 1e-12:
        usdt += leg_pnl(exitp, remainder)
 
    return {
        "usdt": usdt,
        "pct": usdt / MARGIN * 100,
        "hit_tp3": hits[2],
        "tp1_profit_pct": tp_profit_pct[0],
        "tp2_profit_pct": tp_profit_pct[1],
        "tp3_profit_pct": tp_profit_pct[2],
        "tp1_exit_price": tp_exit_price[0],
        "tp2_exit_price": tp_exit_price[1],
        "tp3_exit_price": tp_exit_price[2],
    }
 
 
def build_row(sig, running_balance):
    """Mapea una señal del JSON a una fila de sim_track_record."""
    opened = parse_ts(sig["openedAt"])
    closed = parse_ts(sig["closedAt"])
    sim    = simulate(sig)
 
    bal_before = running_balance
    bal_after  = running_balance + sim["usdt"]
 
    return {
        "symbol":          sig["symbol"],
        "direction":       sig["direction"].capitalize(),         # SHORT → Short
        "entry_price":     fnum(sig["entryPrice"]),
        "exit_price":      fnum(sig["exitPrice"]),
        "stop_loss":       fnum(sig["stopLoss"]),
        "tp1":             fnum(sig.get("tp1")),
        "tp2":             fnum(sig.get("tp2")),
        "tp3":             fnum(sig.get("tp3")),
        "hit_tp1":         bool(sig.get("hitTp1")),
        "hit_tp2":         bool(sig.get("hitTp2")),
        "hit_tp3":         sim["hit_tp3"],
        "tp1_exit_price":  sim["tp1_exit_price"],
        "tp2_exit_price":  sim["tp2_exit_price"],
        "tp3_exit_price":  sim["tp3_exit_price"],
        "tp1_profit_pct":  round(sim["tp1_profit_pct"], 4) if sim["tp1_profit_pct"] is not None else None,
        "tp2_profit_pct":  round(sim["tp2_profit_pct"], 4) if sim["tp2_profit_pct"] is not None else None,
        "tp3_profit_pct":  round(sim["tp3_profit_pct"], 4) if sim["tp3_profit_pct"] is not None else None,
        "final_profit_pct":  round(sim["pct"], 4),
        "final_profit_usdt": round(sim["usdt"], 4),
        "close_reason":    CLOSE_REASON_MAP.get(sig.get("closeReason"), "Closed"),
        "balance_before":  round(bal_before, 4),
        "balance_after":   round(bal_after, 4),
        "margin_used":     MARGIN,
        "leverage":        LEVERAGE,
        "duration":        fmt_duration(opened, closed),
        "opened_at":       opened,
        "closed_at":       closed,
    }, bal_after
 
 
COLUMNS = [
    "symbol", "direction", "entry_price", "exit_price", "stop_loss",
    "tp1", "tp2", "tp3", "hit_tp1", "hit_tp2", "hit_tp3",
    "tp1_exit_price", "tp2_exit_price", "tp3_exit_price",
    "tp1_profit_pct", "tp2_profit_pct", "tp3_profit_pct",
    "final_profit_pct", "final_profit_usdt", "close_reason",
    "balance_before", "balance_after", "margin_used", "leverage",
    "duration", "opened_at", "closed_at",
]
 
 
def main():
    if not DATABASE_URL:
        print("❌ Falta DATABASE_URL en el entorno."); return
 
    # 1) Descargar el JSON
    print(f"⬇️  Descargando señales de {JSON_URL} ...")
    with urllib.request.urlopen(JSON_URL, timeout=60) as r:
        signals = json.loads(r.read().decode("utf-8"))
    print(f"   Total recibidas: {len(signals)}")
 
    # 2) Filtrar SOLO cerradas antes del corte
    elegibles = []
    for s in signals:
        closed = parse_ts(s.get("closedAt"))
        if closed and closed < CUTOFF:
            elegibles.append(s)
    elegibles.sort(key=lambda s: parse_ts(s["closedAt"]))   # cronológico
    print(f"   Cerradas antes de {CUTOFF.date()}: {len(elegibles)}")
 
    if not elegibles:
        print("No hay señales que insertar con ese corte."); return
 
    conn = psycopg2.connect(DATABASE_URL)
    cur  = conn.cursor()
 
    # 3) Construir filas con balance encadenado
    running = INITIAL_BALANCE
    rows, skipped, invalid = [], 0, 0
    invalid_examples = []
    for s in elegibles:
        # Validar datos mínimos: sin entryPrice/exitPrice no se puede simular → saltar
        if fnum(s.get("entryPrice")) is None or fnum(s.get("exitPrice")) is None:
            invalid += 1
            if len(invalid_examples) < 5:
                invalid_examples.append(
                    f"id={s.get('id')} {s.get('symbol')} {s.get('closeReason')} "
                    f"entry={s.get('entryPrice')} exit={s.get('exitPrice')}")
            continue
        opened = parse_ts(s["openedAt"])
        # Idempotencia: si ya existe (mismo símbolo + apertura), saltar
        cur.execute(
            "SELECT 1 FROM sim_track_record WHERE symbol=%s AND opened_at=%s LIMIT 1",
            (s["symbol"], opened),
        )
        if cur.fetchone():
            skipped += 1
            continue
        row, running = build_row(s, running)
        rows.append(row)
 
    print(f"   A insertar: {len(rows)}   (ya existentes: {skipped}, sin precio entrada/salida: {invalid})")
    if invalid_examples:
        print("   Ejemplos de señales sin precio (se saltan):")
        for ex in invalid_examples:
            print(f"     · {ex}")
    if rows:
        tot = sum(r["final_profit_usdt"] for r in rows)
        print(f"   Rango: {rows[0]['closed_at'].date()} → {rows[-1]['closed_at'].date()}")
        print(f"   P&L total backfill: {tot:+.2f} USDT")
        print("\n   Ejemplos (primeras 3 filas):")
        for r in rows[:3]:
            print(f"     {r['closed_at']}  {r['symbol']:<12} {r['direction']:<6} "
                  f"{r['close_reason']:<7} {r['final_profit_pct']:+.2f}% "
                  f"{r['final_profit_usdt']:+.2f}USDT  bal→{r['balance_after']:.2f}")
 
    if DRY_RUN:
        print("\n🟡 DRY_RUN activo: NO se escribió nada. Revisa los números y pon DRY_RUN=False.")
        conn.rollback(); cur.close(); conn.close(); return
 
    # 4) Insertar (una sola transacción)
    placeholders = ", ".join(["%s"] * len(COLUMNS))
    sql = f"INSERT INTO sim_track_record ({', '.join(COLUMNS)}) VALUES ({placeholders})"
    cur.executemany(sql, [[r[c] for c in COLUMNS] for r in rows])
    conn.commit()
    print(f"\n✅ Insertadas {len(rows)} filas en sim_track_record.")
    cur.close(); conn.close()
 
 
if __name__ == "__main__":
    main()
 