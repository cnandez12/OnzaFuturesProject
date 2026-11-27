"""Web-only simulation settings. Never imported by delivery or processing workers."""
from decimal import Decimal

INITIAL_CAPITAL = Decimal("5000")
TRADE_MARGIN = Decimal("250")
MODE = "partial_be"

def metadata():
    return {"initial_capital":float(INITIAL_CAPITAL),"margin_per_trade":float(TRADE_MARGIN),
            "mode":MODE,"tp_split":[40,40,20],"be_after_tp1":True,
            "representation_only":True,"capital_constraints_modelled":False,
            "liquidation_modelled":False,"costs_included":False}
