"""Publicación de eventos ya guardados; nunca se llama desde el POST de TV."""

from __future__ import annotations

import os
from datetime import datetime
from decimal import Decimal

import requests

from onza_processing import margin
from bitunix_card import render_event_image as render_bitunix_event_image


ONZA_URL = "https://api.onza.tech/api/v1/webhooks/signal?source=TradingView"


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
    except requests.Timeout:
        return "unknown", "Tiempo de espera agotado; revisar en Onza antes de reenviar"
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
                  image_sequence: int = 1, event_time: datetime | None = None) -> tuple[str, str]:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    channel = os.getenv("DESTINATION_CHANNEL_ID", "")
    if not token or not channel:
        return "pending", "Canal o bot de Telegram pendiente"
    base = f"https://api.telegram.org/bot{token}"
    try:
        if payload["typeSignal"] == "entry":
            response = requests.post(
                base + "/sendMessage",
                json={"chat_id": channel, "text": telegram_text(payload)}, timeout=10,
            )
        else:
            if trade is None:
                return "failed", "Trade no encontrado para imagen"
            amount, percent = _event_amount(payload, trade)
            picture = render_event_image(
                payload, amount, percent,
                image_sequence=image_sequence, event_time=event_time,
            )
            response = requests.post(
                base + "/sendPhoto",
                data={"chat_id": channel, "caption": telegram_text(payload)},
                files={"photo": ("onza-event.jpg", picture, "image/jpeg")}, timeout=15,
            )
    except requests.Timeout:
        return "unknown", "Tiempo de espera agotado; revisar Telegram antes de reenviar"
    except (requests.RequestException, OSError, ValueError, KeyError) as exc:
        return "failed", type(exc).__name__
    if response.status_code == 200:
        return "delivered", "HTTP 200"
    return "failed", f"HTTP {response.status_code}"
