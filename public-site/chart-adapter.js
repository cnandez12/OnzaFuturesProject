/* Same chart engine as the Onza dashboard, fed by the public read-only ledger. */
const CFG={leverage:20};
let lastMarkFetchAt=0, liveMarkPrices={};
function publicPricesVisible(r){return !!r&&(r.closed||r.prices_visible===true);}
function chartRecord(r){return {id:r.signal_id,symbol:pair(r.symbol),direction:r.direction,
 entry_price:r.entry_price,stop_loss:r.original_stop,tp1:r.targets[0],tp2:r.targets[1],tp3:r.targets[2],
 hit_tp1:r.max_tp>=1,hit_tp2:r.max_tp>=2,hit_tp3:r.max_tp>=3,
 be_active:r.be_activated,current_sl:r.be_activated?r.entry_price:r.original_stop,
 pnl_accumulated:r.recorded_partial_pnl_usdt,margin_used:r.margin_used,leverage:r.leverage,
 final_profit_pct:r.roi_pct,final_profit_usdt:r.pnl_usdt,close_reason:r.close_reason,
 opened_at:r.received_at,closed_at:r.closed_at};}
function fmtScenario(r){const tp=r.hit_tp3?'TP3':r.hit_tp2?'TP2':r.hit_tp1?'TP1':'';
 return tp+(r.close_reason?.startsWith('BE')?' · BE':r.close_reason==='SL'?' · SL':r.close_reason==='CLOSE'?' · CLOSE':'')||r.close_reason;}
async function fetchJson(path){
 const url=new URL(path,location.origin),symbol=url.searchParams.get('symbol');
 const signals=(data?.signals||[]).filter(r=>publicPricesVisible(r)&&(!symbol||pair(r.symbol)===symbol));
 if(url.pathname==='/api/chart/pairs')return [...new Set((data?.signals||[]).map(r=>pair(r.symbol)))].sort().map(pair=>({pair}));
 if(url.pathname==='/api/sim/open')return (data?.signals||[]).filter(r=>!r.closed&&publicPricesVisible(r)).map(r=>({pair:pair(r.symbol)}));
 if(url.pathname==='/api/chart/signals'){
  const focused=publicFocusedSignal||(data?.signals||[]).find(r=>r.signal_id===selected);
  const protectedFocus=focused&&!publicPricesVisible(focused)&&(!symbol||pair(focused.symbol)===symbol);
  return {closed:signals.filter(r=>r.closed&&(!focused?.closed||r.signal_id===focused.signal_id)).map(chartRecord),
   open:protectedFocus||focused?.closed?[]:signals.filter(r=>!r.closed).map(chartRecord)};
 }
 if(url.pathname==='/api/chart/poll')return {open_count:signals.filter(r=>!r.closed).length,
  last_closed:signals.filter(r=>r.closed).map(r=>r.closed_at).sort().at(-1)||null,
  last_opened:signals.map(r=>r.received_at).sort().at(-1)||null,
  open_state:signals.filter(r=>!r.closed).map(r=>r.signal_id+':'+r.max_tp+':'+r.be_activated).join('|')};
 if(url.pathname==='/api/chart/symbol_stats'){
  const rows=signals.filter(r=>r.closed),roi=rows.map(r=>r.roi_pct),total=rows.length;
  return {total,wins:roi.filter(v=>v>0).length,losses:roi.filter(v=>v<0).length,
   total_pct:roi.reduce((a,b)=>a+b,0),avg_pct:total?roi.reduce((a,b)=>a+b,0)/total:0,
   best_pct:total?Math.max(...roi):0,worst_pct:total?Math.min(...roi):0,
   gross_win:roi.filter(v=>v>0).reduce((a,b)=>a+b,0),gross_loss:-roi.filter(v=>v<0).reduce((a,b)=>a+b,0)};
 }
 throw Error('Ruta pública de gráfico desconocida');
}
let publicChartQueue=Promise.resolve(),publicChartStarted=false,publicChartGeneration=0;
let publicFocusedSignal=null;
function publicFittingInterval(row,interval,now=Date.now()){
 if(!publicPricesVisible(row))return interval;
 const duration=((row.closed_at?Date.parse(row.closed_at):now)-Date.parse(row.received_at));
 const steps=[['1m',60000],['5m',300000],['15m',900000],['30m',1800000],['1h',3600000],['4h',14400000],['1d',86400000]];
 const requested=steps.find(([iv])=>iv===interval);
 if(!requested||duration/requested[1]<=1480)return interval;
 return steps.find(([,ms])=>ms>=requested[1]&&duration/ms<=1480)?.[0]||'1d';
}
function publicFocusRange(row,candles,interval='15m'){
 if(!candles.length)return null;
 const offset=-5*3600,entry=Date.parse(row.received_at)/1000+offset;
 const nearest=time=>candles.reduce((best,c,i)=>Math.abs(c.time-time)<Math.abs(candles[best].time-time)?i:best,0);
 const anchor=nearest(entry),last=candles.length-1;
 const end=row.closed_at?nearest(Date.parse(row.closed_at)/1000+offset):last;
 const span=Math.max(1,end-anchor),left=Math.max(180,Math.min(500,span*1.3));
 const right=Math.max(100,Math.round((left+span)*.7));
 return {from:Math.max(-10,anchor-left),to:end+right};
}
function publicFocusPriceRange(base,row){
 if(!base)return base;
 if(!publicPricesVisible(row))return base;
 const levels=[row.entry_price,row.original_stop,...(row.targets||[])].filter(v=>Number.isFinite(v)&&v>0);
 if(!levels.length)return base;
 return {...base,priceRange:{minValue:Math.min(base.priceRange.minValue,...levels),maxValue:Math.max(base.priceRange.maxValue,...levels)}};
}
function centerPublicChart(){
 const row=publicFocusedSignal;if(!fbChart||!fbCandles||!row||pair(row.symbol)!==fbState.symbol)return;
 fbCandles.applyOptions({autoscaleInfoProvider:original=>publicFocusPriceRange(original(),row)});
 fbChart.priceScale('right').applyOptions({autoScale:true,scaleMargins:{top:.12,bottom:.13}});
 const range=publicFocusRange(row,fbState.data,fbState.interval);
 if(range){fbChart.timeScale().applyOptions({minBarSpacing:.05});fbChart.timeScale().setVisibleLogicalRange(range);}
}
function publicChartCovered(row){
 if(!publicPricesVisible(row))return true;
 const candles=fbState.data,entry=Date.parse(row.received_at)/1000-5*3600;
 return candles.length>2&&entry>=candles[0].time-(FB_TF_MS[fbState.interval]/1000)&&entry<=candles.at(-1).time;
}
function openOriginalChart(row,focus=false){
 const generation=++publicChartGeneration;
 publicFocusedSignal=row;
 if(focus||!publicChartStarted){document.getElementById('chart-status').textContent='Cargando operación…';if(fbChart)fbClearSignals();}
 publicChartQueue=publicChartQueue.catch(()=>{}).then(async()=>{
  if(generation!==publicChartGeneration)return;
  if(typeof LightweightCharts==='undefined'){document.getElementById('chart-status').textContent='El gráfico no pudo cargar. Actualiza la página.';return;}
  const first=!publicChartStarted;
  publicFocusedSignal=row;
  if(first||fbState.symbol!==pair(row.symbol)||focus){
   if(!publicChartStarted){await initFBChart();publicChartStarted=true;}
   if(generation!==publicChartGeneration)return;
   if(fbState.symbol!==pair(row.symbol)||focus)await fbOpenSymbol(pair(row.symbol));
   if(generation!==publicChartGeneration)return;
   await fbLoadSignals();
   centerPublicChart();
  }else await fbLoadSignals();
  if(generation!==publicChartGeneration)return;
  fbCandles.applyOptions({autoscaleInfoProvider:original=>publicFocusPriceRange(original(),row)});
  document.getElementById('chart-status').textContent=!publicChartCovered(row)
   ?'No se pudieron cargar las velas del recorrido completo. Pulsa Centrar operación para reintentar.' : fbState.data.length
   ?(publicPricesVisible(row)?'Operación centrada · velas Bitunix · hora Colombia · parciales 40/40/20 con BE tras TP1. '+(fbState._publicFrameNotice||''):'Vista de mercado · los niveles y marcadores de esta señal activa están reservados. Abre la app para consultar la señal completa.')
   :'No hay velas disponibles para este activo. Selecciona otro símbolo o temporalidad.';
 });
 return publicChartQueue;
}
