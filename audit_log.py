"""Logs correlacionados, sin payloads completos ni credenciales."""
import json
from collections import OrderedDict
from datetime import datetime, timezone, timedelta

_waits = OrderedDict()


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
    """Registrar una espera al verla o al cambiar su motivo; no en cada sondeo."""
    key = (stage, event_id, details.get("canal"))
    reason = json.dumps(details, sort_keys=True, default=str)
    if _waits.get(key) == reason:
        _waits.move_to_end(key)
        return
    _waits[key] = reason
    _waits.move_to_end(key)
    if len(_waits) > 20000:
        _waits.popitem(last=False)
    audit(stage, payload, event_id, **details)
