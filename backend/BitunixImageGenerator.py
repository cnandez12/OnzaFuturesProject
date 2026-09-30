"""Independent Bitunix-style image renderer for the free Telegram channel.

This module does not modify the existing Binance renderer. It only registers a
separate localhost endpoint on the same Flask application.
"""

from __future__ import annotations

import base64
import hashlib
import io
import math
from datetime import datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any

import pytz
from flask import jsonify, request
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
ASSET_ROOT = ROOT / "assets" / "bitunix"
TEMPLATE_ROOT = ASSET_ROOT / "templates"
LOGO_PATH = ASSET_ROOT / "bitunix-logo.png"
FONT_REGULAR = ROOT / "arial.ttf"
FONT_BOLD = ROOT / "arialbd.ttf"

CANVAS_SIZE = (1035, 1005)
TEMPLATES = {
    "knight": TEMPLATE_ROOT / "knight.png",
    "bear": TEMPLATE_ROOT / "bear.png",
    "tom": TEMPLATE_ROOT / "tom.png",
    "spider": TEMPLATE_ROOT / "spider.png",
}
TEMPLATE_NAMES = tuple(TEMPLATES)

EVENTS = {"TP1", "TP2", "TP3", "CLOSED"}
OPEN_EVENTS = {"TP1", "TP2"}
CLOSED_EVENTS = {"TP3", "CLOSED"}

WHITE = (246, 246, 246)
GRAY = (154, 154, 158)
DIVIDER = (90, 90, 94)
GREEN = (0, 194, 131)
RED = (246, 83, 84)


class BitunixPayloadError(ValueError):
    pass


def _decimal(value: Any, field: str) -> Decimal:
    if value is None or isinstance(value, bool):
        raise BitunixPayloadError(f"{field} is required")
    normalized = str(value).strip().replace(",", "").replace("%", "")
    try:
        number = Decimal(normalized)
    except (InvalidOperation, ValueError):
        raise BitunixPayloadError(f"{field} must be numeric") from None
    if not math.isfinite(float(number)):
        raise BitunixPayloadError(f"{field} must be finite")
    return number


def _signed(number: Decimal, decimals: int, suffix: str = "") -> str:
    sign = "+" if number >= 0 else "-"
    return f"{sign}{abs(number):,.{decimals}f}{suffix}"


def _price(value: Any, field: str) -> str:
    number = _decimal(value, field)
    raw = str(value).strip().replace(",", "")
    decimals = 0
    if "." in raw:
        decimals = min(8, len(raw.rstrip("0").split(".", 1)[1]))
    decimals = max(decimals, 1 if number != number.to_integral() else 0)
    return f"{number:,.{decimals}f}"


def _font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def _fit_header(draw: ImageDraw.ImageDraw, parts):
    for size in range(43, 29, -1):
        font = _font(FONT_REGULAR, size)
        width = sum(draw.textlength(text, font=font) for text, _ in parts)
        if width <= 920:
            return font
    return _font(FONT_REGULAR, 29)


def _choose_template(data: dict[str, Any]) -> str:
    requested = str(data.get("template", "")).strip().lower()
    if requested:
        if requested not in TEMPLATES:
            raise BitunixPayloadError(
                f"template must be one of: {', '.join(TEMPLATE_NAMES)}"
            )
        return requested

    stable_key = str(
        data.get("signal_id")
        or data.get("rotation_key")
        or f"{data.get('symbol', '')}|{data.get('entry_price', data.get('entry', ''))}"
    )
    digest = hashlib.sha256(stable_key.encode("utf-8")).digest()
    return TEMPLATE_NAMES[digest[0] % len(TEMPLATE_NAMES)]


def _normalize_payload(data: dict[str, Any]) -> dict[str, Any]:
    event = str(data.get("event", "")).strip().upper()
    if event not in EVENTS:
        raise BitunixPayloadError("event must be TP1, TP2, TP3 or CLOSED")

    symbol = str(data.get("symbol", "")).strip().upper()
    if not symbol or len(symbol) > 18 or not symbol.replace("-", "").isalnum():
        raise BitunixPayloadError("symbol is invalid")

    direction = str(data.get("direction", data.get("type", ""))).strip().title()
    if direction not in {"Long", "Short"}:
        raise BitunixPayloadError("direction must be Long or Short")

    leverage = _decimal(data.get("leverage"), "leverage")
    if leverage <= 0 or leverage > 500:
        raise BitunixPayloadError("leverage must be between 1 and 500")

    roi = _decimal(data.get("roi", data.get("profit")), "roi")
    profit_usdt = _decimal(data.get("profit_usdt"), "profit_usdt")
    entry = _price(data.get("entry_price", data.get("entry")), "entry_price")

    is_closed = event in CLOSED_EVENTS
    exit_field = "close_price" if is_closed else "last_price"
    exit_alias = "close" if is_closed else "mark"
    exit_price = _price(data.get(exit_field, data.get(exit_alias)), exit_field)

    timestamp = str(data.get("timestamp", "")).strip()
    if not timestamp:
        timestamp = datetime.now(pytz.UTC).strftime("%Y-%m-%d %H:%M")

    return {
        "event": event,
        "is_closed": is_closed,
        "symbol": symbol,
        "direction": direction,
        "leverage": leverage,
        "roi": roi,
        "profit_usdt": profit_usdt,
        "entry": entry,
        "exit_price": exit_price,
        "timestamp": timestamp,
        "template": _choose_template(data),
    }


def render_bitunix_image(data: dict[str, Any]):
    values = _normalize_payload(data)
    template_path = TEMPLATES[values["template"]]
    if not template_path.exists():
        raise RuntimeError(f"Missing Bitunix template: {template_path.name}")

    image = Image.open(template_path).convert("RGB").resize(
        CANVAS_SIZE, Image.Resampling.LANCZOS
    )
    draw = ImageDraw.Draw(image)

    if LOGO_PATH.exists():
        logo = Image.open(LOGO_PATH).convert("RGBA")
        image.paste(logo, (61, 74), logo)

    direction_color = GREEN if values["direction"] == "Long" else RED
    value_color = GREEN if values["roi"] >= 0 else RED

    leverage = values["leverage"]
    leverage_text = (
        f"{int(leverage)}X" if leverage == leverage.to_integral() else f"{leverage}X"
    )
    parts = [
        (values["symbol"], WHITE),
        ("  |  ", DIVIDER),
        (values["direction"], direction_color),
        (f"  {leverage_text}", WHITE),
    ]
    if values["is_closed"]:
        parts.extend([("  |  ", DIVIDER), ("Closed", WHITE)])

    header_font = _fit_header(draw, parts)
    x = 60
    for text, color in parts:
        draw.text((x, 243), text, fill=color, font=header_font)
        x += draw.textlength(text, font=header_font)

    draw.text(
        (57, 326),
        _signed(values["roi"], 2, "%"),
        fill=value_color,
        font=_font(FONT_BOLD, 89),
    )
    draw.text(
        (59, 451),
        _signed(values["profit_usdt"], 8 if values["is_closed"] else 4, " USDT"),
        fill=value_color,
        font=_font(FONT_REGULAR, 41),
    )

    label_font = _font(FONT_REGULAR, 35)
    price_font = _font(FONT_REGULAR, 36)
    draw.text((60, 690), "Entry Price", fill=GRAY, font=label_font)
    draw.text((269, 690), values["entry"], fill=WHITE, font=price_font)
    exit_label = "Close Price" if values["is_closed"] else "Last Price"
    draw.text((60, 752), exit_label, fill=GRAY, font=label_font)
    draw.text((269, 752), values["exit_price"], fill=WHITE, font=price_font)
    draw.text(
        (60, 920), values["timestamp"], fill=GRAY, font=_font(FONT_REGULAR, 37)
    )

    output = io.BytesIO()
    image.save(output, format="JPEG", quality=94, optimize=True)
    metadata = {
        "event": values["event"],
        "state": "closed" if values["is_closed"] else "open",
        "template": values["template"],
    }
    return output.getvalue(), metadata


def register_bitunix_routes(app) -> None:
    @app.route("/api/free/bitunix-image", methods=["POST"])
    def generate_bitunix_image():
        if request.remote_addr not in {"127.0.0.1", "::1"}:
            return jsonify({"error": "Access forbidden: only localhost is allowed"}), 403

        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify({"error": "No data provided"}), 400

        try:
            image_bytes, metadata = render_bitunix_image(data)
        except BitunixPayloadError as exc:
            return jsonify({"error": str(exc)}), 400
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500

        encoded = base64.b64encode(image_bytes).decode("ascii")
        return jsonify(
            {
                "image": f"data:image/jpeg;base64,{encoded}",
                **metadata,
            }
        )
