/* ════════════════════════════════════════════════════════════════════════════
   RECENT TRADES — OVERVIEW
════════════════════════════════════════════════════════════════════════════ */

function renderRecent() {
  const tb  = el('tb-recent');
  const mob = el('tb-recent-mobile');
  const recent = [...trades].slice(0, 15);
  if (!recent.length) {
    tb.innerHTML = '<tr><td colspan="7" style="padding:32px;text-align:center;color:var(--text3)">Sin datos</td></tr>';
    if (mob) mob.innerHTML = '';
    return;
  }
  const first = recent[recent.length-1]?.closed_at;
  set('ov-sub', trades.length + ' total');
  set('recent-footer', 'Últimos 15 trades' + (first ? ' · desde ' + new Date(first).toLocaleDateString('es', {month:'short',day:'numeric',year:'numeric'}) : ''));

  // Desktop table
  tb.innerHTML = recent.map((t, i) => {
    const p = tradePct(t), u = parseFloat(t.final_profit_usdt||0), b = parseFloat(t.balance_after||0);
    const dt = t.closed_at ? new Date(t.closed_at).toLocaleString('es',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
    return `<tr>
      <td style="color:var(--text3);width:28px">${i+1}</td>
      <td><span style="font-weight:700">${esc(t.symbol)}</span></td>
      <td><span class="badge b-${esc((t.direction||'').toLowerCase())}">${esc(t.direction)}</span></td>
      <td style="color:${p>=0?'var(--green)':'var(--red)'};font-weight:700">${p>=0?'+':''}${p.toFixed(2)}%</td>
      <td style="color:${u>=0?'var(--green)':'var(--red)'}; font-weight:600">${u>=0?'+':'-'}$${Math.abs(u).toFixed(2)}</td>
      <td><span class="badge ${reasonClass(t.close_reason)}">${fmtScenario(t)}</span></td>
      <td style="color:var(--text2);font-weight:600">$${b.toFixed(2)}</td>
      <td style="color:var(--text3);font-size:12px">${dt}</td>
    </tr>`;
  }).join('');

  // Mobile cards
  if (mob) mob.innerHTML = recent.map(t => {
    const p = tradePct(t), u = parseFloat(t.final_profit_usdt||0);
    const col = p >= 0 ? 'var(--green)' : 'var(--red)';
    const dt = t.closed_at ? new Date(t.closed_at).toLocaleDateString('es',{month:'short',day:'numeric'}) : '—';
    return `<div class="ov-trade-card">
      <span class="ov-tc-sym">${esc(t.symbol)}</span>
      <span class="ov-tc-dir"><span class="badge b-${esc((t.direction||'').toLowerCase())}">${esc(t.direction)}</span></span>
      <span class="ov-tc-pnl" style="color:${col}">${p>=0?'+':''}${p.toFixed(1)}%</span>
      <span class="ov-tc-usdt" style="color:${col}">${u>=0?'+':'-'}$${Math.abs(u).toFixed(2)}</span>
      <span class="ov-tc-badge"><span class="badge ${reasonClass(t.close_reason)}" style="font-size:10px">${fmtScenario(t)}</span></span>
    </div>`;
  }).join('');
}
