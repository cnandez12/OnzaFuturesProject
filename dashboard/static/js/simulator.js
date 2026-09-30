/* Strategy scenario replay: saved bot P&L anchors the original split;
   alternative splits use saved partial fill prices. Open and close events are
   processed in time order, with optional notional-based fees. */

document.getElementById('sim-compounding').addEventListener('change', function() {
  el('sim-pct-group').style.display = this.value === 'pct' ? 'block' : 'none';
});

function onSimPeriodChange() {
  const period = el('sim-period').value;
  const group  = el('sim-daterange-group');
  if (period === 'custom') {
    group.style.display = 'block';
    if (trades.length) {
      const sorted = [...trades].sort((a,b) => new Date(a.closed_at)-new Date(b.closed_at));
      const first  = new Date(sorted[0].closed_at);
      const today  = new Date();
      el('sim-date-from').value = first.toISOString().slice(0,10);
      el('sim-date-to').value   = today.toISOString().slice(0,10);
      updateRangeInfo();
    }
  } else {
    group.style.display = 'none';
  }
}

function updateRangeInfo() {
  const fromVal = el('sim-date-from').value;
  const toVal   = el('sim-date-to').value;
  if (!fromVal || !toVal) return;
  const from  = new Date(fromVal);
  const to    = new Date(toVal + 'T23:59:59.999Z');
  const days  = Math.round((to - from) / 86400000);
  const count = trades.filter(t => {
    const d = new Date(t.closed_at);
    return d >= from && d <= to;
  }).length;
  el('sim-range-info').textContent = `${days} días · ${count} trades en ese rango`;
}

/* ── TP-split validation (TP1 + TP2 + TP3 must add up to 100%) ─────────── */

function onTpSplitChange() {
  const statusEl = el('sim-tp-split-status');
  if (!statusEl) return;
  const w1 = parseFloat(el('sim-tp1-size').value) || 0;
  const w2 = parseFloat(el('sim-tp2-size').value) || 0;
  const w3 = parseFloat(el('sim-tp3-size').value) || 0;
  const total = w1 + w2 + w3;
  const valid = Math.abs(total - 100) < 0.01 && w1 >= 0 && w2 >= 0 && w3 >= 0;
  statusEl.style.color   = valid ? 'var(--green)' : 'var(--red)';
  statusEl.textContent   = valid
    ? `Distribución válida: ${total}%`
    : `Distribución inválida: ${total}% (debe sumar 100%)`;
}

document.addEventListener('DOMContentLoaded', () => {
  el('sim-date-from')?.addEventListener('input', updateRangeInfo);
  el('sim-date-to')?.addEventListener('input',   updateRangeInfo);
  onTpSplitChange();
});

function runSimulator() {
  if (!trades.length) { set('sim-data-notice', 'Sin historial cargado para simular.'); return; }
  const b0         = parseFloat(el('sim-balance').value)    || CFG.balance0;
  const marginBase = parseFloat(el('sim-margin').value)     || CFG.margin;
  const leverage   = parseInt(el('sim-leverage').value)     || CFG.leverage;
  const period     = el('sim-period').value;
  const compound   = el('sim-compounding').value;
  const pctRisk    = parseFloat(el('sim-pct').value || 2) / 100;

  const maxPosRaw  = el('sim-max-pos').value;
  const maxPos     = maxPosRaw ? (parseInt(maxPosRaw) || Infinity) : Infinity;

  const w1 = (parseFloat(el('sim-tp1-size').value) || 0) / 100;
  const w2 = (parseFloat(el('sim-tp2-size').value) || 0) / 100;
  const w3 = (parseFloat(el('sim-tp3-size').value) || 0) / 100;
  const weights = [w1, w2, w3];
  if (weights.some(w => !Number.isFinite(w) || w < 0) || Math.abs(w1+w2+w3-1) > 1e-8) {
    set('sim-tp-split-status', 'Distribución inválida: TP1 + TP2 + TP3 debe sumar 100%');
    return;
  }

  const feesOn = el('sim-fees-enabled').checked;
  const feePct = (parseFloat(el('sim-fee-pct').value) || 0) / 100;

  let filtered = [...trades].sort((a,b) => parseUTC(a.closed_at) - parseUTC(b.closed_at));
  if (el('sim-source')?.value === 'bot') filtered = filtered.filter(t => new Date(t.closed_at) >= new Date('2026-05-21T00:00:00Z'));

  let periodLabel = '';
  if (period === 'custom') {
    const fromVal = el('sim-date-from').value;
    const toVal   = el('sim-date-to').value;
    if (!fromVal || !toVal) {
      el('sim-range-info').textContent = '⚠️ Selecciona fecha desde y hasta';
      return;
    }
    const from = new Date(fromVal);
    const to   = new Date(toVal + 'T23:59:59.999Z');
    if (from > to) {
      el('sim-range-info').textContent = '⚠️ La fecha "desde" debe ser anterior a "hasta"';
      return;
    }
    filtered = filtered.filter(t => {
      const d = new Date(t.closed_at);
      return d >= from && d <= to;
    });
    const fmt = d => d.toLocaleDateString('es', {day:'numeric',month:'short',year:'numeric'});
    periodLabel = `${fmt(from)} → ${fmt(to)}`;
  } else if (period !== 'all') {
    const cutoff = new Date(Date.now() - parseInt(period) * 86400000);
    filtered = filtered.filter(t => new Date(t.closed_at) >= cutoff);
    periodLabel = `Últimos ${period} días`;
  } else {
    periodLabel = 'Todo el historial';
  }

  const NA_FIELDS = ['sr-balance','sr-roi','sr-wr','sr-dd','sr-best','sr-worst','sr-exp','sr-streak','sr-missed','sr-fees','sr-max-active','sr-total-pos-pct'];

  if (!filtered.length) {
    set('sr-count', '0');
    set('sr-period-label', periodLabel);
    set('sim-log-count', '0 trades');
    set('sim-data-notice', '');
    NA_FIELDS.forEach(id => set(id, '—'));
    return;
  }

  // Replay openings and closures in event time. Profit is credited only at close.
  const ordered = [...filtered].sort((a,b) => parseUTC(a.opened_at) - parseUTC(b.opened_at));
  let balance = b0, reserved = 0, peak = b0, maxDd = 0;
  let wins = 0, losses = 0, evaluated = 0, missed = 0, unpriced = 0, unreconciled = 0, estimatedFillTrades = 0;
  let bestPct = -Infinity, worstPct = Infinity, bestSym = '', worstSym = '';
  let maxStreak = 0, curStreak = 0;
  let totalWinPct = 0, totalLossPct = 0;
  let totalFees = 0, maxActive = 0, totalPosPct = 0;
  let bankrupt = false, bankruptDate = null;
  const active = [];
  const curve = [{ t: null, b: b0 }];
  const logRows = [];

  function settleThrough(timestamp) {
    active.sort((a,b) => a.closedAt - b.closedAt);
    while (active.length && active[0].closedAt <= timestamp && !bankrupt) {
      const pos = active.shift();
      reserved -= pos.margin;
      const gross = pos.margin * leverage * pos.scenario.rate;
      const exitFee = feesOn ? pos.margin * leverage * pos.scenario.exitFactor * feePct : 0;
      totalFees += exitFee;
      const pnlUsdt = gross - pos.entryFee - exitFee;
      const pnlPct = pnlUsdt / pos.margin * 100;
      balance += gross - exitFee; // entry fee was charged on opening
      evaluated++;
      if (balance <= 0) {
        balance = 0;
        maxDd = 100;
        bankrupt = true;
        bankruptDate = pos.t.closed_at;
      } else {
        peak = Math.max(peak, balance);
        maxDd = Math.max(maxDd, (peak - balance) / peak * 100);
      }
      if (pnlUsdt > 0) {
        wins++; totalWinPct += pnlPct; curStreak++;
        maxStreak = Math.max(maxStreak, curStreak);
      } else if (pnlUsdt < 0) {
        losses++; totalLossPct += pnlPct; curStreak = 0;
      }
      if (pnlPct > bestPct) { bestPct = pnlPct; bestSym = pos.t.symbol; }
      if (pnlPct < worstPct) { worstPct = pnlPct; worstSym = pos.t.symbol; }
      curve.push({ t: pos.t.closed_at, b: balance });
      logRows.push({ sym: pos.t.symbol, dir: pos.t.direction, pct: pnlPct, usdt: pnlUsdt,
        bal: balance, reason: pos.t.close_reason, hit_tp1: pos.t.hit_tp1,
        hit_tp2: pos.t.hit_tp2, dt: pos.t.closed_at });
    }
  }

  for (const t of ordered) {
    const openedAt = parseUTC(t.opened_at).getTime();
    const closedAt = parseUTC(t.closed_at).getTime();
    if (!Number.isFinite(openedAt) || !Number.isFinite(closedAt) || closedAt < openedAt) {
      unpriced++; continue;
    }
    settleThrough(openedAt);
    if (bankrupt) break;
    if (active.length >= maxPos) { missed++; continue; }
    const scenario = tradeScenario(t, weights);
    if (!scenario) { unpriced++; continue; }
    const margin = compound === 'pct' ? balance * pctRisk : marginBase;
    const entryFee = feesOn ? margin * leverage * feePct : 0;
    if (!(margin > 0) || margin + entryFee > balance - reserved + 1e-8) { missed++; continue; }
    if (scenario.discrepancy !== null && Math.abs(scenario.discrepancy) > 0.01) unreconciled++;
    if (scenario.estimatedFills > 0) estimatedFillTrades++;
    balance -= entryFee;
    maxDd = Math.max(maxDd, (peak - balance) / peak * 100);
    totalFees += entryFee;
    reserved += margin;
    totalPosPct += scenario.rate * 100;
    active.push({ t, openedAt, closedAt, margin, entryFee, scenario });
    maxActive = Math.max(maxActive, active.length);
  }
  if (!bankrupt) settleThrough(Infinity);
  const simNotice = el('sim-data-notice');
  if (simNotice) simNotice.textContent = [
    unreconciled ? `${unreconciled} cierres con diferencia entre precios parciales y P&L guardado; se respeta el P&L registrado.` : '',
    unpriced ? `${unpriced} operaciones sin precios/fechas suficientes para recalcular.` : '',
    estimatedFillTrades ? `${estimatedFillTrades} operaciones usan objetivos TP por faltar algún precio de venta guardado.` : '',
  ].filter(Boolean).join(' ');

  set('sr-count', evaluated.toString());
  set('sr-period-label', periodLabel + (missed ? ` · ${missed} omitidos` : ''));
  set('sim-log-count', evaluated + ' trades');

  if (!evaluated) {
    set('sr-balance', '$' + b0.toFixed(2));
    setClass('sr-balance', 'sim-kpi-value');
    set('sr-roi', '0.00%');
    setClass('sr-roi', 'sim-kpi-value');
    ['sr-wr','sr-dd','sr-best','sr-worst','sr-exp','sr-streak','sr-total-pos-pct'].forEach(id => set(id, '—'));
    set('sr-missed', missed.toString());
    set('sr-fees', '$0.00');
    set('sr-max-active', maxActive.toString());
    return;
  }

  const wr    = evaluated ? (wins / evaluated * 100) : 0;
  const roi   = (balance - b0) / b0 * 100;
  const avgW  = wins   ? totalWinPct  / wins   : 0;
  const avgL  = losses ? totalLossPct / losses : 0;
  const exp   = (wins * avgW + losses * avgL) / evaluated;

  // KPIs
  set('sr-balance', '$' + balance.toFixed(2));
  setClass('sr-balance', 'sim-kpi-value ' + (roi >= 0 ? 'c-green' : 'c-red'));
  set('sr-balance-sub', (roi >= 0 ? '+$' : '-$') + Math.abs(balance - b0).toFixed(2) + ' USDT vs inicial' + (bankrupt ? ' · 💀 cuenta liquidada' : ''));
  el('sr-bal-acc').style.background = roi >= 0 ? 'var(--green)' : 'var(--red)';

  set('sr-roi', (roi >= 0 ? '+' : '') + roi.toFixed(2) + '%');
  setClass('sr-roi', 'sim-kpi-value ' + (roi >= 0 ? 'c-green' : 'c-red'));
  set('sr-roi-sub', evaluated + ' trades · ' + periodLabel);
  el('sr-roi-acc').style.background = roi >= 0 ? 'var(--green)' : 'var(--red)';

  set('sr-wr',   wr.toFixed(1) + '%');
  setClass('sr-wr', 'sim-kpi-value ' + (wr >= 50 ? 'c-green' : 'c-red'));
  set('sr-wr-sub', wins + ' ganados · ' + losses + ' perdidos');

  set('sr-dd',   '-' + maxDd.toFixed(2) + '%');
  set('sr-best', bestPct > -Infinity ? (bestPct >= 0 ? '+' : '') + bestPct.toFixed(2) + '%' : '—');
  set('sr-best-sym', bestSym);
  set('sr-worst', worstPct < Infinity ? worstPct.toFixed(2) + '%' : '—');
  set('sr-worst-sym', worstSym);
  set('sr-exp',  (exp >= 0 ? '+' : '') + exp.toFixed(2) + '% / trade');
  setClass('sr-exp', 'sim-kpi-value ' + (exp >= 0 ? 'c-green' : 'c-red'));
  set('sr-streak', maxStreak + ' seguidos');

  set('sr-missed', missed.toString());
  set('sr-fees', '$' + totalFees.toFixed(2));
  set('sr-max-active', maxActive.toString());
  set('sr-total-pos-pct', (totalPosPct >= 0 ? '+' : '') + totalPosPct.toFixed(2) + '%');
  setClass('sr-total-pos-pct', 'sim-kpi-value ' + (totalPosPct >= 0 ? 'c-green' : 'c-red'));

  const dateRange = evaluated >= 2
    ? new Date(logRows[0].dt).toLocaleDateString('es',{month:'short',day:'numeric'}) + ' → ' + new Date(logRows[logRows.length-1].dt).toLocaleDateString('es',{month:'short',day:'numeric'})
    : '';
  set('sim-curve-label', dateRange + (bankrupt ? ` (liquidada ${new Date(bankruptDate).toLocaleDateString('es',{month:'short',day:'numeric'})})` : ''));

  // ── Chart — collapsed to one point per day (last balance of the day), like the reference curve ──
  const dayMap = new Map();
  curve.forEach(c => {
    const key = c.t ? new Date(c.t).toISOString().slice(0,10) : '__start__';
    dayMap.set(key, c);
  });
  const chartCurve = Array.from(dayMap.values());
  const labels = chartCurve.map((c,i) => (i === 0 && !c.t) ? 'Inicio' : (c.t ? new Date(c.t).toLocaleDateString('es',{month:'short',day:'numeric'}) : 'Inicio'));
  const bals   = chartCurve.map(c => c.b);

  if (chSim) chSim.destroy();
  chSim = new Chart(el('ch-sim'), {
    type: 'line',
    data: { labels, datasets: [{
      data: bals,
      borderColor: roi >= 0 ? '#37f4b0' : '#ff5470',
      backgroundColor: roi >= 0 ? 'rgba(55,244,176,.07)' : 'rgba(255,84,112,.07)',
      borderWidth: 2, fill: true, pointRadius: 0, tension: .35,
    }]},
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' $' + ctx.raw.toFixed(2) }}},
      scales: {
        x: { ticks: { maxTicksLimit: 10, font: { size: 10 }}, grid: { color: 'rgba(255,255,255,.025)' }},
        y: { ticks: { callback: v => '$' + v.toFixed(0), font: { size: 10 }}, grid: { color: 'rgba(255,255,255,.03)' }},
      }
    }
  });

  // Trade log — desktop list + mobile cards (executed trades only; missed trades never touch the log)
  const logEl    = el('sim-trade-log');
  const logMobEl = el('sim-trade-log-mobile');
  const rows = [...logRows].reverse();

  if (logEl) logEl.innerHTML = rows.map(r => {
    const dt = r.dt ? new Date(r.dt).toLocaleDateString('es',{month:'short',day:'numeric'}) : '—';
    return `<div class="sim-trade-row">
      <span class="sim-trade-sym">${r.sym}</span>
      <span><span class="badge b-${(r.dir||'').toLowerCase()}" style="font-size:10px">${r.dir}</span></span>
      <span class="sim-trade-pct" style="color:${r.pct>=0?'var(--green)':'var(--red)'}">${r.pct>=0?'+':''}${r.pct.toFixed(2)}%</span>
      <span class="sim-trade-usdt" style="color:${r.usdt>=0?'var(--green)':'var(--red)'}">${r.usdt>=0?'+':'-'}$${Math.abs(r.usdt).toFixed(2)}</span>
      <span class="sim-trade-bal">$${r.bal.toFixed(2)}</span>
      <span class="sim-trade-reason"><span class="badge ${reasonClass(r.reason)}" style="font-size:10px">${fmtScenario(r)}</span></span>
      <span class="sim-trade-date">${dt}</span>
    </div>`;
  }).join('');

  if (logMobEl) logMobEl.innerHTML = rows.slice(0, 30).map(r => {
    const col = r.pct >= 0 ? 'var(--green)' : 'var(--red)';
    const dt  = r.dt ? new Date(r.dt).toLocaleDateString('es',{month:'short',day:'numeric'}) : '—';
    return `<div class="sim-log-card">
      <span class="slc-sym">${r.sym} <span class="badge b-${(r.dir||'').toLowerCase()}" style="font-size:10px;margin-left:4px">${r.dir}</span></span>
      <span class="slc-pnl" style="color:${col}">${r.pct>=0?'+':''}${r.pct.toFixed(1)}%</span>
      <span class="slc-usdt" style="color:${col}">${r.usdt>=0?'+':'-'}$${Math.abs(r.usdt).toFixed(2)}</span>
      <span class="slc-bal">$${r.bal.toFixed(2)}</span>
    </div>`;
  }).join('') + (rows.length > 30 ? `<div style="padding:10px 14px;font-size:11px;color:var(--text3);text-align:center">+${rows.length-30} trades más</div>` : '');
}
