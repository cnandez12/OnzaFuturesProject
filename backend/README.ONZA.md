# Copia del motor anterior

Estos archivos se conservaron como referencia de formatos, recursos gráficos y lógica de simulación. El nuevo `start.sh` de la raíz **no ejecuta** `AllProfitFormatWhitImage.py` ni escucha los dos canales emisores de Telegram. El receptor activo está en `../app.py` y su trabajador en `../worker.py`.

No despliegues esta subcarpeta como servicio independiente: su `Procfile` y `start.sh` son los del proyecto antiguo. Los webhooks de `ConfigWebhoock.json` de esta copia están desactivados y sin claves.
