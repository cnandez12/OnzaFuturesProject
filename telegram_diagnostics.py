"""Detalles de transporte de Telegram sin URLs, cuerpos ni credenciales."""
import requests
from telegram_http import never_sent

# Solo nombres conocidos: nunca serializar str(exc), sus argumentos o la request.
_ALLOWED = {"ConnectTimeout", "ReadTimeout", "Timeout", "ConnectionError",
            "SSLError", "ProxyError", "MaxRetryError", "NewConnectionError",
            "NameResolutionError", "ConnectTimeoutError", "ReadTimeoutError",
            "ProtocolError", "RemoteDisconnected", "ConnectionResetError",
            "ConnectionRefusedError", "gaierror", "BrokenPipeError"}


def transport_details(exc):
    names = []
    pending = [exc]
    seen = set()
    while pending and len(seen) < 16:
        item = pending.pop(0)
        if not isinstance(item, BaseException) or id(item) in seen:
            continue
        seen.add(id(item))
        name = type(item).__name__
        if name in _ALLOWED and name not in names:
            names.append(name)
        pending.extend([getattr(item, "reason", None), item.__cause__, item.__context__])
        pending.extend(a for a in item.args if isinstance(a, BaseException))
    safe = never_sent(exc)
    return {"errores_transporte": names,
            "fase": "conexion" if safe else "lectura" if isinstance(exc, requests.ReadTimeout) else "indeterminada",
            "reintento_seguro": safe, "requiere_conciliacion": not safe}
