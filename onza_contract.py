"""Contrato único entre Pine, este receptor y Onza Futures."""

from __future__ import annotations

import re
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


ONZA_MESSAGE = "ONZA AI CRYPTOFUTURES"
EVENT_TYPES = frozenset({"entry", "tp1", "tp2", "tp3", "sl", "close"})
TIMEFRAMES = frozenset({"15M", "30M", "1H", "4H"})
# Distribución de la lista de 61 alertas facilitada por el usuario.
BYBIT_BASES = frozenset({"ETH", "XRP", "SOL", "APT", "HYPE", "BCH", "ATOM", "CAKE", "ZEN"})
SIGNAL_ID = re.compile(r"^([A-Z0-9]+(?:USDT|USD)\.P)_([0-9]+[MHDW]|[0-9]+MN)_([0-9]{10,13})$")
TWO_PLACES = Decimal("0.01")


class InvalidSignal(ValueError):
    pass


def number(value, name: str, *, positive: bool = False) -> Decimal:
    if isinstance(value, bool) or value is None:
        raise InvalidSignal(f"{name} debe ser numérico")
    try:
        result = Decimal(str(value))
    except (InvalidOperation, ValueError):
        raise InvalidSignal(f"{name} debe ser numérico") from None
    if not result.is_finite() or (positive and result <= 0):
        raise InvalidSignal(f"{name} fuera de rango")
    return result


def onza_symbol(symbol: str) -> str:
    symbol = str(symbol or "").upper().strip()
    if ":" in symbol:
        symbol = symbol.rsplit(":", 1)[1]
    if symbol.endswith("USDT.P"):
        return symbol[:-6] + "USD.P"
    if symbol.endswith("USDT"):
        return symbol[:-4] + "USD.P"
    if symbol.endswith("USD"):
        return symbol + ".P"
    if re.fullmatch(r"[A-Z0-9]+USD\.P", symbol):
        return symbol
    raise InvalidSignal("symbol debe terminar en USDT.P o USD.P")


def internal_pair(symbol: str) -> str:
    """El dashboard copiado usa símbolos tipo BTCUSDT."""
    return onza_symbol(symbol)[:-5] + "USDT"


def roi(direction: str, entry: Decimal, price: Decimal, leverage: int) -> Decimal:
    movement = price - entry if direction == "LONG" else entry - price
    return (movement / entry * 100 * leverage).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)


def canonicalize(raw: dict) -> dict:
    if not isinstance(raw, dict):
        raise InvalidSignal("Se requiere un objeto JSON")
    event = str(raw.get("typeSignal", "")).lower()
    if event not in EVENT_TYPES:
        raise InvalidSignal("typeSignal inválido")
    direction = str(raw.get("direction", "")).upper()
    if direction not in ("LONG", "SHORT"):
        raise InvalidSignal("direction debe ser LONG o SHORT")
    symbol = onza_symbol(raw.get("symbol"))
    timeframe = str(raw.get("timeframe", "")).upper()
    if timeframe not in TIMEFRAMES:
        raise InvalidSignal("timeframe fuera de 15M, 30M, 1H, 4H")
    original_id = str(raw.get("signalId", "")).upper()
    match = SIGNAL_ID.fullmatch(original_id)
    if not match or onza_symbol(match.group(1)) != symbol or match.group(2) != timeframe:
        raise InvalidSignal("signalId no coincide con symbol/timeframe")
    signal_id = f"{symbol}_{timeframe}_{match.group(3)}"
    exchange = str(raw.get("sourceExchange") or "").upper()
    if not exchange:
        base_symbol = symbol[:-5]
        exchange = "BYBIT" if base_symbol in BYBIT_BASES else "BINANCE"
    if exchange not in ("BINANCE", "BYBIT"):
        raise InvalidSignal("sourceExchange debe ser BINANCE o BYBIT")
    entry = number(raw.get("entry"), "entry", positive=True)
    lev = raw.get("leverage")
    if isinstance(lev, bool) or not isinstance(lev, int) or not 1 <= lev <= 125:
        raise InvalidSignal("leverage debe ser entero de 1 a 125")
    base = {
        "signalId": signal_id,
        "typeSignal": event,
        "symbol": symbol,
        "direction": direction,
        "entry": float(entry),
        "leverage": lev,
        "sourceExchange": exchange,
    }
    if event == "entry":
        sl = raw.get("stopLoss")
        tps = raw.get("takeProfits")
        if not isinstance(sl, dict) or not isinstance(tps, list) or len(tps) != 3:
            raise InvalidSignal("La entrada requiere stopLoss y exactamente TP1, TP2, TP3")
        stop_price = number(sl.get("price"), "stopLoss.price", positive=True)
        tp_prices = []
        for i, tp in enumerate(tps, 1):
            if not isinstance(tp, dict):
                raise InvalidSignal(f"TP{i} inválido")
            tp_prices.append(number(tp.get("price"), f"TP{i}.price", positive=True))
        if direction == "LONG":
            valid = stop_price < entry < tp_prices[0] < tp_prices[1] < tp_prices[2]
        else:
            valid = stop_price > entry > tp_prices[0] > tp_prices[1] > tp_prices[2]
        if not valid:
            raise InvalidSignal("Orden de precios TP/SL incoherente")
        base["stopLoss"] = {"price": float(stop_price), "roi": float(roi(direction, entry, stop_price, lev))}
        base["takeProfits"] = [
            {"price": float(price), "roi": float(roi(direction, entry, price, lev))}
            for price in tp_prices
        ]
    else:
        price = number(raw.get("price"), "price", positive=True)
        event_roi = number(raw.get("roi"), "roi")
        base["price"] = float(price)
        # En un cierre después de parciales, el Pine envía un ROI acumulado.
        # TP/SL siempre se recalculan desde el precio; el P&L de la cuenta
        # se calcula por tramos en el procesador, no sumando estos ROI.
        base["roi"] = float(
            event_roi.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
            if event == "close" else roi(direction, entry, price, lev)
        )
    base["timeframe"] = timeframe
    base["message"] = ONZA_MESSAGE
    # El API key saliente se agrega en el trabajador desde el entorno.
    return base
