"""Public, read-only projection. Internal delivery information never leaves this API."""
from audit_reporting import AUDIT_SQL, build_report
from psycopg2.extras import RealDictCursor
from datetime import datetime, timezone
import math
import re
import time
import threading
import requests


def market_symbol(symbol):
    return re.sub(r'(?:USD\.P|USDT)$','',symbol.upper())+'USDT'


_mark_cache = {}
_mark_lock = threading.Lock()


def public_market_marks(symbols):
    """Read public quotes only; short cache and bounded batches avoid per-card calls."""
    symbols=tuple(sorted({market_symbol(s) for s in symbols}))
    if not symbols:
        return {}, None
    with _mark_lock:
        cached=_mark_cache.get(symbols)
        if cached and time.monotonic()-cached[0]<10:
            return cached[1],cached[2]
    marks={}
    for start in range(0,len(symbols),40):
        try:
            response=requests.get('https://fapi.bitunix.com/api/v1/futures/market/tickers',
                                  params={'symbols':','.join(symbols[start:start+40])},timeout=3)
            response.raise_for_status()
            body=response.json()
            if body.get('code')!=0 or not isinstance(body.get('data'),list):
                continue
            for ticker in body['data']:
                try:
                    mark=float(ticker.get('markPrice') or ticker.get('lastPrice'))
                    if math.isfinite(mark) and mark>0:
                        marks[ticker['symbol']]=mark
                except (TypeError,ValueError,KeyError):
                    continue
        except (requests.RequestException,ValueError):
            continue
    as_of=datetime.now(timezone.utc).isoformat() if marks else None
    with _mark_lock:
        _mark_cache.clear()
        _mark_cache[symbols]=(time.monotonic(),marks,as_of)
    return marks,as_of


def open_performance(row,marks):
    """Realized partials + floating remainder, divided by the original margin."""
    try:
        mark=float(marks[market_symbol(row['symbol'])])
        entry=float(row['entry_price']);margin=float(row['margin_used'])
        leverage=float(row['leverage']);remaining=float(row['remaining_fraction'])
        realized=float(row.get('scenario_partial_pnl_usdt') or 0)
        values=(mark,entry,margin,leverage,remaining,realized)
        if not all(math.isfinite(v) for v in values) or min(mark,entry,margin,leverage)<=0:
            return None
        sign=1 if row['direction']=='LONG' else -1
        result=realized+(mark-entry)/entry*leverage*margin*remaining*sign
        return {'mark_price':mark,'pnl_usdt':round(result,2),'roi_pct':round(result/margin*100,4)}
    except (KeyError,TypeError,ValueError,ZeroDivisionError):
        return None


def select_featured(rows,marks,limit=4):
    performance={r['signal_id']:open_performance(r,marks) for r in rows if not r['closed']}
    eligible=[r for r in rows if not r['closed'] and (r['max_tp']>=1 or
              (performance[r['signal_id']] and performance[r['signal_id']]['pnl_usdt']>0))]
    def score(row):
        live=performance[row['signal_id']]
        roi=live['roi_pct'] if live else float('-inf')
        return row['max_tp'],roi,row['received_at'],row['signal_id']
    active=sorted(eligible,key=score,reverse=True)[:limit]
    fallback=sorted((r for r in rows if r['closed'] and r['pnl_usdt'] is not None and r['pnl_usdt']>0),
                    key=lambda r:(r['closed_at'],r['roi_pct'],r['signal_id']),reverse=True)
    return active+fallback[:max(0,limit-len(active))],performance


def project_public(report, capital, marks=None, quote_as_of=None):
    allowed = ('signal_id','symbol','direction','timeframe','entry_price','original_stop','targets',
               'max_tp','be_activated','be_stop_price','be_activated_at','closed','close_reason',
               'received_at','closed_at','pnl_usdt','roi_pct','recorded_partial_pnl_usdt','legs',
               'remaining_fraction','leverage','margin_used')
    featured,performance=select_featured(report['rows'],marks or {})
    preview_ids={r['signal_id'] for r in featured if not r['closed']}
    featured_ranks={r['signal_id']:i for i,r in enumerate(featured)}
    sensitive = {'entry_price','original_stop','targets','be_stop_price',
                 'be_activated_at','pnl_usdt','roi_pct','recorded_partial_pnl_usdt',
                 'legs','remaining_fraction','leverage','margin_used'}
    signals = []
    for row in report['rows']:
        visible = row['closed'] or row['signal_id'] in preview_ids
        public_row = {key: row[key] for key in allowed if visible or key not in sensitive}
        public_row['prices_visible'] = visible
        public_row['visibility'] = 'history' if row['closed'] else ('preview' if visible else 'protected')
        public_row['featured']=row['signal_id'] in featured_ranks
        if public_row['featured']:
            public_row['featured_rank']=featured_ranks[row['signal_id']]
            public_row['featured_reason']=('Cierre positivo reciente' if row['closed'] else
                                          f"TP{row['max_tp']} alcanzado" if row['max_tp'] else 'Rendimiento abierto positivo')
        if visible and not row['closed']:
            public_row['open_performance']=performance[row['signal_id']]
            public_row['quote_as_of']=quote_as_of if performance[row['signal_id']] else None
        signals.append(public_row)
    summary = report['summary']
    return {'as_of':report['as_of'], 'method':'Resultados del registro de operaciones',
            'capital_base':capital,'return_pct':round(summary['pnl_usdt']/capital*100,2) if capital>0 else None,
            'summary':summary,'signals':signals,
            'active_preview_limit':4,'price_visibility_version':2,
            'featured_signal_ids':[r['signal_id'] for r in featured],
            'featured_policy':'Selección de destacadas: activas con TP2, TP1 y después rendimiento abierto positivo. Si faltan, se completa con cierres positivos recientes. No representa el registro completo.',
            'app_url':'https://apps.apple.com/app/id6768534887','telegram_url':'https://t.me/+is8YITl6H_c2MGIy',
            'methodology':'El trading de futuros conlleva un alto nivel de riesgo. El apalancamiento puede amplificar tanto las ganancias como las pérdidas, y puede ocasionar la pérdida del capital invertido. La información presentada tiene fines informativos y no constituye asesoramiento financiero. Los resultados pasados no garantizan resultados futuros. Evalúa tu situación financiera y tolerancia al riesgo antes de operar.', 'risk_disclaimer':'El trading de futuros conlleva un alto nivel de riesgo. El apalancamiento puede amplificar tanto las ganancias como las pérdidas, y puede ocasionar la pérdida del capital invertido. La información presentada tiene fines informativos y no constituye asesoramiento financiero. Los resultados pasados no garantizan resultados futuros. Evalúa tu situación financiera y tolerancia al riesgo antes de operar.'}


def load_public(connection, capital, price_loader=None):
    conn=connection()
    try:
        conn.set_session(readonly=True,isolation_level='REPEATABLE READ')
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SET LOCAL statement_timeout=15000')
                cur.execute(AUDIT_SQL)
                rows=cur.fetchall()
    finally:conn.close()
    report=build_report(rows,mode='partial_be')
    loader=price_loader or public_market_marks
    marks,quote_as_of=loader([r['symbol'] for r in report['rows'] if not r['closed']])
    return project_public(report,capital,marks,quote_as_of)
