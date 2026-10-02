/* ════════════════════════════════════════════════════════════════════════════
   OPEN POSITIONS — LIVE
   ─ Renders position cards using Bitunix futures mark prices.
════════════════════════════════════════════════════════════════════════════ */

function updateOpenBadge() {
  const b = el('badge-open');
  b.textContent = openPos.length;
  b.style.display = openPos.length ? 'inline-flex' : 'none';
}

async function fetchMarkPrices() {
  if (!openPos.length) return;
  const symbols = [...new Set(openPos.map(p => (p.pair || '').replace('/', '').toUpperCase()))]
    .filter(s => /^[A-Z0-9]+USDT$/.test(s));
  if (!symbols.length) return;
  const nextPrices = {};
  try {
    for (let i = 0; i < symbols.length; i += 40) {
      const response = await fetch('/api/bitunix/tickers?symbols=' + encodeURIComponent(symbols.slice(i, i + 40).join(',')));
      if (!response.ok) throw new Error('Bitunix HTTP ' + response.status);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Formato inesperado');
      data.forEach(item => {
        const value = Number(item.markPrice);
        if (Number.isFinite(value) && value > 0) nextPrices['BITUNIX:' + item.symbol] = value;
      });
    }
    if (!Object.keys(nextPrices).length) throw new Error('Sin precios mark válidos');
    liveMarkPrices = nextPrices;
    lastMarkFetchAt = Date.now();
    updateLivePnl();
  } catch (error) {
    console.warn('[live] mark fetch failed:', error);
  }
}

function calcOpenPnl(p, markPrice) {
  return openPositionPnl(p, markPrice);
}

function updateLivePnl() {
  if (!openPos.length) return;
  let tAcc = 0, tFl = 0, tMrg = 0, tNet = 0, missingPrice = false;
  const priceFresh = lastMarkFetchAt && Date.now() - lastMarkFetchAt < 15000;
  openPos.forEach(p => {
    const sym  = (p.pair || '').replace('/', '');
    const mark = priceFresh ? liveMarkPrices['BITUNIX:' + sym] : null;
    const pnl = calcOpenPnl(p, mark);
    if (!pnl) { missingPrice = true; return; }
    const { floating: flUsdt, floatingPct: flPct, net: netUsdt,
      netPct, accumulated: accUsdt, margin } = pnl;
    tAcc += accUsdt; tMrg += margin; tNet += netUsdt || 0;
    if (flUsdt === null) missingPrice = true;
    else tFl += flUsdt;
    const card = el('pos-' + p.id);
    if (!card) return;
    const markEl = card.querySelector('.p-mark');
    const flEl   = card.querySelector('.p-fl');
    const netEl  = card.querySelector('.p-net');
    const netBig = card.querySelector('.p-net-big');
    if (markEl) markEl.textContent = mark ? fmtP(mark) : '—';
    if (flEl) {
      flEl.textContent = mark
        ? (flPct >= 0 ? '+' : '') + flPct.toFixed(2) + '% (' + (flUsdt >= 0 ? '+' : '-') + '$' + Math.abs(flUsdt).toFixed(2) + ')'
        : '—';
      flEl.style.color = mark ? (flUsdt >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--text3)';
    }
    if (netEl) {
      netEl.textContent = netPct !== null
        ? (netPct >= 0 ? '+' : '') + netPct.toFixed(2) + '% / ' + (netUsdt >= 0 ? '+' : '-') + '$' + Math.abs(netUsdt).toFixed(2)
        : '—';
      netEl.style.color = netPct !== null ? (netUsdt >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--text3)';
    }
    if (netBig) {
      netBig.textContent = netPct !== null
        ? (netPct >= 0 ? '+' : '') + netPct.toFixed(2) + '%'
        : '—';
      netBig.style.color = netPct !== null ? (netUsdt >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--text3)';
    }
  });

  // Summary strip
  el('live-summary').style.display = 'flex';

  const tNetPct = tMrg ? (tNet / tMrg * 100) : 0;
  setLive('sum-accum', tAcc,   '$', 2, tMrg);
  if (missingPrice) {
    set('sum-float', '—'); set('sum-net', '—'); set('sum-net-pct', 'Esperando precios vigentes');
  } else {
    setLive('sum-float', tFl, '$', 2, tMrg);
    setLive('sum-net', tNet, '$', 2, tMrg);
    set('sum-net-pct', (tNetPct >= 0 ? '+' : '') + tNetPct.toFixed(2) + '% sobre margen');
  }
  const sm = el('sum-margin');
  if (sm) { sm.textContent = '$' + tMrg.toFixed(0); sm.style.color = 'var(--text)'; }
  set('sum-count-pos', openPos.length + ' posición' + (openPos.length > 1 ? 'es' : ''));
  if (typeof renderOverviewOpenSignals === 'function') renderOverviewOpenSignals();
  set('live-ts', lastMarkFetchAt
    ? 'Último mark price del exchange de cada señal · ' + new Date(lastMarkFetchAt).toLocaleTimeString('es') + (priceFresh ? '' : ' · desactualizado')
    : 'Esperando mark price de Bitunix');
}

function setLive(id, val, prefix, dec, ref) {
  const e = el(id); if (!e) return;
  e.textContent = (val >= 0 ? '+' : '-') + prefix + Math.abs(val).toFixed(dec);
  e.style.color = val > 0 ? 'var(--green)' : val < 0 ? 'var(--red)' : 'var(--text2)';
}

function renderOpen() {
  const container = el('open-list');
  if (!openPos.length) {
    el('live-summary').style.display = 'none';
    container.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>Sin posiciones abiertas</p>
      <small>Esperando una entrada de TradingView</small>
    </div>`;
    return;
  }
  container.innerHTML = openPos.map(p => {
    const isLong  = (p.direction || '').toLowerCase() === 'long';
    const col     = isLong ? 'var(--green)' : 'var(--red)';
    const be      = p.be_active || false;
    const tp1     = p.tp1_filled || false;
    const tp2     = p.tp2_filled || false;
    const slDisp  = p.current_sl || p.stop_loss;
    const accUsdt = calcOpenPnl(p, null)?.accumulated || 0;
    const entry   = parseFloat(p.entry || 0);
    const notional= Number(p.margin_used) * Number(p.leverage);
    const tp1Val  = parseFloat(p.tp1 || 0);
    const tp2Val  = parseFloat(p.tp2 || 0);
    const tp3Val  = parseFloat(p.tp3 || 0);
    const dt      = p.date ? new Date(p.date).toLocaleString('es',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
    const pairSafe = esc(p.pair || p.symbol || '');

    return `<div class="pos-card" id="pos-${Number(p.id)}" data-pair="${pairSafe}" onclick="fbOpenSymbol(this.dataset.pair)" style="cursor:pointer" title="Ver ${pairSafe} en el chart (M15)">
      <div class="pos-card-accent" style="background:${col}"></div>
      <div class="pos-header">
        <div>
          <div class="pos-symbol">${pairSafe || '—'}</div>
          <div class="pos-badges">
            <span class="badge b-${isLong?'long':'short'}">${esc(p.direction)}</span>
            ${be ? '<span class="b-be">⚖️ BE</span>' : ''}
            <span class="tag tag-blue">${dt}</span>
          </div>
        </div>
        <div class="pos-pnl-block">
          <div class="pos-pnl-label">Escenario máximo TP</div>
          <div class="pos-pnl-net p-net-big" style="color:var(--text3)">—</div>
        </div>
      </div>

      <div class="pos-pnl-detail">
        <div class="pos-pnl-col">
          <div class="pos-pnl-col-label">Máximo TP (USDT)</div>
          <div class="pos-pnl-col-val" style="color:${accUsdt>=0?'var(--green)':'var(--red)'}">
            ${accUsdt>=0?'+':'-'}$${Math.abs(accUsdt).toFixed(2)}
          </div>
        </div>
        <div style="width:1px;background:var(--border);flex-shrink:0;margin:0 12px"></div>
        <div class="pos-pnl-col">
          <div class="pos-pnl-col-label">Flotante ahora</div>
          <div class="pos-pnl-col-val p-fl" style="color:var(--text3)">—</div>
        </div>
        <div style="width:1px;background:var(--border);flex-shrink:0;margin:0 12px"></div>
        <div class="pos-pnl-col">
          <div class="pos-pnl-col-label">Resultado del escenario</div>
          <div class="pos-pnl-col-val p-net" style="color:var(--text3)">—</div>
        </div>
      </div>

      <div class="pos-data">
        <div class="pos-data-row">
          <span class="pos-data-key">Entry</span>
          <span class="pos-data-val">${fmtP(entry)}</span>
        </div>
        <div class="pos-data-row">
          <span class="pos-data-key">Mark price</span>
          <span class="pos-data-val pos-mark-val p-mark">—</span>
        </div>
        <div class="pos-data-row">
          <span class="pos-data-key">SL actual</span>
          <span class="pos-data-val" style="color:${be?'var(--amber)':'var(--text2)'}">${fmtP(slDisp)}</span>
        </div>
        <div class="pos-data-row">
          <span class="pos-data-key">TPs objetivo</span>
          <span class="pos-data-val" style="font-size:11px">${fmtP(tp1Val)} / ${fmtP(tp2Val)} / ${fmtP(tp3Val)}</span>
        </div>
        <div class="pos-data-row">
          <span class="pos-data-key">Nominal simulado</span>
          <span class="pos-data-val">$${notional.toFixed(0)} (${entry>0?((notional/entry).toFixed(4)):'—'} ctts)</span>
        </div>
      </div>

      <div class="tp-progress">
        <div class="tp-labels">
          <span style="color:${tp1?'var(--green)':'var(--text3)'}">TP1${tp1?' ✓':''}</span>
          <span style="color:${tp2?'var(--green)':'var(--text3)'}">TP2${tp2?' ✓':''}</span>
          <span style="color:var(--text3)">TP3</span>
        </div>
        <div class="tp-track">
          <div class="tp-seg ${tp1?'hit':''}"></div>
          <div class="tp-seg ${tp2?'hit':''}"></div>
          <div class="tp-seg"></div>
        </div>
      </div>
    </div>`;
  }).join('');
  fetchMarkPrices();
}
