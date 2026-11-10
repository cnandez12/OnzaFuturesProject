"""VORZA publishing contract. No TradingView, Telegram or P&L mutations."""
from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from uuid import UUID
import os
import math
import re
import requests

PUBLISH_URL = "https://vorza.site/api/v1/signals/publish"
ERROR_CODES = {"validation_failed", "invalid_levels", "invalid_provider", "invalid_company", "unauthorized", "too_many_requests", "signals_api_disabled", "server_error"}


def enabled():
    return os.getenv("VORZA_ENABLED", "false").strip().lower() == "true"


def integer(name, default, low, high):
    value = os.getenv(name, str(default))
    if not re.fullmatch(r"[0-9]+", value):
        raise ValueError(name + " debe ser entero")
    number = int(value)
    if not low <= number <= high:
        raise ValueError(name + " fuera de rango")
    return number


@dataclass(frozen=True)
class Settings:
    key: str
    expires: int
    rate: int
    order_type: str
    provider_id: int | None
    company: str
    note: str


def settings():
    # A fixed HTTPS destination prevents secrets going to another host or DEV by accident.
    if os.getenv("VORZA_PUBLISH_URL", PUBLISH_URL) != PUBLISH_URL:
        raise ValueError("VORZA_PUBLISH_URL no coincide con el endpoint documentado")
    key = os.getenv("VORZA_SIGNAL_KEY", "").strip()
    if key.lower() in {"", "0", "false", "your_key", "your-key"}:
        raise ValueError("VORZA_SIGNAL_KEY pendiente")
    if any(ord(char) < 32 or ord(char) == 127 for char in key):
        raise ValueError("VORZA_SIGNAL_KEY invalida")
    order_type = os.getenv("VORZA_ORDER_TYPE", "market").strip().lower()
    if order_type not in {"market", "limit"}:
        raise ValueError("VORZA_ORDER_TYPE invalido")
    company = os.getenv("VORZA_COMPANY", "").strip()
    # Omitted company uses VORZA, exactly as documented; ALL is never a default.
    if any(ord(char) < 32 or ord(char) == 127 for char in company):
        raise ValueError("VORZA_COMPANY invalida")
    provider = integer("VORZA_PROVIDER_ID", 0, 0, 2147483647)
    note = os.getenv("VORZA_NOTE", "Señal del scanner").strip()
    if len(note) > 500:
        raise ValueError("VORZA_NOTE demasiado larga")
    return Settings(key, integer("VORZA_EXPIRES_MINUTES", 20, 1, 1440),
                    integer("VORZA_RATE_PER_MINUTE", 20, 1, 20), order_type,
                    provider or None, company, note)


def price(value):
    if isinstance(value, bool):
        raise ValueError("Precio invalido")
    try:
        number = Decimal(str(value))
    except (InvalidOperation, ValueError):
        raise ValueError("Precio invalido") from None
    if not number.is_finite() or number <= 0:
        raise ValueError("Precio invalido")
    result = float(number)
    if not math.isfinite(result):
        raise ValueError("Precio fuera de rango")
    return result


def adapt(payload, config):
    if payload.get("typeSignal") != "entry":
        raise ValueError("VORZA solo documenta publicacion de entradas")
    sid = payload.get("signalId")
    if not isinstance(sid, str) or not 1 <= len(sid) <= 80:
        raise ValueError("external_id debe contener entre 1 y 80 caracteres")
    from onza_contract import internal_pair
    symbol = internal_pair(payload["symbol"])
    side = str(payload["direction"]).lower()
    if side not in {"long", "short"}:
        raise ValueError("Direccion invalida")
    lev = payload.get("leverage")
    if type(lev) is not int or not 1 <= lev <= 125:
        raise ValueError("Apalancamiento invalido")
    tps = payload.get("takeProfits")
    if not isinstance(tps, list) or not 1 <= len(tps) <= 4:
        raise ValueError("Se requieren entre 1 y 4 objetivos")
    entry = price(payload.get("entry"))
    stop = price(payload.get("stopLoss", {}).get("price"))
    targets = [price(tp.get("price")) for tp in tps]
    levels = [stop, entry] + targets
    if not all(a < b if side == "long" else a > b for a, b in zip(levels, levels[1:])):
        raise ValueError("Niveles SL/TP incoherentes")
    body = {"symbol": symbol, "side": side, "entry_price": entry, "stop_loss": stop,
            "take_profit": targets[0], "leverage": lev, "market": "crypto",
            "order_type": config.order_type, "expires_in_minutes": config.expires,
            "external_id": sid,
            "note": (config.note + " | " + str(payload.get("timeframe", "")))[:500]}
    for index, target in enumerate(targets[1:], 2):
        body["take_profit_" + str(index)] = target
    if config.company:
        body["company"] = config.company
    if config.provider_id:
        body["provider_id"] = config.provider_id
    return body


@dataclass(frozen=True)
class Result:
    state: str
    detail: str
    http: int | None = None
    remote_id: str | None = None
    uid: str | None = None
    recipients: int | None = None
    duplicate: bool | None = None
    expires_at: str | None = None
    retry_after: int = 0


def response_result(body, response):
    status = response.status_code
    if status == 200:
        try:
            data = response.json()["data"]
            ident = data["signal_id"]
            if type(ident) not in (str, int) or not re.fullmatch(r"[0-9]+", str(ident)) or int(ident) < 1:
                raise ValueError()
            uid = str(UUID(data["uid"]))
            if (data["external_id"] != body["external_id"] or data["symbol"] != body["symbol"]
                    or data["side"] != body["side"] or type(data["duplicate"]) is not bool
                    or type(data["recipients"]) is not int or data["recipients"] < 0
                    or not isinstance(data["status"], str) or not data["status"]):
                raise ValueError()
            if not data["duplicate"] and data["status"] != "active":
                raise ValueError()
            expiration = datetime.fromisoformat(data["expires_at"].replace("Z", "+00:00"))
            if expiration.utcoffset() is None:
                raise ValueError()
            return Result("delivered", "Publicado" if data["recipients"] else "Publicado sin destinatarios; revisar acceso", status,
                          str(ident), uid, data["recipients"], data["duplicate"], expiration.isoformat())
        except (ValueError, KeyError, TypeError, AttributeError):
            return Result("retry", "HTTP 200 sin acuse valido o correlacionado", status)
    code = "unclassified"
    try:
        candidate = response.json()["error"]["code"]
        if candidate in ERROR_CODES:
            code = candidate
    except (ValueError, KeyError, TypeError):
        pass
    retry = status == 429 or 500 <= status <= 599
    delay = 60 if status == 429 else 0
    if status == 429:
        value = response.headers.get("Retry-After", "")
        if value.isdigit():
            delay = max(60, min(int(value), 86400))
    return Result("retry" if retry else "failed", "HTTP " + str(status) + "; " + code, status, retry_after=delay)


def publish(body, key, transport=requests.post):
    if not enabled():
        return Result("skipped", "VORZA_ENABLED=false")
    if not key or key.strip().lower() in {"0", "false"}:
        return Result("failed", "VORZA_SIGNAL_KEY pendiente")
    try:
        response = transport(PUBLISH_URL, headers={"X-Signal-Key": key, "Content-Type": "application/json"},
                             json=body, timeout=15, allow_redirects=False)
    except requests.RequestException as exc:
        return Result("retry", "Recepcion no confirmada; " + type(exc).__name__)
    return response_result(body, response)
