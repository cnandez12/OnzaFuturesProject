/* ════════════════════════════════════════════════════════════════════════════
   DATA FETCH & LOADING
   ─ Fetches from backend, populates global stores, triggers renderAll.
════════════════════════════════════════════════════════════════════════════ */

async function fetchJson(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error('HTTP ' + r.status + ' en ' + path);
  return r.json();
}

function showDataStatus(message, warning=false) {
  const e = el('data-status');
  if (!e) return;
  e.textContent = message;
  e.style.color = warning ? 'var(--amber)' : 'var(--text2)';
}

/* Paginates through /api/sim/history until exhausted, so `trades` always
   holds the FULL closed history — not just the most recent 1000 rows. */
async function fetchAllHistory() {
  const pageSize = 1000;
  let offset = 0;
  let all = [];
  while (true) {
    const page = await fetchJson(`/api/sim/history?limit=${pageSize}&offset=${offset}`);
    if (!page || !page.length) break;
    all = all.concat(page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

async function loadAll() {
  const btn = document.getElementById('btn-refresh');
  btn.classList.add('spinning');
  // Snapshot the pulse before loading data, so a change during loading is caught next poll.
  let pulse;
  try { pulse = { status:'fulfilled', value: await fetchJson('/api/sim/pulse') }; }
  catch (reason) { pulse = { status:'rejected', reason }; }
  const [h, s, o, sym] = await Promise.allSettled([
    fetchAllHistory(), fetchJson('/api/sim/stats'), fetchJson('/api/sim/open'),
    fetchJson('/api/sim/symbols'),
  ]);
  if (h.status === 'fulfilled') trades = h.value || [];
  if (s.status === 'fulfilled') stats = s.value || {};
  if (o.status === 'fulfilled') openPos = o.value || [];
  if (sym.status === 'fulfilled') symData = sym.value || [];
  if (pulse.status === 'fulfilled') {
    if (h.status === 'fulfilled') {
      lastKnownTotal = pulse.value.total;
      lastKnownClose = pulse.value.last_closed;
    }
    if (o.status === 'fulfilled') lastKnownOpenState = pulse.value.open_state;
  }
  const failures = [h,s,o,sym,pulse].filter(x => x.status === 'rejected');
  const reconstructed = trades.filter(t => t.source === 'reconstructed').length;
  const latestMargin = Number(stats.last_recorded_margin);
  const marginMismatch = latestMargin > 0 && Math.abs(latestMargin - CFG.margin) > .0001;
  showDataStatus(failures.length
    ? `Datos incompletos o desactualizados: ${failures.length} consultas fallaron. Última carga parcial ${new Date().toLocaleTimeString('es')}.`
    : `Simulación sin BE, bruta · ${trades.length} cierres desde TradingView · actualizado ${new Date().toLocaleTimeString('es')}`
      + (marginMismatch ? ' · AVISO: margen configurado distinto del último cierre; P&L abierto estimado.' : ''),
    failures.length > 0 || marginMismatch);
  if (failures.length) console.error('Dashboard data load failed:', failures.map(x => x.reason));
  btn.classList.remove('spinning');
  renderAll();
}

function renderAll() {
  const bot = trades.filter(t => t.source === 'bot');
  const reconstructed = trades.filter(t => t.source === 'reconstructed');
  const botWins = bot.filter(t => Number(t.final_profit_usdt) > 0).length;
  const botPnl = bot.reduce((a,t) => a + Number(t.final_profit_usdt || 0), 0);
  set('source-summary', `TradingView → Onza Futures: ${bot.length} cierres · ${bot.length ? (botWins/bot.length*100).toFixed(1) : '0.0'}% ganadores · ${botPnl >= 0 ? '+' : ''}$${botPnl.toFixed(2)} brutos. Resultados simulados desde las alertas recibidas.`);
  renderKPIs();
  renderDistributions();
  renderRecent();
  if (typeof renderOverviewMission === 'function') renderOverviewMission();
  updateOpenBadge();
  const active = document.querySelector('.page.active')?.id?.replace('pg-','');
  if (active === 'simulator') runSimulator();
  if (active === 'open')      renderOpen();
  if (active === 'history')   renderHistory();
  if (active === 'curve')     renderCurve();
  if (active === 'symbols')   renderSymbols();
  if (active === 'audit')     renderAudit();
}
