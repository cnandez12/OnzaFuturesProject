"""Gunicorn lo carga solo desde la carpeta de trabajo; la línea de comandos tiene prioridad.

Con hilos, una consulta lenta (Bitunix, informes) ocupa un hilo y no un proceso
entero, de modo que el webhook de TradingView siempre encuentra quien lo atienda.
"""

worker_class = "gthread"
workers = 2
threads = 8
timeout = 30
