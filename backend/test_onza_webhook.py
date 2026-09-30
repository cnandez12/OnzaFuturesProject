# -*- coding: utf-8 -*-
"""
test_onza_webhook.py
====================
Prueba completa del webhook a OnzaFutures.
Reproduce los 6 eventos que el bot real envia:
  1. entry   -- nueva senal
  2. tp1     -- target 1 alcanzado
  3. tp2     -- target 2 alcanzado
  4. tp3     -- target 3 alcanzado (cierre TP)
  5. sl      -- stop loss hit
  6. close   -- cierre forzado (desde canal fuente)

Formato EXACTO extraido de AllProfitFormatWhitImage.py -> funciones:
  onza_emit_entry()   -> "entry"
  onza_emit_event()   -> "tp1/tp2/tp3/sl/close"
  _onza_symbol()      -> "BTCUSDT" -> "BTCUSD.P"
  _onza_signal_id()   -> "{symbol}_{timeframe}_{epoch_ms}"
  _onza_roi()         -> (price - entry) / entry * 100 * leverage  (Long)
                         (entry - price) / entry * 100 * leverage  (Short)
"""

import sys
import io
import os
import time
import json
import requests

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Forzar UTF-8 en la salida para que los emojis no causen errores en Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ─────────────────────────────────────────────────────────────────────────────
#  CONFIGURACION -- edita solo esta seccion si necesitas cambiar parametros
# ─────────────────────────────────────────────────────────────────────────────

ONZA_WEBHOOK_URL = "https://dev.api.onza.tech/api/v1/webhooks/signal?source=TradingView"
ONZA_API_KEY     = "ONZA_WEBHOOK_2026"
ONZA_TIMEFRAME   = os.getenv("ONZA_TIMEFRAME", "15M")
ONZA_MESSAGE     = "FB AI CRYPTOFUTURES SCANNER"
LEVERAGE         = 20

# Trade de prueba (LONG)
SYMBOL_RAW   = "BTCUSDT"      # formato interno del bot
DIRECTION    = "LONG"
ENTRY_PRICE  = 62068.0
STOP_LOSS    = 60600.0
TP1          = 63000.0
TP2          = 63526.0
TP3          = 64500.0

# Pausa entre cada envio (segundos) -- evita spam; ajusta a 0 si quieres rapido
DELAY_BETWEEN = 1.5

# ─────────────────────────────────────────────────────────────────────────────
#  HELPERS -- misma logica que el bot real
# ─────────────────────────────────────────────────────────────────────────────

def _onza_symbol(pair: str) -> str:
    """BTCUSDT -> BTCUSD.P  (igual que el bot)."""
    base = pair[:-4] if pair.endswith("USDT") else pair
    return f"{base}USD.P"

def _onza_signal_id(symbol_tv: str, opened_epoch_ms: int) -> str:
    """{symbol}_{tf}_{epoch_ms}"""
    return f"{symbol_tv}_{ONZA_TIMEFRAME}_{opened_epoch_ms}"

def _onza_roi(entry: float, price: float, is_long: bool) -> float:
    """ROI con apalancamiento (+ = ganancia, - = perdida)."""
    move = (price - entry) / entry if is_long else (entry - price) / entry
    return round(move * 100 * LEVERAGE, 2)

def _post(payload: dict, label: str):
    """Envia un payload y muestra el resultado."""
    print(f"\n{'─'*60}")
    print(f"  Enviando: {label}")
    print(f"  typeSignal : {payload.get('typeSignal')}")
    print(f"  symbol     : {payload.get('symbol')}")
    print(f"  signalId   : {payload.get('signalId')}")
    print(f"  Payload completo:")
    print(json.dumps(payload, indent=4, ensure_ascii=False))
    try:
        resp = requests.post(ONZA_WEBHOOK_URL, json=payload, timeout=15)
        print(f"  -> Status  : {resp.status_code}")
        try:
            print(f"  -> Response: {resp.json()}")
        except Exception:
            print(f"  -> Response: {resp.text[:300]}")
        if resp.status_code in (200, 201):
            print("  [OK]")
        else:
            print(f"  [ADVERTENCIA] Respuesta inesperada: {resp.status_code}")
    except Exception as e:
        print(f"  [ERROR] {e}")

# ─────────────────────────────────────────────────────────────────────────────
#  PREPARAR DATOS COMPARTIDOS
# ─────────────────────────────────────────────────────────────────────────────

is_long        = DIRECTION == "LONG"
symbol_tv      = _onza_symbol(SYMBOL_RAW)
opened_epoch   = int(time.time() * 1000)   # ahora como apertura de la senal
signal_id      = _onza_signal_id(symbol_tv, opened_epoch)

print("=" * 60)
print("  TEST COMPLETO -- ONZA FUTURES WEBHOOK")
print("=" * 60)
print(f"  URL        : {ONZA_WEBHOOK_URL}")
print(f"  apiKey     : {ONZA_API_KEY}")
print(f"  symbol TV  : {symbol_tv}  (raw: {SYMBOL_RAW})")
print(f"  signalId   : {signal_id}")
print(f"  direction  : {DIRECTION}")
print(f"  entry      : {ENTRY_PRICE}")
print(f"  leverage   : {LEVERAGE}x")
print(f"  SL         : {STOP_LOSS}  (roi={_onza_roi(ENTRY_PRICE, STOP_LOSS, is_long)}%)")
print(f"  TP1        : {TP1}  (roi={_onza_roi(ENTRY_PRICE, TP1, is_long)}%)")
print(f"  TP2        : {TP2}  (roi={_onza_roi(ENTRY_PRICE, TP2, is_long)}%)")
print(f"  TP3        : {TP3}  (roi={_onza_roi(ENTRY_PRICE, TP3, is_long)}%)")
print("=" * 60)

# ─────────────────────────────────────────────────────────────────────────────
#  TEST 1: ENTRY  (onza_emit_entry)
# ─────────────────────────────────────────────────────────────────────────────

take_profits = [
    {"price": TP1, "roi": _onza_roi(ENTRY_PRICE, TP1, is_long)},
    {"price": TP2, "roi": _onza_roi(ENTRY_PRICE, TP2, is_long)},
    {"price": TP3, "roi": _onza_roi(ENTRY_PRICE, TP3, is_long)},
]

payload_entry = {
    "signalId":    signal_id,
    "typeSignal":  "entry",
    "symbol":      symbol_tv,
    "direction":   DIRECTION,
    "entry":       ENTRY_PRICE,
    "leverage":    LEVERAGE,
    "stopLoss":    {
        "price": STOP_LOSS,
        "roi":   _onza_roi(ENTRY_PRICE, STOP_LOSS, is_long),
    },
    "takeProfits": take_profits,
    "timeframe":   ONZA_TIMEFRAME,
    "message":     ONZA_MESSAGE,
    "apiKey":      ONZA_API_KEY,
}
_post(payload_entry, "1/6 -- ENTRY")
time.sleep(DELAY_BETWEEN)

# ─────────────────────────────────────────────────────────────────────────────
#  TEST 2: TP1  (onza_emit_event)
# ─────────────────────────────────────────────────────────────────────────────

payload_tp1 = {
    "signalId":   signal_id,
    "typeSignal": "tp1",
    "symbol":     symbol_tv,
    "direction":  DIRECTION,
    "entry":      ENTRY_PRICE,
    "price":      TP1,
    "roi":        _onza_roi(ENTRY_PRICE, TP1, is_long),
    "leverage":   LEVERAGE,
    "timeframe":  ONZA_TIMEFRAME,
    "message":    ONZA_MESSAGE,
    "apiKey":     ONZA_API_KEY,
}
_post(payload_tp1, "2/6 -- TP1")
time.sleep(DELAY_BETWEEN)

# ─────────────────────────────────────────────────────────────────────────────
#  TEST 3: TP2
# ─────────────────────────────────────────────────────────────────────────────

payload_tp2 = {
    "signalId":   signal_id,
    "typeSignal": "tp2",
    "symbol":     symbol_tv,
    "direction":  DIRECTION,
    "entry":      ENTRY_PRICE,
    "price":      TP2,
    "roi":        _onza_roi(ENTRY_PRICE, TP2, is_long),
    "leverage":   LEVERAGE,
    "timeframe":  ONZA_TIMEFRAME,
    "message":    ONZA_MESSAGE,
    "apiKey":     ONZA_API_KEY,
}
_post(payload_tp2, "3/6 -- TP2")
time.sleep(DELAY_BETWEEN)

# ─────────────────────────────────────────────────────────────────────────────
#  TEST 4: TP3 (cierre por take profit completo)
# ─────────────────────────────────────────────────────────────────────────────

payload_tp3 = {
    "signalId":   signal_id,
    "typeSignal": "tp3",
    "symbol":     symbol_tv,
    "direction":  DIRECTION,
    "entry":      ENTRY_PRICE,
    "price":      TP3,
    "roi":        _onza_roi(ENTRY_PRICE, TP3, is_long),
    "leverage":   LEVERAGE,
    "timeframe":  ONZA_TIMEFRAME,
    "message":    ONZA_MESSAGE,
    "apiKey":     ONZA_API_KEY,
}
_post(payload_tp3, "4/6 -- TP3")
time.sleep(DELAY_BETWEEN)

# ─────────────────────────────────────────────────────────────────────────────
#  TEST 5: SL -- senal nueva que termina en stop loss
#  El bot siempre emite entry antes de sl; reproducimos ese flujo.
#  Nota: el bot pasa fill_price (mark price real de Binance al momento del
#  trigger), no el nivel exacto del SL. En practica son iguales o muy cercanos.
# ─────────────────────────────────────────────────────────────────────────────

signal_id_sl = _onza_signal_id(symbol_tv, int(time.time() * 1000))

payload_sl_entry = {
    "signalId":    signal_id_sl,
    "typeSignal":  "entry",
    "symbol":      symbol_tv,
    "direction":   DIRECTION,
    "entry":       ENTRY_PRICE,
    "leverage":    LEVERAGE,
    "stopLoss":    {
        "price": STOP_LOSS,
        "roi":   _onza_roi(ENTRY_PRICE, STOP_LOSS, is_long),
    },
    "takeProfits": take_profits,
    "timeframe":   ONZA_TIMEFRAME,
    "message":     ONZA_MESSAGE,
    "apiKey":      ONZA_API_KEY,
}
_post(payload_sl_entry, "5a/6 -- SL trade: ENTRY")
time.sleep(DELAY_BETWEEN)

payload_sl = {
    "signalId":   signal_id_sl,
    "typeSignal": "sl",
    "symbol":     symbol_tv,
    "direction":  DIRECTION,
    "entry":      ENTRY_PRICE,
    "price":      STOP_LOSS,
    "roi":        _onza_roi(ENTRY_PRICE, STOP_LOSS, is_long),
    "leverage":   LEVERAGE,
    "timeframe":  ONZA_TIMEFRAME,
    "message":    ONZA_MESSAGE,
    "apiKey":     ONZA_API_KEY,
}
_post(payload_sl, "5b/6 -- SL trade: STOP LOSS")
time.sleep(DELAY_BETWEEN)

# ─────────────────────────────────────────────────────────────────────────────
#  TEST 6: CLOSE -- cierre forzado (onza_emit_close)
#  Flujo real: entry -> tp1 -> close desde canal fuente
#  final_roi = max(roi_tp1, roi_floating) si last_tp > 0
# ─────────────────────────────────────────────────────────────────────────────

signal_id_close = _onza_signal_id(symbol_tv, int(time.time() * 1000))
close_price     = 68200.0

payload_close_entry = {
    "signalId":    signal_id_close,
    "typeSignal":  "entry",
    "symbol":      symbol_tv,
    "direction":   DIRECTION,
    "entry":       ENTRY_PRICE,
    "leverage":    LEVERAGE,
    "stopLoss":    {
        "price": STOP_LOSS,
        "roi":   _onza_roi(ENTRY_PRICE, STOP_LOSS, is_long),
    },
    "takeProfits": take_profits,
    "timeframe":   ONZA_TIMEFRAME,
    "message":     ONZA_MESSAGE,
    "apiKey":      ONZA_API_KEY,
}
_post(payload_close_entry, "6a/6 -- CLOSE trade: ENTRY")
time.sleep(DELAY_BETWEEN)

payload_close_tp1 = {
    "signalId":   signal_id_close,
    "typeSignal": "tp1",
    "symbol":     symbol_tv,
    "direction":  DIRECTION,
    "entry":      ENTRY_PRICE,
    "price":      TP1,
    "roi":        _onza_roi(ENTRY_PRICE, TP1, is_long),
    "leverage":   LEVERAGE,
    "timeframe":  ONZA_TIMEFRAME,
    "message":    ONZA_MESSAGE,
    "apiKey":     ONZA_API_KEY,
}
_post(payload_close_tp1, "6b/6 -- CLOSE trade: TP1")
time.sleep(DELAY_BETWEEN)

roi_tp1_filled = _onza_roi(ENTRY_PRICE, TP1, is_long)
roi_floating   = _onza_roi(ENTRY_PRICE, close_price, is_long)
final_roi      = max(roi_tp1_filled, roi_floating) if roi_tp1_filled > 0 else roi_floating

payload_close = {
    "signalId":   signal_id_close,
    "typeSignal": "close",
    "symbol":     symbol_tv,
    "direction":  DIRECTION,
    "entry":      ENTRY_PRICE,
    "price":      close_price,
    "roi":        round(final_roi, 2),
    "leverage":   LEVERAGE,
    "timeframe":  ONZA_TIMEFRAME,
    "message":    ONZA_MESSAGE,
    "apiKey":     ONZA_API_KEY,
}
_post(payload_close, "6c/6 -- CLOSE trade: CLOSE forzado")

# ─────────────────────────────────────────────────────────────────────────────
#  BONUS: SHORT trade de prueba (entry unicamente)
# ─────────────────────────────────────────────────────────────────────────────

print(f"\n{'─'*60}")
print("  BONUS -- Senal SHORT de ejemplo (solo entry)")
print(f"{'─'*60}")

SHORT_ENTRY   = 67500.0
SHORT_SL      = 70000.0
SHORT_TP1     = 66000.0
SHORT_TP2     = 64500.0
SHORT_TP3     = 63000.0

is_short_long = False   # SHORT
signal_id_short = _onza_signal_id(symbol_tv, int(time.time() * 1000))

take_profits_short = [
    {"price": SHORT_TP1, "roi": _onza_roi(SHORT_ENTRY, SHORT_TP1, is_short_long)},
    {"price": SHORT_TP2, "roi": _onza_roi(SHORT_ENTRY, SHORT_TP2, is_short_long)},
    {"price": SHORT_TP3, "roi": _onza_roi(SHORT_ENTRY, SHORT_TP3, is_short_long)},
]

payload_short_entry = {
    "signalId":    signal_id_short,
    "typeSignal":  "entry",
    "symbol":      symbol_tv,
    "direction":   "SHORT",
    "entry":       SHORT_ENTRY,
    "leverage":    LEVERAGE,
    "stopLoss":    {
        "price": SHORT_SL,
        "roi":   _onza_roi(SHORT_ENTRY, SHORT_SL, is_short_long),
    },
    "takeProfits": take_profits_short,
    "timeframe":   ONZA_TIMEFRAME,
    "message":     ONZA_MESSAGE,
    "apiKey":      ONZA_API_KEY,
}
_post(payload_short_entry, "BONUS -- SHORT entry")

# ─────────────────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("  TESTS COMPLETADOS")
print("=" * 60)
