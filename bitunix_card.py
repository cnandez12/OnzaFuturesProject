"""Tarjetas Bitunix construidas con fondos limpios y rotación de diseños."""

from __future__ import annotations

import io
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

from onza_contract import internal_pair


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets" / "bitunix"
BACKGROUNDS = ASSETS / "clean"
CARD_TEMPLATES = ASSETS / "card_templates"
LOGO = ROOT / "backend" / "assets" / "bitunix" / "bitunix-logo.png"
FONTS = ROOT / "backend"
DESIGN_COUNT = 25
CANVAS = (1035, 1005)

WHITE = (246, 246, 246)
GRAY = (154, 154, 158)
GREEN = (0, 194, 131)
RED = (246, 83, 84)


def font(bold: bool, size: int):
    try:
        return ImageFont.truetype(str(FONTS / ("arialbd.ttf" if bold else "arial.ttf")), size)
    except OSError:
        return ImageFont.load_default()


def design_number(image_sequence: int) -> int:
    if not isinstance(image_sequence, int) or image_sequence < 1:
        raise ValueError("image_sequence debe ser un entero positivo")
    return (image_sequence - 1) % DESIGN_COUNT + 1


def template_path(design: int, direction: str) -> Path:
    if not 1 <= design <= DESIGN_COUNT or direction.upper() not in {"LONG", "SHORT"}:
        raise ValueError("Diseño o dirección inválidos")
    return CARD_TEMPLATES / f"card-{design:02d}-{direction.lower()}.jpg"


def build_template_image(design: int, direction: str) -> Image.Image:
    """Build a card with only permanent text; dynamic positions stay blank."""
    if not 1 <= design <= DESIGN_COUNT or direction.upper() not in {"LONG", "SHORT"}:
        raise ValueError("Diseño o dirección inválidos")
    background_path = BACKGROUNDS / f"background-{design:02d}.png"
    with Image.open(background_path) as source:
        image = ImageOps.pad(source.convert("RGB"), CANVAS, color=(0, 0, 0), method=Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 879, CANVAS[0], CANVAS[1]), fill=(32, 33, 36))
    with Image.open(LOGO) as logo_source:
        logo = logo_source.convert("RGBA")
        image.paste(logo, (61, 74), logo)

    draw.line(((290, 247), (290, 280)), fill=(90, 90, 94), width=2)
    header_font = font(False, 43)
    side = direction.title()
    draw.text((310, 238), side, fill=GREEN if direction.upper() == "LONG" else RED, font=header_font)
    draw.text((310 + draw.textlength(side, font=header_font) + 12, 238), "20X", fill=WHITE, font=header_font)
    label_font = font(False, 35)
    draw.text((60, 690), "Entry Price", fill=GRAY, font=label_font)
    draw.text((60, 752), "Last Price", fill=GRAY, font=label_font)
    return image


def _fit_font(draw: ImageDraw.ImageDraw, value: str, max_width: int, start: int, minimum: int, *, bold: bool = False):
    for size in range(start, minimum - 1, -1):
        candidate = font(bold, size)
        if draw.textlength(value, font=candidate) <= max_width:
            return candidate
    return font(bold, minimum)


def _price(value) -> str:
    return format(Decimal(str(value)), "f")


def _timestamp(event_time: datetime | None) -> str:
    stamp = event_time or datetime.now(timezone.utc)
    if stamp.tzinfo is None:
        stamp = stamp.replace(tzinfo=timezone.utc)
    return stamp.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M")


def render_event_image(
    payload: dict,
    pnl_usd: Decimal,
    pnl_pct: Decimal,
    *,
    image_sequence: int = 1,
    event_time: datetime | None = None,
) -> bytes:
    """Fill live values on the next clean Long/Short 20X template."""
    if int(payload["leverage"]) != 20:
        raise ValueError("Las plantillas Bitunix de este proyecto requieren 20X")
    direction = str(payload["direction"]).upper()
    design = design_number(image_sequence)
    with Image.open(template_path(design, direction)) as template:
        image = template.convert("RGB")
    draw = ImageDraw.Draw(image)
    accent = GREEN if pnl_usd >= 0 else RED

    symbol = internal_pair(payload["symbol"])
    draw.text((60, 238), symbol, fill=WHITE,
              font=_fit_font(draw, symbol, 220, 43, 22))

    event = str(payload["typeSignal"]).lower()
    if event not in {"tp1", "tp2", "tp3", "sl", "close"}:
        raise ValueError("La tarjeta requiere TP1, TP2, TP3, SL o cierre")

    percent_text = f"{pnl_pct:+.2f}%"
    amount_text = f"{pnl_usd:+,.4f} USDT"
    draw.text((56, 345), percent_text, fill=accent,
              font=_fit_font(draw, percent_text, 480, 89, 51, bold=True))
    draw.text((60, 456), amount_text, fill=accent,
              font=_fit_font(draw, amount_text, 495, 41, 24))

    entry_text = _price(payload["entry"])
    price_text = _price(payload["price"])
    draw.text((269, 690), entry_text, fill=WHITE,
              font=_fit_font(draw, entry_text, 285, 36, 21))
    draw.text((269, 752), price_text, fill=WHITE,
              font=_fit_font(draw, price_text, 285, 36, 21))
    draw.text((60, 920), _timestamp(event_time), fill=GRAY, font=font(False, 31))

    output = io.BytesIO()
    image.save(output, format="JPEG", quality=93, optimize=True)
    return output.getvalue()
