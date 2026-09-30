/* ════════════════════════════════════════════════════════════════════════════
   SYMBOLS ANALYSIS
════════════════════════════════════════════════════════════════════════════ */

function renderSymbols() {
  if (!symData.length) return;

  // Cards
  el('sym-grid').innerHTML = symData.map(s => {
    const pl  = parseFloat(s.total_usdt || 0);
    const avg = parseFloat(s.avg_pct || 0);
    const wr  = s.total ? (s.wins / s.total * 100) : 0;
    return `<div class="sym-card" onclick="fbOpenSymbol('${s.symbol}')" style="cursor:pointer" title="Ver ${s.symbol} en el chart (M15)">
      <div class="sym-card-header">
        <span class="sym-card-name">${s.symbol.replace('USDT','')}</span>
        <span class="sym-card-total">${s.total} trades</span>
      </div>
      <div class="sym-card-pnl ${pl>=0?'c-green':'c-red'}">${pl>=0?'+':'-'}$${Math.abs(pl).toFixed(2)}</div>
      <div class="sym-card-stats">
        <span>WR: ${wr.toFixed(0)}%</span>
        <span>Avg: ${avg>=0?'+':''}${avg.toFixed(2)}%</span>
        <span>✅${s.wins} ❌${s.losses}</span>
      </div>
      <div class="sym-wr-bar"><div class="sym-wr-fill" style="width:${wr.toFixed(0)}%"></div></div>
    </div>`;
  }).join('');

  // Table
  el('tb-symbols').innerHTML = symData.map((s,i) => {
    const pl  = parseFloat(s.total_usdt || 0);
    const avg = parseFloat(s.avg_pct   || 0);
    const wr  = s.total ? (s.wins / s.total * 100) : 0;
    const trend = avg >= 3 ? '🔥' : avg >= 0 ? '✅' : avg > -3 ? '⚠️' : '❌';
    return `<tr onclick="fbOpenSymbol('${s.symbol}')" style="cursor:pointer" title="Ver ${s.symbol} en el chart (M15)">
      <td><span style="font-weight:700">${s.symbol}</span></td>
      <td style="font-weight:600">${s.total}</td>
      <td style="color:var(--green)">${s.wins}</td>
      <td style="color:var(--red)">${s.losses}</td>
      <td>
        <span style="color:${wr>=50?'var(--green)':'var(--red)'}; font-weight:600">${wr.toFixed(1)}%</span>
        <div class="mini-prog" style="width:80px;margin-top:4px"><div class="mini-prog-fill" style="width:${wr.toFixed(0)}%;background:${wr>=50?'var(--green)':'var(--red)'}"></div></div>
      </td>
      <td style="color:${pl>=0?'var(--green)':'var(--red)'};font-weight:700">${pl>=0?'+':'-'}$${Math.abs(pl).toFixed(2)}</td>
      <td style="color:${avg>=0?'var(--green)':'var(--red)'}">${avg>=0?'+':''}${avg.toFixed(2)}%</td>
      <td style="font-size:16px">${trend}</td>
    </tr>`;
  }).join('');
}