/* ════════════════════════════════════════════════════════════════════════════
   CURVE PAGE — period curve, P&L bars and audited monthly performance.
   Every balance comes from: configured initial capital + recorded final USDT P&L.
════════════════════════════════════════════════════════════════════════════ */

const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
let monthlyMode = 'total';
let pnlBarMode = 'trade';

function curveTradeOrder(a, b) {
  const dateDiff = parseUTC(a.closed_at) - parseUTC(b.closed_at);
  if (dateDiff) return dateDiff;
  const ai = Number(a.id), bi = Number(b.id);
  if (Number.isFinite(ai) && Number.isFinite(bi)) return ai - bi;
  return String(a.id ?? '').localeCompare(String(b.id ?? ''));
}

/**
 * Builds the P&L bars from the exact recorded final USDT result.
 * trade keeps each close; day groups closes by UTC calendar date.
 */
function computePnlBars(rows, mode='trade') {
  if (!['trade','day'].includes(mode)) throw new Error('Modo de P&L inválido');
  const valid=(Array.isArray(rows)?rows:[]).map(t=>({
    ...t,
    _barClosed:parseUTC(t.closed_at),
    _barPnl:Number.isFinite(Number(t.final_profit_usdt))?Number(t.final_profit_usdt):0,
  })).filter(t=>!Number.isNaN(t._barClosed.getTime())).sort(curveTradeOrder);

  if (mode==='trade') {
    return {
      mode,
      keys:valid.map(t=>String(t.id??'')),
      labels:valid.map(t=>t._barClosed.toLocaleDateString('es',{month:'short',day:'numeric',timeZone:'UTC'})),
      data:valid.map(t=>t._barPnl),
      counts:valid.map(()=>1),
    };
  }

  const grouped=new Map();
  valid.forEach(t=>{
    const key=t._barClosed.toISOString().slice(0,10);
    if (!grouped.has(key)) grouped.set(key,{key,date:t._barClosed,pnl:0,count:0});
    const day=grouped.get(key);
    day.pnl+=t._barPnl;
    day.count++;
  });
  const days=[...grouped.values()];
  return {
    mode,
    keys:days.map(day=>day.key),
    labels:days.map(day=>day.date.toLocaleDateString('es',{month:'short',day:'numeric',timeZone:'UTC'})),
    data:days.map(day=>day.pnl),
    counts:days.map(day=>day.count),
  };
}

function syncPnlBarModeUi() {
  const daily=pnlBarMode==='day';
  set('cv-bar-title',daily?'P&L por día (USDT)':'P&L por trade (USDT)');
  const canvas=el('ch-bars');
  if (canvas) canvas.setAttribute('aria-label',daily?'P&L por día':'P&L por trade');
  document.querySelectorAll('[data-pnl-mode]').forEach(btn=>{
    const active=btn.dataset.pnlMode===pnlBarMode;
    btn.classList.toggle('active',active);
    btn.setAttribute('aria-selected',active?'true':'false');
  });
}

function switchPnlBarMode(mode) {
  if (!['trade','day'].includes(mode)||mode===pnlBarMode) return;
  pnlBarMode=mode;
  renderCurve();
}

/**
 * Pure monthly ledger used by the chart and tests.
 * total carries the accumulated balance; reset starts each month from the base.
 */
function computeMonthlyPerformance(rows, initialBalance, mode='total') {
  const initial = Number(initialBalance);
  if (!Number.isFinite(initial)) throw new Error('Capital inicial inválido');
  if (!['total','reset'].includes(mode)) throw new Error('Modo mensual inválido');
  const diagnostics = {invalidDate:0,invalidPnl:0,coincidentOpenings:0,exactDuplicateRows:0,exactDuplicatePnl:0};
  const openingKeys=new Set(), exactKeys=new Set(), valid=[];
  (Array.isArray(rows)?rows:[]).forEach(t=>{
    const closed=parseUTC(t.closed_at);
    if (Number.isNaN(closed.getTime())) { diagnostics.invalidDate++; return; }
    const rawPnl=t.final_profit_usdt;
    const pnlValid=!(rawPnl===null||rawPnl===undefined||rawPnl==='')&&Number.isFinite(Number(rawPnl));
    const pnl=pnlValid?Number(rawPnl):0;
    if (!pnlValid) diagnostics.invalidPnl++;
    const openingKey=String(t.symbol||'').toUpperCase()+'|'+String(t.opened_at||'');
    if (t.symbol&&t.opened_at) {
      if (openingKeys.has(openingKey)) diagnostics.coincidentOpenings++;
      openingKeys.add(openingKey);
    }
    const exactKey=[String(t.symbol||'').toUpperCase(),String(t.direction||'').toUpperCase(),
      String(t.opened_at||''),String(t.closed_at||''),String(t.entry_price||''),
      String(t.exit_price||''),String(t.stop_loss||''),String(t.tp1||''),
      String(t.tp2||''),String(t.tp3||''),String(t.close_reason||''),String(rawPnl??'')].join('|');
    const exactDuplicate=exactKeys.has(exactKey);
    exactKeys.add(exactKey);
    if (exactDuplicate) { diagnostics.exactDuplicateRows++; diagnostics.exactDuplicatePnl+=pnl; }
    valid.push({...t,_closed:closed,_pnl:pnl,_exactDuplicate:exactDuplicate});
  });
  valid.sort(curveTradeOrder);
  const grouped=new Map();
  valid.forEach(t=>{
    const key=String(t._closed.getUTCFullYear())+'-'+String(t._closed.getUTCMonth()+1).padStart(2,'0');
    if (!grouped.has(key)) grouped.set(key,{key,year:String(t._closed.getUTCFullYear()),month:t._closed.getUTCMonth(),
      pnl:0,count:0,bot:0,exactDuplicates:0,exactDuplicatePnl:0});
    const month=grouped.get(key);
    month.pnl+=t._pnl; month.count++; month.bot++;
    if (t._exactDuplicate) { month.exactDuplicates++; month.exactDuplicatePnl+=t._pnl; }
  });
  let running=initial;
  const months=[...grouped.values()].sort((a,b)=>a.key.localeCompare(b.key)).map(month=>{
    const cumulativeStart=running, cumulativeEnd=cumulativeStart+month.pnl;
    running=cumulativeEnd;
    const start=mode==='reset'?initial:cumulativeStart;
    const end=start+month.pnl;
    const returnPct=start!==0?month.pnl/start*100:null;
    return {...month,start,end,returnPct,cumulativeStart,cumulativeEnd};
  });
  const byYear={};
  months.forEach(month=>{
    if (!byYear[month.year]) byYear[month.year]={};
    byYear[month.year][month.month]=month;
  });
  return {mode,initialBalance:initial,finalBalance:running,totalPnl:running-initial,
    tradeCount:valid.length,months,byYear,years:Object.keys(byYear).sort(),
    diagnostics,sourceTotals:{bot:valid.length}};
}

function renderCurve() {
  syncPnlBarModeUi();
  set('cv-base-account', '$'+CFG.balance0.toFixed(2));
  const totalBalance = Number(stats.last_balance);
  set('cv-current-account', '$'+(Number.isFinite(totalBalance) ? totalBalance : CFG.balance0).toFixed(2));
  if (!trades.length) return;

  const allSorted = [...trades].sort(curveTradeOrder);
  let runningAll = CFG.balance0;
  const balanceBeforeById = new Map();
  allSorted.forEach(t => {
    balanceBeforeById.set(t.id, runningAll);
    runningAll += Number(t.final_profit_usdt || 0);
  });

  const filtered = filterByPeriod([...trades], activePeriod, 'closed_at').sort(curveTradeOrder);
  if (!filtered.length) {
    set('cv-ini','$'+CFG.balance0.toFixed(2));
    set('cv-roi','—'); set('cv-peak','—'); set('cv-min','—');
    set('cv-dd','—'); set('cv-proft','—');
    set('cv-period-label', periodLabel(activePeriod) + ' · 0 trades');
    if (chBal) { chBal.destroy(); chBal=null; }
    if (chBars) { chBars.destroy(); chBars=null; }
    buildMonthlyChart();
    return;
  }

  const sorted = filtered;
  const plUsdt = sorted.map(t => Number(t.final_profit_usdt || 0));
  const periodStart = balanceBeforeById.get(sorted[0].id) ?? CFG.balance0;
  let runBal = periodStart;
  const bals = plUsdt.map(u => { runBal += u; return runBal; });

  let peak = periodStart, maxDd = 0;
  for (const balance of [periodStart, ...bals]) {
    if (balance > peak) peak = balance;
    const dd = peak ? (peak-balance)/peak*100 : 0;
    if (dd > maxDd) maxDd = dd;
  }

  const periodPl = plUsdt.reduce((a,v) => a+v, 0);
  const roi = periodStart ? periodPl/periodStart*100 : 0;
  const profit = plUsdt.filter(v => v>0).length;
  set('cv-ini','$'+periodStart.toFixed(2));
  set('cv-peak','$'+Math.max(periodStart,...bals).toFixed(2));
  set('cv-min','$'+Math.min(periodStart,...bals).toFixed(2));
  set('cv-roi',(roi>=0?'+':'')+roi.toFixed(2)+'%');
  setClass('cv-roi','curve-stat-value '+(roi>=0?'c-green':'c-red'));
  set('cv-dd','-'+maxDd.toFixed(2)+'%');
  set('cv-proft',profit+' / '+sorted.length);
  set('cv-period-label',periodLabel(activePeriod)+' · '+sorted.length+' trades');

  const gOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{legend:{display:false}},
    scales:{
      x:{ticks:{maxTicksLimit:12,font:{size:11,weight:'500'},color:'#7890aa'},grid:{color:'rgba(255,255,255,.025)'}},
      y:{ticks:{font:{size:11,weight:'500'},color:'#7890aa'},grid:{color:'rgba(255,255,255,.04)'}},
    },
  };
  if (chBal) chBal.destroy();
  if (chBars) chBars.destroy();

  const balLabels=['Inicio',...sorted.map(t=>parseUTC(t.closed_at).toLocaleDateString('es',{month:'short',day:'numeric',timeZone:'UTC'}))];
  chBal=new Chart(el('ch-balance'),{
    type:'line',data:{labels:balLabels,datasets:[{
      data:[periodStart,...bals],borderColor:'#2688ff',backgroundColor:'rgba(38,136,255,.07)',
      borderWidth:2,fill:true,pointRadius:0,tension:.3,
    }]},options:{...gOpts,plugins:{...gOpts.plugins,tooltip:{callbacks:{label:ctx=>' $'+ctx.raw.toFixed(2)}}}},
  });

  const pnlBars=computePnlBars(sorted,pnlBarMode);
  const barLabels=pnlBars.labels,barData=pnlBars.data;
  chBars=new Chart(el('ch-bars'),{
    type:'bar',data:{labels:barLabels,datasets:[{
      data:barData,
      backgroundColor:barData.map(v=>v>=0?'rgba(55,244,176,.65)':'rgba(255,84,112,.65)'),
      borderColor:barData.map(v=>v>=0?'#37f4b0':'#ff5470'),borderWidth:1,borderRadius:3,borderSkipped:false,
    }]},options:{...gOpts,plugins:{...gOpts.plugins,tooltip:{callbacks:{
      label:ctx=>(pnlBarMode==='day'?' P&L neto: ':' P&L: ')+(ctx.raw>=0?'+':'-')+'$'+Math.abs(ctx.raw).toFixed(2),
      afterLabel:ctx=>pnlBarMode==='day'?' '+pnlBars.counts[ctx.dataIndex]+' cierre'+(pnlBars.counts[ctx.dataIndex]===1?'':'s'):'',
    }}}},
  });
  buildMonthlyChart();
}

function buildMonthlyChart() {
  const audit=computeMonthlyPerformance(trades,CFG.balance0,monthlyMode);
  set('cv-current-account','$'+audit.finalBalance.toFixed(2));
  set('cv-monthly-title',monthlyMode==='reset'
    ? 'Rendimiento mensual reiniciado desde $'+audit.initialBalance.toFixed(2)+' (%)'
    : 'Rendimiento mensual sobre balance inicial del mes (%)');
  set('cv-monthly-mode-sub',monthlyMode==='reset'
    ? 'Cada mes comienza nuevamente desde el capital base'
    : 'El balance final de un mes continúa en el siguiente');
  document.querySelectorAll('[data-monthly-mode]').forEach(btn=>{
    const active=btn.dataset.monthlyMode===monthlyMode;
    btn.classList.toggle('active',active);
    btn.setAttribute('aria-selected',active?'true':'false');
  });
  if (!audit.years.length) return;
  if (!activeYear||!audit.byYear[activeYear]) activeYear=audit.years[audit.years.length-1];
  const tabs=el('cv-year-tabs');
  if (tabs) tabs.innerHTML=audit.years.map(y=>'<button class="yr-tab '+(y===activeYear?'active':'')+
    '" onclick="switchYear(\''+y+'\')">'+y+'</button>').join('');
  renderMonthlyBars(audit.byYear[activeYear]||{},audit,activeYear);
}
function switchYear(year) { activeYear=year; buildMonthlyChart(); }
function switchMonthlyMode(mode) {
  if (!['total','reset'].includes(mode)||mode===monthlyMode) return;
  monthlyMode=mode; buildMonthlyChart();
}
function money(value) {
  const n=Number(value||0); return (n>=0?'+':'-')+'$'+Math.abs(n).toFixed(2);
}
function renderMonthlyAudit(audit,year) {
  const target=el('cv-monthly-audit'); if (!target) return;
  const yearMonths=audit.months.filter(m=>m.year===year);
  const pnl=yearMonths.reduce((sum,m)=>sum+m.pnl,0);
  const diagnosticCount=audit.diagnostics.invalidDate+audit.diagnostics.invalidPnl+audit.diagnostics.exactDuplicateRows;
  const reset=audit.mode==='reset';
  const expected=Number(stats.last_balance);
  const diff=Number.isFinite(expected)?audit.finalBalance-expected:0;
  const reconciled=!Number.isFinite(expected)||Math.abs(diff)<.01;
  const healthy=(reset||reconciled)&&diagnosticCount===0;
  let metrics='';
  if (reset) {
    const simpleReturn=audit.initialBalance?pnl/audit.initialBalance*100:0;
    metrics='<div><span>Base de cada mes</span><strong>$'+audit.initialBalance.toFixed(2)+'</strong></div>'+
      '<div><span>P&L '+year+'</span><strong style="color:'+(pnl>=0?'var(--green)':'var(--red)')+'">'+money(pnl)+'</strong></div>'+
      '<div><span>Retorno sobre base</span><strong style="color:'+(simpleReturn>=0?'var(--green)':'var(--red)')+'">'+
      (simpleReturn>=0?'+':'')+simpleReturn.toFixed(2)+'%</strong></div>'+
      '<div><span>Meses con cierres</span><strong>'+yearMonths.length+'</strong></div>';
  } else {
    const start=yearMonths[0]?.start??audit.initialBalance;
    const end=yearMonths[yearMonths.length-1]?.end??start;
    const yearReturn=start?pnl/start*100:0;
    metrics='<div><span>Inicio '+year+'</span><strong>$'+start.toFixed(2)+'</strong></div>'+
      '<div><span>P&L '+year+'</span><strong style="color:'+(pnl>=0?'var(--green)':'var(--red)')+'">'+money(pnl)+'</strong></div>'+
      '<div><span>Retorno '+year+'</span><strong style="color:'+(yearReturn>=0?'var(--green)':'var(--red)')+'">'+
      (yearReturn>=0?'+':'')+yearReturn.toFixed(2)+'%</strong></div>'+
      '<div><span>Final '+year+'</span><strong>$'+end.toFixed(2)+'</strong></div>';
  }
  const formula=reset
    ? 'Fórmula mensual: P&L del mes ÷ $'+audit.initialBalance.toFixed(2)+'. Cada mes reinicia desde la misma base; los meses no se encadenan.'
    : 'Fórmula mensual: P&L del mes ÷ balance al inicio del mes. Base global $'+audit.initialBalance.toFixed(2)+'; el cierre de cada mes continúa en el siguiente.';
  target.className='monthly-audit '+(healthy?'audit-ok':'audit-warn');
  target.innerHTML='<div class="monthly-audit-head"><span class="audit-dot"></span><strong>'+
    (healthy?(reset?'Meses verificados':'Histórico reconciliado'):'Revisión de integridad requerida')+
    '</strong><span>'+audit.tradeCount+' cierres · Origen: Bot</span></div>'+
    '<div class="monthly-audit-grid">'+metrics+'</div><p>'+formula+' Origen: Bot.</p>'+
    (!reset&&!reconciled?'<p class="audit-alert">Diferencia contra el balance resumen: '+money(diff)+'.</p>':'')+
    (audit.diagnostics.invalidDate?'<p class="audit-alert">'+audit.diagnostics.invalidDate+' cierres sin fecha válida.</p>':'')+
    (audit.diagnostics.invalidPnl?'<p class="audit-alert">'+audit.diagnostics.invalidPnl+' cierres sin P&L válido, tratados como $0.</p>':'')+
    (audit.diagnostics.exactDuplicateRows?'<p class="audit-alert">'+audit.diagnostics.exactDuplicateRows+
      ' duplicados económicos exactos; impacto incluido '+money(audit.diagnostics.exactDuplicatePnl)+'.</p>':'')+
    (audit.diagnostics.coincidentOpenings>audit.diagnostics.exactDuplicateRows?'<p>'+
      (audit.diagnostics.coincidentOpenings-audit.diagnostics.exactDuplicateRows)+
      ' coincidencias de símbolo/hora con datos distintos; se conservan como señales independientes.</p>':'');
}
function renderMonthlyBars(monthData,audit,year) {
  if (chMonthly) chMonthly.destroy();
  const records=MONTH_NAMES.map((_,i)=>monthData[i]||null);
  const data=records.map(r=>r&&Number.isFinite(r.returnPct)?r.returnPct:0);
  const colors=data.map(v=>v>=0?'rgba(55,244,176,.75)':'rgba(255,84,112,.75)');
  const borders=data.map(v=>v>=0?'#37f4b0':'#ff5470');
  chMonthly=new Chart(el('ch-monthly'),{
    type:'bar',data:{labels:MONTH_NAMES,datasets:[{data,backgroundColor:colors,borderColor:borders,
      borderWidth:1,borderRadius:4,borderSkipped:false,barPercentage:.7,categoryPercentage:.8}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{
        title:items=>items[0].label+' '+year,
        label:ctx=>{
          const r=records[ctx.dataIndex];
          if (!r) return ['Sin cierres registrados'];
          return ['Retorno del mes: '+(r.returnPct>=0?'+':'')+r.returnPct.toFixed(2)+'%',
            'P&L del mes: '+money(r.pnl),'Balance inicial: $'+r.start.toFixed(2),
            'Balance final: $'+r.end.toFixed(2),'Cierres: '+r.count+' · Origen: Bot'];
        }}}},
      scales:{
        x:{ticks:{font:{size:12,weight:'600'},color:'#7890aa'},grid:{color:'rgba(255,255,255,.025)'}},
        y:{ticks:{font:{size:11,weight:'500'},color:'#7890aa',callback:v=>v.toFixed(0)+'%'},grid:{color:'rgba(255,255,255,.04)'}}}},
    plugins:[{id:'monthlyLabels',afterDatasetsDraw(chart){
      const {ctx}=chart;chart.getDatasetMeta(0).data.forEach((bar,i)=>{
        const r=records[i],val=data[i]; if(!r||val===0)return;
        ctx.save();ctx.font='700 11px Inter, sans-serif';ctx.fillStyle=val>=0?'#37f4b0':'#ff5470';ctx.textAlign='center';
        ctx.fillText((val>=0?'+':'')+val.toFixed(2)+'%',bar.x,val>=0?bar.y-7:bar.y+16);ctx.restore();
      });
    }}]});
  renderMonthlyAudit(audit,year);
  renderMonthlyLedger(audit,year);
}
function renderMonthlyLedger(audit,year) {
  const body=el('cv-monthly-ledger'),sub=el('cv-ledger-sub');
  if (!body) return;
  const months=audit.months.filter(m=>m.year===year);
  if (sub) sub.textContent=audit.mode==='reset'
    ? year+' · '+months.reduce((n,m)=>n+m.count,0)+' cierres · cada mes inicia en $'+audit.initialBalance.toFixed(2)
    : year+' · '+months.reduce((n,m)=>n+m.count,0)+' cierres · balance histórico continuo';
  body.innerHTML=months.map(m=>{
    const integrity=m.exactDuplicates
      ? '<span class="ledger-status warn">'+m.exactDuplicates+' duplicado'+(m.exactDuplicates>1?'s':'')+' · '+money(m.exactDuplicatePnl)+'</span>'
      : '<span class="ledger-status ok">Verificado</span>';
    return '<tr><td><strong>'+MONTH_NAMES[m.month]+' '+m.year+'</strong></td>'+
      '<td>$'+m.start.toFixed(2)+'</td>'+
      '<td style="color:'+(m.pnl>=0?'var(--green)':'var(--red)')+';font-weight:700">'+money(m.pnl)+'</td>'+
      '<td>$'+m.end.toFixed(2)+'</td>'+
      '<td style="color:'+(m.returnPct>=0?'var(--green)':'var(--red)')+';font-weight:700">'+
      (m.returnPct>=0?'+':'')+m.returnPct.toFixed(2)+'%</td>'+
      '<td>'+m.count+'</td><td>Bot</td><td>'+integrity+'</td></tr>';
  }).join('')||'<tr><td colspan="8">Sin cierres para este año.</td></tr>';
}
