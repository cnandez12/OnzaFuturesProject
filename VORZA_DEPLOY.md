# Integración VORZA Signal Publishing API

Contrato revisado: VORZA-Signal-API.pdf, versión 1.0, noviembre 2026 (5 páginas).

## Alcance

Se mantiene TradingView -> receptor -> procesamiento local, Telegram y dashboard. Un worker independiente publica únicamente eventos entry aplicados, usando POST https://vorza.site/api/v1/signals/publish. No enviar TP1/TP2/TP3, SL, close, ROI ni apiKey del formato Onza a esta API: el PDF no documenta actualizaciones/cancelaciones por HTTP. VORZA sigue los precios y el usuario confirma si desea copiar la señal. Una publicación no prueba una ejecución financiera.

ONZA_ENABLED debe permanecer false. No reutilizar la API key de Onza. No cambiar alertas Pine ni su URL para apuntar directamente a VORZA.

## Variables Railway

- VORZA_ENABLED=false: predeterminado, solo true habilita. Aplicar con despliegue del servicio completo.
- VORZA_SIGNAL_KEY: clave nueva del administrador, enviada en X-Signal-Key. No se guarda en tablas ni logs.
- VORZA_COMPANY: opcional; se omite si queda vacío y la API asigna la señal a VORZA, según el PDF. Si hay un código de empresa asignado, configurarlo exactamente. ALL solo tras decisión explícita; nunca se agrega por defecto.
- VORZA_PROVIDER_ID: ID activo del proveedor, opcional (0/ausente lo omite).
- VORZA_EXPIRES_MINUTES=20: vigencia solicitada, 1..1440. Confirmar antes de activar. No es un timeout HTTP ni un cierre de operación; limita cuándo copiar la señal.
- VORZA_ORDER_TYPE=market: market o limit, confirmar cuál desea el proveedor.
- VORZA_RATE_PER_MINUTE=20: entero 1..20. Es presupuesto de ESTE publicador, compartido entre nuestras réplicas mediante PostgreSQL. El servidor limita a 20 entre TODOS los publicadores: acordar presupuesto y reducir esta variable si existen otros emisores.
- VORZA_NOTE: descripción sin credenciales, hasta 500 caracteres; se añade la temporalidad si cabe en ese límite.
- VORZA_PUBLISH_URL: opcional; solo acepta exactamente el endpoint HTTPS documentado. No usar 0, HTTP, otra URL o redirecciones.

Las variables no secretas pueden configurarse sin editar código. No copiar el nombre SIGNALS_API_KEY del servidor de VORZA en nuestra app: nuestro worker lee VORZA_SIGNAL_KEY, según el ejemplo Python del PDF.

## Adaptación

symbol USD.P -> USDT; direction -> side minúscula; entry -> entry_price; stopLoss.price -> stop_loss; takeProfits[].price -> take_profit y take_profit_2/3; leverage explícito; signalId -> external_id (1..80 caracteres). market=crypto. No presupone soporte forex: el contrato de entrada actual es cripto. Admite TP4 en el adaptador, pero el scanner actual solo genera tres. No se inventa TP4.

## Durabilidad y no reenvío

setup_db.py crea vorza_control, vorza_deliveries y vorza_attempts antes de arrancar vorza_worker.py. No se reutilizan onza_status ni tablas de entregas Onza. Primera activación y toda transición false -> true fijan un corte en MAX(tv_events.id)+1. Pausar, reiniciar pausado o reactivar excluye entregas pendientes/retry/sending; no borra el histórico ni afecta estado local/Telegram. Reiniciar habilitado preserva el corte y la cola válida. El contenido se congela al encolar: cada reintento utiliza el mismo external_id y JSON.

Solo se encolan entradas aplicadas posteriores al corte. Se descartan entradas vencidas o con actualizaciones ya aplicadas antes del primer intento. El plazo local parte de received_at + VORZA_EXPIRES_MINUTES para evitar liberar una cola antigua. La vigencia de copia devuelta por VORZA se conserva por separado. Pausar requiere redesplegar; una petición en vuelo en un contenedor anterior puede terminar hasta que Railway lo retire.

Timeout 15 segundos, redirecciones deshabilitadas. Reintentos persistentes: red, acuse 200 inválido, 429 y 5xx, con 5/15/60 segundos y máximo 6 intentos dentro del plazo local. 429 bloquea todas nuestras réplicas al menos 60 segundos; respeta Retry-After numérico superior. Un 400/401/404/3xx termina sin reintento. 503 signals_api_disabled exige contactar al administrador; los intentos son limitados. Agotar intentos ambiguos produce unknown, nunca delivered. Un sending interrumpido se recupera después de 60 segundos con la misma identidad; no hay reenvíos ilimitados.

## Confirmación y observabilidad

Solo HTTP 200 con data correlacionado, signal_id válido, uid UUID, external_id exacto, símbolo y dirección iguales, duplicate booleano, recipients entero no negativo y expires_at con zona horaria confirma entrega. duplicate=true es éxito idempotente. recipients=0 queda publicado pero genera advertencia; no significa entrega a usuarios. El acuse y cada intento quedan registrados sin clave/cuerpos HTTP completos. Las respuestas de error se reducen a códigos documentados, sin volcar mensajes que pudieran contener secretos.

GET /health/vorza expone enabled, configured, motivo de configuración y conteos por estado. status=ok indica disponibilidad local, no publicación exitosa ni copia ejecutada. No se expone la clave. El hostname público de marketing no permite este endpoint interno.

## Pruebas antes de activar

1. Obtener la clave; company y provider_id solo si aplica. Confirmar order_type, vigencia y presupuesto global de frecuencia.
2. Preguntar por API de actualizaciones/cierres, BE y parciales 40/40/20: el PDF no promete ninguno de estos controles. Mantenerlos en auditoría local no los ejecuta en VORZA.
3. Ejecutar unit tests y PostgreSQL con tablas TEMP. Ninguna prueba automatizada llama al servidor VORZA.
4. Acordar con administrador una audiencia de prueba. El PDF NO proporciona sandbox; no enviar una señal TEST a todos los usuarios. Una prueba coordinada puede usar expires_in_minutes=1 y note=TEST, siguiendo su guía; el administrador la cancela desde su panel.
5. Confirmar señal en app, destinatarios, ausencia de duplicados al repetir la MISMA prueba autorizada y señal rechazada con credencial inválida solo si se acuerda.
6. Activar solo señales nuevas con VORZA_ENABLED=true y revisar acuses. No vaciar el corte ni reenviar el historial.

## Comandos de verificación

python -B -m unittest discover -s tests

Tests SQL opt-in: VORZA_TEST_DATABASE_URL. Usan exclusivamente tablas TEMP en la sesión y nunca HTTP. No apuntar pruebas de publicación real a producción sin coordinación.
