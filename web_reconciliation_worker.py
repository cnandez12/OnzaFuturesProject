"""Standalone Railway service for web reconciliation; no webhook, Telegram or VORZA imports."""
import argparse
import copy
import json
import os
import signal
import threading
import time
from collections import defaultdict
from datetime import datetime,timezone
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from web_auto_store import SOURCE_SQL,initialize,read_state,publish,heartbeat
from web_auto_engine import CandleReader,replay,RoundBudget
from web_candle_reconciliation import EVIDENCE,valid_record
from web_opposites import first_opposites
from web_history_integrity import is_archived

_STATE={"status":"starting","leader":False}
_STOP=threading.Event()
LOCK=(407702,20261128)

def source_rows():
    conn=psycopg2.connect(os.environ['DATABASE_URL'],connect_timeout=5)
    try:
        conn.set_session(readonly=True,isolation_level='REPEATABLE READ')
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SET LOCAL statement_timeout=5000');cur.execute(SOURCE_SQL);return cur.fetchall()
    finally:conn.close()

def cycle(rows,records,activation,reader=None,now=None):
    now=now or int(time.time()*1000)//60000*60000;reader=reader or CandleReader()
    grouped=defaultdict(list)
    for e in rows:grouped[e['signal_id']].append(e)
    opposites=first_opposites(rows);jobs=[]
    for sid,events in grouped.items():
        if is_archived(sid):continue
        entry=next((e for e in events if e['event_type']=='entry' and e.get('state')=='applied' and e.get('signal_exists',True)),None)
        if not entry or entry['payload']['symbol']=='EPICUSD.P':continue
        raw_closed=any(e['event_type'] in ('sl','close','tp3') and e.get('state')=='applied' for e in events)
        if raw_closed and sid not in records and sid not in EVIDENCE and entry['id']<=activation:continue
        seed=records.get(sid) or EVIDENCE.get(sid)
        jobs.append((sid,events,seed))
    # Least recently verified first, so an old data problem cannot starve new signals.
    jobs.sort(key=lambda j:(j[2].get('as_of',0) if j[2] else 0,j[0]))
    output={};errors=[];deferred=0
    for sid,events,seed in jobs:
        try:output[sid]=replay(sid,events,now,reader,seed,opposites.get(sid))
        except RoundBudget:
            deferred+=1
        except Exception as exc:
            errors.append(dict(signal_id=sid,reason=type(exc).__name__))
            if valid_record(seed,events):
                old=copy.deepcopy(seed);old.update(sync_status='unavailable',last_attempt=now);output[sid]=old
    detail=dict(checked=len(jobs)-deferred,closed=sum(r['status']=='closed' for r in output.values()),
        errors=errors,deferred=deferred,requests=getattr(reader,'requests',0),
        scope='web_only',opposite_scope='same_asset_and_timeframe',precision='1m',
        interval_seconds=max(30,int(os.getenv('WEB_RECONCILIATION_INTERVAL','60'))))
    return output,detail

class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path!='/health':self.send_error(404);return
        body=json.dumps(_STATE).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(body)
    def log_message(self,*args):pass

def main(argv=None):
    load_dotenv()
    parser=argparse.ArgumentParser();parser.add_argument('--once',action='store_true');parser.add_argument('--dry-run',action='store_true');parser.add_argument('--init-only',action='store_true');args=parser.parse_args(argv)
    rows=source_rows();activation=max((e['id'] for e in rows),default=0)
    if args.dry_run:
        records,detail=cycle(rows,{},activation);print(json.dumps(dict(**detail,records=len(records))));return
    writer=psycopg2.connect(os.environ.get('WEB_AUDIT_DATABASE_URL') or os.environ['DATABASE_URL'],connect_timeout=5)
    initialize(writer,activation)
    if args.init_only:writer.close();print('web_audit schema initialized; source tables unchanged');return
    signal.signal(signal.SIGTERM,lambda *_:_STOP.set());signal.signal(signal.SIGINT,lambda *_:_STOP.set())
    if not args.once:
        server=ThreadingHTTPServer(('0.0.0.0',int(os.getenv('PORT','8080'))),HealthHandler)
        threading.Thread(target=server.serve_forever,name='web-audit-health',daemon=True).start()
    leader=False
    try:
        while not _STOP.is_set():
            round_started=time.monotonic()
            try:
                if writer.closed:writer=psycopg2.connect(os.environ.get('WEB_AUDIT_DATABASE_URL') or os.environ['DATABASE_URL'],connect_timeout=5);leader=False
                if not leader:
                    with writer.cursor() as cur:cur.execute('SELECT pg_try_advisory_lock(%s,%s)',LOCK);leader=cur.fetchone()[0]
                    writer.commit();_STATE.update(status='ready' if leader else 'standby',leader=leader)
                    if not leader:
                        if args.once:return
                        _STOP.wait(5);continue
                heartbeat(writer,'checking',{})
                with writer.cursor(cursor_factory=RealDictCursor) as cur:records,health=read_state(cur)
                writer.commit()
                rows=source_rows();begin=time.monotonic();records,detail=cycle(rows,records,int(health['activation_event_id']))
                detail['duration_seconds']=round(time.monotonic()-begin,3)
                status='degraded' if detail['errors'] or detail['deferred'] else 'ok'
                publish(writer,records,status,detail);_STATE.update(status=status,last_completed=datetime.now(timezone.utc).isoformat(),checked=detail['checked'],errors=len(detail['errors']),deferred=detail['deferred'])
                print(json.dumps(dict(event='web_reconciliation_cycle',**_STATE)),flush=True)
            except Exception as exc:
                _STATE.update(status='unavailable',error=type(exc).__name__)
                print(json.dumps(dict(event='web_reconciliation_unavailable',reason=type(exc).__name__)),flush=True)
                try:writer.rollback()
                except Exception:pass
            if args.once:return
            _STOP.wait(max(1,max(30,int(os.getenv('WEB_RECONCILIATION_INTERVAL','60')))-(time.monotonic()-round_started)))
    finally:
        writer.close()

if __name__=='__main__':main()
