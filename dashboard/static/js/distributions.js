/* ════════════════════════════════════════════════════════════════════════════
   DISTRIBUTIONS — OVERVIEW
════════════════════════════════════════════════════════════════════════════ */

function renderDistributions() {
  const total = trades.length || 1;

  // Close reason — composite scenarios with hit_tp1/tp2
  const closeCounts = {};
  trades.forEach(t => {
    const key = fmtScenario(t);
    closeCounts[key] = (closeCounts[key] || 0) + 1;
  });
  set('dist-close-total', total + ' trades');

  // Logical order: best outcomes first
  const scenarioOrder = [
    'TP1 + TP2 + TP3', 'TP1 + TP2 + Closed', 'TP1 + Closed',
    'TP1 + TP2 + BE', 'TP1 + BE', 'BE sin TP',
    'TP1 + TP2 + SL', 'TP1 + SL', 'SL Directo', 'SL Forced', 'Closed'
  ];
  const sortedScenarios = [
    ...scenarioOrder.filter(s => closeCounts[s]),
    ...Object.keys(closeCounts).filter(s => !scenarioOrder.includes(s))
  ];

  el('dist-close').innerHTML = sortedScenarios.map(s => {
    const c   = closeCounts[s] || 0;
    const pct = (c / total * 100).toFixed(1);
    const col = scenarioColor(s);
    return `<div class="dist-row">
      <span class="dist-label" style="font-size:12px">${s}</span>
      <div class="dist-track"><div class="dist-fill" style="width:${pct}%;background:${col}"></div></div>
      <span class="dist-num">${c}</span>
      <span class="dist-pct">${pct}%</span>
    </div>`;
  }).join('');

  // Direction
  const longs  = trades.filter(t => (t.direction||'').toLowerCase() === 'long').length;
  const shorts = trades.filter(t => (t.direction||'').toLowerCase() === 'short').length;
  el('dist-dir').innerHTML = [
    { label:'Long ↑', n:longs,  color:'var(--green)' },
    { label:'Short ↓',n:shorts, color:'var(--red)'   },
  ].map(({label,n,color}) => `
    <div class="dist-row">
      <span class="dist-label">${label}</span>
      <div class="dist-track"><div class="dist-fill" style="width:${(n/total*100).toFixed(0)}%;background:${color}"></div></div>
      <span class="dist-num">${n}</span>
      <span class="dist-pct">${(n/total*100).toFixed(1)}%</span>
    </div>`).join('');

  // Symbols
  const symTop = symData.slice(0,8);
  const symMax = symTop[0]?.total || 1;
  el('dist-sym').innerHTML = symTop.map(s => `
    <div class="dist-row">
      <span class="dist-label" style="font-size:11px;font-weight:600">${esc(s.symbol.replace('USDT',''))}</span>
      <div class="dist-track"><div class="dist-fill" style="width:${(s.total/symMax*100).toFixed(0)}%;background:var(--blue)"></div></div>
      <span class="dist-num">${s.total}</span>
      <span class="dist-pct" style="color:${parseFloat(s.avg_pct||0)>=0?'var(--green)':'var(--red)'}">${parseFloat(s.avg_pct||0)>=0?'+':''}${parseFloat(s.avg_pct||0).toFixed(1)}%</span>
    </div>`).join('');
}
