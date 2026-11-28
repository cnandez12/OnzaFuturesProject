"""Bounded, deterministic candle replay for independent web scenarios."""
import copy
import math
import time
from datetime import datetime,timezone
from decimal import Decimal
import requests
from presentation_config import risk_margin
from web_candle_reconciliation import fingerprint,entry_fingerprint,valid_record

MINUTE=60000
HOUR=60*MINUTE
class MissingCandles(RuntimeError):pass
class RoundBudget(RuntimeError):pass

def event_ms(event):return int((event.get("applied_at") or event["received_at"]).timestamp()*1000)
def observation_ms(observation):return int(observation.get("at",observation.get("bar",{}).get("time",0)+MINUTE))

def reference(events,opposite):
    candidates=[dict(kind=e['event_type'],price=e['payload']['price'],at=event_ms(e),basis='recorded_alert',reference_event_id=e['id'])
        for e in events if e.get('state')=='applied' and e['event_type'] in ('tp3','sl','close')]
    if opposite:candidates.append(dict(kind='close',price=opposite['payload']['entry'],at=int(opposite['received_at'].timestamp()*1000),basis='opposite_signal_reference',reference_event_id=opposite['id'],opposite_signal_id=opposite['signal_id']))
    return min(candidates,key=lambda o:(o['at'],o['reference_event_id'])) if candidates else None

class CandleReader:
    """One bounded public feed; no authentication, orders, or delivery endpoints."""
    def __init__(self,seconds=45,max_requests=80,timeout=4):
        self.deadline=time.monotonic()+seconds;self.maximum=max_requests;self.requests=0;self.last=0;self.timeout=timeout;self.cache={}
    def __call__(self,symbol,interval,start,end):
        key=(symbol,interval,start,end)
        if key in self.cache:return self.cache[key]
        if time.monotonic()>self.deadline or self.requests>=self.maximum:raise RoundBudget('Límite de la ronda web')
        pause=.3-(time.monotonic()-self.last)
        if pause>0:time.sleep(pause)
        self.last=time.monotonic();self.requests+=1
        response=requests.get('https://fapi.bitunix.com/api/v1/futures/market/kline',
            params=dict(symbol=symbol,interval=interval,startTime=start,endTime=end,limit=200,type='LAST_PRICE'),timeout=self.timeout)
        response.raise_for_status();body=response.json()
        if body.get('code')!=0:raise MissingCandles('Fuente sin velas disponibles')
        bars=[]
        for r in body.get('data',[]):
            at=int(r['time'])
            if not start<=at<end:continue
            b=dict(time=at,**{k:float(r[k]) for k in ('open','high','low','close')})
            if any(not math.isfinite(b[k]) or b[k]<=0 for k in ('open','high','low','close')) or b['low']>b['high']:
                raise MissingCandles('Vela inválida')
            bars.append(b)
        bars.sort(key=lambda b:b['time'])
        if len({b['time'] for b in bars})!=len(bars):raise MissingCandles('Velas duplicadas')
        self.cache[key]=bars
        return bars

def seed_record(sid,events,cutoff):
    entry=next(e for e in events if e['event_type']=='entry' and e.get('state')=='applied')
    risk_margin(entry['payload'])
    start=(event_ms(entry)//MINUTE+1)*MINUTE
    # Precise persisted alerts in the incomplete entry minute are retained.
    prelude=[];highest=0
    for e in sorted(events,key=lambda e:(event_ms(e),e['id'])):
        if e.get('state')!='applied' or e['event_type'] not in ('tp1','tp2') or event_ms(e)>=min(start,cutoff):continue
        n=int(e['event_type'][-1])
        if n==highest+1:
            prelude.append(dict(kind=e['event_type'],price=e['payload']['price'],at=event_ms(e),basis='recorded_alert',reference_event_id=e['id']));highest=n
    return dict(signal_id=sid,status='open',source='Bitunix Futures LAST_PRICE',start=start,end=start,as_of=start,
        observations=prelude,entry_fingerprint=entry_fingerprint(events),fingerprint=fingerprint(events),
        anchor_ids=[entry['id']],anchor_fingerprint=fingerprint([entry]),auto_generated=True,sync_status='warming')

def replay(sid,events,now,reader,seed=None,opposite=None):
    entry=next(e for e in events if e['event_type']=='entry' and e.get('state')=='applied');p=entry['payload'];risk_margin(p)
    final=reference(events,opposite);cutoff=min(now,final['at']) if final else now
    record=copy.deepcopy(seed) if valid_record(seed,events) else seed_record(sid,events,cutoff)
    closing=next((o for o in record['observations'] if o['kind'] in ('sl','close','tp3')),None)
    if closing and (not final or observation_ms(closing)<=final['at']):return record
    if final and record.get('end',0)>final['at']:record=seed_record(sid,events,cutoff)
    observations=record['observations'];long=p['direction']=='LONG';entry_price=Decimal(str(p['entry']));stop=Decimal(str(p['stopLoss']['price']));targets=[Decimal(str(t['price'])) for t in p['takeProfits']]
    highest=max([int(o['kind'][-1]) for o in observations if o['kind'].startswith('tp')]+[1 if len(record.get('anchor_ids',[]))>1 else 0])
    # A newly applied TP1 is a precise source observation; recheck BE from there.
    tp1=next((e for e in events if e['event_type']=='tp1' and e.get('state')=='applied' and event_ms(e)<cutoff),None)
    if highest==0 and tp1 and event_ms(tp1)<record['end']:
        record=seed_record(sid,events,cutoff);observations=record['observations']=[dict(kind='tp1',price=tp1['payload']['price'],at=event_ms(tp1),basis='recorded_alert',reference_event_id=tp1['id'])]
        record['end']=record['start']=(event_ms(tp1)//MINUTE+1)*MINUTE;highest=1
    start=max(record['start'],record['end'])
    for e in sorted(events,key=lambda e:(event_ms(e),e['id'])):
        if e.get('state')=='applied' and e['event_type'] in ('tp1','tp2') and event_ms(e)<min(start,cutoff):
            n=int(e['event_type'][-1])
            if n==highest+1:
                observations.append(dict(kind=e['event_type'],price=e['payload']['price'],at=event_ms(e),basis='recorded_alert',reference_event_id=e['id']));highest=n
    observations.sort(key=observation_ms)
    end=cutoff//MINUTE*MINUTE;symbol=p['symbol'].replace('USD.P','USDT')
    def reached(bar):
        low,high=Decimal(str(bar['low'])),Decimal(str(bar['high']));active_stop=entry_price if highest else stop
        return (low<=active_stop if long else high>=active_stop) or (highest<3 and (high>=targets[highest] if long else low<=targets[highest]))
    def consume(bars,lo,hi):
        nonlocal highest
        at=lo
        for bar in bars:
            if bar['time']!=at:raise MissingCandles('Falta cobertura de un minuto')
            at+=MINUTE;low,high=Decimal(str(bar['low'])),Decimal(str(bar['high']));active_stop=entry_price if highest else stop
            adverse=low<=active_stop if long else high>=active_stop
            target=highest<3 and (high>=targets[highest] if long else low<=targets[highest])
            if adverse:
                observations.append(dict(kind='sl',price=float(active_stop),bar=bar,ambiguous=bool(target),basis='market_candle_reference'));record['status']='closed'
            elif target:
                while highest<3 and (high>=targets[highest] if long else low<=targets[highest]):
                    highest+=1;observations.append(dict(kind='tp'+str(highest),price=float(targets[highest-1]),bar=bar,ambiguous=False,basis='market_candle_reference'))
                    if highest==3:record['status']='closed';break
                    if highest==1 and (low<=entry_price if long else high>=entry_price):
                        observations.append(dict(kind='sl',price=float(entry_price),bar=bar,ambiguous=True,basis='market_candle_reference'));record['status']='closed';break
            record['end']=at
            if record['status']=='closed':return True
        if at<hi:raise MissingCandles('Falta cobertura al final del intervalo')
        return False
    # Incremental steady-state reads one completed minute, not the whole history.
    if start<end and end-start<=199*MINUTE:
        if consume(reader(symbol,'1m',start,end),start,end):
            record.update(as_of=now,auto_generated=True,sync_status='ok');return record
    else:
        cursor=start//HOUR*HOUR
        while cursor<end:
            boundary=min(cursor+199*HOUR,end);coarse=reader(symbol,'1h',cursor,boundary);expected=cursor
            for bar in coarse:
                if bar['time']!=expected:raise MissingCandles('Falta cobertura horaria')
                expected+=HOUR;lo=max(start,bar['time']);hi=min(bar['time']+HOUR,end)
                if lo>=hi:continue
                if reached(bar) and consume(reader(symbol,'1m',lo,hi),lo,hi):
                    record.update(as_of=now,auto_generated=True,sync_status='ok');return record
                record['end']=hi
            if expected<boundary//HOUR*HOUR:raise MissingCandles('Cobertura horaria incompleta')
            cursor=boundary
    record['end']=max(record['end'],end)
    if final and final['at']<=now:
        # Source/contrary signal is the closing reference; never read future bars.
        o=copy.deepcopy(final);price=Decimal(str(o['price']))
        if o['basis']=='opposite_signal_reference' and highest==0 and (price<=stop if long else price>=stop):
            o.update(kind='sl',price=float(stop),basis='opposite_signal_stop_reference')
        observations.append(o);record['status']='closed'
    record.update(as_of=now,auto_generated=True,sync_status='ok')
    return record
