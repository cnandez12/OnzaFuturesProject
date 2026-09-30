from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from FreeChannel import (
    FreeChannelConfig,
    FreeChannelService,
    format_free_close_message,
    format_free_signal_message,
    format_free_tp_message,
    free_symbol,
)


def test_free_signal_format_has_full_trade_and_no_filters_footer():
    message = format_free_signal_message(
        "BTC/USDT",
        "Long",
        20,
        "84,000",
        ["84,500", "85,000", "86,000"],
        "83,000",
    )

    assert "NUEVA SEÑAL GRATUITA" in message
    assert "ONZA FUTURES" in message
    assert "BTCUSD" in message
    assert all(target in message for target in ("TP1", "TP2", "TP3"))
    assert "STOP LOSS" in message
    assert "Detectada por Onza Filters" not in message
    assert message.endswith("https://apps.apple.com/app/id6768534887")


def test_free_weekly_configuration_targets_the_requested_channel():
    config = FreeChannelConfig.from_env(
        {
            "FREE_CHANNEL_ID": "-1004344705677",
            "FREE_SIGNALS_PER_WEEK": "3",
            "FREE_ACCOUNT_BALANCE": "10000",
            "FREE_MARGIN_PER_TRADE": "500",
        },
        leverage=20,
        existing_image_url="https://images.example/api/futures/image",
    )

    assert config.weekly_limit == 3
    assert config.channel_id == -1004344705677
    assert config.image_url == "https://images.example/api/free/bitunix-image"


def test_free_channel_id_defaults_to_the_registered_channel():
    config = FreeChannelConfig.from_env({})

    assert config.channel_id == -1004344705677
    assert config.weekly_limit == 3


@pytest.mark.parametrize("limit", ("1", "2", "4"))
def test_free_weekly_limit_rejects_values_other_than_three(limit):
    with pytest.raises(ValueError, match="debe ser 3"):
        FreeChannelConfig.from_env({"FREE_SIGNALS_PER_WEEK": limit})


def test_momentum_chooses_direction_with_more_profitable_closes():
    rows = [
        {"direction": "Long", "final_profit_pct": 14.0},
        {"direction": "Long", "final_profit_pct": 8.0},
        {"direction": "Short", "final_profit_pct": 5.0},
        {"direction": "Long", "final_profit_pct": -2.0},
        {"direction": "Short", "final_profit_pct": -7.0},
    ]

    assert FreeChannelService.choose_momentum_direction(rows) == "LONG"


def test_momentum_waits_when_long_and_short_are_exactly_tied():
    rows = [
        {"direction": "Long", "final_profit_pct": 10.0},
        {"direction": "Long", "final_profit_pct": 5.0},
        {"direction": "Short", "final_profit_pct": 10.0},
        {"direction": "Short", "final_profit_pct": 5.0},
    ]

    assert FreeChannelService.choose_momentum_direction(rows) is None


def test_momentum_waits_until_two_wins_confirm_a_direction():
    rows = [
        {"direction": "Long", "final_profit_pct": 10.0},
        {"direction": "Short", "final_profit_pct": -2.0},
    ]

    assert FreeChannelService.choose_momentum_direction(rows) is None


def test_week_runs_monday_to_sunday_in_colombia():
    # Lunes 00:30 UTC todavía es domingo 19:30 en Colombia.
    now = datetime(2026, 9, 28, 0, 30, tzinfo=timezone.utc)
    local_day, monday, sunday = FreeChannelService._colombia_week(now)

    assert local_day.isoformat() == "2026-09-27"
    assert monday.isoformat() == "2026-09-21"
    assert sunday.isoformat() == "2026-09-27"


def test_free_account_math_scales_the_real_main_pnl():
    # Si el simulador principal gana 4 USDT usando margen 20, la misma
    # señal con margen 500 gana 100 USDT. El ROI se conserva en 20%.
    free_pnl = FreeChannelService.scaled_pnl(4.0, 20.0, 500.0)

    assert free_pnl == pytest.approx(100.0)
    assert free_pnl / 500.0 * 100 == pytest.approx(20.0)


def test_accumulated_messages_report_realized_result_and_close_state():
    tp = format_free_tp_message("ETHUSDT", 2, 18.25, 91.25, "2h 10m")
    closed = format_free_close_message(
        "ETHUSDT", "BREAKEVEN", 8.5, 42.5, "3h 05m"
    )

    plain_tp = tp.replace("**", "")
    plain_closed = closed.replace("**", "")
    assert "ROI acumulado: +18.25%" in plain_tp
    assert "P&L acumulado: +91.25 USDT" in plain_tp
    assert "BREAK EVEN" in plain_closed
    assert "P&L final: +42.50 USDT" in plain_closed


def test_bitunix_payload_uses_open_price_for_tp1_tp2_and_close_for_tp3():
    config = FreeChannelConfig.from_env(
        {
            "FREE_CHANNEL_ID": "-100123",
            "FREE_SIGNALS_PER_WEEK": "3",
            "FREE_ACCOUNT_BALANCE": "10000",
            "FREE_MARGIN_PER_TRADE": "500",
        }
    )
    service = FreeChannelService(config, None, None, lambda *args: None, lambda _: False)
    sim = SimpleNamespace(
        msg_id="7",
        pair="LTCUSDT",
        direction="Short",
        entry=66.31,
    )

    open_payload = service._image_payload(sim, "TP1", 1.71, 8.55, 66.25)
    final_payload = service._image_payload(sim, "TP3", 5.25, 26.25, 65.10)

    assert open_payload["last_price"] == "66.25"
    assert "close_price" not in open_payload
    assert final_payload["close_price"] == "65.1"
    assert "last_price" not in final_payload
    assert free_symbol("LTCUSDT") == "LTCUSD"


@pytest.mark.asyncio
async def test_tp2_is_forwarded_from_private_channel_to_free_channel():
    config = FreeChannelConfig.from_env(
        {
            "FREE_CHANNEL_ID": "-1004344705677",
            "FREE_SIGNALS_PER_WEEK": "3",
        }
    )
    client = SimpleNamespace(forward_messages=AsyncMock())
    service = FreeChannelService(
        config,
        client,
        lambda *args, **kwargs: None,
        lambda *args: None,
        lambda _: False,
    )
    sim = SimpleNamespace(
        msg_id="9",
        pair="BTCUSDT",
        formatted_pair="BTC/USDT",
        direction="Long",
        entry=84000.0,
    )

    published = await service.publish_tp(
        sim,
        2,
        85000.0,
        20.0,
        20.0,
        "1 Hour",
        private_message_id=7788,
        private_channel_id=-100999,
    )

    assert published is True
    client.forward_messages.assert_awaited_once_with(
        -1004344705677,
        7788,
        from_peer=-100999,
    )
