/* Same chart engine as the Onza dashboard, fed by the public read-only ledger. */
const CFG={leverage:20};
let lastMarkFetchAt=0, liveMarkPrices={};
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
 const signals=(data?.signals||[]).filter(r=>!symbol||pair(r.symbol)===symbol);
 if(url.pathname==='/api/chart/pairs')return [...new Set((data?.signals||[]).map(r=>pair(r.symbol)))].sort().map(pair=>({pair}));
 if(url.pathname==='/api/sim/open')return (data?.signals||[]).filter(r=>!r.closed).map(r=>({pair:pair(r.symbol)}));
 if(url.pathname==='/api/chart/signals')return {closed:signals.filter(r=>r.closed).map(chartRecord),open:signals.filter(r=>!r.closed).map(chartRecord)};
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
let publicChartQueue=Promise.resolve(),publicChartStarted=false;
function openOriginalChart(row,focus=false){
 publicChartQueue=publicChartQueue.catch(()=>{}).then(async()=>{
  if(!window.LightweightCharts){document.getElementById('chart-status').textContent='El gráfico no pudo cargar. Actualiza la página.';return;}
  if(!publicChartStarted||fbState.symbol!==pair(row.symbol)||focus){
   if(!publicChartStarted){await initFBChart();publicChartStarted=true;}
   if(fbState.symbol!==pair(row.symbol)||(focus&&fbState.interval!=='15m'))await fbOpenSymbol(pair(row.symbol));
   await fbLoadSignals();
   if(focus){const from=Date.parse(row.received_at)/1000-5*3600-3*3600;
    const to=(row.closed_at?Date.parse(row.closed_at)/1000:Date.now()/1000)-5*3600+3*3600;
    fbChart.timeScale().setVisibleRange({from,to:Math.max(from+6*3600,to)});}
  }else await fbLoadSignals();
  document.getElementById('chart-status').textContent=fbState.data.length
   ?'Gráfico original de Onza · velas Bitunix, operaciones registradas, zonas de riesgo y objetivos. Hora Colombia. Los resultados usan parciales 40/40/20 con BE tras TP1.'
   :'No hay velas disponibles para este activo. Selecciona otro símbolo o temporalidad.';
 });
 return publicChartQueue;
}
