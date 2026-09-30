"""Tres lecturas de un mismo registro inmutable de señales TradingView.

Estos resultados son simulaciones brutas; un TP tocado no demuestra un fill
en Bitunix. El modo de alcance no asigna beneficios monetarios.
"""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP


WEIGHTS = {"tp1": Decimal("0.40"), "tp2": Decimal("0.40"), "tp3": Decimal("0.20")}
MODES = frozenset({"partial_no_be", "partial_be", "max_tp"})
CENT = Decimal("0.01")


def _dec(value) -> Decimal:
    return Decimal(str(value))


def _pnl(direction: str, entry: Decimal, price: Decimal,
         leverage: Decimal, margin: Decimal, fraction: Decimal) -> Decimal:
    change = price - entry if direction == "LONG" else entry - price
    return change / entry * leverage * margin * fraction


def evaluate(signal_id: str, events: list[dict], *, mode: str, margin,
             be_hit_at: datetime | None = None, be_hit_price=None,
             be_activated_at: datetime | None = None) -> dict:
    if mode not in MODES:
        raise ValueError("Modo de auditoría inválido")
    # Un TP puede recibirse antes que otro por latencia de alertas; la cola
    # aplica los eventos en orden lógico y applied_at refleja esa secuencia.
    ordered = sorted(events, key=lambda item: (item.get("applied_at") or item["received_at"], item["id"]))
    entry_event = next((e for e in ordered if e["typeSignal"] == "entry"), None)
    if entry_event is None:
        raise ValueError("Señal sin entrada")
    initial = entry_event["payload"]
    entry = _dec(initial["entry"])
    leverage = _dec(initial["leverage"])
    trade_margin = _dec(margin)
    direction = initial["direction"]
    reached = {name: False for name in WEIGHTS}
    remaining = Decimal(1)
    profit = Decimal(0)
    close_reason = "OPEN"
    closed_at = None
    be_model_exit = False
    be_observed = be_hit_at is not None
    quality = "webhook_simulation_no_fills"
    activation = be_activated_at

    def exit_be(moment, *, inferred=False):
        nonlocal remaining, profit, close_reason, closed_at, be_model_exit, quality
        observed = _dec(be_hit_price) if be_hit_price is not None and not inferred else entry
        # Una observación posterior a un salto de precio no puede mejorar el fill BE.
        exit_price = min(entry, observed) if direction == "LONG" else max(entry, observed)
        profit += _pnl(direction, entry, exit_price, leverage, trade_margin, remaining)
        remaining = Decimal(0)
        close_reason = "BE_INFERRED" if inferred else "BE_OBSERVED"
        closed_at = moment
        be_model_exit = True
        if inferred:
            quality = "be_inferred_from_original_sl"

    for event in ordered:
        kind = event["typeSignal"]
        if kind == "entry":
            continue
        moment = event.get("applied_at") or event["received_at"]
        if (mode == "partial_be" and activation is not None and be_hit_at is not None
                and be_hit_at >= activation and be_hit_at <= moment and remaining > 0):
            exit_be(be_hit_at)
        if kind in WEIGHTS:
            reached[kind] = True
            if kind == "tp1" and activation is None:
                activation = moment
            if mode == "max_tp":
                if kind == "tp3":
                    close_reason = "TP3"
                    closed_at = moment
                    break
                continue
            if remaining <= 0:
                continue
            fraction = min(remaining, WEIGHTS[kind])
            profit += _pnl(direction, entry, _dec(event["payload"]["price"]),
                           leverage, trade_margin, fraction)
            remaining -= fraction
            if remaining == 0:
                close_reason = "TP3"
                closed_at = moment
                break
        elif kind in ("sl", "close"):
            price = _dec(event["payload"]["price"])
            if mode == "max_tp":
                close_reason = kind.upper()
                closed_at = moment
                break
            adverse = (price < entry if direction == "LONG" else price > entry)
            if remaining > 0 and mode == "partial_be" and activation is not None and adverse:
                # El evento adverso sugiere cruce de entrada después de TP1.
                # Sin ticks/fills se contabiliza BE teórico y se marca inferido.
                exit_be(moment, inferred=True)
            elif remaining > 0:
                profit += _pnl(direction, entry, price,
                               leverage, trade_margin, remaining)
                remaining = Decimal(0)
                close_reason = kind.upper()
                closed_at = moment
                if mode == "partial_be" and activation is not None and not be_observed:
                    quality = "be_path_unverified"
            break

    if mode == "partial_be" and remaining > 0 and activation is not None and be_hit_at is not None:
        if be_hit_at >= activation and (closed_at is None or be_hit_at <= closed_at):
            exit_be(be_hit_at)
    if mode == "partial_be" and activation is not None and not be_model_exit and not be_observed:
        quality = "be_path_unverified"
    highest = 3 if reached["tp3"] else 2 if reached["tp2"] else 1 if reached["tp1"] else 0
    complete = closed_at is not None or remaining == 0
    result = {
        "signal_id": signal_id, "symbol": initial["symbol"],
        "direction": direction, "timeframe": initial["timeframe"],
        "max_tp": highest, "be_activated": activation is not None,
        "be_model_exit": be_model_exit, "be_observed": be_observed,
        "be_fill_verified": False,
        "close_reason": close_reason, "closed": complete,
        "quality": quality if mode != "max_tp" else "tp_reached_by_webhook_no_fills",
        "received_at": entry_event["received_at"].isoformat(),
        "closed_at": closed_at.isoformat() if closed_at else None,
        "pnl_usdt": None, "roi_pct": None,
    }
    if mode != "max_tp" and complete:
        result["pnl_usdt"] = float(profit.quantize(CENT, rounding=ROUND_HALF_UP))
        result["roi_pct"] = float((profit / trade_margin * 100).quantize(CENT, rounding=ROUND_HALF_UP))
    return result


def summarize(rows: list[dict], mode: str) -> dict:
    counts = {str(i): sum(row["max_tp"] == i for row in rows) for i in range(4)}
    closed = [row for row in rows if row["closed"]]
    summary = {"mode": mode, "signals": len(rows), "closed": len(closed),
               "max_tp_counts": counts, "be_activated": sum(r["be_activated"] for r in rows),
               "be_observed": sum(r["be_observed"] for r in rows),
               "inferred": sum(r["quality"] == "be_inferred_from_original_sl" for r in rows),
               "unverified": sum(r["quality"] == "be_path_unverified" for r in rows)}
    if mode == "max_tp":
        summary.update({"pnl_usdt": None, "profit_factor": None, "win_rate": None})
        return summary
    eligible = [r for r in closed if r["pnl_usdt"] is not None]
    wins = sum(r["pnl_usdt"] > 0 for r in eligible)
    gross_profit = sum((r["pnl_usdt"] for r in eligible if r["pnl_usdt"] > 0), 0.0)
    gross_loss = -sum((r["pnl_usdt"] for r in eligible if r["pnl_usdt"] < 0), 0.0)
    summary.update({"pnl_usdt": round(sum(r["pnl_usdt"] for r in eligible), 2),
                    "win_rate": round(100 * wins / len(eligible), 2) if eligible else None,
                    "profit_factor": round(gross_profit / gross_loss, 3) if gross_loss else None,
                    "gross_profit": round(gross_profit, 2), "gross_loss": round(gross_loss, 2)})
    return summary
