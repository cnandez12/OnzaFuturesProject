/* ════════════════════════════════════════════════════════════════════════════
   UTILITY HELPERS
   ─ Pure functions used across all modules.
════════════════════════════════════════════════════════════════════════════ */

function el(id)  { return document.getElementById(id); }
function set(id, val) { const e = el(id); if (e) e.textContent = val; }
function setClass(id, cls) { const e = el(id); if (e) e.className = cls; }

/**
 * Parses a backend timestamp (opened_at/closed_at) as UTC, whether or not the
 * string carries an explicit offset. The bot/backend work entirely in UTC, but
 * depending on the DB column type the JSON string may or may not include a
 * 'Z'/offset suffix — without one, native `new Date(...)` parses date-time
 * strings in the BROWSER's local timezone, silently shifting every trade by
 * the viewer's UTC offset (wrong calendar day/month near midnight boundaries).
 * This guarantees a correct UTC instant either way.
 */
function parseUTC(s) {
  if (!s) return new Date(NaN);
  return /[Zz]|[+-]\d{2}:?\d{2}$/.test(s) ? new Date(s) : new Date(s + 'Z');
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ── Close reason helpers ──────────────────────────────────────────────── */

const REASON_LABELS = {
  'TP_FORCED': 'Closed', 'Closed': 'Closed',
  'SL_FORCED': 'SL Forced', 'SL': 'SL',
  'BREAKEVEN': 'Breakeven',
  'TP3': 'TP3', 'TP2': 'TP2', 'TP1': 'TP1',
};

function fmtReason(r) { return REASON_LABELS[r] || r || '—'; }

function reasonClass(r) {
  if (!r) return '';
  if (r === 'TP_FORCED' || r === 'Closed') return 'b-closed';
  if (r === 'SL_FORCED') return 'b-sl_forced';
  return 'b-' + r.toLowerCase();
}

/**
 * Composite scenario: combines hit_tp1/tp2 with close_reason.
 * Accepts both trade objects (close_reason) and simulator logRow objects (reason).
 */
function fmtScenario(t) {
  const tp1 = t.hit_tp1 || false;
  const tp2 = t.hit_tp2 || false;
  const raw = t.close_reason || t.reason || '';
  const r   = fmtReason(raw);

  if (r === 'TP3')       return 'TP1 + TP2 + TP3';
  if (r === 'Closed') {
    if (tp2)             return 'TP1 + TP2 + Closed';
    if (tp1)             return 'TP1 + Closed';
                         return 'Closed';
  }
  if (r === 'Breakeven') {
    if (tp2)             return 'TP1 + TP2 + BE';
    if (tp1)             return 'TP1 + BE';
                         return 'BE sin TP';
  }
  if (r === 'SL' || r === 'SL Forced') {
    if (tp2)             return 'TP1 + TP2 + SL';
    if (tp1)             return 'TP1 + SL';
                         return 'SL Directo';
  }
  return r;
}

/* ── Scenario color mapping ────────────────────────────────────────────── */

const SCENARIO_COLORS = {
  'TP1 + TP2 + TP3':    'var(--green)',
  'TP1 + TP2 + Closed': '#37f4b0',
  'TP1 + Closed':       '#7fffd0',
  'TP1 + TP2 + BE':     '#ffd166',
  'TP1 + BE':           'var(--amber)',
  'BE sin TP':          '#e8ad42',
  'TP1 + TP2 + SL':     '#ff995c',
  'TP1 + SL':           '#ffaf70',
  'SL Directo':         'var(--red)',
  'SL Forced':          '#ff91a4',
  'Closed':             '#37f4b0',
};

function scenarioColor(s) { return SCENARIO_COLORS[s] || 'var(--blue)'; }

/**
 * tradePct — always calculates % from real USDT / margin.
 * Corrects legacy records that had the bug of summing 3 pcts without 40/40/20 weighting.
 */
function tradePct(t, overrideMargin) {
  const usdt   = parseFloat(t.final_profit_usdt || 0);
  const margin = overrideMargin || parseFloat(t.margin_used || CFG.margin);
  if (margin > 0) return (usdt / margin) * 100;
  return parseFloat(t.final_profit_pct || 0);
}

/** Format a price with dynamic decimal precision. */
function fmtP(p) {
  if (p == null || p === '' || p === 'N/A') return '—';
  const f = parseFloat(p);
  if (isNaN(f)) return '—';
  if (f >= 1000)  return f.toLocaleString('en', {minimumFractionDigits:2, maximumFractionDigits:2});
  if (f >= 1)     return f.toFixed(4);
  if (f >= 0.001) return f.toFixed(6);
  return f.toFixed(8);
}

/* ── Period filter helper (shared by Curve & History) ──────────── */

const PERIOD_OPTIONS = [
  { value:'7',      label:'Semana' },
  { value:'30',     label:'30 días' },
  { value:'90',     label:'90 días' },
  { value:'180',    label:'180 días' },
  { value:'365',    label:'1 año' },
  { value:'all',    label:'Todo' },
  { value:'custom', label:'Personalizado' },
];

function filterByPeriod(arr, period, dateField) {
  if (period === 'all' || !period) return arr;
  if (period === 'custom') {
    if (!customDateFrom || !customDateTo) return arr;
    const from = new Date(customDateFrom);
    const to   = new Date(customDateTo + 'T23:59:59.999Z');
    return arr.filter(t => {
      const d = parseUTC(t[dateField || 'closed_at']);
      return d >= from && d <= to;
    });
  }
  const days = parseInt(period);
  if (isNaN(days)) return arr;
  const cutoff = new Date(Date.now() - days * 86400000);
  return arr.filter(t => parseUTC(t[dateField || 'closed_at']) >= cutoff);
}

function periodLabel(period) {
  if (period === 'custom') {
    if (!customDateFrom || !customDateTo) return 'Personalizado';
    const fmt = s => new Date(s).toLocaleDateString('es', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
    return fmt(customDateFrom) + ' → ' + fmt(customDateTo);
  }
  const opt = PERIOD_OPTIONS.find(o => o.value === period);
  return opt ? opt.label : period;
}

/**
 * Keeps the Curve & History period-bars in sync (same activePeriod state),
 * and shows/hides the custom date-range pickers on both pages.
 */
function syncPeriodBars() {
  document.querySelectorAll('.period-bar').forEach(bar => {
    bar.querySelectorAll('.period-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.period === activePeriod);
    });
  });

  const showRange = activePeriod === 'custom';
  document.querySelectorAll('.date-range-group').forEach(g => {
    g.style.display = showRange ? 'block' : 'none';
  });
  if (!showRange) return;

  if ((!customDateFrom || !customDateTo) && trades.length) {
    const sorted = [...trades].sort((a,b) => new Date(a.closed_at)-new Date(b.closed_at));
    customDateFrom = customDateFrom || sorted[0].closed_at.slice(0,10);
    customDateTo   = customDateTo   || new Date().toISOString().slice(0,10);
  }
  ['hist-date-from','curve-date-from'].forEach(id => { if (el(id)) el(id).value = customDateFrom || ''; });
  ['hist-date-to','curve-date-to'].forEach(id   => { if (el(id)) el(id).value = customDateTo   || ''; });
}

/** Called by the date <input> fields on the Curve/History custom range pickers. */
function onCustomDateChange(fromId, toId) {
  customDateFrom = el(fromId).value || null;
  customDateTo   = el(toId).value   || null;
  syncPeriodBars();
  histPage = 1;
  const active = document.querySelector('.page.active')?.id?.replace('pg-','');
  if (active === 'curve')   renderCurve();
  if (active === 'history') renderHistory();
}

function initPeriodButtons(containerId, onChange) {
  const c = el(containerId);
  if (!c) return;
  c.addEventListener('click', (e) => {
    const btn = e.target.closest('.period-btn');
    if (!btn) return;
    c.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePeriod = btn.dataset.period;
    if (onChange) onChange();
  });
  // Set initial active
  const dflt = c.querySelector(`.period-btn[data-period="${activePeriod}"]`);
  if (dflt) dflt.classList.add('active');
}
