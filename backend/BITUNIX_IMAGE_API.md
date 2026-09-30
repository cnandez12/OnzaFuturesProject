# Generador de imágenes Bitunix para el canal gratuito

El endpoint `POST /api/free/bitunix-image` es independiente de
`POST /api/futures/image`, que continúa generando las imágenes actuales de
Binance.

Solo acepta solicitudes locales (`127.0.0.1` o `::1`). No calcula el
resultado de la operación: exige que el sistema de señales le entregue el ROI
y el P&L USDT exactos.

## Eventos

- `TP1` y `TP2`: posición abierta. Usa `last_price` y no imprime `Closed`.
- `TP3` y `CLOSED`: posición cerrada. Usa `close_price` e imprime `Closed`.

## Ejemplo TP1

```json
{
  "event": "TP1",
  "signal_id": "telegram-message-id",
  "symbol": "LTCUSDT",
  "direction": "Short",
  "leverage": 20,
  "roi": "1.71",
  "profit_usdt": "348.2843",
  "entry_price": "66.31",
  "last_price": "66.25",
  "timestamp": "2026-09-24 15:49"
}
```

## Ejemplo de cierre

```json
{
  "event": "CLOSED",
  "signal_id": "telegram-message-id",
  "symbol": "BNBUSDT",
  "direction": "Short",
  "leverage": 20,
  "roi": "7.77",
  "profit_usdt": "1504.11483911",
  "entry_price": "764.12",
  "close_price": "760.58",
  "timestamp": "2026-09-24 15:41"
}
```

`template` puede fijarse en `knight`, `bear`, `tom` o `spider`. Si se omite, se
elige de forma estable usando `signal_id`, por lo que una misma señal
conserva su ilustración durante todo el seguimiento.
