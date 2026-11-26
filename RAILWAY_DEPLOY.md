# Despliegue en Railway

Las claves se configuran como variables de cada servicio en Railway; ninguna va al repositorio. La lista completa está en `.env.example`.

## Servicios

Una base PostgreSQL exclusiva y cuatro servicios desde la misma carpeta raíz, cada uno con su **Start Command** en la interfaz de Railway:

| Servicio | Start Command | Variables | Red pública |
|---|---|---|---|
| `onza-web` | `python setup_db.py && gunicorn app:app --bind 0.0.0.0:${PORT:-5000}` | `DATABASE_URL`, `TRADINGVIEW_API_KEY`, `DASHBOARD_TOKEN`, `INITIAL_BALANCE`, `MARGIN_PER_TRADE`, `LEVERAGE`, `PUBLIC_WEBSITE_HOSTS`, `VORZA_ENABLED` | Sí |
| `onza-process` | `python worker.py process` | `DATABASE_URL`, `INITIAL_BALANCE`, `MARGIN_PER_TRADE` | No |
| `onza-telegram` | `python worker.py telegram` | `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `DESTINATION_CHANNEL_ID`, opcional `FREE_CHANNEL_ID`, `TELEGRAM_APP_URL`, `ONZA_FREE_BLACKLIST` | No |
| `onza-vorza` | `python vorza_worker.py` | `DATABASE_URL` y las `VORZA_*` | No |

- `DATABASE_URL` como referencia al servicio de base, por ejemplo `${{Postgres.DATABASE_URL}}`.
- Healthcheck solo en `onza-web`, en la ruta **`/health`**. No usar `/`: ahora pide contraseña y el healthcheck fallaría.
- Los procesos e hilos del servidor web salen de `gunicorn.conf.py` (2 procesos × 8 hilos). Un Start Command anterior con `--workers 2 --timeout 30` sigue siendo válido.
- Mantener los cuatro servicios encendidos, sin Serverless ni App Sleeping.
- **Alternativa de un solo contenedor:** `bash start.sh` (es lo que hace el `Procfile`). Arranca los cuatro procesos; si uno termina, el contenedor sale y Railway lo reinicia completo. No usar `start.sh` y los servicios separados a la vez: duplicaría los workers.

`setup_db.py` aplica `schema.sql` y las tablas VORZA en cada arranque del servicio web. Es idempotente.

### `VORZA_ENABLED` debe coincidir

El interruptor de VORZA se guarda en la base cuando corre `setup_db.py`, con el valor de `VORZA_ENABLED` **del servicio que lo ejecuta** (`onza-web`). Si `onza-web` lo tiene en `false` y `onza-vorza` en `true`, VORZA no publica y no aparece ningún error en los logs. Usar el mismo valor en ambos y comprobarlo en `GET /health/vorza`.

## Al desplegar esta versión

1. Definir `DASHBOARD_TOKEN` en `onza-web` (valor largo y aleatorio). Sin él, el panel responde 503.
2. Comprobar que el healthcheck de `onza-web` es `/health`.
3. Desplegar primero `onza-web`: su `setup_db.py` añade las columnas e índices nuevos de Telegram. Después `onza-telegram`. Si el worker de Telegram arranca antes, registra `WORKER ERROR` y se recupera solo cuando el esquema está al día.
4. Revisar `GET /health/telegram`. Si responde `attention`, hay publicaciones antiguas atascadas: `python telegram_review.py list`.

Las columnas y tablas de versiones anteriores no se borran.

## Dominios

- Panel y receptor: el dominio de `onza-web`. La URL de las alertas es `https://DOMINIO/webhook/tradingview`.
- Sitio público: un segundo hostname del mismo servicio, declarado en `PUBLIC_WEBSITE_HOSTS` (por defecto `trade-onzafutures.up.railway.app`; admite varios separados por comas). En ese hostname solo se sirven el sitio y `/api/public/*`.

## Alertas de TradingView

1. Crear cada alerta con el indicador `FB_AI_SCANNER_ONZA_WEBHOOK_ONLY.pine`, condición **Any alert() function call** y la URL del webhook. El mensaje JSON lo genera el indicador; no escribir uno manual.
2. En el indicador: `API Key` igual a `TRADINGVIEW_API_KEY`, TP1, TP2 y TP3 activos y en orden ascendente, apalancamiento 20.
3. Temporalidades aceptadas: `15M`, `30M`, `1H` y `4H`.
4. TradingView guarda una copia del indicador y de sus parámetros al crear la alerta. Tras cambiar el Pine o la clave hay que recrear las alertas.
5. Revisar la columna **Webhook status** del registro de alertas de TradingView.

## Telegram

- El bot debe ser administrador del canal principal, con permiso para publicar y para fijar mensajes, y administrador del canal Free.
- **Canal principal:** entradas en español; TP con el formato aprobado en inglés; resumen diario fijado a las 00:00 UTC con los cierres del día anterior, por máximo TP.
- **Canal Free:** si no se define `FREE_CHANNEL_ID` se usa el canal por defecto de `telegram_channels.py`; un valor vacío lo desactiva. Recibe todas las entradas confirmadas del principal: hasta tres por semana (lunes a domingo, hora de Colombia) con niveles completos y el resto ocultas, sin dirección ni precios. La selección exige que, entre los últimos ocho cierres, la dirección de la señal tenga al menos dos resultados positivos y suma positiva. `ONZA_FREE_BLACKLIST` excluye símbolos de la selección completa.
- Los resultados de cada entrada Free copian la tarjeta del principal con texto en inglés, en respuesta a su entrada. El lunes a las 00:00 UTC se publica el resumen semanal.
- Ritmo del canal principal: un mensaje cada 4 segundos. Reintentos y revisión manual: sección «Telegram» del `README.md`.

## Verificación

1. `GET /health` responde `status: ok`.
2. `GET /health/telegram` responde `ok`; `GET /health/vorza` muestra `enabled` y `configured` como se espera.
3. El panel pide contraseña y la acepta; `GET /api/sim/open` sin contraseña responde 401.
4. El sitio público carga en su hostname y `GET /api/public/results` responde sin contraseña.
5. Una alerta de prueba aparece en los logs como `TV GUARDADO EN COLA`, `PROCESAMIENTO GUARDADO` y `TELEGRAM CONFIRMADO` con el mismo `signalId`.

Los logs son JSON, con hora de Colombia, etapa, evento y `signalId`. Nunca incluyen el payload completo ni claves.

## Respaldo

Activar los respaldos de PostgreSQL de Railway antes de dirigir todas las alertas al servicio. Para una copia manual, `pg_dump` contra `DATABASE_URL`. El repositorio no incluye una herramienta de vaciado o clonado de la base.
