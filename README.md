# Onza Futures Project

Recibe las alertas del indicador de TradingView, lleva el registro simulado de cada señal y la publica en Telegram y en VORZA. Incluye un panel interno protegido por contraseña y un sitio público de resultados.

El proyecto **no coloca órdenes ni lee ejecuciones reales**: todas las cifras son resultados teóricos calculados a partir de las alertas, sin comisiones, funding ni deslizamiento.

## Flujo

1. **TradingView → receptor.** El indicador `FB_AI_SCANNER_ONZA_WEBHOOK_ONLY.pine` envía un JSON a `POST /webhook/tradingview`. El receptor valida la clave, normaliza el contrato (`onza_contract.py`), guarda el evento en `tv_events` y responde `202`. Un evento repetido idéntico responde `200` sin duplicar nada; uno repetido con datos distintos responde `409`.
2. **Procesamiento.** `worker.py process` aplica cada evento a `trades` y, al cerrar, a `sim_track_record`, con parciales 40/40/20 y el stop original (`onza_processing.py`).
3. **Telegram.** `worker.py telegram` publica en el canal principal: la entrada como texto y cada TP/SL/cierre como tarjeta en respuesta a su entrada. El mismo proceso lanza `telegram_channels.py`, que atiende el canal Free, el resumen diario y el semanal.
4. **VORZA.** `vorza_worker.py` publica las entradas nuevas y los cierres por señal contraria. Ver `VORZA_DEPLOY.md`.
5. **Consulta.** El panel interno en `/` (con contraseña) y el sitio público en su propio hostname.

Cada etapa lee de PostgreSQL y ninguna espera a la siguiente: el receptor responde aunque Telegram o VORZA estén caídos.

## Archivos

| Archivo | Función |
|---|---|
| `app.py` | Aplicación web: receptor, APIs del panel, API pública y rutas de salud |
| `gunicorn.conf.py` | Servidor web con hilos (2 procesos × 8 hilos) |
| `request_limits.py` | Cupo para rutas lentas y caché breve; protege al receptor |
| `dashboard_auth.py` | Contraseña del panel |
| `dashboard/` | Panel interno: rutas, plantillas y recursos |
| `public_website.py`, `public_results.py`, `public-site/` | Sitio público y su API de solo lectura |
| `onza_contract.py`, `onza_processing.py` | Validación del JSON y contabilidad de la simulación |
| `worker.py` | Procesos `process` y `telegram` |
| `telegram_delivery.py`, `telegram_http.py`, `telegram_rate.py`, `telegram_policy.py` | Canal principal: envío, clasificación de fallos, ritmo y reglas de publicación |
| `telegram_channels.py` | Canal Free y resúmenes |
| `telegram_review.py` | Revisión manual de publicaciones atascadas |
| `bitunix_card.py`, `build_bitunix_card_templates.py`, `assets/` | Tarjetas de resultado y sus 50 plantillas |
| `audit_scenarios.py`, `audit_reporting.py`, `audit_log.py` | Escenarios de auditoría, informe y logs |
| `vorza_*.py` | Publicación en VORZA |
| `schema.sql`, `setup_db.py` | Esquema idempotente y su instalación |

## Configuración

Las variables están descritas en `.env.example`. Las imprescindibles:

- `DATABASE_URL`: PostgreSQL exclusiva del proyecto. `setup_db.py` se niega a instalar sobre la base de otro proyecto.
- `TRADINGVIEW_API_KEY`: debe coincidir con el campo **API Key** del indicador.
- `DASHBOARD_TOKEN`: contraseña del panel. **Sin ella el panel responde 503.**
- `TELEGRAM_BOT_TOKEN` y `DESTINATION_CHANNEL_ID`: bot administrador y canal principal.
- `INITIAL_BALANCE`, `MARGIN_PER_TRADE`, `LEVERAGE`: iguales en el servicio web y en `worker.py process`.

Los mensajes de Telegram se publican con la marca **Vorza Futures**. El pie «JOIN VORZA APP NOW» no lleva enlace hasta que se defina `TELEGRAM_APP_URL` en el servicio de Telegram.

## Ejecución

```bash
pip install -r requirements.txt
cp .env.example .env      # completar valores
bash start.sh             # esquema + web + process + telegram + vorza
python -B -m unittest discover -s tests
```

`start.sh` arranca todo en un solo contenedor. En Railway se recomienda un servicio por proceso: ver `RAILWAY_DEPLOY.md`.

## Rutas

| Ruta | Acceso | Uso |
|---|---|---|
| `POST /webhook/tradingview` | Clave en el JSON | Entrada de alertas |
| `/`, `/api/sim/*`, `/api/chart/*`, `/api/audit/results`, `/api/bitunix/*` | Contraseña del panel | Panel interno |
| `/api/public/results`, `/api/public/tickers`, `/api/public/candles` | Abierto, solo lectura | Sitio público |
| `/health` | Abierto | Base de datos disponible (healthcheck) |
| `/health/telegram` | Abierto | Publicaciones de Telegram atascadas |
| `/health/vorza` | Abierto | Configuración y colas de VORZA |

En el hostname público (`PUBLIC_WEBSITE_HOSTS`) solo existen el sitio y las tres rutas `/api/public/*`; el panel y el receptor responden 404 allí.

## Panel interno y contraseña

El panel muestra entrada, stop y objetivos de las señales activas, así que pide contraseña en todas sus páginas y APIs. En el navegador: cualquier usuario y `DASHBOARD_TOKEN` como contraseña. Desde un script: cabecera `Authorization: Bearer <token>`. Usar un valor largo y aleatorio; no hay límite de intentos.

## Tres lecturas del mismo resultado

Una misma operación puede mostrar cifras distintas según dónde se mire. No es un error: son tres reglas diferentes.

| Lectura | Regla | Dónde se usa | Ejemplo: TP1 y luego SL |
|---|---|---|---|
| Contable | 40/40/20, el resto conserva el stop original | `sim_track_record`, Auditoría «stop original» | −0,4 R |
| Con BE | Igual, pero tras TP1 el resto sale en entrada | Sitio público, Auditoría «BE tras TP1» | +0,2 R |
| TP máximo | 100 % de la posición al TP más alto alcanzado | Indicadores del panel, resúmenes de Telegram | +0,5 R |

R es la distancia entre entrada y stop; TP1 está a 0,5 R. La lectura con BE supone que el stop en entrada se habría ejecutado: no hay precio observado que lo confirme. La lectura de TP máximo es retrospectiva y la más favorable. En Telegram, un SL o cierre posterior a un TP no se publica.

`GET /api/audit/results?mode=partial_no_be|partial_be|max_tp` calcula las tres desde los eventos guardados. Admite `from`, `to` (día de entrada en Colombia), `status` (`all`, `closed`, `open`) y `search`.

## Telegram: qué se repite solo y qué no

| Situación | Qué hace el sistema |
|---|---|
| Sin conexión, 429, bot sin permiso (401/403) | Nada se publicó. En el canal principal, pausa el canal y repite sin límite. |
| Error 5xx con rechazo explícito | Nada se publicó. Repite ese mensaje con espera creciente, hasta 6 intentos. |
| Sin respuesta o respuesta ilegible | No se sabe si se publicó. Queda `unknown` y **no** se repite. |
| Rechazo 400 | Queda `failed`. |

Los resultados de una señal esperan a que su mensaje anterior esté confirmado, así que un `unknown`, `failed` o `sending` detiene esa señal hasta revisarlo:

```bash
python telegram_review.py list
python telegram_review.py retry   --event 123                    # el mensaje NO está en el canal
python telegram_review.py confirm --event 123 --message-id 4567  # el mensaje SÍ está
```

`--publication` hace lo mismo para el canal Free y los resúmenes. `GET /health/telegram` devuelve `attention` cuando hay algo que revisar.

En el canal Free y los resúmenes el límite de 6 intentos (unos 30 minutos) vale para cualquier motivo, también sin conexión o sin permiso: una entrada Free publicada con horas de atraso se leería como nueva.

Lo atascado que ya es demasiado viejo para publicarse se descarta sin enviarlo. No borra filas ni cambia la contabilidad:

```bash
python telegram_review.py discard --older-than-hours 24            # solo cuenta
python telegram_review.py discard --older-than-hours 24 --execute  # descarta
```

Los resultados de una entrada descartada tampoco se publican, porque no tienen mensaje al que responder; un TP descartado no frena al siguiente.

## Sitio público

`public_results.py` entrega el historial cerrado completo y hasta cuatro señales activas destacadas con sus niveles. De las demás activas publica símbolo, dirección, temporalidad y hora, pero no precios. Los totales incluyen todo el registro. Más detalle en `public-site/README.md`.

## Tarjetas de resultado

Cada TP/SL/cierre rota entre 25 diseños. La tarjeta muestra el movimiento entre entrada y precio del evento multiplicado por 20, sobre el margen completo: es ilustrativa e independiente de la contabilidad. Solo existen plantillas 20X. Para regenerarlas desde `assets/bitunix/clean/`: `python build_bitunix_card_templates.py`.

## Limitaciones conocidas

- **Alertas perdidas.** TradingView no reintenta de forma garantizada. Si se pierde un SL o cierre, la operación queda abierta; si se pierde una entrada, sus eventos posteriores quedan en espera. No hay reconciliación automática contra el mercado.
- **Apalancamiento.** El contrato acepta de 1 a 125, pero las tarjetas exigen 20X: con otro valor la entrada se publica y sus resultados quedan `failed`.
- **Hora de cierre.** `closed_at` es la hora de procesamiento, no la de la alerta; tras un atraso del worker, un cierre puede caer en el resumen del día siguiente.
- **Base de datos.** Las instalaciones anteriores conservan columnas `onza_*` y las tablas `daily_profits`, `weekly_profits` y `monthly_profits` de versiones previas. Son historial: el código no las usa.


## Cuenta representada en las webs

Ambas webs muestran una proyección de consulta con 5.000 USDT de capital inicial,
250 USDT de margen fijo por señal y parciales 40/40/20 con BE tras TP1.
`presentation_config.py` define este modelo. Las variables operativas
`INITIAL_BALANCE` y `MARGIN_PER_TRADE`, los eventos y los importes originales
almacenados no se modifican. Los workers no importan esta configuración.
La auditoría conserva la conciliación contra el registro fuente original.
El capital de referencia no impone filtros de admisión de señales: esta proyección
no modela disponibilidad de margen, liquidación, comisiones ni funding.
