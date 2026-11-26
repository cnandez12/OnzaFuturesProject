# Sitio público de Onza Futures

Página de producto con los resultados del registro. La sirve `public_website.py` desde esta carpeta, solo en los hostnames de `PUBLIC_WEBSITE_HOSTS` (por defecto `trade-onzafutures.up.railway.app`), junto con las tres rutas de solo lectura `/api/public/*`. En esos hostnames el panel interno y el receptor responden 404. Es enrutamiento por hostname: la protección del panel es su contraseña (`dashboard_auth.py`).

## Archivos

- **Servidos al visitante:** `index.html`, `app.js`, `chart-adapter.js`, `fb-chart.js`, `experience.js`, `premium.js`, las hojas `.css`, `onza-logo.png` y `vendor/`. La lista exacta está en `PUBLIC_FILES` de `public_website.py`; cualquier otro archivo responde 404.
- **`premium.js`:** paquete generado desde `source/premium-entry.js` con Motion 14.3.0 y Three.js 0.186.1. Sus licencias MIT están en `vendor/`.
- **`fb-chart.js` y `chart-adapter.js`:** el motor de gráficos del panel y su adaptador para el sitio.
- **`chart-tests.cjs`, `featured-ui-tests.cjs`, `source/`:** pruebas y herramientas de construcción; no se sirven.

`app.js` y `fb-chart.js` consultan la API por la URL absoluta del servicio web (`/api/public`), por lo que esas tres rutas quedan abiertas, sin contraseña, también en el hostname del panel.

## Qué se publica

`public_results.py` entrega:

- Todo el historial cerrado, con niveles y resultado.
- Hasta cuatro señales activas destacadas con sus niveles: primero las que alcanzaron TP2, luego TP1, luego las que tienen rendimiento abierto positivo según una cotización reciente. Si faltan, se completa con cierres positivos recientes, rotulados como cerrados.
- Del resto de las activas: símbolo, dirección, temporalidad, hora y máximo TP. Sin precios, tramos ni importes (`prices_visible=false`).

Los totales y la curva usan el registro completo, con la regla de BE tras TP1. El rendimiento abierto suma los parciales realizados y el resto valorado a precio de mercado; las cotizaciones se guardan 10 segundos y el resultado completo 15. La selección de destacadas se describe en la propia página como una muestra parcial.

Si una fila activa llega sin la marca de visibilidad, la interfaz la trata como reservada y no dibuja sus niveles en el gráfico.

## Construcción y pruebas

```bash
cd source && pnpm install --ignore-scripts && node build.cjs
cd .. && node chart-tests.cjs && node featured-ui-tests.cjs
```

No se usa ninguna plantilla externa, testimonio ni captura inventada. Sin WebGL queda la versión CSS del elemento visual; con `prefers-reduced-motion` no hay animación.
