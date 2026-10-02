# Dashboard copiado para Onza Futures Project

Esta carpeta conserva la documentación histórica del dashboard original. **Para instalar y desplegar la adaptación de TradingView → Onza, usa el README en la raíz de `Onza Futures Project` y despliega la raíz, no esta subcarpeta.** La base de datos debe ser nueva y exclusiva; el bot de Telegram anterior no participa.

## Referencia histórica del dashboard original

# CryptoPilot AI · Signals Studio

Dashboard de señales y resultados simulados con identidad CryptoPilot AI. Comparte marca visual con la app de clientes, pero es un producto de seguimiento del emisor de señales: **no representa ejecuciones reales de Binance o Bitunix en cuentas de usuario**.

## Estructura del proyecto

```
dashboard/
├── app.py              ← Flask server + API endpoints
├── requirements.txt    ← Dependencias Python
├── Procfile            ← Comando de inicio para Railway
├── railway.toml        ← Configuración de Railway
├── .env.example        ← Variables de entorno de ejemplo
├── templates/
│   └── dashboard.html  ← Estructura y vistas
└── static/
    ├── css/            ← Diseño adaptable y marca CryptoPilot AI
    ├── js/             ← Navegación, gráficos y datos
    └── logo.png        ← Icono oficial CryptoPilot AI
```

## Deploy en Railway

### 1. Crear nuevo servicio

En Railway → New Project → Deploy from GitHub repo  
Selecciona este repositorio.

### 2. Variables de entorno

En Railway → tu servicio → Variables, agrega:

| Variable         | Valor                                    | Obligatoria |
|------------------|------------------------------------------|-------------|
| `DATABASE_URL`   | La misma URL que usa el bot de Telegram  | ✅ Sí       |
| `INITIAL_BALANCE`| `1000`                                   | No          |
| `MARGIN_PER_TRADE`| `20`                                    | No          |
| `LEVERAGE`       | `20`                                     | No          |
| `DASHBOARD_TOKEN`| tu_token_secreto (protege la API)        | No          |

> **IMPORTANTE**: `DATABASE_URL` es la misma que tiene configurada  
> el bot `AllProfitFormatWhitImage.py`. El servidor web solo **lee** la DB; los scripts de mantenimiento se ejecutan por separado.

### 3. Deploy

Railway hace el deploy automáticamente al hacer push a main.

### 4. URL

Railway asignará una URL tipo:  
`https://sim-dashboard-production-xxxx.up.railway.app`

---

## Desarrollo local

```bash
# 1. Clonar e instalar dependencias
pip install -r requirements.txt

# 2. Copiar variables de entorno
cp .env.example .env
# Edita .env con tu DATABASE_URL

# 3. Correr
python app.py
# → http://localhost:5000
```

---

## Tablas de DB que necesita

El dashboard lee de estas tablas (escritas por el bot de Telegram):

### `sim_track_record` (historial de trades cerrados)
Creada automáticamente por el bot al cerrarse cada trade.

### `trades` (posiciones abiertas)
La tabla principal del bot — el dashboard filtra `WHERE Close = FALSE`.

---

## Endpoints de la API

| Endpoint            | Descripción                               |
|---------------------|-------------------------------------------|
| `GET /`             | Dashboard principal (HTML)               |
| `GET /api/sim/history` | Historial completo de sim_track_record |
| `GET /api/sim/stats`   | Estadísticas resumidas                |
| `GET /api/sim/open`    | Posiciones abiertas (tabla trades)    |
| `GET /api/sim/curve`   | Datos para los gráficos               |
| `GET /api/sim/symbols` | Distribución por símbolo              |
| `GET /health`          | Healthcheck para Railway              |

Si configuras `DASHBOARD_TOKEN`, el navegador lo solicita al recibir 401 y lo guarda solo durante la sesión. Los clientes de API deben enviar `X-Dashboard-Token`.

---

## Funcionalidades del dashboard

- **Resumen**: KPIs (balance, P/L, win rate, avg ganancia/pérdida)
- **Curva de balance**: balance por período, P&L por trade/día y rendimiento mensual auditado.
  - La cuenta parte de `INITIAL_BALANCE` una sola vez.
  - Retorno mensual = P&L cerrado durante el mes / balance al inicio de ese mes.
  - El panel reconcilia el balance final contra `/api/sim/stats`, muestra origen de cierres y alerta datos inválidos o posibles duplicados.
- **Posiciones abiertas**: trades activos con TPs completados y BE
- **Historial**: tabla filtrable por dirección, razón de cierre y símbolo
- **Actualización**: consulta cambios de señales cada 10 segundos y precios mark de Binance cada 5 segundos; informa si los datos quedan desactualizados. Este feed Binance pertenece al dashboard de señales y no reemplaza el feed del exchange seleccionado en la app de clientes.
- **Origen**: el historial anterior al 21 de mayo de 2026 fue reconstruido desde otra fuente. El simulador inicia con los cierres posteriores a esa fecha y permite incluir el tramo reconstruido.
- **Matemática**: el escenario original 40/40/20 respeta el P&L final almacenado; escenarios alternos cambian cada tramo usando los precios de venta guardados. Las filas antiguas que no concilian se advierten. Las columnas TP del historial muestran la contribución ponderada de cada venta sobre el margen. Comisiones opcionales se cobran sobre nominal de entrada y de cada salida.
- **Límite**: estos son resultados simulados brutos del bot, no ejecuciones de exchange. El margen de posiciones aún abiertas sale de `MARGIN_PER_TRADE`; debe coincidir con `USDT_PER_TRADE` del bot.

'## Auditoría mensual de solo lectura

```bash
python scripts/audit_monthly_performance.py
python scripts/audit_monthly_performance.py --compare-public
```

El script reconcilia cada mes, valida que el producto de retornos llegue al balance final y, opcionalmente, compara la cobertura reconstruida con la fuente pública. No escribe en PostgreSQL.

'## Scripts de mantenimiento

`BackfillSignals.py` requiere `DATABASE_URL` y funciona en modo de prueba por defecto. Solo inserta datos si se establece `BACKFILL_APPLY=true` explícitamente. `backup_db.py` requiere `SOURCE_DATABASE_URL` y `DEST_DATABASE_URL` en el entorno. Las credenciales que existían en versiones anteriores del repositorio deben rotarse en los servicios correspondientes; quitarlas del archivo actual no las borra del historial Git.


## Vista principal: máximo TP

Las consultas financieras del dashboard usan una proyección de solo lectura (`dashboard/max_tp.py`). Para cada cierre se valora el precio del TP más alto registrado con el margen completo de la operación; sin TP se conserva el precio de salida. Balance, curva, estadísticas e historial usan esa proyección. Los datos persistidos y los eventos no cambian. El historial incluye `recorded_final_profit_usdt` para que el simulador conserve su base original; Auditoría sigue leyendo los eventos sin esta proyección. Las posiciones abiertas muestran el máximo TP registrado y el movimiento de mercado por separado; el balance se abona al cierre.
