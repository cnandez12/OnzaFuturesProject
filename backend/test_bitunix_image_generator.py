from collections import Counter

import base64
import io

from PIL import Image

from BitunixImageGenerator import CANVAS_SIZE, render_bitunix_image
from ImageServer import app


BASE_PAYLOAD = {
    "event": "TP1",
    "signal_id": "signal-123",
    "symbol": "LTCUSDT",
    "direction": "Short",
    "leverage": 20,
    "roi": "1.71",
    "profit_usdt": "348.2843",
    "entry_price": "66.31",
    "last_price": "66.25",
    "timestamp": "2026-09-24 15:49",
}


def test_tp1_renders_open_image_with_stable_template():
    first, first_meta = render_bitunix_image(BASE_PAYLOAD)
    second, second_meta = render_bitunix_image(BASE_PAYLOAD)

    assert first_meta == second_meta
    assert first_meta["state"] == "open"
    assert first == second
    assert Image.open(io.BytesIO(first)).size == CANVAS_SIZE


def test_tp3_uses_closed_price_and_closed_state():
    payload = {
        **BASE_PAYLOAD,
        "event": "TP3",
        "close_price": "65.10",
    }
    payload.pop("last_price")

    image, metadata = render_bitunix_image(payload)

    assert image.startswith(b"\xff\xd8")
    assert metadata["state"] == "closed"


def test_free_endpoint_returns_data_uri_and_keeps_binance_route():
    client = app.test_client()
    response = client.post("/api/free/bitunix-image", json=BASE_PAYLOAD)

    assert response.status_code == 200
    body = response.get_json()
    prefix, encoded = body["image"].split(",", 1)
    assert prefix == "data:image/jpeg;base64"
    assert base64.b64decode(encoded).startswith(b"\xff\xd8")

    rules = {rule.rule for rule in app.url_map.iter_rules()}
    assert "/api/futures/image" in rules
    assert "/api/free/bitunix-image" in rules


def test_profit_usdt_is_required_to_prevent_invented_results():
    payload = dict(BASE_PAYLOAD)
    payload.pop("profit_usdt")
    response = app.test_client().post("/api/free/bitunix-image", json=payload)

    assert response.status_code == 400
    assert response.get_json()["error"] == "profit_usdt is required"


def test_all_four_events_follow_open_and_closed_contract():
    cases = (
        ("TP1", "last_price", "open"),
        ("TP2", "last_price", "open"),
        ("TP3", "close_price", "closed"),
        ("CLOSED", "close_price", "closed"),
    )

    for event, price_field, expected_state in cases:
        payload = {
            **BASE_PAYLOAD,
            "event": event,
            price_field: "65.10",
        }
        other_field = "close_price" if price_field == "last_price" else "last_price"
        payload.pop(other_field, None)

        _, metadata = render_bitunix_image(payload)

        assert metadata["event"] == event
        assert metadata["state"] == expected_state


def test_spider_template_is_available_for_rotation():
    payload = {**BASE_PAYLOAD, "template": "spider"}
    _, metadata = render_bitunix_image(payload)

    assert metadata["template"] == "spider"


def _dominant_result_color(image_bytes, positive):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    pixels = list(image.crop((40, 300, 550, 520)).getdata())
    if positive:
        selected = [
            pixel
            for pixel in pixels
            if pixel[1] > 130
            and pixel[1] > pixel[0] * 1.7
            and pixel[1] > pixel[2] * 1.15
        ]
    else:
        selected = [
            pixel
            for pixel in pixels
            if pixel[0] > 160
            and pixel[0] > pixel[1] * 1.7
            and pixel[0] > pixel[2] * 1.25
        ]
    return Counter(selected).most_common(1)[0][0]


def test_rendered_profit_colors_match_bitunix_reference():
    positive, _ = render_bitunix_image({**BASE_PAYLOAD, "template": "spider"})
    negative, _ = render_bitunix_image(
        {
            **BASE_PAYLOAD,
            "roi": "-3.05",
            "profit_usdt": "-721.0773",
            "template": "knight",
        }
    )

    assert _dominant_result_color(positive, True) == (0, 194, 131)
    assert _dominant_result_color(negative, False) == (246, 83, 84)
