# Onza Futures Project

Copia independiente del motor de Señales Smart Crypto, del dashboard de futuros y del Pine de TradingView. **El proyecto original no se modifica ni se ejecuta desde aquí.** La entrada nueva es `POST /webhook/tradingview`; no se escuchan los dos canales emisores de Telegram.

## Flujo

1. TradingView llama al endpoint público con el JSON del Pine. El servidor autentica `apiKey`, valida y normaliza `USDT.P` a `USD.P`, **persiste el evento mínimo para deduplicar** en PostgreSQL y responde `202`. Este paso evita un POST externo dentro del límite de respuesta de TradingView.
2. `worker.py onza` recibe una notificación de PostgreSQL, verifica entrada y orden de TP y tiene prioridad para iniciar el envío. Si se pierde la notificación, revisa la cola cada 500 ms. El contrato normalizado sale sin `sourceExchange`.
3. `worker.py process` aplica los eventos válidos cuando empieza el intento de Onza o cuando transcurre un segundo desde la recepción, lo que ocurra primero. No espera respuesta de Onza. Al registrar TP1 guarda `tv_signals.be_activated_at`, sin cambiar el stop base. Cada combinación `signalId` + `typeSignal` se procesa una vez.
4. `worker.py telegram` publica los eventos aplicados independientemente del estado de Onza. Mantiene el orden de publicación de la señal y registra cualquier bloqueo local. TP1, TP2, TP3, SL y cierre rotan los 25 diseños de `assets/bitunix/card_templates/`, con versiones Long 20X y Short 20X. `tv_events.image_sequence` conserva el diseño en reintentos.
5. El dashboard se sirve desde Flask en `/`. La vista base mantiene la simulación 40/40/20 **sin BE**. En escritorio, `Auditoría` aparece en el menú lateral; en móvil se abre desde `Más → Auditoría de escenarios`. Allí se elige entre parciales sin BE, parciales con BE tras TP1 y TP más alto alcanzado. La distribución de Auditoría es fija 40/40/20; los porcentajes editables de `Simulador` pertenecen a otra simulación y no cambian estos tres modos. La vista de TP máximo no asigna P&L. Los cálculos usan el margen guardado por señal para entradas nuevas.

## Alcance de la auditoría

Los logs JSON de `audit_log.py` incluyen hora de Colombia (-05:00), etapa, evento, signalId, símbolo, dirección y temporalidad. Etapas: TV PETICION RECIBIDA, TV VALIDADO, TV GUARDADO EN COLA, ONZA ENVIO INICIADO, ONZA CONFIRMADO/SIN CONFIRMACION/ERROR, PROCESAMIENTO GUARDADO, IMAGEN GENERADA y TELEGRAM CONFIRMADO/ERROR. Se registran duración, fase del timeout y message_id de Telegram; nunca se imprime el payload completo ni claves. Las esperas se registran una vez por evento y de nuevo si cambia el motivo. El seguimiento de estas esperas se reinicia al arrancar cada worker y conserva hasta 20.000 casos.

Al desplegar esta versión, los eventos válidos pendientes de Telegram por timeout de Onza quedan habilitados automáticamente. No se reenvían a Onza los eventos unknown/sending: siguen requiriendo conciliación. Los eventos rechazados localmente, faltantes de entrada/TP previo o publicaciones Telegram fallidas/ambiguas requieren revisión explícita. Un HTTP 200/201 confirma el webhook de Onza, no una ejecución de trading.

- **Sin BE:** TP1/TP2/TP3 cierran 40/40/20 y el remanente conserva el SL original.
- **Con BE:** después de TP1, el 60% restante se modela con stop en entrada. `be_activated_at` representa la activación de esa regla, **no un fill**. Si llega una alerta de SL o cierre adverso tras TP1, el cálculo atribuye al remanente un BE teórico y lo marca como inferido. Un regreso a entrada entre alertas puede no detectarse, por lo que incluso un TP posterior puede sobreestimar el resultado de este escenario.
- **TP máximo:** registra TP1, TP2 o TP3 según el máximo comunicado por TradingView, sin suponer que se vendió toda la posición a ese precio.

El endpoint público `GET /api/audit/results?mode=partial_no_be|partial_be|max_tp` calcula las tres lecturas desde los eventos aplicados. La vista incluye conteos de BE activado, inferencias y casos sin recorrido verificable. No hay datos de ejecución real, comisiones, funding, slippage, liquidaciones o gaps de Bitunix; por eso el P&L y el profit factor son **brutos teóricos**, no una certificación de rentabilidad en vivo. El JSON Pine→receptor→Onza conserva el formato existente; los nuevos campos de auditoría quedan internos en PostgreSQL.

## Estructura

Las entradas confirmadas por Telegram guardan `telegram_entry_message_id` y `telegram_chat_id` por signalId. Las imágenes TP/SL/cierre usan `reply_parameters` para responder a esa entrada, y cada evento guarda su propio `telegram_message_id`. Si falta la referencia, el resultado espera en vez de publicarse suelto. Los mensajes anteriores a esta versión no se vinculan retroactivamente.

Para un reinicio expresamente solicitado: detener receptor y todos los workers, configurar la conexión exclusiva de Onza y ejecutar `python reset_onza_data.py --execute --workers-stopped`. El comando verifica la identidad y las tablas antes de vaciar datos y reiniciar secuencias en una transacción. Conserva el esquema y la marca de identidad del proyecto. No borra publicaciones de Telegram ni operaciones en Onza. No se ejecuta durante el arranque normal.

- `backend/`: copia del código, imágenes, fuentes y pruebas originales para referencia. Su bot de Telegram no forma parte del arranque nuevo.
- `dashboard/`: copia del dashboard adaptada a señales de TradingView.
- `FB_AI_SCANNER_ONZA_WEBHOOK_ONLY.pine`: indicador para crear las alertas nuevas.
- `app.py`, `worker.py`, `onza_contract.py`, `onza_processing.py`, `onza_delivery.py`: receptor, despacho prioritario y procesamiento local.
- `schema.sql`: tablas nuevas y tablas compatibles con el dashboard.
- `RAILWAY_DEPLOY.md`: configuración por servicio y verificación de entrega.

## Configuración pendiente

Crear una **base PostgreSQL exclusiva** y configurar en un servicio nuevo las variables de `.env.example`. El dashboard y sus APIs son públicos por decisión expresa del propietario; el webhook de TradingView mantiene su propia API key. También hacen falta un bot administrador y el ID del canal Telegram nuevo, más el dominio público que el proveedor asigne al servicio. No hay credenciales ni sesiones activas copiadas a este proyecto. `setup_db.py` se niega a instalar el esquema si encuentra la tabla `trades` de otro proyecto.

La API key del campo Pine debe coincidir con `TRADINGVIEW_API_KEY`. El valor por defecto del campo en esta copia del Pine está **vacío** para no duplicar credenciales en archivos. `ONZA_API_KEY` es la clave que el servidor agrega al JSON enviado a Onza; conviene que sea distinta y que nunca se escriba en Pine. El destino saliente predeterminado es `https://api.onza.tech/api/v1/webhooks/signal?source=TradingView`; se puede fijar por `ONZA_WEBHOOK_URL`.

## Ejecución

```bash
pip install -r requirements.txt
cp .env.example .env
# Completar .env con los destinos NUEVOS.
bash start.sh
```

`start.sh` sirve para una instalación de un solo contenedor: aplica el esquema idempotente y arranca Flask, Onza, procesamiento y Telegram como procesos separados. En Railway se recomienda separarlos en servicios con los comandos de `RAILWAY_DEPLOY.md`. Telegram queda pendiente si Onza no confirmó el mismo evento. Un estado `unknown`, `failed` o `sending` de Onza exige conciliación manual antes de cualquier reenvío; no se dispara una segunda orden automáticamente.

La URL para las alertas de TradingView será `https://DOMINIO-NUEVO/webhook/tradingview`, con condición **Any alert() function call** y el Pine de esta carpeta. Las alertas creadas con el código anterior no cambian al sustituir el indicador: deben recrearse o cambiar su URL al servidor nuevo. Verificar una señal y su `signalId` en Onza antes de redirigir la lista completa.

## Entregas y diagnóstico

`GET /health/onza` comprueba la base, cuenta eventos pendientes/rechazados y muestra `onza_pending` y `last_onza_delivery_ms` (desde recepción hasta confirmación HTTP de Onza). La tabla `tv_events` registra `received_at`, `onza_started_at`, `onza_finished_at`, `state`, `onza_status`, `telegram_status` y el resultado de cada entrega. Un timeout saliente queda como `unknown`: **no se reenvía automáticamente** porque Onza podría haber ejecutado la señal pese al timeout. Los estados `failed` y `sending` también requieren conciliación antes de un reenvío manual. Si falta configurar un destino, sus eventos permanecen en `pending`.

El Pine elimina el límite de 200 velas del rastreador webhook; las zonas visuales originales conservan su comportamiento. En modo webhook exige TP1/TP2/TP3 activos y multiplicadores ascendentes para ajustarse al contrato Onza. Cualquier alerta creada en TradingView con una versión anterior conserva su copia del script: crearla de nuevo después de actualizar el indicador.

El dashboard y el trabajador deben usar la **misma base nueva**. `INITIAL_BALANCE`, `MARGIN_PER_TRADE` y `LEVERAGE` deben tener los mismos valores para la vista y el procesamiento. Las comisiones, deslizamiento y latencia de mercado no se descuentan: los reportes son resultados teóricos de las alertas recibidas.

El Pine envía `sourceExchange` para identificar el gráfico de TradingView que originó la alerta (Binance o Bybit en la lista existente). El dashboard consulta **mark prices y velas de Bitunix**. La columna heredada `trades.source_exchange` contiene `BITUNIX` para este fin, mientras `tv_signals.exchange` conserva el origen de TradingView para verificar los eventos de la misma señal. `sourceExchange` se elimina antes de enviar el JSON a Onza para conservar el contrato que ya aceptó. Para alertas antiguas que no traen ese campo, la lista recibida asigna ETH, XRP, SOL, APT, HYPE, BCH, ATOM, CAKE y ZEN a Bybit; los demás a Binance.

La API pública de Bitunix confirmó los 34 símbolos únicos de las 61 alertas el 28-09-2026. El proyecto no coloca órdenes en Bitunix ni lee fills de cuenta: sus cifras e imágenes continúan siendo resultados teóricos basados en eventos de TradingView. Antes de operar de verdad, el receptor de Onza debe confirmar que esa fuente de señales está vinculada a Bitunix; el contrato JSON actual no incluye un campo de exchange de ejecución.

Galería de las 50 plantillas limpias y referencias: `galeria_imagenes_onza.html`. Se regeneran con `python build_bitunix_card_templates.py` a partir de `assets/bitunix/clean/`.

Las imágenes muestran el movimiento firmado entre entrada y precio del evento, multiplicado por 20, sobre el margen completo de la señal. No ponderan parciales ni muestran etiquetas TP/SL/cierre o el sufijo UTC. La fecha mantiene su referencia horaria UTC. Este rendimiento ilustrativo de la tarjeta es independiente de los escenarios contables del dashboard.
