# VORZA Signal Publishing API 1.1

Referencia: VORZA-Signal-API (1).pdf, noviembre 2026 (6 páginas), y asignación del equipo VORZA: provider_id=1, company=VORZA y hasta 10 publicaciones por minuto.

## Estado y límites

Mantener VORZA_ENABLED=false hasta que el administrador confirme una audiencia interna de pruebas. No se ha realizado ninguna publicación real de prueba. La clave se configura solo en Railway como VORZA_SIGNAL_KEY; no va al repositorio, logs ni base de datos.

La recepción TradingView, aplicación local de TP/SL/close, Telegram y dashboard no dependen de la respuesta VORZA. No cambiar Pine ni su URL. El worker VORZA publica entradas nuevas aplicadas y envía cierres por señal contraria de publicaciones confirmadas. TP1/TP2/TP3/SL no se publican como señales nuevas: VORZA los mide en Bitunix.

## Configuración Railway

- VORZA_ENABLED=false. Solo true habilita publicaciones y acciones. Aplicar mediante despliegue completo.
- VORZA_SIGNAL_KEY: nueva clave secreta enviada en X-Signal-Key. No reutilizar claves Onza ni poner 0/false.
- VORZA_PROVIDER_ID=1: asignado por VORZA, entero positivo obligatorio localmente.
- VORZA_COMPANY=VORZA: destinatario asignado; se envía explícitamente. Para las pruebas, sustituir SOLO por el código interno confirmado por el administrador. PRUEBA es un ejemplo del PDF, no un código que podamos dar por válido. ALL nunca es predeterminado.
- VORZA_RATE_PER_MINUTE=10: máximo local asignado; no admite valores superiores. Presupuesto compartido entre publicaciones, reintentos y acciones de todas nuestras réplicas. El servidor documenta 20 por minuto globales, pero nuestra asignación es 10.
- VORZA_ORDER_TYPE=market: para entrada vigente. limit para un nivel futuro.
- VORZA_EXPIRES_MINUTES=20: recomendado market 15-20, limit 60-240. Si se omite la variable, usa 20 para market y 120 para limit. Rango API 1..1440; la prueba coordinada del PDF usa 5. Esta vigencia limita copiar, no cierra posiciones.
- VORZA_NOTE: hasta 500 caracteres; añade temporalidad si cabe.
- VORZA_PUBLISH_URL: opcional; solo admite https://vorza.site/api/v1/signals/publish. No usar 0, HTTP ni otros hosts. El cierre usa exclusivamente https://vorza.site/api/v1/signals/close.

## Entrada y gestión 40/40/20

symbol USD.P -> USDT; direction -> side minúscula; entry -> entry_price; stopLoss.price -> stop_loss; takeProfits[].price -> take_profit, take_profit_2 y take_profit_3. Se requieren exactamente tres TP para nuestro plan y se envía tp_split=[40,40,20], con porcentajes enteros. leverage se envía explícito y market=crypto (perpetuos USDT; no spot). signalId se conserva como external_id de 1..80 caracteres. La API valida que el símbolo exista en sus mercados; no se asume que todo ticker del scanner esté disponible en Bitunix.

Con tp_split el proveedor documenta parciales en cada TP y BE en entrada tras TP1. Sin tp_split, el plan estándar con tres TP es diferente: TP1 solo mueve BE; TP2 cierra 50%; TP3 el resto. El acuse de publicación DEBE devolver exactamente el reparto enviado. Se conserva en remote_tp_split. VORZA redondea las cantidades al lote del exchange; si un usuario cambia el número de TP, aplica su gestión estándar. No significa que cada cuenta ejecutará exactamente nuestros importes locales.

## Cierre y cancelación

POST /api/v1/signals/close con la misma clave, external_id, action close/cancel, reason código hasta 40 caracteres y note hasta 200.

- Close automático: exclusivamente desde un tv_event close aplicado, posterior al corte de activación, cuyo padre tenga publicación VORZA confirmada e identidad remota válida. Se envía action=close, reason=opposite_signal y nota descriptiva. Una publicación con acuse ambiguo no habilita un cierre fuera de orden. Las acciones tienen prioridad sobre nuevas publicaciones.
- Cancel: operación explícita del operador para una señal errónea; nunca se genera automáticamente por TP/SL. VORZA solo la acepta activa y sin usuarios que la hayan copiado.
- 404 not_found y 409 signal_in_use/signal_not_active/signal_cancelled son terminales sin reintento ni conversión automática de cancel a close. Se guarda el código para revisión.
- Ambas acciones son idempotentes según VORZA; cada reintento conserva la misma acción, external_id y cuerpo. No se duplica una fila por sondeo ni cambia el cuerpo de una acción existente.
- El acuse exige identidad remota del padre, external_id exacto, status closed/cancelled acorde con la acción, closed_at con zona, close_reason y open_trades_notified no negativo. Se guardan por separado de la publicación y de las finanzas locales.

CLI local autorizada, sin endpoint público de modificación:

    python vorza_action.py --external-id ID_REAL --action cancel --reason manual --note "Publicacion por error"
    python vorza_action.py --external-id ID_REAL --action close --reason manual --note "Revision del proveedor"

Solo encola si VORZA está habilitado en entorno y base y existe publicación confirmada. El worker hace HTTP después. La CLI no activa VORZA, no llama al servidor directamente y no permite reescribir ni reenviar una acción antigua. Revisar los fallos en vorza_actions antes de cualquier conciliación manual.

## Qué NO significa close

Close retira la posibilidad de copiar, cancela entradas limit pendientes y notifica a quienes tengan posición abierta. NO cierra automáticamente sus posiciones. Cada usuario decide. No altera las estadísticas de VORZA: siguen midiéndose con los niveles originales desde publicación y hasta 7 días. Se usa Bitunix de 1 minuto; SL y TP1 en la misma vela cuenta como SL. Tras TP1, retorno a entrada o último TP termina el seguimiento. Nuestros resultados locales pueden diferir por fuente, hora de inicio, política de cierre y ajustes del usuario. No se cambiaron los cálculos locales para igualarlos artificialmente.

## Durabilidad, pausa y reintentos

setup_db.py crea/migra vorza_control, vorza_deliveries, vorza_attempts, vorza_actions y vorza_action_attempts antes de iniciar el worker. Se preserva la cola 1.0 y el historial Onza. Primera activación y transición false -> true fijan MAX(tv_events.id)+1. Pausa, reinicio pausado o reactivación excluyen trabajos pending/retry/sending de ambas colas. No se borra historial ni se toca el estado local/Telegram. Reiniciar habilitado conserva el corte y cola válida.

Entradas vencidas o ya avanzadas antes del primer intento se excluyen. El plazo local de publicación es recepción + vigencia configurada, separado de expires_at remoto. Solo los eventos close nuevos posteriores al corte son elegibles: no se acumulan cierres de la pausa. Un cierre nuevo puede referirse a una publicación anterior confirmada. Las acciones tienen un plazo LOCAL de una hora y máximo 6 intentos; no es una limitación de la API. Una petición en vuelo del contenedor anterior puede terminar hasta que Railway lo retire.

Timeout 15 segundos, sin redirecciones. Reintentos persistentes red/200 sin acuse válido/429/5xx con 5,15,60 segundos y máximo 6 intentos dentro del plazo local. 429 bloquea ambas colas y réplicas al menos 60 segundos, respetando Retry-After numérico superior. 400/401/404/409/3xx no se reintentan. 503 signals_api_disabled exige revisar con administrador. Agotar ambigüedad produce unknown, nunca delivered. Sending interrumpido se recupera tras 60 segundos con la misma identidad y cuerpo.

Cada intento se guarda sin secretos ni cuerpos HTTP completos. No hay cambios en onza_status, trades, sim_track_record ni Telegram por enviar una acción externa. El presupuesto global de intentos está protegido por bloqueo transaccional en PostgreSQL.

## Salud y pruebas de aceptación

GET /health/vorza: api_version=1.1, enabled, configured, motivo de configuración, scope=publish_close_cancel, tp_split=[40,40,20], rate_limit=10, queue y action_queue. status=ok mide disponibilidad local, NO copia de posiciones ni recepción remota. El host de marketing no permite este endpoint interno.

Antes de activar:

1. Obtener código de audiencia interna confirmado por administrador; no usar company=VORZA para pruebas que notifiquen a clientes reales.
2. Guardar VORZA_SIGNAL_KEY solo en Railway y configurar audiencia de pruebas; mantener proveedor 1 y límite 10.
3. Ejecutar pruebas locales y SQL TEMP; ninguna prueba automatizada envía HTTP real.
4. Coordinar publicación market de 5 minutos, mismo external_id repetido (duplicate=true), niveles inválidos (invalid_levels), reparto inválido (invalid_tp_split), y close/cancel en señales de prueba separadas. Verificar 409 al cancelar una señal ya copiada solo con cuentas internas.
5. Comprobar reparto, BE, llegada a app y notificaciones con el administrador. Aceptación de una señal no implica confirmación del usuario para copiarla.
6. Una vez aprobadas las pruebas, usar company=VORZA y VORZA_ENABLED=true mediante despliegue, solo señales nuevas. No reiniciar cortes ni liberar históricos.

    python -B -m unittest discover -s tests

SQL opt-in: VORZA_TEST_DATABASE_URL. Exclusivamente tablas TEMP en la sesión, sin modificar datos productivos ni HTTP. La clave compartida por el usuario no fue usada en las pruebas ni guardada en archivos del repositorio.

## Retiro del proveedor anterior

No existe cliente HTTP ni proceso para el antiguo webhook. La configuración de ese publicador ya no tiene efecto y debe retirarse de Railway. Se preservan solo el historial de auditoría y nombres internos de contrato/tablas por compatibilidad. El backend de referencia no se inicia con el servicio; su sumidero antiguo quedó sin red.
