# Webhook de CryptoPilot AI

El emisor envía una sola señal a CryptoPilot AI. El backend la distribuye internamente a los motores Bitunix y Binance según el exchange configurado para cada usuario.

## Destinos

- Entrada: POST https://trade.cryptopilot-ai.com/api/v1/signals/provider
- Cierre explícito: POST https://trade.cryptopilot-ai.com/api/v1/signals/provider/close

Ambos endpoints usan HTTPS, limitación de solicitudes y el mismo secreto del backend. El secreto no se guarda en ConfigWebhoock.json; el archivo referencia env:CRYPTOPILOT_WEBHOOK_SECRET.

## Despliegue en Railway

Crear la variable de servicio CRYPTOPILOT_WEBHOOK_SECRET con exactamente el mismo valor de WEBHOOK_SECRET del backend CryptoPilot AI y reiniciar el worker.

Si la variable falta, CryptoPilot AI rechazará ese destino por autenticación. El destino independiente de Onza Futures continúa funcionando.
