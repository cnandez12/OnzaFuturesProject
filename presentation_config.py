"""Web-only independent scenarios. Never changes broker or delivery settings."""
from decimal import Decimal

INITIAL_CAPITAL = Decimal("10000")
RISK_PER_TRADE = Decimal("250")
TRADE_MARGIN = RISK_PER_TRADE  # legacy template input; now represents stop risk
MODE = "partial_be"


def risk_margin(payload, risk=RISK_PER_TRADE):
    entry=Decimal(str(payload["entry"]));stop=Decimal(str(payload["stopLoss"]["price"]))
    leverage=Decimal(str(payload["leverage"]));risk=Decimal(str(risk))
    direction=payload["direction"]
    if not all(v.is_finite() for v in (entry,stop,leverage,risk)) or min(entry,stop,leverage,risk)<=0:
        raise ValueError("Datos inválidos para dimensionar riesgo")
    if direction not in ("LONG","SHORT") or (stop>=entry if direction=="LONG" else stop<=entry):
        raise ValueError("Stop original inválido para dimensionar riesgo")
    return risk*entry/(abs(entry-stop)*leverage)


def metadata():
    return {"initial_capital":float(INITIAL_CAPITAL),"risk_per_trade":float(RISK_PER_TRADE),
            "initial_risk_pct":float(RISK_PER_TRADE/INITIAL_CAPITAL*100),"margin_per_trade":None,"sizing_mode":"fixed_stop_risk","independent_scenarios":True,
            "roi_basis":"required_margin","mode":MODE,"tp_split":[40,40,20],"be_after_tp1":True,
            "representation_only":True,"capital_constraints_modelled":False,
            "liquidation_modelled":False,"costs_included":False}
