import io
import os
import unittest
from decimal import Decimal
from datetime import datetime, timezone
from unittest.mock import Mock, patch

from PIL import Image

from bitunix_card import DESIGN_COUNT, design_number, render_event_image, template_path
from onza_delivery import post_telegram, _event_amount


class BitunixCardsTests(unittest.TestCase):
    def test_full_margin_results_ignore_partials(self):
        trade = {"margin_used": 100, "tp1_filled": True, "tp2_filled": True}
        short = {"direction": "SHORT", "leverage": 20, "entry": 65000,
                 "price": 64675, "typeSignal": "tp1"}
        long = {"direction": "LONG", "leverage": 20, "entry": 2500,
                "price": 2550, "typeSignal": "tp3"}
        self.assertEqual(_event_amount(short, trade), (Decimal(10), Decimal(10)))
        self.assertEqual(_event_amount(long, trade), (Decimal(40), Decimal(40)))
        self.assertEqual(_event_amount(dict(long, price=2450, typeSignal="sl"), trade),
                         (Decimal(-40), Decimal(-40)))

    def test_event_name_does_not_appear_on_card(self):
        event = {"symbol": "BTCUSD.P", "direction": "LONG", "leverage": 20,
                 "typeSignal": "tp1", "entry": 100, "price": 101}
        stamp = datetime(2026, 9, 30, tzinfo=timezone.utc)
        a = render_event_image(event, Decimal(20), Decimal(20), event_time=stamp)
        b = render_event_image(dict(event, typeSignal="tp3"), Decimal(20), Decimal(20), event_time=stamp)
        self.assertEqual(a, b)

    def test_all_long_and_short_templates_are_present(self):
        for design in range(1, DESIGN_COUNT + 1):
            for direction in ("LONG", "SHORT"):
                with self.subTest(design=design, direction=direction):
                    with Image.open(template_path(design, direction)) as image:
                        self.assertEqual(image.size, (1035, 1005))

    def test_result_rotation_wraps_after_design_25(self):
        self.assertEqual([design_number(i) for i in (1, 2, 25, 26, 27)],
                         [1, 2, 25, 1, 2])

    def test_every_result_type_renders_for_both_directions(self):
        event = {"symbol": "BTCUSD.P", "direction": "LONG", "leverage": 20,
                 "typeSignal": "tp1", "entry": 100, "price": 101}
        images = []
        for direction in ("LONG", "SHORT"):
            for kind in ("tp1", "tp2", "tp3", "sl"):
                with self.subTest(direction=direction, kind=kind):
                    data = render_event_image(
                        dict(event, direction=direction, typeSignal=kind),
                        Decimal("-3.2") if kind == "sl" else Decimal("1.6"),
                        Decimal("-16") if kind == "sl" else Decimal("8"),
                        image_sequence=len(images) + 1,
                    )
                    images.append(data)
                    with Image.open(io.BytesIO(data)) as image:
                        self.assertEqual(image.size, (1035, 1005))
        self.assertEqual(len(set(images)), 8)

    def test_card_refuses_mismatched_leverage(self):
        event = {"symbol": "BTCUSD.P", "direction": "SHORT", "leverage": 10,
                 "typeSignal": "tp1", "entry": 100, "price": 99}
        with self.assertRaises(ValueError):
            render_event_image(event, Decimal("1"), Decimal("5"))

    def test_telegram_sends_rendered_result_photo(self):
        event = {"symbol": "BTCUSD.P", "direction": "LONG", "leverage": 20,
                 "typeSignal": "tp2", "entry": 100, "price": 102,
                 "timeframe": "30M", "signalId": "sample"}
        response = Mock(status_code=200)
        with patch.dict(os.environ, {"TELEGRAM_BOT_TOKEN": "test", "DESTINATION_CHANNEL_ID": "-1"}), \
             patch("onza_delivery._event_amount", return_value=(Decimal("1"), Decimal("5"))), \
             patch("onza_delivery.render_event_image", return_value=b"jpeg-data") as render, \
             patch("onza_delivery.requests.post", return_value=response) as send:
            result = post_telegram(event, {}, image_sequence=27)
        self.assertEqual(result[0], "delivered")
        self.assertEqual(render.call_args.kwargs["image_sequence"], 27)
        self.assertTrue(send.call_args.args[0].endswith("/sendPhoto"))
        self.assertEqual(send.call_args.kwargs["files"]["photo"][1], b"jpeg-data")


if __name__ == "__main__":
    unittest.main()
