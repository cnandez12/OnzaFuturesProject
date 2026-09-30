"""Canal gratuito de Onza Futures.

Selecciona señales antes de conocer su resultado, conserva el estado en
PostgreSQL, publica el seguimiento como respuestas y usa las imágenes Bitunix
sin afectar el canal privado ni los webhooks.
"""

from __future__ import annotations

import asyncio
import base64
import os
import re
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable, Optional

import requests


ONZA_APP_URL = "https://apps.apple.com/app/id6768534887"
UTC = timezone.utc


FREE_SIGNAL_TEMPLATE = (
    "🎁 **NUEVA SEÑAL GRATUITA**\n"
    "⚡ **ONZA FUTURES**\n"
    "━━━━━━━━━━━━━━━━━━\n\n"
    "🪙 **{symbol}**\n"
    "{signal_emoji} **{direction}**  •  ⚙️ **{leverage}X**\n\n"
    "📍 **PUNTO DE ENTRADA**\n"
    "`{entry_price}`\n\n"
    "🏆 **ZONAS DE BENEFICIO**\n"
    "① **TP1**  ·  `{tp1}`\n"
    "② **TP2**  ·  `{tp2}`\n"
    "③ **TP3**  ·  `{tp3}`\n\n"
    "🛡️ **STOP LOSS · NIVEL DE PROTECCIÓN**\n"
    "`{stop_loss}`\n\n"
    "━━━━━━━━━━━━━━━━━━\n"
    "🚀 **¿QUIERES OPERAR ESTA SEÑAL?**\n"
    "📲 **ENTRA A ONZA APP YA MISMO**👇🏻\n"
    f"{ONZA_APP_URL}"
)


def free_symbol(pair: Any) -> str:
    symbol = re.sub(r"[^A-Za-z0-9]", "", str(pair or "")).upper()
    if symbol.endswith("USDT"):
        symbol = symbol[:-1]
    return symbol


def format_free_signal_message(
    pair, direction, leverage, entry_price, tp_levels, stop_loss
) -> str:
    if len(tp_levels) != 3:
        raise ValueError("El formato gratuito requiere exactamente tres take profits")

    normalized_direction = str(direction).strip().upper()
    signal_emoji = "🟢 📈" if normalized_direction == "LONG" else "🔴 📉"
    return FREE_SIGNAL_TEMPLATE.format(
        symbol=free_symbol(pair),
        direction=normalized_direction,
        signal_emoji=signal_emoji,
        leverage=leverage,
        entry_price=entry_price,
        tp1=tp_levels[0],
        tp2=tp_levels[1],
        tp3=tp_levels[2],
        stop_loss=stop_loss,
    )


def format_free_tp_message(
    pair: str,
    tp_num: int,
    roi: float,
    profit_usdt: float,
    duration: str,
) -> str:
    final = tp_num == 3
    title = "🏆 **TP3 COMPLETADO · OPERACIÓN CERRADA**" if final else f"✅ **TP{tp_num} ALCANZADO**"
    return (
        f"{title}\n"
        f"⚡ **ONZA FUTURES**\n"
        f"━━━━━━━━━━━━━━━━━━\n\n"
        f"🪙 **{free_symbol(pair)}**\n"
        f"📊 **ROI acumulado:** {roi:+.2f}%\n"
        f"💵 **P&L acumulado:** {profit_usdt:+.2f} USDT\n"
        f"⏱️ **Duración:** {duration}\n\n"
        f"📲 **ENTRA A ONZA APP YA MISMO**👇🏻\n"
        f"{ONZA_APP_URL}"
    )


def format_free_close_message(
    pair: str,
    reason: str,
    roi: float,
    profit_usdt: float,
    duration: str,
) -> str:
    normalized = str(reason or "CLOSED").upper()
    if normalized == "BREAKEVEN":
        title = "⚖️ **OPERACIÓN CERRADA EN BREAK EVEN**"
    elif profit_usdt >= 0:
        title = "✅ **OPERACIÓN CERRADA EN POSITIVO**"
    else:
        title = "🛑 **OPERACIÓN FINALIZADA**"
    return (
        f"{title}\n"
        f"⚡ **ONZA FUTURES**\n"
        f"━━━━━━━━━━━━━━━━━━\n\n"
        f"🪙 **{free_symbol(pair)}**\n"
        f"📊 **ROI final:** {roi:+.2f}%\n"
        f"💵 **P&L final:** {profit_usdt:+.2f} USDT\n"
        f"⏱️ **Duración:** {duration}\n\n"
        f"📲 **ENTRA A ONZA APP YA MISMO**👇🏻\n"
        f"{ONZA_APP_URL}"
    )


@dataclass(frozen=True)
class FreeChannelConfig:
    channel_id: Optional[int]
    weekly_limit: int
    account_balance: float
    margin_per_trade: float
    leverage: int
    image_url: str

    @property
    def enabled(self) -> bool:
        return self.channel_id is not None

    @classmethod
    def from_env(
        cls,
        env: Optional[dict[str, str]] = None,
        *,
        leverage: int = 20,
        existing_image_url: str = "",
    ) -> "FreeChannelConfig":
        values = os.environ if env is None else env
        channel_value = str(
            values.get("FREE_CHANNEL_ID", "-1004344705677")
        ).strip()
        channel_id = int(channel_value) if channel_value else None

        weekly_limit = int(values.get("FREE_SIGNALS_PER_WEEK", "3"))
        if weekly_limit != 3:
            raise ValueError("FREE_SIGNALS_PER_WEEK debe ser 3")

        account_balance = float(values.get("FREE_ACCOUNT_BALANCE", "10000"))
        margin_per_trade = float(values.get("FREE_MARGIN_PER_TRADE", "500"))
        if account_balance <= 0 or margin_per_trade <= 0:
            raise ValueError("Los balances del canal gratuito deben ser positivos")
        if margin_per_trade > account_balance:
            raise ValueError("FREE_MARGIN_PER_TRADE no puede superar FREE_ACCOUNT_BALANCE")

        configured_image = str(values.get("BITUNIX_IMAGE_SERVER_URL", "")).strip()
        if not configured_image and existing_image_url:
            configured_image = re.sub(
                r"/api/futures/image/?$",
                "/api/free/bitunix-image",
                existing_image_url.rstrip("/"),
            )
        if not configured_image:
            configured_image = "http://127.0.0.1:3000/api/free/bitunix-image"

        return cls(
            channel_id=channel_id,
            weekly_limit=weekly_limit,
            account_balance=account_balance,
            margin_per_trade=margin_per_trade,
            leverage=int(leverage),
            image_url=configured_image,
        )


class FreeChannelService:
    def __init__(
        self,
        config: FreeChannelConfig,
        client: Any,
        db_query: Callable[..., Any],
        log: Callable[..., Any],
        is_blacklisted: Callable[[Any], bool],
    ):
        self.config = config
        self.client = client
        self.db_query = db_query
        self.log = log
        self.is_blacklisted = is_blacklisted
        self._selection_lock = asyncio.Lock()
        self._event_lock = asyncio.Lock()

    def ensure_schema(self) -> bool:
        queries = (
            """CREATE TABLE IF NOT EXISTS free_channel_signals (
                source_message_id BIGINT PRIMARY KEY,
                selected_date DATE NOT NULL,
                free_message_id BIGINT,
                symbol VARCHAR NOT NULL,
                direction VARCHAR NOT NULL,
                entry_price DECIMAL(20,8) NOT NULL,
                tp1 DECIMAL(20,8),
                tp2 DECIMAL(20,8),
                tp3 DECIMAL(20,8),
                stop_loss DECIMAL(20,8),
                leverage INTEGER NOT NULL,
                pnl_accumulated DECIMAL(14,8) DEFAULT 0,
                tp1_filled BOOLEAN DEFAULT FALSE,
                tp2_filled BOOLEAN DEFAULT FALSE,
                tp3_filled BOOLEAN DEFAULT FALSE,
                closed BOOLEAN DEFAULT FALSE,
                close_reason VARCHAR,
                final_profit_pct DECIMAL(12,4),
                final_profit_usdt DECIMAL(14,4),
                balance_before DECIMAL(14,4),
                balance_after DECIMAL(14,4),
                opened_at TIMESTAMP WITH TIME ZONE,
                closed_at TIMESTAMP WITH TIME ZONE
            )""",
            """CREATE TABLE IF NOT EXISTS free_channel_meta (
                key VARCHAR PRIMARY KEY,
                value TEXT
            )""",
            "CREATE INDEX IF NOT EXISTS idx_free_signals_selected_date ON free_channel_signals(selected_date)",
            "CREATE INDEX IF NOT EXISTS idx_free_signals_closed_at ON free_channel_signals(closed_at)",
        )
        for query in queries:
            if not self.db_query(query):
                self.log("ERROR", "[FREE] No fue posible inicializar el esquema")
                return False
        return True

    @staticmethod
    def scaled_pnl(main_profit_usdt: float, main_margin: float, free_margin: float) -> float:
        if float(main_margin) <= 0:
            raise ValueError("main_margin debe ser positivo")
        return float(main_profit_usdt) * (float(free_margin) / float(main_margin))

    def _selected(self, source_message_id: Any):
        return self.db_query(
            "SELECT * FROM free_channel_signals WHERE source_message_id = %s",
            (int(source_message_id),),
            fetchone=True,
        )

    def _current_balance(self) -> float:
        row = self.db_query(
            "SELECT COALESCE(SUM(final_profit_usdt), 0) AS total "
            "FROM free_channel_signals WHERE closed = TRUE",
            fetchone=True,
        )
        realized = float(row["total"]) if row and row.get("total") is not None else 0.0
        return self.config.account_balance + realized

    @staticmethod
    def choose_momentum_direction(rows: list[dict[str, Any]]) -> Optional[str]:
        """Elige la dirección dominante usando solo operaciones ya cerradas."""
        stats = {
            "LONG": {"wins": 0, "net": 0.0},
            "SHORT": {"wins": 0, "net": 0.0},
        }
        for row in rows:
            direction = str(row.get("direction") or "").strip().upper()
            if direction not in stats:
                continue
            result = float(row.get("final_profit_pct") or 0)
            stats[direction]["net"] += result
            if result > 0:
                stats[direction]["wins"] += 1

        eligible = [
            direction
            for direction, values in stats.items()
            if values["wins"] >= 2 and values["net"] > 0
        ]
        if not eligible:
            return None
        ranked = sorted(
            eligible,
            key=lambda direction: (
                stats[direction]["wins"],
                stats[direction]["net"],
            ),
            reverse=True,
        )
        if len(ranked) > 1:
            first = stats[ranked[0]]
            second = stats[ranked[1]]
            if (first["wins"], first["net"]) == (
                second["wins"], second["net"]
            ):
                return None
        return ranked[0]

    def _momentum_direction(self) -> Optional[str]:
        rows = self.db_query(
            """SELECT symbol, direction, final_profit_pct, closed_at
               FROM sim_track_record
               WHERE closed_at IS NOT NULL
               ORDER BY closed_at DESC
               LIMIT 8""",
            fetch=True,
        ) or []
        allowed = [
            row for row in rows
            if not self.is_blacklisted(row.get("symbol"))
        ]
        return self.choose_momentum_direction(allowed)

    @staticmethod
    def _colombia_week(now: Optional[datetime] = None):
        colombia = timezone(timedelta(hours=-5))
        local_day = (now or datetime.now(UTC)).astimezone(colombia).date()
        monday = local_day - timedelta(days=local_day.weekday())
        sunday = monday + timedelta(days=6)
        return local_day, monday, sunday

    async def maybe_publish_signal(self, sim: Any) -> bool:
        if not self.config.enabled or self.is_blacklisted(sim.pair):
            return False

        async with self._selection_lock:
            if self._selected(sim.msg_id):
                return False

            today, monday, sunday = self._colombia_week()
            count_row = self.db_query(
                """SELECT COUNT(*) AS total
                   FROM free_channel_signals
                   WHERE selected_date BETWEEN %s AND %s""",
                (monday, sunday),
                fetchone=True,
            )
            selected = int(count_row["total"]) if count_row else 0
            if selected >= self.config.weekly_limit:
                self.log(
                    "INFO",
                    f"[FREE] Cupo semanal completo "
                    f"({selected}/{self.config.weekly_limit})",
                )
                return False

            momentum = self._momentum_direction()
            candidate_direction = str(sim.direction).strip().upper()
            if momentum is None:
                self.log(
                    "INFO",
                    f"[FREE] {sim.pair} en espera: todavía no hay "
                    "una dirección ganadora confirmada",
                )
                return False
            if candidate_direction != momentum:
                self.log(
                    "INFO",
                    f"[FREE] {sim.pair} {candidate_direction} omitida: "
                    f"momento dominante {momentum}",
                )
                return False

            reserved = self.db_query(
                """INSERT INTO free_channel_signals (
                    source_message_id, selected_date, symbol, direction,
                    entry_price, tp1, tp2, tp3, stop_loss, leverage, opened_at
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                ON CONFLICT (source_message_id) DO NOTHING""",
                (
                    int(sim.msg_id), today, sim.pair, sim.direction,
                    sim.entry, sim.tp1, sim.tp2, sim.tp3, sim.stop_loss,
                    self.config.leverage, sim.timestamp,
                ),
            )
            if not reserved:
                return False

            message = format_free_signal_message(
                sim.formatted_pair,
                sim.direction,
                self.config.leverage,
                self._format_price(sim.entry),
                [
                    self._format_price(sim.tp1),
                    self._format_price(sim.tp2),
                    self._format_price(sim.tp3),
                ],
                self._format_price(sim.stop_loss),
            )
            try:
                sent = await self.client.send_message(
                    self.config.channel_id, message, link_preview=False
                )
            except Exception as exc:
                self.db_query(
                    "DELETE FROM free_channel_signals WHERE source_message_id = %s",
                    (int(sim.msg_id),),
                )
                self.log("ERROR", f"[FREE] Error enviando señal {sim.pair}: {exc}")
                return False

            self.db_query(
                "UPDATE free_channel_signals SET free_message_id = %s "
                "WHERE source_message_id = %s",
                (sent.id, int(sim.msg_id)),
            )
            self.log(
                "INFO",
                f"[FREE] Señal semanal seleccionada {sim.pair} {momentum} "
                f"({selected + 1}/{self.config.weekly_limit})",
            )
            return True

    async def publish_tp(
        self,
        sim: Any,
        tp_num: int,
        fill_price: float,
        main_accumulated_usdt: float,
        main_margin: float,
        duration: str,
        *,
        private_message_id: Optional[int] = None,
        private_channel_id: Optional[int] = None,
    ) -> bool:
        if not self.config.enabled or self.is_blacklisted(sim.pair):
            return False
        if tp_num not in (1, 2, 3):
            raise ValueError("tp_num debe ser 1, 2 o 3")

        async with self._event_lock:
            row = self._selected(sim.msg_id)
            free_profit = self.scaled_pnl(
                main_accumulated_usdt,
                main_margin,
                self.config.margin_per_trade,
            )
            roi = (free_profit / self.config.margin_per_trade) * 100
            flag = f"tp{tp_num}_filled"
            if row and row.get(flag):
                return False

            # TP2 y TP3 se reenvían literalmente desde el canal privado.
            # Esto también publica los resultados premium de señales que no
            # pertenecen a las tres selecciones semanales.
            if tp_num in (2, 3):
                sent = await self._forward_private_result(
                    private_message_id, private_channel_id
                )
                if not sent:
                    return False
                if not row:
                    self.log(
                        "INFO",
                        f"[FREE] TP{tp_num} premium reenviado: {sim.pair}",
                    )
                    return True
            elif not row:
                return False
            else:
                payload = self._image_payload(
                    sim, "TP1", roi, free_profit, fill_price
                )
                caption = format_free_tp_message(
                    sim.formatted_pair, 1, roi, free_profit, duration
                )
                sent = await self._send_with_optional_image(
                    caption, payload, reply_to=row.get("free_message_id")
                )
                if not sent:
                    return False

            if tp_num == 3:
                balance_before = self._current_balance()
                balance_after = balance_before + free_profit
                self.db_query(
                    """UPDATE free_channel_signals
                       SET tp3_filled=TRUE, pnl_accumulated=%s, closed=TRUE,
                           close_reason='TP3', final_profit_pct=%s,
                           final_profit_usdt=%s, balance_before=%s,
                           balance_after=%s, closed_at=%s
                       WHERE source_message_id=%s""",
                    (
                        free_profit, roi, free_profit, balance_before,
                        balance_after, datetime.now(UTC), int(sim.msg_id),
                    ),
                )
            else:
                self.db_query(
                    f"UPDATE free_channel_signals SET {flag}=TRUE, "
                    "pnl_accumulated=%s WHERE source_message_id=%s",
                    (free_profit, int(sim.msg_id)),
                )
            return True

    async def _forward_private_result(
        self,
        private_message_id: Optional[int],
        private_channel_id: Optional[int],
    ) -> bool:
        if not private_message_id or not private_channel_id:
            self.log(
                "ERROR",
                "[FREE] No se recibió el mensaje privado que debía reenviarse",
            )
            return False
        try:
            await self.client.forward_messages(
                self.config.channel_id,
                int(private_message_id),
                from_peer=int(private_channel_id),
            )
            return True
        except Exception as exc:
            self.log("ERROR", f"[FREE] Error reenviando resultado privado: {exc}")
            return False

    async def publish_close(
        self,
        sim: Any,
        close_price: float,
        main_net_usdt: float,
        main_margin: float,
        duration: str,
        reason: str,
    ) -> bool:
        if not self.config.enabled or self.is_blacklisted(sim.pair):
            return False

        async with self._event_lock:
            row = self._selected(sim.msg_id)
            if not row or row.get("closed"):
                return False

            free_profit = self.scaled_pnl(
                main_net_usdt, main_margin, self.config.margin_per_trade
            )
            roi = (free_profit / self.config.margin_per_trade) * 100
            payload = self._image_payload(
                sim, "CLOSED", roi, free_profit, close_price
            )
            caption = format_free_close_message(
                sim.formatted_pair, reason, roi, free_profit, duration
            )
            sent = await self._send_with_optional_image(
                caption, payload, reply_to=row.get("free_message_id")
            )
            if not sent:
                return False

            balance_before = self._current_balance()
            balance_after = balance_before + free_profit
            self.db_query(
                """UPDATE free_channel_signals
                   SET pnl_accumulated=%s, closed=TRUE, close_reason=%s,
                       final_profit_pct=%s, final_profit_usdt=%s,
                       balance_before=%s, balance_after=%s, closed_at=%s
                   WHERE source_message_id=%s""",
                (
                    free_profit, reason, roi, free_profit,
                    balance_before, balance_after, datetime.now(UTC),
                    int(sim.msg_id),
                ),
            )
            return True

    async def publish_positive_daily(self, now: datetime) -> bool:
        if not self.config.enabled:
            return False

        day = now.astimezone(UTC).date()
        day_key = day.isoformat()
        if self._get_meta("last_daily_summary_date") == day_key:
            return False

        start = datetime(day.year, day.month, day.day, tzinfo=UTC)
        end = start + timedelta(days=1)
        rows = self.db_query(
            """SELECT symbol, direction, final_profit_pct
               FROM sim_track_record
               WHERE closed_at >= %s AND closed_at < %s
               ORDER BY closed_at""",
            (start, end),
            fetch=True,
        ) or []
        allowed = [row for row in rows if not self.is_blacklisted(row["symbol"])]
        total = sum(float(row["final_profit_pct"] or 0) for row in allowed)
        if not allowed or total <= 0:
            self._set_meta("last_daily_summary_date", day_key)
            return False

        won = sum(1 for row in allowed if float(row["final_profit_pct"] or 0) >= 0)
        lost = len(allowed) - won
        accuracy = won / len(allowed) * 100
        text = (
            "🏆 **CIERRE POSITIVO DEL DÍA**\n"
            "⚡ **ONZA FUTURES · CANAL PREMIUM**\n"
            "━━━━━━━━━━━━━━━━━━\n\n"
            f"📊 **Resultado neto:** {total:+.2f}%\n"
            f"✅ **Ganadas:** {won}\n"
            f"❌ **Perdidas:** {lost}\n"
            f"🎯 **Efectividad:** {accuracy:.2f}%\n\n"
            "🚀 **Recibe todas las señales en Onza App**\n"
            f"{ONZA_APP_URL}"
        )
        try:
            sent = await self.client.send_message(
                self.config.channel_id, text, link_preview=False
            )
        except Exception as exc:
            self.log("ERROR", f"[FREE] No se pudo enviar el cierre diario: {exc}")
            return False

        self._set_meta("last_daily_summary_date", day_key)
        previous = self._get_meta("last_pinned_message_id")
        if previous:
            try:
                await self.client.unpin_message(
                    self.config.channel_id, int(previous)
                )
            except Exception:
                pass
        try:
            await self.client.pin_message(
                self.config.channel_id, sent.id, notify=False
            )
            self._set_meta("last_pinned_message_id", str(sent.id))
        except Exception as exc:
            self.log("ERROR", f"[FREE] No se pudo fijar el cierre diario: {exc}")
        return True

    def _image_payload(
        self,
        sim: Any,
        event: str,
        roi: float,
        profit_usdt: float,
        price: float,
    ) -> dict[str, Any]:
        payload = {
            "event": event,
            "signal_id": str(sim.msg_id),
            "symbol": sim.pair,
            "direction": sim.direction,
            "leverage": self.config.leverage,
            "roi": f"{roi:.8f}",
            "profit_usdt": f"{profit_usdt:.8f}",
            "entry_price": str(sim.entry),
            "timestamp": datetime.now(UTC).strftime("%Y-%m-%d %H:%M"),
        }
        if event in {"TP1", "TP2"}:
            payload["last_price"] = str(price)
        else:
            payload["close_price"] = str(price)
        return payload

    async def _send_with_optional_image(
        self,
        caption: str,
        payload: dict[str, Any],
        reply_to: Optional[int] = None,
    ) -> bool:
        image_path = await self._request_image(payload)
        try:
            if image_path:
                await self.client.send_file(
                    self.config.channel_id,
                    image_path,
                    caption=caption,
                    reply_to=reply_to,
                    link_preview=False,
                )
            else:
                await self.client.send_message(
                    self.config.channel_id,
                    caption,
                    reply_to=reply_to,
                    link_preview=False,
                )
            return True
        except Exception as exc:
            self.log("ERROR", f"[FREE] Error enviando actualización: {exc}")
            return False
        finally:
            if image_path:
                Path(image_path).unlink(missing_ok=True)

    async def _request_image(self, payload: dict[str, Any]) -> str:
        try:
            response = await asyncio.to_thread(
                requests.post,
                self.config.image_url,
                json=payload,
                timeout=20,
            )
            if response.status_code != 200:
                self.log(
                    "ERROR",
                    f"[FREE] Imagen Bitunix respondió {response.status_code}",
                )
                return ""
            encoded = response.json()["image"].split(",", 1)[1]
            path = Path(f"temp_bitunix_{uuid.uuid4().hex[:8]}.jpg")
            path.write_bytes(base64.b64decode(encoded))
            return str(path)
        except Exception as exc:
            self.log("ERROR", f"[FREE] Error generando imagen Bitunix: {exc}")
            return ""

    def _get_meta(self, key: str) -> Optional[str]:
        row = self.db_query(
            "SELECT value FROM free_channel_meta WHERE key = %s",
            (key,),
            fetchone=True,
        )
        return str(row["value"]) if row and row.get("value") is not None else None

    def _set_meta(self, key: str, value: str) -> None:
        self.db_query(
            """INSERT INTO free_channel_meta (key, value) VALUES (%s, %s)
               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value""",
            (key, value),
        )

    @staticmethod
    def _format_price(value: Any) -> str:
        number = float(value)
        if number >= 1000:
            return f"{number:,.2f}"
        if number >= 1:
            return f"{number:.4f}".rstrip("0").rstrip(".")
        return f"{number:.8f}".rstrip("0").rstrip(".")
