# Despliegue de Onza Futures Project en Railway

Esta carpeta aún no está desplegada. No contiene las claves ni el dominio de producción. El proyecto de Smart Crypto Signals original no se usa como origen.

## Flujo prioritario

`TradingView → registro en PostgreSQL → envío prioritario a Onza + procesamiento local independiente → Telegram/dashboard`.

El proceso local puede comenzar al iniciar el intento Onza o tras un segundo desde la recepción. No necesita confirmación de Onza. Los eventos válidos que quedaron pendientes de Telegram por timeouts anteriores se publicarán al desplegar; los envíos ambiguos a Onza no se repiten automáticamente.

El registro mínimo anterior al envío es necesario para reconocer reintentos de TradingView y no duplicar órdenes. El receptor devuelve `202` sin esperar a Onza. PostgreSQL despierta al trabajador de Onza con `LISTEN/NOTIFY`; hay un sondeo de respaldo cada 500 ms. El trabajador no calcula estadísticas ni genera imágenes. `202` significa **recibido por nuestro servidor**, no entregado a Onza. Ninguna red ofrece entrega literalmente instantánea; los tiempos reales se miden con `received_at`, `onza_started_at` y `onza_finished_at`.

## Recursos necesarios

1. Una cuenta/proyecto Railway y esta carpeta como fuente del servicio (repositorio Git privado o despliegue local mediante Railway CLI).
2. Una base **PostgreSQL nueva** y exclusiva dentro del proyecto. Usar su `DATABASE_URL` privado en los servicios; no usar la base de Smart Crypto Signals.
3. `TRADINGVIEW_API_KEY`: secreto del receptor, idéntico al campo `API Key` del indicador.
4. `ONZA_API_KEY` y `ONZA_WEBHOOK_URL`: credenciales y destino saliente que Onza confirmó. No guardar secretos en el repositorio ni en el Pine de muestra.
5. El dashboard y sus APIs son públicos por decisión expresa del propietario. No configurar `DASHBOARD_TOKEN`.
6. Bot de Telegram administrador del canal nuevo: `TELEGRAM_BOT_TOKEN` y `DESTINATION_CHANNEL_ID`. Telegram puede activarse después de verificar Onza.
7. Valores acordados para `INITIAL_BALANCE` y `MARGIN_PER_TRADE`. La simulación registra el margen usado por cada señal nueva.

## Servicios recomendados

Crear cuatro servicios desde la **misma carpeta raíz** y una base PostgreSQL. Configurar un **Start Command distinto en la interfaz de Railway** para cada servicio; no usar `start.sh` en estos cuatro servicios simultáneamente.

| Servicio | Start Command | Variables principales | Red pública |
|---|---|---|---|
| `onza-web` | `python setup_db.py && gunicorn app:app --bind 0.0.0.0:${PORT:-5000} --workers 2 --timeout 30` | `DATABASE_URL`, `TRADINGVIEW_API_KEY`, `INITIAL_BALANCE`, `MARGIN_PER_TRADE` | Sí |
| `onza-dispatch` | `python worker.py onza` | `DATABASE_URL`, `ONZA_API_KEY`, `ONZA_WEBHOOK_URL` | No |
| `onza-process` | `python worker.py process` | `DATABASE_URL`, `INITIAL_BALANCE`, `MARGIN_PER_TRADE` | No |
| `onza-telegram` | `python worker.py telegram` | `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `DESTINATION_CHANNEL_ID` | No |

Configurar `DATABASE_URL` como referencia al servicio PostgreSQL, por ejemplo `${{Postgres.DATABASE_URL}}` si el servicio se llama `Postgres`. Railway debe asignar el puerto del servicio web mediante `PORT`. Configurar `GET /health/onza` como healthcheck **solo** en `onza-web`. Mantener los cuatro servicios encendidos; desactivar Serverless/App Sleeping para evitar arranques en frío o interrupción de los trabajadores. Empezar con una réplica del despachador Onza para conservar el orden de los eventos.

El archivo `railway.toml` ya no fija un `startCommand` ni un healthcheck global. `start.sh` y `Procfile` quedan como alternativa de un solo contenedor o para pruebas locales. Los comandos por servicio tienen prioridad cuando se configuran explícitamente.

## Dominio y alertas

1. En `onza-web` → **Settings → Networking → Public Networking → Generate Domain**. Railway creará un dominio HTTPS. También se puede añadir uno propio con los registros DNS que Railway indique.
2. La URL de TradingView será `https://DOMINIO-ASIGNADO/webhook/tradingview`. El dominio exacto solo se conoce después de crearlo en Railway.
3. En TradingView activar 2FA y crear las alertas con **Any alert() function call**, el indicador `FB_AI_SCANNER_ONZA_WEBHOOK_ONLY.pine`, el símbolo/exchange y la temporalidad deseados. El mensaje JSON sale del `alert()` del Pine; no escribir un mensaje manual distinto.
4. En modo webhook mantener TP1, TP2 y TP3 activos, en orden, con `API Key` igual a `TRADINGVIEW_API_KEY`. El receptor acepta `15M`, `30M`, `1H` y `4H`.
5. Recrear las alertas tras cambiar el Pine: TradingView conserva una copia de sus parámetros y código al crear cada alerta. Revisar la columna **Webhook status** del registro de alertas.

## Verificación antes de dirigir las 61 alertas

1. `GET /health/onza` debe responder `status: ok`; `onza_pending` debe mantenerse en cero salvo durante una entrega.
2. Probar un evento designado con Onza en un entorno de prueba o con una señal que ellos autoricen. No usar una entrada real de producción solo para probar conectividad.
3. Confirmar para el mismo `signalId`: evento `applied`, `onza_status=delivered`, HTTP 200/201, `onza_finished_at` y el registro equivalente en Onza. Comparar `last_onza_delivery_ms` con el registro de TradingView. Después validar Telegram y dashboard.
4. Revisar `unknown`, `failed` y `sending` antes de reenviar: un timeout puede haber sido recibido por Onza. No hacer reintento automático de una posible orden duplicada.
5. Configurar respaldo de PostgreSQL, monitoreo de procesos y alertas de fallos antes de pasar todas las temporalidades al dominio nuevo.

El Pine y el receptor no prueban ejecuciones reales en Bitunix. Las estadísticas de P&L son simulaciones basadas en alertas, sin comisiones, funding, deslizamiento ni fills confirmados.
