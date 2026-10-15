# Onza Futures · web pública

Fuente estática: index.html, style.css y app.js. Alojamiento independiente en Sites; API pública de solo lectura en el servicio existente de Railway. El diseño conserva la identidad de Onza. El destino personalizado solicitado es trade.onzafutures.com; requiere configurar los registros DNS del alojamiento. El enlace Telegram permanece pendiente; la app usa el enlace oficial ya configurado en el proyecto.

La API pública usa 40/40/20 con BE tras TP1, capital base INITIAL_BALANCE y margen histórico. Excluye credenciales, estados de entrega, incidencias internas y acciones de ejecución. El retorno es simulado sobre el capital base declarado; no es suma de ROI ni una garantía. El gráfico utiliza velas públicas de Bitunix y marca niveles de la señal; si no existen velas se muestran puntos de alertas sin inventar un recorrido. Los datos se consultan cada 30 segundos.
