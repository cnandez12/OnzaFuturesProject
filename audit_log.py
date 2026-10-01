"""Logs correlacionados, sin payloads completos ni credenciales."""
import json
import time
from datetime import datetime, timezone, timedelta

_waits = {}


def audit(stage, payload=None, event_id=None, **details):
    payload = payload or {}
    record = {"hora": datetime.now(timezone(timedelta(hours=-5))).isoformat(timespec="milliseconds"),
              "etapa": stage, "evento": event_id,
              "signalId": payload.get("signalId"), "tipo": payload.get("typeSignal"),
              "simbolo": payload.get("symbol"), "direccion": payload.get("direction"),
              "temporalidad": payload.get("timeframe")}
    record.update(details)
    print(json.dumps({k: v for k, v in record.items() if v is not None},
                     ensure_ascii=False, default=str), flush=True)


def audit_wait(stage, payload=None, event_id=None, **details):
    """Repetir esperas como máximo una vez por minuto por evento/motivo."""
    key = (stage, event_id, str(details))
    now = time.monotonic()
    if now - _waits.get(key, -1000) < 60:
        return
    if len(_waits) >= 2000:
        _waits.clear()
    _waits[key] = now
    audit(stage, payload, event_id, **details)
