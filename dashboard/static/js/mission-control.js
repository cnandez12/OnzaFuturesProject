/* CryptoPilot AI signal overview — recorded simulation and live mark-price state. */
let chOverview = null;

function renderOverviewMission() {
  renderOverviewBalanceChart();
  renderOverviewOpenSignals();
  if (openPos.length && (!lastMarkFetchAt || Date.now() - lastMarkFetchAt > 15000)) fetchMarkPrices();
}

function renderOverviewBalanceChart() {
  const canvas = el('ch-overview');
  if (!canvas || typeof Chart === 'undefined') return;
  const chronological = [...trades]
    .filter(t => t.closed_at)
    .sort((a,b) => new Date(a.closed_at) - new Date(b.closed_at));
  let running = CFG.balance0;
  const labels = [];
  const values = [];
  chronological.forEach(t => {
    const recorded = Number(t.balance_after);
    running = Number.isFinite(recorded) && recorded > 0
      ? recorded
      : running + Number(t.final_profit_usdt || 0);
    labels.push(new Date(t.closed_at).toLocaleDateString('es', { day:'2-digit', month:'short' }));
    values.push(Number(running.toFixed(2)));
  });
  if (!values.length) { labels.push('Inicio'); values.push(CFG.balance0); }
  const finalBalance = values[values.length - 1];
  const delta = finalBalance - CFG.balance0;
  set('overview-chart-balance', '$' + finalBalance.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
  set('overview-chart-change', (delta >= 0 ? '+' : '-') + '$' + Math.abs(delta).toFixed(2) + ' acumulado');
  const change = el('overview-chart-change');
  if (change) change.style.color = delta >= 0 ? 'var(--green)' : 'var(--red)';
  set('overview-chart-sub', chronological.length + ' cierres · escenario de máximo TP');

  if (chOverview) chOverview.destroy();
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0,0,0,250);
  gradient.addColorStop(0,'rgba(38,136,255,.16)');
  gradient.addColorStop(1,'rgba(38,136,255,0)');
  chOverview = new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[{
      data:values, borderColor:'#2688ff', backgroundColor:gradient, fill:true,
      borderWidth:2.2, pointRadius:0, pointHoverRadius:4, pointHoverBackgroundColor:'#2688ff',
      tension:.28
    }]},
    options:{
      responsive:true, maintainAspectRatio:false, animation:{duration:450}, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip:{
        displayColors:false, backgroundColor:'#091426', borderColor:'#2c4f72', borderWidth:1,
        titleColor:'#a0b5ca', bodyColor:'#eaf6ff', padding:10,
        callbacks:{label:c => ' Balance  $' + Number(c.raw).toFixed(2)}
      }},
      scales:{
        x:{grid:{display:false},border:{display:false},ticks:{color:'#7890aa',font:{size:9},maxTicksLimit:7,maxRotation:0}},
        y:{position:'right',grid:{color:'rgba(255,255,255,.045)'},border:{display:false},ticks:{color:'#7890aa',font:{size:9},callback:v=>'$'+Number(v).toLocaleString('en-US')}}
      }
    }
  });
}

function renderOverviewOpenSignals() {
  const list = el('overview-open-list');
  if (!list) return;
  set('overview-open-count', openPos.length + ' LIVE');
  if (!openPos.length) {
    list.innerHTML = '<div class="mission-open-empty"><div><strong>Sin señales abiertas</strong><br><span>El dashboard está sincronizado y esperando una nueva entrada.</span></div></div>';
    return;
  }
  list.innerHTML = openPos.map(p => {
    const pair = p.pair || p.symbol || '—';
    const safePair = esc(pair);
    const isLong = String(p.direction || '').toLowerCase() === 'long';
    const symbol = String(pair).replace('/','');
    const mark = lastMarkFetchAt && Date.now()-lastMarkFetchAt < 20000 ? liveMarkPrices['BITUNIX:' + symbol] : null;
    const pnl = calcOpenPnl(p, mark);
    const accumulated = Number(p.pnl_accumulated || 0);
    const target = p.tp2_filled ? Number(p.tp2) : p.tp1_filled ? Number(p.tp1) : null;
    const highestPct = target ? (isLong ? target-Number(p.entry) : Number(p.entry)-target)/Number(p.entry)*Number(p.leverage)*100 : null;
    const net = highestPct !== null ? highestPct * Number(p.margin_used)/100 : pnl && pnl.net !== null ? pnl.net : accumulated;
    const netPct = highestPct !== null ? highestPct : pnl && pnl.netPct !== null ? pnl.netPct : (Number(p.margin_used) ? accumulated/Number(p.margin_used)*100 : 0);
    const tp1 = Boolean(p.tp1_filled), tp2 = Boolean(p.tp2_filled);
    const be = Boolean(p.be_active);
    const state = tp2 ? 'Máximo TP2' : tp1 ? 'Máximo TP1' : 'Riesgo abierto';
    const protect = be ? ' · BE activo' : '';
    return `<div class="mission-open-row" data-pair="${safePair}" onclick="fbOpenSymbol(this.dataset.pair)" title="Abrir ${safePair} en el chart">
      <div class="mission-open-main"><span class="mission-open-symbol">${safePair}</span><span class="mission-dir ${isLong?'long':'short'}">${isLong?'LONG':'SHORT'}</span></div>
      <div class="mission-open-pnl" style="color:${net>=0?'var(--green)':'var(--red)'}">${netPct>=0?'+':''}${netPct.toFixed(2)}%</div>
      <div class="mission-progress"><span class="${tp1?'hit':''}"></span><span class="${tp2?'hit':''}"></span><span></span></div>
      <div class="mission-open-meta"><span>${state}${protect}</span><span>${mark ? 'Mark '+fmtP(mark) : 'Esperando mark price'}</span></div>
    </div>`;
  }).join('');
}
