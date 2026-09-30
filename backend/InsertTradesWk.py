import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
import pytz
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Configuración de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está definida en las variables de entorno")

# Zona horaria UTC
UTC = pytz.timezone('UTC')

def connect_db():
    """Establece una conexión a la base de datos."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute("SET timezone = 'UTC'")
        logger.info("Conexión a la base de datos establecida")
        return conn
    except psycopg2.Error as e:
        logger.error(f"Error conectando a la base de datos: {e}")
        raise

def update_profit_tables(conn):
    """Actualiza las tablas daily_profits, weekly_profits y monthly_profits con datos de trades."""
    now = datetime.now(UTC).replace(microsecond=0)
    
    # Definir rangos de tiempo
    today_start = now.replace(hour=0, minute=0, second=0)
    week_start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0)
    
    # Mapa de períodos
    periods = {
        'daily_profits': {'start': today_start, 'end': now},
        'weekly_profits': {'start': week_start, 'end': now},
        'monthly_profits': {'start': month_start, 'end': now}
    }
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            for table, time_range in periods.items():
                start_date = time_range['start']
                end_date = time_range['end']
                
                # Consultar trades cerrados en el rango de tiempo
                query = """
                    SELECT message_id, pair, side, trade_pl, date
                    FROM trades
                    WHERE date >= %s AND date <= %s AND Close = TRUE AND trade_pl IS NOT NULL
                    ORDER BY date
                """
                cur.execute(query, (start_date, end_date))
                trades = cur.fetchall()
                
                if not trades:
                    logger.info(f"No se encontraron trades cerrados para {table} en {start_date} - {end_date}")
                    continue
                
                # Procesar cada trade
                for trade in trades:
                    message_id = str(trade['message_id'])
                    pair = trade['pair']
                    side = trade['side']
                    trade_pl = trade['trade_pl']
                    
                    # Formatear entrada de profit/loss
                    profit_entry = (
                        f"✅ {pair} {side} {trade_pl}" if float(trade_pl.replace('%', '')) >= 0
                        else f"❌ {pair} {side} {trade_pl}"
                    )
                    
                    # Insertar o actualizar en la tabla
                    insert_query = f"""
                        INSERT INTO {table} (key, value, gain_date, Close)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (key) DO UPDATE
                        SET value = EXCLUDED.value,
                            gain_date = EXCLUDED.gain_date,
                            Close = EXCLUDED.Close
                    """
                    cur.execute(insert_query, (message_id, profit_entry, trade['date'], True))
                    logger.info(f"Actualizado {table}: key={message_id}, value={profit_entry}")
                
                logger.info(f"Tabla {table} actualizada con {len(trades)} trades")
    
    except psycopg2.Error as e:
        logger.error(f"Error actualizando tablas: {e}")
        raise

def clear_old_profit_records(conn):
    """Elimina registros antiguos de las tablas de profits."""
    now = datetime.now(UTC).replace(microsecond=0)
    today_start = now.replace(hour=0, minute=0, second=0)
    week_start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0)
    
    periods = {
        'daily_profits': today_start,
        'weekly_profits': week_start,
        'monthly_profits': month_start
    }
    
    try:
        with conn.cursor() as cur:
            for table, start_date in periods.items():
                query = f"DELETE FROM {table} WHERE gain_date < %s"
                cur.execute(query, (start_date,))
                logger.info(f"Registros antiguos eliminados de {table} antes de {start_date}")
    except psycopg2.Error as e:
        logger.error(f"Error limpiando tablas: {e}")
        raise

def main():
    """Función principal para ejecutar el script."""
    conn = None
    try:
        conn = connect_db()
        clear_old_profit_records(conn)
        update_profit_tables(conn)
        logger.info("Script completado exitosamente")
    except Exception as e:
        logger.error(f"Error en la ejecución del script: {e}")
    finally:
        if conn:
            conn.close()
            logger.info("Conexión a la base de datos cerrada")

if __name__ == "__main__":
    main()
