"""Aplica eventos TradingView a las mismas tablas que consume el dashboard."""

from __future__ import annotations

import os
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP

from psycopg2.extras import RealDictCursor

from onza_contract import InvalidSignal, internal_pair, number


TP_WEIGHTS = {1: Decimal("0.40"), 2: Decimal("0.40"), 3: Decimal("0.20")}
EIGHT_PLACES = Decimal("0.00000001")
FOUR_PLACES = Decimal("0.0001")


class DeferredEvent(Exception):
    """El evento llegó antes que la entrada o el TP anterior."""


def margin() -> Decimal:
    value = number(os.getenv("MARGIN_PER_TRADE", "20"), "MARGIN_PER_TRADE", positive=True)
    return value


def starting_balance() -> Decimal:
    return number(os.getenv("INITIAL_BALANCE", "1000"), "INITIAL_BALANCE", positive=True)


def pnl_piece(direction: str, entry: Decimal, exit_price: Decimal,
              leverage: int, trade_margin: Decimal, fraction: Decimal) -> Decimal:
    movement = exit_price - entry if direction == "LONG" else entry - exit_price
    return (movement / entry * leverage * trade_margin * fraction).quantize(
        EIGHT_PLACES, rounding=ROUND_HALF_UP
    )


def _opened_at(signal_id: str) -> datetime:
    raw = int(signal_id.rsplit("_", 1)[1])
    return datetime.fromtimestamp(raw / (1000 if raw > 9999999999 else 1), tz=timezone.utc)


def _duration(start: datetime, end: datetime) -> str:
    minutes = max(0, int((end - start).total_seconds() // 60))
    return f"{minutes // 60}h {minutes % 60}m"


def _entry(cur, payload: dict, received_at: datetime | None = None) -> None:
    cur.execute(
        """INSERT INTO tv_signals (signal_id, symbol, timeframe, exchange, margin_used)
           VALUES (%s, %s, %s, %s, %s) ON CONFLICT (signal_id) DO NOTHING RETURNING id""",
        (payload["signalId"], payload["symbol"], payload["timeframe"],
         payload["sourceExchange"], str(margin())),
    )
    row = cur.fetchone()
    if row is None:
        raise InvalidSignal("Ya existe una entrada con este signalId")
    signal_pk = row[0] if not isinstance(row, dict) else row["id"]
    tps = payload["takeProfits"]
    cur.execute(
        """INSERT INTO trades
           (message_id, date, pair, leverage, entry, side, tp1, tp2, tp3,
            stop_loss, current_sl, source_exchange, pnl_accumulated, Close)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,0,FALSE)""",
        (
            signal_pk, received_at or _opened_at(payload["signalId"]), internal_pair(payload["symbol"]),
            payload["leverage"], str(payload["entry"]), payload["direction"],
            str(tps[0]["price"]), str(tps[1]["price"]), str(tps[2]["price"]),
            str(payload["stopLoss"]["price"]), str(payload["stopLoss"]["price"]),
            "BITUNIX",
        ),
    )


def _event(cur, payload: dict, received_at: datetime | None = None) -> None:
    cur.execute(
        """SELECT s.id, s.symbol, s.timeframe, s.exchange, s.margin_used, t.* FROM tv_signals s
           JOIN trades t ON t.message_id = s.id
           WHERE s.signal_id = %s FOR UPDATE OF t""",
        (payload["signalId"],),
    )
    row = cur.fetchone()
    if row is None:
        raise DeferredEvent("Esperando la entrada")
    trade = dict(row)
    if (trade["symbol"] != payload["symbol"] or trade["timeframe"] != payload["timeframe"]
            or trade["exchange"] != payload["sourceExchange"]
            or trade["side"] != payload["direction"] or trade["leverage"] != payload["leverage"]
            or Decimal(trade["entry"]) != Decimal(str(payload["entry"]))):
        raise InvalidSignal("El evento no coincide con su entrada")
    if trade["close"]:
        raise InvalidSignal("El trade ya está cerrado")

    event = payload["typeSignal"]
    entry = Decimal(trade["entry"])
    price = Decimal(str(payload["price"]))
    used_margin = Decimal(str(trade["margin_used"])) if trade["margin_used"] is not None else margin()
    accumulated = Decimal(str(trade["pnl_accumulated"] or 0))
    filled = {i: bool(trade[f"tp{i}_filled"]) for i in (1, 2, 3)}
    if event.startswith("tp"):
        index = int(event[-1])
        if index > 1 and not filled[index - 1]:
            raise DeferredEvent(f"Esperando TP{index - 1}")
        if filled[index]:
            raise InvalidSignal(f"TP{index} ya registrado")
        target = Decimal(trade[f"tp{index}"])
        if abs(price - target) > max(Decimal("0.00000001"), entry * Decimal("0.000001")):
            raise InvalidSignal(f"Precio de TP{index} no coincide")
        fraction = TP_WEIGHTS[index]
        pnl = pnl_piece(trade["side"], entry, price, trade["leverage"], used_margin, fraction)
        accumulated += pnl
        cur.execute(
            f"""UPDATE trades SET tp{index}_filled = TRUE,
                tp{index}_fill_price = %s, pnl_accumulated = %s
                WHERE message_id = %s""",
            (str(price), accumulated, trade["message_id"]),
        )
        if index == 1:
            # Hecho de la señal: TP1 habilita el BE hipotético. El registro base
            # sin BE conserva el stop original y sus parciales 40/40/20.
            cur.execute(
                "UPDATE tv_signals SET be_activated_at = COALESCE(be_activated_at, %s) WHERE signal_id = %s",
                (received_at or datetime.now(timezone.utc), payload["signalId"]),
            )
        filled[index] = True
        if index < 3:
            return
        close_reason = "TP3"
        exit_price = price
    else:
        if event == "sl":
            target = Decimal(trade["stop_loss"])
            if abs(price - target) > max(Decimal("0.00000001"), entry * Decimal("0.000001")):
                raise InvalidSignal("Precio SL no coincide")
        remaining = Decimal(1) - sum((TP_WEIGHTS[i] for i in filled if filled[i]), Decimal(0))
        accumulated += pnl_piece(trade["side"], entry, price, trade["leverage"], used_margin, remaining)
        close_reason = "SL" if event == "sl" else "SIGNAL_OPPOSITE"
        exit_price = price

    now = datetime.now(timezone.utc)
    total_pct = (accumulated / used_margin * 100).quantize(FOUR_PLACES, rounding=ROUND_HALF_UP)
    cur.execute("SELECT pg_advisory_xact_lock(173614708)")
    cur.execute("SELECT COALESCE(SUM(final_profit_usdt), 0) AS total FROM sim_track_record")
    balance_before = starting_balance() + Decimal(str(cur.fetchone()["total"]))
    balance_after = balance_before + accumulated
    cur.execute(
        """UPDATE trades SET Close = TRUE, sl_filled = %s, trade_pl = %s,
               duration = %s, pnl_accumulated = %s WHERE message_id = %s""",
        (event == "sl", f"{total_pct:+.2f}%", _duration(trade["date"], now),
         accumulated, trade["message_id"]),
    )
    tp_exit_prices = {
        i: price if event == f"tp{i}" else
        (Decimal(trade[f"tp{i}_fill_price"]) if trade.get(f"tp{i}_fill_price") else None)
        for i in (1, 2, 3)
    }
    tp_pct = {
        i: (pnl_piece(trade["side"], entry, tp_exit_prices[i], trade["leverage"],
                      used_margin, TP_WEIGHTS[i]) / used_margin * 100).quantize(FOUR_PLACES)
        if filled[i] and tp_exit_prices[i] is not None else None
        for i in (1, 2, 3)
    }
    cur.execute(
        """INSERT INTO sim_track_record
           (symbol,direction,entry_price,exit_price,stop_loss,tp1,tp2,tp3,
            hit_tp1,hit_tp2,hit_tp3,tp1_exit_price,tp2_exit_price,tp3_exit_price,
            tp1_profit_pct,tp2_profit_pct,tp3_profit_pct,final_profit_pct,
            final_profit_usdt,close_reason,balance_before,balance_after,
            margin_used,leverage,duration,opened_at,closed_at)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                   %s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (trade["pair"], trade["side"], entry, exit_price, Decimal(trade["stop_loss"]),
         Decimal(trade["tp1"]), Decimal(trade["tp2"]), Decimal(trade["tp3"]),
         filled[1], filled[2], filled[3], tp_exit_prices[1], tp_exit_prices[2], tp_exit_prices[3],
         tp_pct[1], tp_pct[2], tp_pct[3], total_pct, accumulated, close_reason,
         balance_before, balance_after, used_margin, trade["leverage"],
         _duration(trade["date"], now), trade["date"], now),
    )
    for table in ("daily_profits", "weekly_profits", "monthly_profits"):
        cur.execute(
            f"""INSERT INTO {table} (key,value,gain_date,Close) VALUES (%s,%s,%s,TRUE)
                ON CONFLICT (key) DO NOTHING""",
            (payload["signalId"], f"{trade['pair']} {trade['side']} {total_pct:+.2f}%", now),
        )


def apply_event(cur, payload: dict, received_at: datetime | None = None) -> None:
    if payload["typeSignal"] == "entry":
        _entry(cur, payload, received_at)
    else:
        _event(cur, payload, received_at)
