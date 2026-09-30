/* ════════════════════════════════════════════════════════════════════════════
   HISTORY TABLE — Period filter + pagination (100/page) + Fecha/Hora column
════════════════════════════════════════════════════════════════════════════ */

function renderHistory() {
  const source = el('f-source').value;
  const dir    = el('f-dir').value;
  const reason = el('f-reason').value;
  const sym    = el('f-sym').value.trim().toUpperCase();

  // 1) Period filter
  let f = filterByPeriod([...trades], activePeriod, 'closed_at');

  // 2) User filters
  if (source) f = f.filter(t => t.source === source);
  if (dir)    f = f.filter(t => t.direction === dir);
  if (reason) f = f.filter(t => {
    const r = fmtReason(t.close_reason);
    return r === reason || t.close_reason === reason;
  });
  if (sym) f = f.filter(t => (t.symbol || '').includes(sym));

  const totalFiltered = f.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / HIST_PER_PAGE));

  // Clamp page
  if (histPage > totalPages) histPage = totalPages;
  if (histPage < 1) histPage = 1;

  // 3) Paginate
  const start = (histPage - 1) * HIST_PER_PAGE;
  const page  = f.slice(start, start + HIST_PER_PAGE);

  set('f-count', totalFiltered + ' trades · ' + periodLabel(activePeriod));
  set('hist-footer',
    `Página ${histPage} de ${totalPages} · ${totalFiltered} resultados · ` +
    `${f.filter(t=>parseFloat(t.final_profit_usdt||0)>0).length} ganados · ` +
    `$${f.reduce((a,t)=>a+parseFloat(t.final_profit_usdt||0),0).toFixed(2)} USDT total`
  );

  // Pagination controls
  renderHistPagination(totalPages);

  // Desktop table
  const tb = el('tb-history');
  if (!page.length) {
    tb.innerHTML = '<tr><td colspan="14" style="padding:32px;text-align:center;color:var(--text3)">Sin resultados</td></tr>';
    const mob = el('tb-history-mobile'); if (mob) mob.innerHTML = '';
    return;
  }
  tb.innerHTML = page.map((t, i) => {
    const idx = start + i + 1;
    const p  = tradePct(t), u = parseFloat(t.final_profit_usdt||0), b = parseFloat(t.balance_after||0);
    const t1 = tradeTpContributionPct(t,0);
    const t1Text = t1 === null ? '—' : t1.toFixed(2)+'%';
    const t2 = tradeTpContributionPct(t,1);
    const t2Text = t2 === null ? '—' : t2.toFixed(2)+'%';
    const t3 = tradeTpContributionPct(t,2);
    const t3Text = t3 === null ? '—' : t3.toFixed(2)+'%';
    const dt = t.closed_at ? new Date(t.closed_at).toLocaleString('es',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
    return `<tr>
      <td class="col-idx" style="color:var(--text3);width:32px">${idx}</td>
      <td><span style="font-weight:700">${esc(t.symbol)}</span><small style="display:block;color:var(--text3)">${t.source==='reconstructed'?'Reconstruido':'TradingView'}</small></td>
      <td><span class="badge b-${esc((t.direction||'').toLowerCase())}">${esc(t.direction)}</span></td>
      <td class="num col-price">${fmtP(t.entry_price)}</td>
      <td class="num col-price">${fmtP(t.exit_price)}</td>
      <td class="col-fill" style="color:${t.hit_tp1?'var(--green)':'var(--text3)'}">${t1Text}</td>
      <td class="col-fill" style="color:${t.hit_tp2?'var(--green)':'var(--text3)'}">${t2Text}</td>
      <td class="col-fill" style="color:${t.hit_tp3?'var(--green)':'var(--text3)'}">${t3Text}</td>
      <td style="color:${p>=0?'var(--green)':'var(--red)'};font-weight:700">${p>=0?'+':''}${p.toFixed(2)}%</td>
      <td style="color:${u>=0?'var(--green)':'var(--red)'};font-weight:600">${u>=0?'+':'-'}$${Math.abs(u).toFixed(2)}</td>
      <td><span class="badge ${reasonClass(t.close_reason)}">${fmtScenario(t)}</span></td>
      <td class="col-dur" style="color:var(--text3);font-size:12px">${t.duration||'—'}</td>
      <td class="col-bal" style="color:var(--text2);font-weight:600">$${b.toFixed(2)}</td>
      <td class="col-date" style="color:var(--text3);font-size:11px;white-space:nowrap">${dt}</td>
    </tr>`;
  }).join('');

  // Mobile cards
  const mob = el('tb-history-mobile');
  if (!mob) return;
  mob.innerHTML = page.map(t => {
    const p  = tradePct(t), u = parseFloat(t.final_profit_usdt||0), b = parseFloat(t.balance_after||0);
    const col = p >= 0 ? 'var(--green)' : 'var(--red)';
    const t1 = tradeTpContributionPct(t,0);
    const t1Text = t1 === null ? '—' : t1.toFixed(1)+'%';
    const t2 = tradeTpContributionPct(t,1);
    const t2Text = t2 === null ? '—' : t2.toFixed(1)+'%';
    const t3 = tradeTpContributionPct(t,2);
    const t3Text = t3 === null ? '—' : t3.toFixed(1)+'%';
    const dt = t.closed_at ? new Date(t.closed_at).toLocaleString('es',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
    return `<div class="hist-card">
      <div class="hist-card-accent" style="background:${col}"></div>
      <div class="hist-card-top">
        <span class="hist-card-sym">${esc(t.symbol)} <small style="color:var(--text3)">${t.source==='reconstructed'?'Reconstruido':'TradingView'}</small></span>
        <span class="badge b-${esc((t.direction||'').toLowerCase())}">${esc(t.direction)}</span>
        <span class="badge ${reasonClass(t.close_reason)}" style="font-size:10px">${esc(fmtScenario(t))}</span>
        <span class="hist-card-pnl" style="color:${col}">${p>=0?'+':''}${p.toFixed(1)}%</span>
      </div>
      <div class="hist-card-body">
        <div class="hist-card-row"><span class="hist-card-key">Entry</span><span class="hist-card-val">${fmtP(t.entry_price)}</span></div>
        <div class="hist-card-row"><span class="hist-card-key">Exit</span><span class="hist-card-val">${fmtP(t.exit_price)}</span></div>
        <div class="hist-card-row"><span class="hist-card-key">USDT</span><span class="hist-card-val" style="color:${col}">${u>=0?'+':'-'}$${Math.abs(u).toFixed(2)}</span></div>
        <div class="hist-card-row"><span class="hist-card-key">Balance</span><span class="hist-card-val">$${b.toFixed(2)}</span></div>
        <div class="hist-card-row"><span class="hist-card-key">TP1/2/3</span><span class="hist-card-val">${t1Text} / ${t2Text} / ${t3Text}</span></div>
        <div class="hist-card-row"><span class="hist-card-key">Cerrado</span><span class="hist-card-val">${dt}</span></div>
      </div>
    </div>`;
  }).join('');
}

function renderHistPagination(totalPages) {
  const containers = [el('hist-pagination'), el('hist-pagination-mobile')].filter(Boolean);
  if (!containers.length) return;
  if (totalPages <= 1) { containers.forEach(c => c.innerHTML = ''); return; }

  // Build page numbers with ellipsis
  let pages = [];
  const P = histPage, T = totalPages;
  if (T <= 7) {
    for (let i = 1; i <= T; i++) pages.push(i);
  } else {
    pages.push(1);
    if (P > 3) pages.push('…');
    for (let i = Math.max(2, P-1); i <= Math.min(T-1, P+1); i++) pages.push(i);
    if (P < T-2) pages.push('…');
    pages.push(T);
  }

  const html =
    `<button class="pg-btn" ${P<=1?'disabled':''} onclick="histGoPage(${P-1})">‹ Anterior</button>` +
    pages.map(p => p === '…'
      ? '<span class="pg-ellipsis">…</span>'
      : `<button class="pg-num ${p===P?'active':''}" onclick="histGoPage(${p})">${p}</button>`
    ).join('') +
    `<button class="pg-btn" ${P>=T?'disabled':''} onclick="histGoPage(${P+1})">Siguiente ›</button>`;
  containers.forEach(c => c.innerHTML = html);
}

function histGoPage(p) {
  histPage = p;
  renderHistory();
  // Scroll to top of history section
  const section = el('pg-history');
  if (section) section.scrollTo({ top: 0, behavior: 'smooth' });
}
