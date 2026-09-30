"""Publicación de eventos ya guardados; nunca se llama desde el POST de TV."""

from __future__ import annotations

import os
from decimal import Decimal

import requests

from onza_processing import TP_WEIGHTS, margin, pnl_piece
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


def render_event_image(payload: dict, pnl_usd: Decimal, pnl_pct: Decimal) -> bytes:
    return render_bitunix_event_image(payload, pnl_usd, pnl_pct)



def _event_amount(payload: dict, trade: dict) -> tuple[Decimal, Decimal]:
    entry = Decimal(str(payload["entry"]))
    price = Decimal(str(payload["price"]))
    event = payload["typeSignal"]
    if event.startswith("tp"):
        fraction = TP_WEIGHTS[int(event[-1])]
    else:
        fraction = Decimal(1) - sum(
            (TP_WEIGHTS[i] for i in (1, 2, 3) if trade[f"tp{i}_filled"]), Decimal(0)
        )
    used_margin = Decimal(str(trade["margin_used"])) if trade.get("margin_used") is not None else margin()
    amount = pnl_piece(payload["direction"], entry, price, payload["leverage"], used_margin, fraction)
    return amount, amount / used_margin * 100


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


def post_telegram(payload: dict, trade: dict | None) -> tuple[str, str]:
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
            picture = render_event_image(payload, amount, percent)
            response = requests.post(
                base + "/sendPhoto",
                data={"chat_id": channel, "caption": telegram_text(payload)},
                files={"photo": ("onza-event.jpg", picture, "image/jpeg")}, timeout=15,
            )
    except requests.Timeout:
        return "unknown", "Tiempo de espera agotado; revisar Telegram antes de reenviar"
    except (requests.RequestException, OSError) as exc:
        return "failed", type(exc).__name__
    if response.status_code == 200:
        return "delivered", "HTTP 200"
    return "failed", f"HTTP {response.status_code}"
