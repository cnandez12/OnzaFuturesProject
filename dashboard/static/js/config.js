/* ════════════════════════════════════════════════════════════════════════════
   CONFIG & GLOBAL STATE
   ─ Loaded first; every other module reads/writes these globals.
════════════════════════════════════════════════════════════════════════════ */

/* Chart.js global defaults */
Chart.defaults.color       = '#7890aa';
Chart.defaults.borderColor = 'rgba(255,255,255,0.04)';

/* Observed dashboard configuration; scenario changes stay inside the simulator. */
const CFG = {
  balance0: parseFloat(document.querySelector('meta[name="cfg-balance"]')?.content || '1000'),
  margin:   parseFloat(document.querySelector('meta[name="cfg-margin"]')?.content  || '20'),
  leverage: parseInt(  document.querySelector('meta[name="cfg-leverage"]')?.content || '20'),
};
const TP_DIST = [0.40, 0.40, 0.20];

/* Shared data stores — populated by api.js, consumed by all renderers */
let trades  = [];
let openPos = [];
let stats   = {};
let symData = [];

/* Chart.js instances — managed by curve.js and simulator.js */
let chBal  = null;
let chPnl  = null;
let chBars = null;
let chSim  = null;
let chMonthly = null;
let activeYear = null;   // managed by curve.js monthly chart

/* Live pricing state — managed by open-positions.js */
let liveMarkPrices = {};
let lastMarkFetchAt = null;

/* Timer references — managed by timers.js */
let livePriceTimer   = null;
let autoRefreshTimer = null;
let pnlTimer         = null;
let pulseTimer       = null;

/* Pulse detection state — managed by timers.js */
let lastKnownTotal = 0;
let lastKnownClose = null;
let lastKnownOpenState = null;

/* Period filter — shared by Curve & History pages */
let activePeriod   = '7';   // default: Semana (7 días)
let customDateFrom = null;  // 'YYYY-MM-DD', used when activePeriod === 'custom'
let customDateTo   = null;

/* History pagination — managed by history.js */
let histPage = 1;
const HIST_PER_PAGE = 100;