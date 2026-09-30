"""Tarjeta Bitunix limpia creada con datos del evento, sin capturas históricas."""

from __future__ import annotations

import io
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


FONTS = Path(__file__).with_name("backend")


def font(bold: bool, size: int):
    try:
        return ImageFont.truetype(str(FONTS / ("arialbd.ttf" if bold else "arial.ttf")), size)
    except OSError:
        return ImageFont.load_default()


def render_event_image(payload: dict, pnl_usd: Decimal, pnl_pct: Decimal) -> bytes:
    image = Image.new("RGB", (1035, 1005), (8, 11, 13))
    draw = ImageDraw.Draw(image)
    green, red, muted = (140, 236, 25), (255, 91, 105), (156, 166, 166)
    accent = green if pnl_usd >= 0 else red
    # Fondo geométrico original. Los JPEG de WhatsApp solo sirven como referencias.
    draw.ellipse((615, 80, 1230, 695), outline=(27, 49, 27), width=5)
    draw.ellipse((680, 145, 1165, 630), outline=(43, 77, 34), width=3)
    draw.ellipse((750, 215, 1095, 560), outline=(82, 128, 42), width=2)
    draw.polygon([(690, 650), (1035, 480), (1035, 850)], fill=(15, 30, 23))
    draw.rectangle((0, 875, 1035, 1005), fill=(27, 31, 34))
    draw.rounded_rectangle((62, 46, 89, 73), radius=6, fill=green)
    draw.text((102, 41), "Bitunix", font=font(True, 37), fill=(246, 248, 245))
    draw.text((65, 140), "ONZA FUTURES  /  BITUNIX", font=font(True, 25), fill=muted)
    symbol = payload["symbol"].replace("USD.P", "USDT")
    draw.text((65, 207), symbol, font=font(True, 43), fill=(246, 248, 245))
    draw.text((65, 267), f"{payload['direction']}  |  {payload['leverage']}X  |  {payload['timeframe']}",
              font=font(True, 28), fill=accent)
    event = payload["typeSignal"]
    label = {"tp1": "OBJETIVO 1", "tp2": "OBJETIVO 2", "tp3": "OBJETIVO 3",
             "sl": "STOP LOSS", "close": "CIERRE POR SEÑAL"}.get(event, event.upper())
    draw.text((65, 347), label, font=font(True, 28), fill=muted)
    draw.text((58, 393), f"{pnl_pct:+.2f}%", font=font(True, 112), fill=accent)
    draw.text((65, 543), f"{pnl_usd:+,.2f} USDT", font=font(True, 46), fill=accent)
    draw.text((65, 655), "Precio de entrada", font=font(False, 25), fill=muted)
    draw.text((382, 655), str(payload["entry"]), font=font(True, 27), fill=(246, 248, 245))
    draw.text((65, 710), "Precio del evento", font=font(False, 25), fill=muted)
    draw.text((382, 710), str(payload["price"]), font=font(True, 27), fill=(246, 248, 245))
    draw.text((65, 793), "Resultado teórico de la señal", font=font(False, 24), fill=muted)
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    draw.text((65, 917), stamp, font=font(False, 24), fill=muted)
    draw.text((590, 917), "Sin verificación de fill en Bitunix", font=font(False, 20), fill=muted)
    output = io.BytesIO()
    image.save(output, format="JPEG", quality=92)
    return output.getvalue()
