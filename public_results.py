"""Public, read-only projection. Internal delivery information never leaves this API."""
from audit_reporting import AUDIT_SQL, build_report
from psycopg2.extras import RealDictCursor


def project_public(report, capital):
    allowed = ('signal_id','symbol','direction','timeframe','entry_price','original_stop','targets',
               'max_tp','be_activated','be_stop_price','be_activated_at','closed','close_reason',
               'received_at','closed_at','pnl_usdt','roi_pct','recorded_partial_pnl_usdt','legs',
               'remaining_fraction','leverage','margin_used')
    # Four most recent active examples are public. All other active levels and
    # quantities are removed here, before serialization (never only masked in UI).
    opened = sorted((r for r in report['rows'] if not r['closed']),
                    key=lambda r: (r['received_at'], r['signal_id']), reverse=True)
    preview_ids = {r['signal_id'] for r in opened[:4]}
    sensitive = {'entry_price','original_stop','targets','be_stop_price',
                 'be_activated_at','pnl_usdt','roi_pct','recorded_partial_pnl_usdt',
                 'legs','remaining_fraction','leverage','margin_used'}
    signals = []
    for row in report['rows']:
        visible = row['closed'] or row['signal_id'] in preview_ids
        public_row = {key: row[key] for key in allowed if visible or key not in sensitive}
        public_row['prices_visible'] = visible
        public_row['visibility'] = 'history' if row['closed'] else ('preview' if visible else 'protected')
        signals.append(public_row)
    summary = report['summary']
    return {'as_of':report['as_of'], 'method':'40/40/20 · BE automático tras TP1',
            'capital_base':capital,'return_pct':round(summary['pnl_usdt']/capital*100,2) if capital>0 else None,
            'summary':summary,'signals':signals,
            'active_preview_limit':4,'price_visibility_version':1,
            'app_url':'https://apps.apple.com/app/id6768534887','telegram_url':'https://t.me/+is8YITl6H_c2MGIy',
            'methodology':'Resultados brutos calculados a partir de las alertas registradas. TP1 realiza 40% y activa BE en entrada; TP2 realiza 40%; TP3 realiza 20%. Un cierre adverso posterior a TP1 simula la salida del remanente en entrada. No incluye comisiones, funding ni deslizamiento. El TP máximo describe el alcance y no una venta de toda la posición.'}


def load_public(connection, capital):
    conn=connection()
    try:
        conn.set_session(readonly=True,isolation_level='REPEATABLE READ')
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SET LOCAL statement_timeout=15000')
                cur.execute(AUDIT_SQL)
                rows=cur.fetchall()
        return project_public(build_report(rows,mode='partial_be'),capital)
    finally:conn.close()
