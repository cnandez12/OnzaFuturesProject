# Onza Futures · web pública

Fuente estática: index.html, style.css y app.js. Alojamiento independiente en Sites; API pública de solo lectura en el servicio existente de Railway. El diseño conserva la identidad de Onza. El destino personalizado solicitado es trade.onzafutures.com; requiere configurar los registros DNS del alojamiento. El enlace Telegram es https://t.me/+is8YITl6H_c2MGIy; la app usa el enlace oficial ya configurado en el proyecto.

La API pública usa 40/40/20 con BE tras TP1, capital base INITIAL_BALANCE y margen histórico. Excluye credenciales, estados de entrega, incidencias internas y acciones de ejecución. El retorno es calculado desde alertas sobre el capital base declarado; no es suma de ROI ni una garantía. El gráfico utiliza velas públicas de Bitunix y marca niveles de la señal; si no existen velas se muestran puntos de alertas sin inventar un recorrido. Los datos se consultan cada 30 segundos.


El gráfico reutiliza dashboard/static/js/fb-chart.js, con la misma librería Lightweight Charts 4.1.0 incluida localmente con su licencia. Se adapta exclusivamente la fuente de datos pública y la navegación, conservando zonas, operaciones, Heikin Ashi, WebSocket, temporalidades, crosshair y countdown. El logo es el PNG suministrado por el propietario. Las animaciones respetan prefers-reduced-motion.
