/* Navigation shared by desktop rail and mobile dock. */
function goTo(name, btn) {
  const page = document.getElementById('pg-' + name);
  if (!page) return;
  closeMoreMenu();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  page.classList.add('active');
  const target = btn || document.querySelector(`.nav-tab[data-page="${name}"]`);
  if (target) target.classList.add('active');
  const more = document.getElementById('nav-more');
  if (more) more.classList.toggle('active', ['curve', 'symbols', 'chart', 'audit'].includes(name));
  syncPeriodBars();
  const map = {
    overview:  () => renderOverviewMission(),
    curve:     () => renderCurve(),
    history:   () => renderHistory(),
    open:      () => renderOpen(),
    simulator: () => runSimulator(),
    symbols:   () => renderSymbols(),
    chart:     () => initFBChart(),
    audit:     () => renderAudit(),
  };
  if (map[name]) requestAnimationFrame(map[name]);
  if (window.innerWidth < 700) window.scrollTo({top:0,behavior:'smooth'});
}

function closeMoreMenu() {
  const menu = document.getElementById('nav-more-menu');
  const trigger = document.getElementById('nav-more');
  if (menu) menu.hidden = true;
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function toggleMoreMenu() {
  const menu = document.getElementById('nav-more-menu');
  const trigger = document.getElementById('nav-more');
  if (!menu || !trigger) return;
  menu.hidden = !menu.hidden;
  trigger.setAttribute('aria-expanded', String(!menu.hidden));
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMoreMenu();
});

function openSignalSearch() {
  goTo('history', null);
  requestAnimationFrame(() => {
    const input = el('f-sym');
    if (input) { input.focus(); input.scrollIntoView({behavior:'smooth',block:'center'}); }
  });
}
