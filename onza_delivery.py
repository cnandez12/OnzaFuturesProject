"""Publicación de eventos ya guardados; nunca se llama desde el POST de TV."""

from __future__ import annotations

import os
import json
import time
from typing import NamedTuple
from datetime import datetime
from decimal import Decimal

import requests

from onza_processing import margin
from bitunix_card import render_event_image as render_bitunix_event_image
from audit_log import audit
from telegram_channels import free_text


ONZA_URL = "https://api.onza.tech/api/v1/webhooks/signal?source=TradingView"


class TelegramDelivery(NamedTuple):
    status: str
    detail: str
    message_id: int | None = None
    chat_id: str | None = None


def post_onza(payload: dict) -> tuple[str, str]:
    key = os.getenv("ONZA_API_KEY", "")
    if not key:
        return "pending", "ONZA_API_KEY pendiente"
    outbound = dict(payload)
    outbound.pop("sourceExchange", None)
    outbound["apiKey"] = key
    try:
        response = requests.post(
            os.getenv("ONZA_WEBHOOK_URL", ONZA_URL), json=outbound, timeout=10
        )
    except requests.ConnectTimeout:
        return "unknown", "Timeout de conexion; recepcion Onza no confirmada; sin reenvio automatico"
    except requests.ReadTimeout:
        return "unknown", "Timeout de lectura; Onza pudo recibirlo; sin reenvio automatico"
    except requests.Timeout:
        return "unknown", "Timeout; fase no identificada; recepcion Onza no confirmada"
    except requests.RequestException as exc:
        return "failed", type(exc).__name__
    if response.status_code in (200, 201):
        return "delivered", f"HTTP {response.status_code}"
    return "failed", f"HTTP {response.status_code}"


def render_event_image(payload: dict, pnl_usd: Decimal, pnl_pct: Decimal, *,
                       image_sequence: int = 1, event_time: datetime | None = None) -> bytes:
    return render_bitunix_event_image(
        payload, pnl_usd, pnl_pct, image_sequence=image_sequence, event_time=event_time
    )



def _event_amount(payload: dict, trade: dict) -> tuple[Decimal, Decimal]:
    """Rendimiento ilustrativo sobre el margen completo, sin cierres parciales."""
    entry = Decimal(str(payload["entry"]))
    price = Decimal(str(payload["price"]))
    used_margin = Decimal(str(trade["margin_used"])) if trade.get("margin_used") is not None else margin()
    if entry <= 0 or used_margin <= 0 or int(payload["leverage"]) != 20:
        raise ValueError("La imagen requiere entrada y margen positivos y apalancamiento 20X")
    direction = str(payload["direction"]).upper()
    if direction not in {"LONG", "SHORT"}:
        raise ValueError("Dirección inválida")
    movement = price - entry if direction == "LONG" else entry - price
    percent = movement / entry * Decimal(20) * 100
    return used_margin * percent / 100, percent


def telegram_text(payload: dict) -> str:
    symbol = payload["symbol"]
    direction = payload["direction"]
    event = payload["typeSignal"]
    if event == "entry":
        targets = "\n".join(
            f"🎯 TP{i}: {tp['price']} ({tp['roi']:+.2f}% ROI)"
            for i, tp in enumerate(payload["takeProfits"], 1)
        )
        return (f"🔔 Nueva señal Onza Futures\n#{symbol} {direction} · {payload['timeframe']}\n"
                f"⚡ Apalancamiento x{payload['leverage']}\n📍 Entrada: {payload['entry']}\n"
                f"{targets}\n⛔ SL: {payload['stopLoss']['price']}\n"
                f"ID: {payload['signalId']}")
    label = {"tp1": "✅ TP1", "tp2": "✅ TP2", "tp3": "🏆 TP3",
             "sl": "⛔ Stop Loss", "close": "🔄 Cierre por señal"}[event]
    return (f"{label} · Onza Futures\n#{symbol} {direction} · {payload['timeframe']}\n"
            f"📍 Precio: {payload['price']}\nID: {payload['signalId']}")


def post_telegram(payload: dict, trade: dict | None, *,
                  image_sequence: int = 1, event_time: datetime | None = None,
                  event_id: int | None = None) -> TelegramDelivery:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    channel = os.getenv("DESTINATION_CHANNEL_ID", "")
    if not token or not channel:
        return TelegramDelivery("pending", "Canal o bot de Telegram pendiente")
    base = f"https://api.telegram.org/bot{token}"
    try:
        if payload["typeSignal"] == "entry":
            response = requests.post(
                base + "/sendMessage",
                json={"chat_id": channel, "text": telegram_text(payload)}, timeout=10,
            )
        else:
            if trade is None:
                return TelegramDelivery("failed", "Trade no encontrado para imagen")
            parent_id = trade.get("telegram_entry_message_id")
            parent_chat = trade.get("telegram_chat_id")
            if not parent_id or not parent_chat:
                return TelegramDelivery("pending", "Esperando referencia al mensaje de entrada de Telegram")
            amount, percent = _event_amount(payload, trade)
            started = time.monotonic()
            picture = render_event_image(
                payload, amount, percent,
                image_sequence=image_sequence, event_time=event_time,
            )
            audit("IMAGEN GENERADA", payload, event_id,
                  responde_a=parent_id,
                  diseno=(image_sequence - 1) % 25 + 1,
                  duracion_ms=round((time.monotonic() - started) * 1000))
            response = requests.post(
                base + "/sendPhoto",
                data={"chat_id": parent_chat,
                      "caption": free_text(payload, trade.get("date"), event_time,
                                           trade.get("margin_used") if trade.get("margin_used") is not None else margin())
                          if payload["typeSignal"] in ("tp1", "tp2", "tp3") else telegram_text(payload),
                      **({"parse_mode": "HTML"} if payload["typeSignal"] in ("tp1", "tp2", "tp3") else {}),
                      "reply_parameters": json.dumps({"message_id": int(parent_id),
                                                       "allow_sending_without_reply": False})},
                files={"photo": ("onza-event.jpg", picture, "image/jpeg")}, timeout=15,
            )
    except requests.Timeout:
        return TelegramDelivery("unknown", "Tiempo de espera agotado; revisar Telegram antes de reenviar")
    except (requests.RequestException, OSError, ValueError, KeyError) as exc:
        return TelegramDelivery("failed", type(exc).__name__)
    try:
        body = response.json()
    except ValueError:
        return TelegramDelivery("unknown", f"HTTP {response.status_code}; respuesta Telegram no interpretable")
    if not isinstance(body, dict):
        return TelegramDelivery("unknown", f"HTTP {response.status_code}; respuesta Telegram inesperada")
    if response.status_code == 200 and body.get("ok") is True:
        result = body.get("result")
        if not isinstance(result, dict):
            return TelegramDelivery("unknown", "Telegram no devolvio el mensaje confirmado")
        message_id = result.get("message_id")
        chat = result.get("chat")
        chat_id = chat.get("id") if isinstance(chat, dict) else None
        if type(message_id) is not int or message_id <= 0 or type(chat_id) is not int:
            return TelegramDelivery("unknown", "Telegram no devolvio message_id/chat.id validos")
        return TelegramDelivery("delivered", f"HTTP 200; message_id={message_id}", message_id, str(chat_id))
    # No registrar cuerpos HTTP completos: pueden contener datos o credenciales.
    reasons = {400: "Solicitud o canal invalido", 401: "Token no autorizado",
               403: "Bot sin permiso o bloqueado", 429: "Limite de Telegram"}
    return TelegramDelivery("failed", f"HTTP {response.status_code}; {reasons.get(response.status_code, 'Telegram no confirmo el mensaje')}")
