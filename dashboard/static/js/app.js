/* ════════════════════════════════════════════════════════════════════════════
   APP BOOTSTRAP
   ─ Loaded last. Kicks off data loading, timers, and period controls.
════════════════════════════════════════════════════════════════════════════ */

function onPeriodChange() {
  syncPeriodBars();
  histPage = 1;
  // Re-render whichever page is active (or both if needed)
  const active = document.querySelector('.page.active')?.id?.replace('pg-','');
  if (active === 'curve')   renderCurve();
  if (active === 'history') renderHistory();
  // If switching pages later, they'll pick up the current activePeriod
}

initPeriodButtons('hist-period-bar', onPeriodChange);
initPeriodButtons('curve-period-bar', onPeriodChange);

loadAll();
startTimers();
