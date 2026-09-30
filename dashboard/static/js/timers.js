/* ════════════════════════════════════════════════════════════════════════════
   TIERED REFRESH SYSTEM
   ─ 1s  : recalculate floating P&L from cached prices (no network)
   ─ 5s  : Bitunix mark prices
   ─ 10s : pulse check — if a new trade closed, reload everything
════════════════════════════════════════════════════════════════════════════ */

async function checkPulse() {
  try {
    const pulse = await fetchJson('/api/sim/pulse');
    const changed = pulse.total !== lastKnownTotal || pulse.last_closed !== lastKnownClose
      || pulse.open_state !== lastKnownOpenState;
    if (changed) {
      console.log(`[pulse] Signal state changed (${lastKnownTotal} closed → ${pulse.total} closed) — reloading...`);
      await loadAll();
    }
  } catch(e) { showDataStatus('Sin conexión con la base de datos; las cifras pueden estar desactualizadas.', true); }
}

function startTimers() {
  // Clear previous timers
  if (pnlTimer)       clearInterval(pnlTimer);
  if (livePriceTimer) clearInterval(livePriceTimer);
  if (pulseTimer)     clearInterval(pulseTimer);

  // 1s — recalculate floating P&L with cached prices (no network)
  pnlTimer = setInterval(() => {
    if (openPos.length) updateLivePnl();
  }, 1000);

  // 5s — update Bitunix mark prices
  livePriceTimer = setInterval(() => {
    if (openPos.length) fetchMarkPrices();
  }, 5000);

  // 10s — detect newly closed trades
  pulseTimer = setInterval(checkPulse, 10000);
}
