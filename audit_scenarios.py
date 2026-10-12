"""Read-only risk scenarios reconstructed from the persisted TradingView ledger."""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP

WEIGHTS = {"tp1": Decimal(".4"), "tp2": Decimal(".4"), "tp3": Decimal(".2")}
MODES = frozenset({"partial_no_be", "partial_be", "max_tp"})
CENT = Decimal(".01")


def _dec(value):
    result = Decimal(str(value))
    if not result.is_finite():
        raise ValueError("Valor no finito en el registro")
    return result


def _money(value):
    return float(value.quantize(CENT, rounding=ROUND_HALF_UP))


def _pnl(direction, entry, price, leverage, margin, fraction):
    change = price - entry if direction == "LONG" else entry - price
    return change / entry * leverage * margin * fraction


def evaluate(signal_id: str, events: list[dict], *, mode: str, margin,
             be_hit_at: datetime | None = None, be_hit_price=None,
             be_activated_at: datetime | None = None) -> dict:
    if mode not in MODES:
        raise ValueError("Modo de auditoría inválido")
    ordered = sorted(events, key=lambda e: (e.get("applied_at") or e["received_at"], e["id"]))
    entry_event = next((e for e in ordered if e["typeSignal"] == "entry"), None)
    if entry_event is None:
        raise ValueError("Señal sin entrada")
    initial = entry_event["payload"]
    entry, leverage, trade_margin = map(_dec, (initial["entry"], initial["leverage"], margin))
    direction = initial["direction"]
    if direction not in ("LONG", "SHORT") or min(entry, leverage, trade_margin) <= 0:
        raise ValueError("Entrada, dirección, margen o apalancamiento inválidos")
    # Raw reach and the scenario exit are separate: a BE exit does not erase
    # later TP alerts from the base ledger, nor credit them to the BE position.
    base_events, targets, terminal = [], {}, None
    for event in ordered:
        if event["typeSignal"] == "entry":
            continue
        base_events.append(event)
        kind = event["typeSignal"]
        if kind in WEIGHTS:
            if kind in targets:
                raise ValueError("TP duplicado")
            if kind != "tp1" and f"tp{int(kind[-1]) - 1}" not in targets:
                raise ValueError("Falta el TP anterior")
            targets[kind] = event
        if kind in ("tp3", "sl", "close"):
            terminal = event
            break
    tp1 = targets.get("tp1")
    activation = (be_activated_at or tp1["received_at"]) if tp1 else None
    highest = max((int(k[-1]) for k in targets), default=0)
    remaining, profit = Decimal(1), Decimal(0)
    partial_profit = sum((_pnl(direction, entry, _dec(e["payload"]["price"]),
                              leverage, trade_margin, WEIGHTS[k])
                          for k, e in targets.items()), Decimal(0))
    legs, close_reason, closed_at, exit_price = [], "OPEN", None, None
    be_exit = False
    be_observed = bool(activation and be_hit_at and be_hit_at >= activation)
    quality = "webhook_simulation_no_fills"

    def add_leg(kind, price, fraction, moment, basis="recorded_alert"):
        nonlocal remaining, profit, exit_price
        price = _dec(price)
        amount = _pnl(direction, entry, price, leverage, trade_margin, fraction)
        profit += amount
        remaining -= fraction
        exit_price = price
        legs.append({"kind": kind, "price": float(price), "fraction": float(fraction),
                     "quantity": float(trade_margin * leverage / entry * fraction),
                     "pnl_usdt": _money(amount), "roi_pct": _money(amount / trade_margin * 100),
                     "at": moment.isoformat(), "basis": basis})

    def exit_be(moment, inferred=False):
        nonlocal close_reason, closed_at, be_exit, quality
        observed = _dec(be_hit_price) if be_hit_price is not None and not inferred else entry
        price = min(entry, observed) if direction == "LONG" else max(entry, observed)
        add_leg("BE", price, remaining, moment, "tp1_rule_inferred" if inferred else "price_observation")
        close_reason = "BE_INFERRED" if inferred else "BE_OBSERVED"
        closed_at, be_exit = moment, True
        quality = "be_inferred_from_original_sl" if inferred else "be_price_observed_no_fill"

    if mode == "max_tp":
        quality = "highest_tp_full_margin_hindsight"
        if terminal:
            chosen = targets.get(f"tp{highest}") if highest else terminal
            close_reason = f"TP{highest}" if highest else terminal["typeSignal"].upper()
            closed_at = terminal.get("applied_at") or terminal["received_at"]
            add_leg(close_reason, chosen["payload"]["price"], Decimal(1),
                    chosen.get("applied_at") or chosen["received_at"], "highest_tp_hindsight")
    else:
        activated = False
        for event in base_events:
            kind = event["typeSignal"]
            moment = event.get("applied_at") or event["received_at"]
            # Process TP1 itself before its newly enabled stop can exit.
            if (mode == "partial_be" and activated and be_observed
                    and be_hit_at <= moment and remaining > 0):
                exit_be(be_hit_at)
                break
            if kind in WEIGHTS:
                add_leg(kind.upper(), event["payload"]["price"], WEIGHTS[kind], moment)
                if kind == "tp1":
                    activated = True
                if remaining == 0:
                    close_reason, closed_at = "TP3", moment
                    break
            elif kind in ("sl", "close"):
                price = _dec(event["payload"]["price"])
                adverse = price <= entry if direction == "LONG" else price >= entry
                if mode == "partial_be" and activated and adverse:
                    exit_be(moment, inferred=True)
                else:
                    add_leg(kind.upper(), price, remaining, moment)
                    close_reason, closed_at = kind.upper(), moment
                break
        if mode == "partial_be" and remaining > 0 and tp1 and be_observed:
            exit_be(be_hit_at)
        if mode == "partial_be" and tp1 and not be_exit:
            quality = "be_path_unverified"
    complete = closed_at is not None
    return {
        "signal_id": signal_id, "symbol": initial["symbol"], "direction": direction,
        "timeframe": initial["timeframe"], "mode": mode,
        "entry_price": float(entry), "margin_used": float(trade_margin),
        "leverage": float(leverage), "quantity_initial": float(trade_margin * leverage / entry),
        "original_stop": initial.get("stopLoss", {}).get("price"),
        "targets": [t.get("price") for t in initial.get("takeProfits", [])],
        "max_tp": highest, "be_activated": tp1 is not None,
        "be_activated_at": activation.isoformat() if activation else None,
        "be_stop_price": float(entry) if tp1 else None,
        "be_applied": mode == "partial_be" and tp1 is not None,
        "be_model_exit": be_exit, "be_observed": be_observed, "be_fill_verified": False,
        "close_reason": close_reason, "base_close_reason": terminal["typeSignal"].upper() if terminal else "OPEN",
        "closed": complete, "quality": quality,
        "received_at": entry_event["received_at"].isoformat(),
        "closed_at": closed_at.isoformat() if closed_at else None,
        "exit_price": float(exit_price) if exit_price is not None else None,
        "remaining_fraction": float(remaining), "legs": legs,
        "pnl_usdt": _money(profit) if complete else None,
        "roi_pct": _money(profit / trade_margin * 100) if complete else None,
        "scenario_partial_pnl_usdt": _money(profit) if not complete else None,
        "recorded_partial_pnl_usdt": _money(partial_profit),
    }


def summarize(rows: list[dict], mode: str) -> dict:
    closed = [r for r in rows if r["closed"] and r["pnl_usdt"] is not None]
    values = [_dec(r["pnl_usdt"]) for r in closed]
    gross_profit = sum((v for v in values if v > 0), Decimal(0))
    gross_loss = -sum((v for v in values if v < 0), Decimal(0))
    equity = peak = drawdown = Decimal(0)
    curve = []
    for r in sorted(closed, key=lambda r: (r["closed_at"], r["signal_id"])):
        equity += _dec(r["pnl_usdt"])
        peak = max(peak, equity)
        drawdown = max(drawdown, peak - equity)
        curve.append({"at": r["closed_at"], "signal_id": r["signal_id"], "pnl_usdt": _money(equity)})
    return {"mode": mode, "signals": len(rows), "closed": len(closed), "open": len(rows) - len(closed),
            "max_tp_counts": {str(i): sum(r["max_tp"] == i for r in rows) for i in range(4)},
            "reached_counts": {str(i): sum(r["max_tp"] >= i for r in rows) for i in range(1, 4)},
            "be_activated": sum(r["be_activated"] for r in rows),
            "be_observed": sum(r["be_observed"] for r in rows),
            "inferred": sum(r["be_model_exit"] and not r["be_observed"] for r in rows),
            "unverified": sum(r["quality"] == "be_path_unverified" for r in rows),
            "pnl_usdt": _money(sum(values, Decimal(0))),
            "win_rate": round(100 * sum(v > 0 for v in values) / len(values), 2) if values else None,
            "profit_factor": round(float(gross_profit / gross_loss), 3) if gross_loss else None,
            "profit_factor_unbounded": gross_loss == 0 and gross_profit > 0,
            "gross_profit": _money(gross_profit), "gross_loss": _money(gross_loss),
            "wins": sum(v > 0 for v in values), "losses": sum(v < 0 for v in values),
            "flat": sum(v == 0 for v in values), "max_drawdown_usdt": _money(drawdown),
            "worst_trade_usdt": _money(min(values)) if values else None,
            "average_trade_usdt": _money(sum(values, Decimal(0)) / len(values)) if values else None,
            "open_partial_pnl_usdt": _money(sum((_dec(r["scenario_partial_pnl_usdt"] or 0)
                                                 for r in rows if not r["closed"]), Decimal(0))),
            "curve": curve}
