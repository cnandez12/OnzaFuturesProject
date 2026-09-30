/* ════════════════════════════════════════════════════════════════════════════
   KPIs — OVERVIEW
════════════════════════════════════════════════════════════════════════════ */

function renderKPIs() {
  const s = stats, b0 = CFG.balance0;
  const lastBal  = parseFloat(s.last_balance || b0);
  const pl       = parseFloat(s.total_pnl_usdt || 0);
  const plPct    = pl / b0 * 100;
  const wins     = parseInt(s.wins || 0);
  const losses   = parseInt(s.losses || 0);
  const breaks   = parseInt(s.breakevens || 0);
  const total    = parseInt(s.total_trades || 0);
  const wr       = total ? (wins / total * 100) : 0;
  const avgWin   = parseFloat(s.avg_win_pct  || 0);
  const avgLoss  = parseFloat(s.avg_loss_pct || 0);
  const ratio    = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

  // Header balance
  set('hdr-balance', (pl >= 0 ? '+' : '') + pl.toFixed(2) + ' USDT');

  // KPI 1: balance
  set('k-balance', '$' + lastBal.toFixed(2));
  setClass('k-balance', 'kpi-value ' + (pl >= 0 ? 'c-green' : 'c-red'));
  set('k-inicial', b0.toFixed(0));
  set('k-balance-sub', 'P&L: ' + (plPct >= 0 ? '+' : '') + plPct.toFixed(2) + '%');
  el('k-bal-accent').style.background = pl >= 0 ? 'var(--green)' : 'var(--red)';
  el('k-bal-glow').style.background   = pl >= 0 ? 'var(--green)' : 'var(--red)';
  setTrend('k-bal-trend', pl, (pl >= 0 ? '+$' : '-$') + Math.abs(pl).toFixed(2) + ' vs inicial');

  // KPI 2: P&L
  set('k-pl', (pl >= 0 ? '+$' : '-$') + Math.abs(pl).toFixed(2));
  setClass('k-pl', 'kpi-value ' + (pl >= 0 ? 'c-green' : 'c-red'));
  set('k-pl-pct', (plPct >= 0 ? '+' : '') + plPct.toFixed(2) + '% sobre capital inicial');
  el('k-pl-accent').style.background = pl >= 0 ? 'var(--green)' : 'var(--red)';
  setTrend('k-pl-trend', pl, (pl >= 0 ? 'Ganando' : 'En pérdida') + ' · ' + total + ' trades');

  // KPI 3: win rate
  set('k-wr', wr.toFixed(1) + '%');
  setClass('k-wr', 'kpi-value ' + (wr >= 50 ? 'c-green' : 'c-red'));
  set('k-wr-sub', wins + ' ganados · ' + losses + ' perdidos · ' + breaks + ' BE');
  el('k-wr-bar').style.width = wr.toFixed(1) + '%';

  // KPI 4: total
  set('k-total', total.toString());
  set('k-total-sub', wins + ' ganados · ' + losses + ' perdidos');
  const ob = el('k-open-badge');
  if (ob && openPos.length) {
    ob.innerHTML = `<span class="badge b-open" style="font-size:11px">⚡ ${openPos.length} abierta${openPos.length>1?'s':''} ahora</span>`;
    ob.style.display = 'block';
  }

  // Row 2 KPIs
  set('k-avg-win',  avgWin  !== 0 ? '+' + avgWin.toFixed(2)  + '%' : '—');
  set('k-avg-loss', avgLoss !== 0 ?        avgLoss.toFixed(2) + '%' : '—');
  set('k-ratio', ratio !== 0 ? ratio.toFixed(2) + ':1' : '—');
  setClass('k-ratio', ratio >= 1.5 ? 'c-green' : ratio >= 1 ? 'c-amber' : 'c-red');
}

function setTrend(id, val, label) {
  const e = el(id);
  if (!e) return;
  const cls = val > 0 ? 'kpi-trend trend-up' : val < 0 ? 'kpi-trend trend-down' : 'kpi-trend trend-flat';
  const arrow = val > 0 ? '▲' : val < 0 ? '▼' : '▸';
  e.className = cls;
  e.textContent = arrow + ' ' + label;
}
