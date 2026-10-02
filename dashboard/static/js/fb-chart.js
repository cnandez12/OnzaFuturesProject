/* ════════════════════════════════════════════════════════════════════════════
   FB-CHART MODULE (Lightweight Charts + Bitunix WS + Signal Zones)
   ─ Self-contained: manages its own state, WebSocket, and DOM elements.
════════════════════════════════════════════════════════════════════════════ */

const FB_REST = '/api/bitunix/kline';
const FB_WS   = 'wss://fapi.bitunix.com/public/';
const FB_WS_INTERVAL = {'1m':'1min','5m':'5min','15m':'15min','30m':'30min','1h':'60min','4h':'4h','1d':'1day'};
const FB_CANDLES = 1800;
const FB_CHUNK   = 200;
const FB_TF_MS = {'1m':60000,'5m':300000,'15m':900000,'30m':1800000,'1h':3600000,'4h':14400000,'1d':86400000};

let fbChart=null, fbCandles=null, fbVolume=null;
let fbState = {
  symbol:'', interval:'15m', tf:'15', tzOff:-5, chartType:'heikinashi',
  data:[], ws:null, reconnect:true, inited:false,
  signals:{closed:[],open:[]}, pollRef:null, lastPoll:null,
  markers:[], priceLines:[], _zonesData:null,
  pairs:[], openSyms:new Set()};

function fbCurrentExchange() {
  return 'BITUNIX';
}

/* Abre el Chart para un símbolo dado, SIEMPRE en M15.
   Lo llaman las tarjetas de la pestaña Símbolos y las de En vivo. */
async function fbOpenSymbol(symbol) {
  const raw = (symbol || '').replace('/', '').toUpperCase();
  if (!raw) return;

  // Activar pestaña Chart (sin depender del init no-esperado de goTo)
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  const pg = document.getElementById('pg-chart');
  if (pg) pg.classList.add('active');
  const chartBtn = [...document.querySelectorAll('.nav-tab')].find(b => /chart/i.test(b.textContent));
  if (chartBtn) chartBtn.classList.add('active');

  await initFBChart();   // idempotente: si ya está, solo redimensiona

  // Forzar M15
  fbState.tf = '15';
  fbState.interval = '15m';

  // Seleccionar símbolo en el dropdown (lo agrega a la lista si no estaba)
  if (!(fbState.pairs||[]).some(p => p.raw === raw)) {
    (fbState.pairs = fbState.pairs || []).push({
      raw, display: raw.length > 4 ? `${raw.slice(0,-4)}/${raw.slice(-4)}` : raw,
      exchange: 'BITUNIX'
    });
  }
  fbState.symbol = raw;
  await fbLoadOpenSymbols();
  fbBuildSymbolDropdown();

  // Marcar el botón 15m activo + leyenda
  document.querySelectorAll('#chartTfGroup .ct-tf').forEach(b => b.classList.toggle('active', b.dataset.iv === '15m'));
  const tfBtn = document.querySelector('#chartTfGroup .ct-tf[data-iv="15m"]');
  const clTf = document.getElementById('clTf');
  if (clTf) clTf.textContent = tfBtn ? `· ${tfBtn.textContent}` : '· 15m';

  await fbReload();
}

async function initFBChart() {
  if (fbState.inited && fbChart) {
    fbChart.resize(
      document.getElementById('fb-chart-container').clientWidth,
      document.getElementById('fb-chart-container').clientHeight
    );
    return;
  }
  await fbLoadPairs();
  fbCreateChart();
  fbInitControls();
  await fbLoadData();
  fbState.inited = true;
}

async function fbLoadPairs() {
  try {
    const pairs = await fetchJson('/api/chart/pairs');
    let list;
    if (!pairs || !pairs.length) {
      list = [{raw:'BTCUSDT', display:'BTC/USDT'}];
    } else {
      list = pairs.map(p => {
        const raw = (p.pair||'').replace('/','');
        const display = (p.pair||'').includes('/') ? p.pair : `${raw.slice(0,-4)}/${raw.slice(-4)}`;
        return {raw, display, exchange:'BITUNIX'};
      });
    }
    fbState.pairs  = list;
    fbState.symbol = list[0].raw;
  } catch(e) {
    console.error('Chart pairs error:', e);
    fbState.pairs  = [{raw:'BTCUSDT', display:'BTC/USDT'}];
    fbState.symbol = 'BTCUSDT';
  }
  await fbLoadOpenSymbols();
  fbBuildSymbolDropdown();
}

/* Símbolos con operación abierta actualmente (tabla trades, close=FALSE) */
async function fbLoadOpenSymbols() {
  try {
    const open = await fetchJson('/api/sim/open');
    fbState.openSyms = new Set((open||[]).map(o => (o.pair||'').replace('/','').toUpperCase()));
  } catch(e) {
    fbState.openSyms = fbState.openSyms || new Set();
  }
}

/* Pinta el dropdown personalizado: etiqueta del trigger + filas con indicador
   "● Open" (titilante, amarillo) en los símbolos que tengan trade abierto. */
function fbBuildSymbolDropdown() {
  const label = document.getElementById('chartSymbolLabel');
  const menu  = document.getElementById('chartSymbolMenu');
  if (!menu) return;
  const open = fbState.openSyms || new Set();
  const cur  = fbState.symbol;

  const curPair = (fbState.pairs||[]).find(p => p.raw === cur);
  if (label) label.textContent = curPair ? curPair.display : (cur || '—');

  menu.innerHTML = (fbState.pairs||[]).map(p => {
    const isOpen = open.has(p.raw.toUpperCase());
    const isSel  = p.raw === cur;
    return `<div class="fb-dd-row${isSel?' sel':''}" data-raw="${p.raw}">
      <span>${p.display}</span>
      ${isOpen ? '<span class="fb-open"><span class="dot"></span>Open</span>' : ''}
    </div>`;
  }).join('');
}

function fbCreateChart() {
  const c = document.getElementById('fb-chart-container');
  if (fbChart) { fbChart.remove(); fbChart=null; }

  fbChart = LightweightCharts.createChart(c, {
    width: c.clientWidth, height: c.clientHeight,
    layout: { background:{type:'solid',color:'#02050d'}, textColor:'#7890aa',
              fontFamily:"'Inter',sans-serif", fontSize:11 },
    grid: { vertLines:{color:'#091426',style:0}, horzLines:{color:'#0d1b30',style:0} },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
      vertLine:{color:'#3b3f4a',width:1,style:LightweightCharts.LineStyle.Dashed,labelBackgroundColor:'#2688ff'},
      horzLine:{color:'#3b3f4a',width:1,style:LightweightCharts.LineStyle.Dashed,labelBackgroundColor:'#2688ff'},
    },
    timeScale: { timeVisible:true, secondsVisible:false, borderColor:'#19334f',
                 rightOffset:25, barSpacing:7, minBarSpacing:2 },
    rightPriceScale: { borderColor:'#19334f', scaleMargins:{top:0.08,bottom:0.18} },
    watermark: { visible:false },
    handleScroll:{mouseWheel:true,pressedMouseMove:true},
    handleScale:{mouseWheel:true,pinch:true,axisPressedMouseMove:true},
  });

  fbCandles = fbChart.addCandlestickSeries({
    upColor:'#37f4b0', downColor:'#ff5470',
    borderUpColor:'#37f4b0', borderDownColor:'#ff5470',
    wickUpColor:'#37f4b0', wickDownColor:'#ff5470',
    priceLineVisible:true, priceLineWidth:1, lastValueVisible:false,
    priceLineStyle:LightweightCharts.LineStyle.Dashed,
  });

  fbVolume = fbChart.addHistogramSeries({
    priceFormat:{type:'volume'}, priceScaleId:'',
  });
  fbVolume.priceScale().applyOptions({ scaleMargins:{top:0.85,bottom:0} });

  fbChart.subscribeCrosshairMove(fbOnCrosshair);

  const ro = new ResizeObserver(() => {
    if (fbChart) fbChart.applyOptions({ width:c.clientWidth, height:c.clientHeight });
  });
  ro.observe(c);

  // Logo Watermark
  const wm = document.createElement('div');
  wm.id = 'fb-watermark';
  wm.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;pointer-events:none;z-index:1;';
  wm.innerHTML = `
    <img src="/static/logo.png" alt="" style="width:460px;height:460px;object-fit:contain;opacity:0.06;" onerror="this.style.display='none'">
    <div id="fb-wm-sym" style="font-family:'Inter',sans-serif;font-size:52px;font-weight:700;color:rgba(255,255,255,0.04);margin-top:6px;letter-spacing:-0.5px;"></div>
  `;
  c.appendChild(wm);

  // Panel estadístico por símbolo (esquina superior derecha)
  const sp = document.createElement('div');
  sp.id = 'fb-stats-panel';
  sp.style.cssText = 'position:absolute;top:8px;right:74px;z-index:20;width:238px;'+
    'background:rgba(11,13,20,0.92);border:1px solid rgba(255,255,255,0.09);'+
    'border-radius:8px;padding:11px 13px;backdrop-filter:blur(4px);'+
    "font-family:'Inter',sans-serif;box-shadow:0 8px 26px rgba(0,0,0,0.45);pointer-events:none;display:none;";
  c.appendChild(sp);
}

function fbInitControls() {
  // ── Dropdown de símbolos (custom, con indicador "Open" titilante) ──
  const ddBtn  = document.getElementById('chartSymbolBtn');
  const ddMenu = document.getElementById('chartSymbolMenu');
  if (ddBtn && ddMenu) {
    ddBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const opening = ddMenu.style.display !== 'block';
      if (opening) {
        await fbLoadOpenSymbols();          // refrescar qué símbolos están abiertos
        fbBuildSymbolDropdown();
        const r = ddBtn.getBoundingClientRect();
        ddMenu.style.left = r.left + 'px';
        ddMenu.style.top  = (r.bottom + 4) + 'px';
        ddMenu.style.display = 'block';
      } else {
        ddMenu.style.display = 'none';
      }
    });
    ddMenu.addEventListener('click', (e) => {
      const row = e.target.closest('.fb-dd-row');
      if (!row) return;
      ddMenu.style.display = 'none';
      const raw = row.dataset.raw;
      if (raw && raw !== fbState.symbol) {
        fbState.symbol = raw;
        fbBuildSymbolDropdown();
        fbReload();
      }
    });
    document.addEventListener('click', () => { ddMenu.style.display = 'none'; });
  }

  document.getElementById('chartTfGroup').addEventListener('click', (e) => {
    const btn = e.target.closest('.ct-tf');
    if (!btn) return;
    document.querySelectorAll('#chartTfGroup .ct-tf').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    fbState.tf = btn.dataset.tf;
    fbState.interval = btn.dataset.iv;
    document.getElementById('clTf').textContent = `· ${btn.textContent}`;
    fbReload();
  });
  // ── Tipo de gráfico: Velas / Heikin Ashi (solo re-pinta, no recarga) ──
  const ctg = document.getElementById('chartTypeGroup');
  if (ctg) ctg.addEventListener('click', (e) => {
    const btn = e.target.closest('.ct-tf');
    if (!btn) return;
    ctg.querySelectorAll('.ct-tf').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    fbState.chartType = btn.dataset.ctype;
    fbBuildSeriesData();
  });
}

async function fbLoadData() {
  const iv = fbState.interval;
  const ms = FB_TF_MS[iv];
  if (!ms || !fbState.symbol) return;

  const now = Date.now();
  const chunkSize = FB_CHUNK;
  const chunks = Math.ceil(FB_CANDLES / chunkSize);
  const globalStart = now - FB_CANDLES * ms;
  const reqs = [];
  for (let i=0; i<chunks; i++) {
    const st = globalStart + i * chunkSize * ms;
    const url = `${FB_REST}?symbol=${encodeURIComponent(fbState.symbol)}&interval=${iv}&startTime=${st}&endTime=${st + chunkSize*ms - 1}`;
    reqs.push(fetch(url).then(r=>r.ok?r.json():[])
      .then(result => Array.isArray(result) ? result : [])
      .catch(()=>[]));
  }
  const results = await Promise.all(reqs);
  const all = [];
  for (const raw of results) for (const k of raw)
    all.push({time:(Number(k.time)/1000)+(fbState.tzOff*3600),open:+k.open,high:+k.high,low:+k.low,close:+k.close,volume:+k.baseVol});

  const seen = new Set();
  fbState.data = all.filter(c => { if(seen.has(c.time))return false; seen.add(c.time); return true; })
    .sort((a,b)=>a.time-b.time);

  fbRender();
  fbConnectWS();
  fbStartSignalPoll();
  fbStartCountdown();
  fbUpdateLegend();
  fbLoadSymbolStats();
  document.getElementById('clSym').textContent = fbState.symbol;
  const wmSym = document.getElementById('fb-wm-sym');
  if (wmSym) wmSym.textContent = fbState.symbol.replace('USDT',' / USDT');
}

function fbRender() {
  const d = fbState.data;
  if (!d.length) return;

  // Dynamic precision based on actual price
  const lastPrice = d[d.length-1].close;
  let prec=2, minMv=0.01;
  if (lastPrice < 0.01)       { prec=8; minMv=0.00000001; }
  else if (lastPrice < 0.1)   { prec=6; minMv=0.000001; }
  else if (lastPrice < 1)     { prec=5; minMv=0.00001; }
  else if (lastPrice < 10)    { prec=4; minMv=0.0001; }
  else if (lastPrice < 1000)  { prec=3; minMv=0.001; }
  fbCandles.applyOptions({ priceFormat:{type:'price', precision:prec, minMove:minMv} });

  fbBuildSeriesData();
  fbChart.timeScale().fitContent();
  fbChart.timeScale().applyOptions({rightOffset:25});
  fbChart.timeScale().scrollToRealTime();
  fbLoadSignals();
}

/* Construye/aplica los datos de las series según el tipo de gráfico.
   Heikin Ashi se DERIVA de fbState.data (OHLCV real) solo para mostrar;
   las zonas/señales siguen usando precios reales, así que no cambian.
   Se llama también al alternar Velas↔Heikin Ashi (re-pinta sin recargar). */
function fbBuildSeriesData() {
  const d = fbState.data;
  if (!fbCandles || !d || !d.length) return;
  const candleData = (fbState.chartType === 'heikinashi')
    ? fbToHeikinAshi(d)
    : d.map(c=>({time:c.time,open:c.open,high:c.high,low:c.low,close:c.close}));
  fbCandles.setData(candleData);
  fbVolume.setData(d.map(c=>({
    time:c.time, value:c.volume,
    color: c.close>=c.open ? 'rgba(55,244,176,0.18)' : 'rgba(255,84,112,0.18)',
  })));
}

/* Heikin Ashi: haClose=(O+H+L+C)/4 · haOpen=(haOpen_prev+haClose_prev)/2 ·
   haHigh=max(H,haOpen,haClose) · haLow=min(L,haOpen,haClose). El volumen y los
   colores se mantienen sobre el OHLCV real. */
function fbToHeikinAshi(data) {
  const ha = [];
  let prev = null;
  for (const c of data) {
    const haClose = (c.open + c.high + c.low + c.close) / 4;
    const haOpen  = prev ? (prev.open + prev.close) / 2 : (c.open + c.close) / 2;
    const haHigh  = Math.max(c.high, haOpen, haClose);
    const haLow   = Math.min(c.low,  haOpen, haClose);
    const cd = { time:c.time, open:haOpen, high:haHigh, low:haLow, close:haClose };
    ha.push(cd);
    prev = cd;
  }
  return ha;
}

/* ════════════════════════════════════════════════════════════════════════════
   PANEL ESTADÍSTICO POR SÍMBOLO — en % real (no USD)
   Mismo concepto que las tarjetas de la pestaña Símbolos, anclado al chart.
════════════════════════════════════════════════════════════════════════════ */
async function fbLoadSymbolStats() {
  const panel = document.getElementById('fb-stats-panel');
  if (!panel || !fbState.symbol) return;
  try {
    const s = await fetchJson(`/api/chart/symbol_stats?symbol=${encodeURIComponent(fbState.symbol)}`);
    fbRenderStatsPanel(s || {});
  } catch(e) { /* silencioso */ }
}

function fbRenderStatsPanel(s) {
  const panel = document.getElementById('fb-stats-panel');
  if (!panel) return;
  panel.style.display = 'block';

  const sym   = (fbState.symbol||'').replace('USDT','/USDT');
  const total = +s.total || 0;
  const DIM='#7890aa', TXT='#eaf6ff', TXT2='#a0b5ca', G='#37f4b0', R='#ff5470', A='#ffd166';

  if (!total) {
    panel.innerHTML =
      `<div style="display:flex;align-items:center;justify-content:space-between;">
         <span style="font-weight:700;font-size:12px;color:${TXT};">${sym}</span>
         <span style="font-size:9px;color:${DIM};font-weight:600;letter-spacing:.5px;">ESTADÍSTICAS</span>
       </div>
       <div style="margin-top:10px;font-size:11px;color:${DIM};text-align:center;padding:4px 0;">Sin operaciones registradas</div>`;
    return;
  }

  const wins=+s.wins||0, losses=+s.losses||0;
  const totalPct=+s.total_pct||0, avgPct=+s.avg_pct||0;
  const best=+s.best_pct||0, worst=+s.worst_pct||0;
  const gw=+s.gross_win||0, gl=+s.gross_loss||0;
  const wr = total ? (wins/total*100) : 0;
  const pf = gl>0 ? (gw/gl) : (gw>0 ? Infinity : 0);
  const sgn = v => v>=0 ? '+' : '';
  const pfTxt = pf===Infinity ? '∞' : pf.toFixed(2);
  const wrColor  = wr>=65?G:wr>=50?A:R;
  const netColor = totalPct>=0?G:R;
  const pfColor  = pf>=2?G:pf>=1?A:R;

  const cell = (label,val,col) =>
    `<div><div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:14px;color:${col};">${val}</div>
     <div style="font-size:8px;color:${DIM};margin-top:2px;letter-spacing:.4px;">${label}</div></div>`;

  panel.innerHTML =
    `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;">
       <span style="display:flex;align-items:center;gap:6px;font-weight:700;font-size:12px;color:${TXT};">
         <span style="width:6px;height:6px;border-radius:50%;background:${netColor};box-shadow:0 0 6px ${netColor};"></span>${sym}
       </span>
       <span style="font-size:9.5px;color:${DIM};font-weight:600;">${total} ops</span>
     </div>
     <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:25px;line-height:1;color:${netColor};">${sgn(totalPct)}${totalPct.toFixed(2)}%</div>
     <div style="font-size:8.5px;color:${DIM};margin-top:3px;letter-spacing:.4px;text-transform:uppercase;">Resultado simulado bruto acumulado</div>
     <div style="height:1px;background:rgba(255,255,255,0.07);margin:9px 0;"></div>
     <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;text-align:center;">
       ${cell('WIN RATE', wr.toFixed(0)+'%', wrColor)}
       ${cell('PROM/OP', sgn(avgPct)+avgPct.toFixed(1)+'%', avgPct>=0?G:R)}
       ${cell('P. FACTOR', pfTxt, pfColor)}
     </div>
     <div style="height:1px;background:rgba(255,255,255,0.07);margin:9px 0;"></div>
     <div style="display:flex;align-items:center;justify-content:space-between;font-size:10.5px;margin-bottom:4px;">
       <span style="color:${G};font-weight:600;">✓ ${wins} ganadas</span>
       <span style="color:${R};font-weight:600;">✗ ${losses} perdidas</span>
     </div>
     <div style="display:flex;align-items:center;justify-content:space-between;font-size:10px;color:${TXT2};">
       <span>Mejor <b style="color:${G};">+${best.toFixed(1)}%</b></span>
       <span>Peor <b style="color:${R};">${worst.toFixed(1)}%</b></span>
     </div>`;
}

/* ── WebSocket (exponential backoff + heartbeat + debounced OFF) ── */
let _wsLastMsg     = 0;
let _wsHeartbeatId = null;
let _wsPingId      = null;
let _wsOffTimeout  = null;
let _wsRetryCount  = 0;
const WS_HEARTBEAT_MS = 10000;
const WS_STALE_MS     = 60000;
const WS_OFF_DELAY_MS = 8000;
const WS_MAX_RETRY_MS = 30000;

function fbConnectWS() {
  fbDisconnectWS(true);
  fbState.reconnect = true;
  const sock = new WebSocket(FB_WS);   // referencia local → guard de identidad
  fbState.ws = sock;

  sock.onopen = () => {
    if (fbState.ws !== sock) { try{sock.close();}catch(e){} return; }  // socket superado
    _wsRetryCount = 0;
    _wsLastMsg = Date.now();
    fbCancelOffTimer();
    fbSetLive(true);
    fbStartHeartbeat();
    sock.send(JSON.stringify({op:'subscribe', args:[{symbol:fbState.symbol, ch:`market_kline_${FB_WS_INTERVAL[fbState.interval]}`}]}));
    _wsPingId = setInterval(() => {
      if (fbState.ws === sock && sock.readyState === WebSocket.OPEN)
        sock.send(JSON.stringify({op:'ping', ping:Math.floor(Date.now()/1000)}));
    }, 20000);
  };

  sock.onmessage = (evt) => {
    if (fbState.ws !== sock) return;  // ignorar mensajes de un socket viejo
    _wsLastMsg = Date.now();
    fbCancelOffTimer();
    fbSetLive(true);

    const message = JSON.parse(evt.data);
    if (message.ch !== `market_kline_${FB_WS_INTERVAL[fbState.interval]}` || message.symbol !== fbState.symbol || !message.data) return;
    const k = message.data;
    const candleStart = Math.floor(Number(message.ts) / FB_TF_MS[fbState.interval]) * FB_TF_MS[fbState.interval];
    if (!Number.isFinite(candleStart)) return;
    const c = {
      time: Math.floor(candleStart/1000)+(fbState.tzOff*3600),
      open:+k.o, high:+k.h, low:+k.l, close:+k.c, volume:+k.b,
    };

    // Mantener fbState.data EXACTO (Heikin Ashi se deriva de él)
    const last = fbState.data[fbState.data.length-1];
    if (last && last.time===c.time) {
      Object.assign(last, c);
    } else if (!last || c.time > last.time) {
      fbState.data.push({...c});
      if (fbState.data.length>FB_CANDLES+100) fbState.data.shift();
    }

    // Pintar la última vela según el tipo de gráfico
    if (fbState.chartType === 'heikinashi') {
      const ha = fbToHeikinAshi(fbState.data);
      if (ha.length) fbCandles.update(ha[ha.length-1]);
    } else {
      fbCandles.update({time:c.time,open:c.open,high:c.high,low:c.low,close:c.close});
    }
    fbVolume.update({time:c.time,value:c.volume,
      color:c.close>=c.open?'rgba(55,244,176,0.18)':'rgba(255,84,112,0.18)'});
    fbUpdateLegend();
    fbTickCountdown();   // re-sincronizar etiqueta de precio con la línea, en cada tick
  };

  sock.onerror = () => {};

  sock.onclose = () => {
    if (fbState.ws !== sock) return;  // un socket superado al cerrar NO reconecta
    fbStopHeartbeat();
    fbScheduleOff();
    if (fbState.reconnect) {
      const delay = Math.min(1000 * Math.pow(1.5, _wsRetryCount), WS_MAX_RETRY_MS);
      _wsRetryCount++;
      setTimeout(() => { if (fbState.reconnect) fbConnectWS(); }, delay);
    }
  };
}

function fbStartHeartbeat() {
  fbStopHeartbeat();
  _wsHeartbeatId = setInterval(() => {
    if (Date.now() - _wsLastMsg > WS_STALE_MS && fbState.ws) {
      fbState.ws.close();
    }
  }, WS_HEARTBEAT_MS);
}
function fbStopHeartbeat() { if (_wsHeartbeatId) { clearInterval(_wsHeartbeatId); _wsHeartbeatId = null; } }
function fbScheduleOff() { if (!_wsOffTimeout) _wsOffTimeout = setTimeout(() => { _wsOffTimeout = null; fbSetLive(false); }, WS_OFF_DELAY_MS); }
function fbCancelOffTimer() { if (_wsOffTimeout) { clearTimeout(_wsOffTimeout); _wsOffTimeout = null; } }

function fbDisconnectWS(keepReconnect) {
  if (!keepReconnect) fbState.reconnect = false;
  fbCancelOffTimer();
  fbStopHeartbeat();
  if (_wsPingId) { clearInterval(_wsPingId); _wsPingId = null; }
  _wsRetryCount = 0;
  if(fbState.ws){fbState.ws.close();fbState.ws=null;}
}
function fbSetLive(on) {
  const el = document.getElementById('chartLive');
  if (!el) return;
  el.querySelector('span:last-child').textContent = on?'LIVE':'OFF';
  el.style.background = on?'rgba(55,244,176,0.08)':'rgba(255,84,112,0.08)';
  el.style.borderColor = on?'rgba(55,244,176,0.15)':'rgba(255,84,112,0.15)';
  const dot = el.querySelector('span:first-child');
  dot.style.background = on?'var(--green)':'var(--red)';
}

/* ── Signals polling ── */
function fbStartSignalPoll() {
  if (fbState.pollRef) clearInterval(fbState.pollRef);
  fbState.lastPoll = null;
  fbState.pollRef = setInterval(fbPollChanges, 3000);
}
async function fbPollChanges() {
  if (!fbState.symbol) return;
  try {
    const p = await fetchJson(`/api/chart/poll?symbol=${fbState.symbol}`);
    const key = `${p.open_count}_${p.last_closed}_${p.last_opened}_${p.open_state}`;
    if (fbState.lastPoll && key !== fbState.lastPoll) {
      fbLoadSignals();
      fbLoadSymbolStats();
      fbLoadOpenSymbols().then(fbBuildSymbolDropdown);
    }
    fbState.lastPoll = key;
  } catch(e) {}
}

/* ── Load & draw signals ── */
async function fbLoadSignals() {
  if (!document.getElementById('chartShowSignals').checked) {
    fbClearSignals();
    return;
  }
  try {
    const res = await fetchJson(`/api/chart/signals?symbol=${fbState.symbol}`);
    fbState.signals = res;
    fbDrawSignals();
  } catch(e) { console.error('Signals error:', e); }
}

function fbClearSignals() {
  fbStopZoneSync();
  fbState.priceLines.forEach(l => { try{fbCandles.removePriceLine(l);}catch(e){} });
  fbState.priceLines = [];
  fbState.markers = [];
  fbState._zonesData = null;
  if (fbCandles) fbCandles.setMarkers([]);
  const zoneContainer = document.getElementById('fb-zones');
  if (zoneContainer) zoneContainer.innerHTML = '';
}

/**
 * Find the exact candle where price hit a TP level.
 * Scans fbState.data between afterTime and beforeTime.
 * For LONG: first candle where high >= tpPrice
 * For SHORT: first candle where low <= tpPrice
 * Returns the candle's time, or null if not found.
 */
function fbFindTPHitCandle(tpPrice, afterTime, beforeTime, isLong) {
  const data = fbState.data;
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    if (c.time < afterTime) continue;
    if (c.time > beforeTime) break;
    if (isLong && c.high >= tpPrice) return c.time;
    if (!isLong && c.low <= tpPrice) return c.time;
  }
  return null;
}

function fbDrawSignals() {
  fbClearSignals();

  // Merge + DEDUPLICATE
  const closed = (fbState.signals.closed||[]).map(s=>({...s, _open:false}));
  const open   = (fbState.signals.open||[]).map(s=>({...s, _open:true}));
  const merged = [...closed, ...open];

  const seen = new Set();
  const all = merged.filter(s => {
    if (!s.opened_at) return true;
    const key = `${s.symbol}_${s.opened_at}_${(s.direction||'').toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!all.length) return;

  let zc = document.getElementById('fb-zones');
  if (!zc) {
    zc = document.createElement('div');
    zc.id = 'fb-zones';
    zc.style.cssText = 'position:absolute;top:0;left:0;right:65px;bottom:28px;pointer-events:none;overflow:hidden;z-index:20;';
    document.getElementById('fb-chart-container').appendChild(zc);
  }

  const decs = fbDecimals(fbState.symbol);
  const zones = [];

  // Pine Script colors
  const C_AMBER='rgba(255,209,102,', C_CORAL='rgba(255,84,112,', C_GREEN='rgba(55,244,176,', C_AMBR_BR='rgba(255,209,102,';

  for (const sig of all) {
    const entry = parseFloat(sig.entry_price || sig.entry || 0);
    if (!entry || isNaN(entry) || entry===0) continue;
    const sl=parseFloat(sig.current_sl || sig.stop_loss)||0, tp1=parseFloat(sig.tp1)||0,
          tp2=parseFloat(sig.tp2)||0, tp3=parseFloat(sig.tp3)||0;
    const dirLower = (sig.direction||'').toLowerCase();
    const isL = dirLower==='long' || dirLower==='buy';
    const isOpen = sig._open;

    let tO = sig.opened_at ? Math.floor(new Date(sig.opened_at).getTime()/1000)+(fbState.tzOff*3600) : null;
    let tC = sig.closed_at ? Math.floor(new Date(sig.closed_at).getTime()/1000)+(fbState.tzOff*3600) : null;
    if (!tO) continue;
    if (isOpen && fbState.data.length) tC = fbState.data[fbState.data.length-1].time+(FB_TF_MS[fbState.interval]/1000)*8;
    if (!tC) tC = tO+86400;

    // Snap tO to nearest candle time (timeToCoordinate requires exact data times)
    let anchorCandle = null;
    if (fbState.data.length) {
      let bestT = fbState.data[0].time, bestC = fbState.data[0];
      for (const cd of fbState.data) {
        if (Math.abs(cd.time - tO) < Math.abs(bestT - tO)) { bestT = cd.time; bestC = cd; }
        if (cd.time > tO + 300) break;
      }
      tO = bestT; anchorCandle = bestC;
    }

    // ROI% calculator (with leverage)
    const roi = (t)=> ((Math.abs(t-entry)/entry)*100*Number(sig.leverage || CFG.leverage)).toFixed(2);

    // ── Entry tag: BUY/SELL pill anclado a la vela de entrada ──
    // SELL se sienta SOBRE la vela (ancla = high); BUY DEBAJO (ancla = low).
    // Se dibuja en el overlay y se reposiciona cada frame → nunca se despega.
    const anchorPrice = anchorCandle ? (isL ? anchorCandle.low : anchorCandle.high) : entry;
    zones.push({ type:'sigtag', time:tO, price:anchorPrice, isLong:isL,
                 text: isL ? '▲▲ BUY' : '▼▼ SELL' });

    // ══════════════════════════════════════════════════════════════════
    //  SEÑAL ABIERTA (EN EJECUCIÓN) — proyección completa de zonas.
    //  Zona roja Entry→SL + zonas verdes Entry→TP1→TP2→TP3 (proyectadas ~8
    //  velas al futuro vía tC) + etiquetas de precio a la derecha (rtag).
    //  BREAK-EVEN: al tocar TP1 (hit_tp1 / be_active) la zona roja DESAPARECE
    //  y la entrada pasa a "ENTRY + BE" (el SL queda en el Entry).
    // ══════════════════════════════════════════════════════════════════
    if (isOpen) {

      // BREAK-EVEN: se activa al tocar TP1 (o si el backend ya marcó be_active)
      const beActive = !!sig.be_active;
      const hit1 = !!sig.hit_tp1, hit2 = !!sig.hit_tp2, hit3 = !!sig.hit_tp3;

      // ── RIESGO: zona roja Entry→SL · SOLO si NO está en break-even ──
      if (sl>0 && !beActive) {
        zones.push({type:'box',  tO, tC, p1:entry, p2:sl, bg:`${C_CORAL}0.10)`, border:`${C_CORAL}0.28)`});
        zones.push({type:'line', tO, tC, price:sl, color:`${C_CORAL}0.70)`, dash:true});
        zones.push({type:'rtag', tC, price:sl, accent:'#FF5470', icon:'⨯',
          text:`SL  ${sl.toFixed(decs)}  (-${roi(sl)}%)`});
      }

      // ── ENTRADA (ámbar). En break-even se refuerza y rotula "ENTRY + BE" ──
      zones.push({type:'line', tO, tC, price:entry,
        color:`${C_AMBER}${beActive?'0.95)':'0.80)'}`, dash:false, width: beActive?2:1.5});
      zones.push({type:'rtag', tC, price:entry, accent:'#FFD166', icon:'▶',
        text: beActive ? `ENTRY + BE  ${entry.toFixed(decs)}` : `ENTRY  ${entry.toFixed(decs)}`});

      // ── ZONAS VERDES apiladas Entry→TP1→TP2→TP3 (sólida+brillante si ya tocó) ──
      const tpStack = [
        {val:tp1, n:1, from:entry,             hit:hit1},
        {val:tp2, n:2, from:tp1||entry,        hit:hit2},
        {val:tp3, n:3, from:tp2||tp1||entry,   hit:hit3},
      ];
      for (const tp of tpStack) {
        if (!tp.val || tp.val===0) continue;
        zones.push({type:'box', tO, tC, p1:tp.from, p2:tp.val,
          bg:`${C_GREEN}${tp.hit?'0.16)':'0.09)'}`, border:`${C_GREEN}0.22)`});
        const lineCol = tp.n===3 ? C_AMBR_BR : C_GREEN;
        zones.push({type:'line', tO, tC, price:tp.val,
          color:`${lineCol}${tp.hit?'0.95)':'0.70)'}`, dash:!tp.hit, width: tp.n===3?2:1});
        const acc = tp.n===3 ? '#FFD166' : '#37F4B0';
        zones.push({type:'rtag', tC, price:tp.val, accent:acc, icon: tp.n===3?'★':'✓',
          text:`TP${tp.n}  ${tp.val.toFixed(decs)}  (+${roi(tp.val)}%)`});
      }

    // ══════════════════════════════════════════════════════════════════
    //  HISTORICAL SIGNAL — SOLO etiqueta de resultado (sin sombras ni líneas)
    // ══════════════════════════════════════════════════════════════════
    } else {

      // ── SIN SOMBRAS NI LÍNEAS en históricos ──
      // Las zonas/sombras (box) y líneas SOLO se dibujan en señales ABIERTAS.
      // Las cerradas conservan únicamente su etiqueta de resultado (abajo),
      // anclada a su vela, para no ensuciar el chart con divisas ya cerradas.

      // ── Determine scenario text (like DB: TP1+TP2+TP3, etc.) ──
      const scenario = typeof fmtScenario === 'function' ? fmtScenario(sig) : 'CLOSED';

      // ── Una etiqueta por operación con el P&L simulado guardado ──
      // final_profit_pct ya refleja cuánto se ganó/perdió según los TP tocados
      // y el cierre del remanente (NO el ROI a objetivo completo). Es el mismo
      // valor de la columna "P&L %" del Historial.
      const realPct = (sig.final_profit_pct !== undefined && sig.final_profit_pct !== null)
        ? parseFloat(sig.final_profit_pct) : null;

      // Mejor TP alcanzado (para anclar/colorear) y si tocó SL
      const bestTP = sig.hit_tp3 ? {n:3, val:tp3} :
                     sig.hit_tp2 ? {n:2, val:tp2} :
                     sig.hit_tp1 ? {n:1, val:tp1} : null;
      const wasSL = sl > 0 && (sig.close_reason === 'SL' || sig.close_reason === 'SL_FORCED');

      // Anclaje: vela donde tocó su mejor TP; si no hubo TP, donde tocó el SL; si no, tC
      let anchorPrice, anchorTime;
      if (bestTP && bestTP.val > 0) {
        let searchAfter = tO;
        if (bestTP.n >= 2 && tp1 > 0) { const t1c = fbFindTPHitCandle(tp1, searchAfter, tC, isL); if (t1c) searchAfter = t1c; }
        if (bestTP.n >= 3 && tp2 > 0) { const t2c = fbFindTPHitCandle(tp2, searchAfter, tC, isL); if (t2c) searchAfter = t2c; }
        anchorPrice = bestTP.val;
        anchorTime  = fbFindTPHitCandle(bestTP.val, searchAfter, tC, isL) || tC;
      } else if (wasSL) {
        anchorPrice = sl;
        anchorTime  = fbFindTPHitCandle(sl, tO, tC, !isL) || tC;
      } else {
        anchorPrice = entry;
        anchorTime  = tC;
      }

      // Texto: P&L real de la BD (fallback al ROI calculado si el campo faltara)
      const isWin  = realPct !== null ? (realPct >= 0) : !!bestTP;
      const pctTxt = realPct !== null
        ? `${realPct >= 0 ? '+' : ''}${realPct.toFixed(2)}% ROI`
        : (bestTP ? `+${roi(bestTP.val)}% ROI` : `-${roi(sl)}% ROI`);
      const accent = isWin ? (bestTP && bestTP.n === 3 ? '#FFD166' : '#37F4B0') : '#FF5470';
      const icon   = isWin ? (bestTP && bestTP.n === 3 ? '★' : '✓') : '⨯';

      zones.push({type:'tplbl', time: anchorTime, price: anchorPrice, dot:true,
        icon: icon, accent: accent,
        line1: scenario,
        line2: pctTxt});
    }
  }

  // Sin markers nativos: el pill BUY/SELL del overlay los sustituye (idéntico a las imágenes)
  if (fbCandles) fbCandles.setMarkers([]);
  fbState._zonesData = zones;
  fbRenderZones();
}

/* ────────────────────────────────────────────────────────────────────────────
   RENDER EN DOS FASES
   1) fbRenderZones / fbBuildZones → crea los nodos UNA sola vez.
   2) fbSyncZones (rAF, cada frame) → solo recalcula posición.
   Así los labels quedan SIEMPRE pegados a su punto (precio+tiempo), tanto en
   scroll horizontal como en el autoescalado vertical de la escala de precio.
──────────────────────────────────────────────────────────────────────────── */
let fbZoneRAF = null;

function fbRenderZones() {
  fbBuildZones();
  fbSyncZones();
  fbStartZoneSync();
}

function fbBuildZones() {
  const c = document.getElementById('fb-zones');
  if (!c || !fbState._zonesData) return;
  c.innerHTML = '';

  for (const z of fbState._zonesData) {
    if (z.type === 'box') {
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;background:${z.bg};border:1px solid ${z.border};`;
      c.appendChild(d); z._el = d;

    } else if (z.type === 'line') {
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;height:0;border-top:${z.width||1}px ${z.dash?'dashed':'solid'} ${z.color};`;
      c.appendChild(d); z._el = d;

    } else if (z.type === 'lbl') {           // (legacy) label derecho
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;transform:translateY(-50%);`+
        `font:600 10px/1 'JetBrains Mono',monospace;color:${z.color};`+
        `background:${z.bg};padding:3px 8px;border-radius:3px;white-space:nowrap;`+
        `border:1px solid ${z.color.replace(',1)',',0.25)')};`;
      d.textContent = z.text;
      c.appendChild(d); z._el = d;

    } else if (z.type === 'sigtag') {        // pill BUY / SELL
      const d = document.createElement('div');
      d.className = `fb-sig-tag ${z.isLong ? 'buy' : 'sell'}`;
      d.textContent = z.text;
      c.appendChild(d); z._el = d;

    } else if (z.type === 'tplbl') {         // pill TP/SL (estilo imagen 3)
      const pill = document.createElement('div');
      pill.className = 'fb-tp-pill';
      pill.style.borderColor = z.accent + '66';
      const l1 = document.createElement('div');
      l1.className = 'l1'; l1.style.color = z.accent;
      l1.textContent = (z.icon ? z.icon + '  ' : '') + z.line1;
      const l2 = document.createElement('div');
      l2.className = 'l2'; l2.style.color = z.accent;
      l2.textContent = z.line2;
      pill.appendChild(l1); pill.appendChild(l2);
      c.appendChild(pill); z._el = pill;
      if (z.dot) {
        const dot = document.createElement('div');
        dot.className = 'fb-tp-dot';
        dot.style.background = z.accent;
        dot.style.boxShadow = `0 0 6px ${z.accent}`;
        c.appendChild(dot); z._dot = dot;
      }

    } else if (z.type === 'rtag') {          // etiqueta de precio · borde derecho
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;transform:translateY(-50%);display:flex;align-items:center;`+
        `font:600 10px/1 'JetBrains Mono',monospace;color:#F5F5F5;`+
        `background:${z.accent}22;border:1px solid ${z.accent}99;`+
        `padding:3px 8px;border-radius:3px;white-space:nowrap;z-index:22;`;
      const notch = document.createElement('div');
      notch.style.cssText = `position:absolute;left:-6px;top:50%;transform:translateY(-50%);`+
        `width:0;height:0;border-top:5px solid transparent;border-bottom:5px solid transparent;`+
        `border-right:6px solid ${z.accent};`;
      d.appendChild(notch);
      const span = document.createElement('span');
      span.textContent = (z.icon ? z.icon + '  ' : '') + z.text;
      d.appendChild(span);
      c.appendChild(d); z._el = d;
    }
  }
}

/* timeToCoordinate() devuelve null para tiempos FUTUROS: la proyección de la
   señal abierta termina en tC = última vela + 8 velas, donde no hay barra real.
   fbX cae a logicalToCoordinate(), que SÍ extrapola índices más allá de los
   datos → así las zonas/líneas/etiquetas proyectadas al futuro se posicionan. */
function fbX(ts, t) {
  const x = ts.timeToCoordinate(t);
  if (x !== null) return x;
  const d = fbState.data;
  if (!d.length) return null;
  const lastT = d[d.length - 1].time;
  const tfSec = (FB_TF_MS[fbState.interval] || 60000) / 1000;
  const logical = (d.length - 1) + (t - lastT) / tfSec;
  return ts.logicalToCoordinate(logical);
}

function fbSyncZones() {
  const c = document.getElementById('fb-zones');
  if (!c || !fbState._zonesData) return;
  // Si la pestaña del chart no está visible, no recalcular (rAF sigue, barato)
  if (!c.clientWidth || !c.offsetParent) return;
  const ts = fbChart.timeScale();
  const W = c.clientWidth, H = c.clientHeight;

  // Extremo derecho VIVO de la proyección de la señal abierta: siempre 8 velas
  // por delante de la vela actual, recalculado cada frame → la sombra avanza
  // vela a vela y mantiene su distancia a favor de la vela en curso.
  const tfSec = (FB_TF_MS[fbState.interval] || 60000) / 1000;
  const liveEndT = (fbState.data && fbState.data.length)
    ? fbState.data[fbState.data.length-1].time + tfSec * 8
    : null;

  for (const z of fbState._zonesData) {
    const el = z._el;
    if (!el) continue;

    if (z.type === 'box') {
      const x1 = fbX(ts, z.tO), x2 = fbX(ts, liveEndT !== null ? liveEndT : z.tC);
      const y1 = fbCandles.priceToCoordinate(z.p1), y2 = fbCandles.priceToCoordinate(z.p2);
      if (x1===null||x2===null||y1===null||y2===null) { el.style.display='none'; continue; }
      const l=Math.max(0,Math.min(x1,x2)), r=Math.min(W,Math.max(x1,x2));
      const t=Math.max(0,Math.min(y1,y2)), b=Math.min(H,Math.max(y1,y2));
      if (r-l<2||b-t<1) { el.style.display='none'; continue; }
      el.style.display='block';
      el.style.left=l+'px'; el.style.top=t+'px';
      el.style.width=(r-l)+'px'; el.style.height=(b-t)+'px';

    } else if (z.type === 'line') {
      const x1 = fbX(ts, z.tO), x2 = fbX(ts, liveEndT !== null ? liveEndT : z.tC);
      const y  = fbCandles.priceToCoordinate(z.price);
      if (x1===null||x2===null||y===null) { el.style.display='none'; continue; }
      const l=Math.max(0,Math.min(x1,x2)), r=Math.min(W,Math.max(x1,x2));
      if (r-l<2) { el.style.display='none'; continue; }
      el.style.display='block';
      el.style.left=l+'px'; el.style.top=y+'px'; el.style.width=(r-l)+'px';

    } else if (z.type === 'lbl') {
      const x = ts.timeToCoordinate(z.tC), y = fbCandles.priceToCoordinate(z.price);
      if (x===null||y===null) { el.style.display='none'; continue; }
      el.style.display='block';
      el.style.left=Math.min(x+4, W-180)+'px'; el.style.top=y+'px';

    } else if (z.type === 'sigtag') {
      const x = ts.timeToCoordinate(z.time), y = fbCandles.priceToCoordinate(z.price);
      if (x===null||y===null||x<0||x>W) { el.style.display='none'; continue; }
      el.style.display='block';
      el.style.left=x+'px'; el.style.top=y+'px';

    } else if (z.type === 'tplbl') {
      const x = ts.timeToCoordinate(z.time), y = fbCandles.priceToCoordinate(z.price);
      // Ocultar si el ancla (su vela) NO está visible: la etiqueta debe irse
      // con su vela al scrollear, nunca quedarse pegada al borde.
      if (x===null||y===null||x<0||x>W) {
        el.style.display='none'; if (z._dot) z._dot.style.display='none'; continue;
      }
      el.style.display='flex';
      // Pill a la izquierda del ancla (sin clamp). translate(-100%) lo coloca a la izq.
      el.style.left=(x-8)+'px'; el.style.top=y+'px';
      if (z._dot) {
        z._dot.style.display='block';
        z._dot.style.left=x+'px'; z._dot.style.top=y+'px';
      }

    } else if (z.type === 'rtag') {
      const x = fbX(ts, liveEndT !== null ? liveEndT : z.tC);
      const y = fbCandles.priceToCoordinate(z.price);
      if (x===null||y===null||y<0||y>H) { el.style.display='none'; continue; }
      el.style.display='flex';
      const wlbl = el.offsetWidth || 120;
      let lx = x + 7;
      if (lx + wlbl > W - 2) lx = Math.max(0, W - 2 - wlbl);   // mantener visible
      el.style.left = lx + 'px';
      el.style.top  = y + 'px';
    }
  }
}

function fbStartZoneSync() {
  if (fbZoneRAF) return;
  const loop = () => {
    fbSyncZones();
    fbPositionDeltaPnl();   // pill Δ pegado a la vela en cada frame (scroll/zoom sin saltos)
    fbZoneRAF = requestAnimationFrame(loop);
  };
  fbZoneRAF = requestAnimationFrame(loop);
}

function fbStopZoneSync() {
  if (fbZoneRAF) { cancelAnimationFrame(fbZoneRAF); fbZoneRAF = null; }
  if (fbState._zonesData) {
    for (const z of fbState._zonesData) { z._el = null; z._dot = null; }
  }
}

/* ── Legend ── */
function fbOnCrosshair(param) {
  if (!param||!param.time) { fbUpdateLegend(); return; }
  const cd = param.seriesData.get(fbCandles);
  if (cd) fbSetLegendValues(cd);
}
function fbUpdateLegend() {
  const d = fbState.data;
  if (d.length) fbSetLegendValues(d[d.length-1]);
}
function fbSetLegendValues(c) {
  const up = c.close>=c.open;
  const cls = up?'up':'down';
  const dec = fbDecimals(fbState.symbol);
  const map = {clO:'open', clH:'high', clL:'low', clC:'close'};
  for (const [id, prop] of Object.entries(map)) {
    const e = document.getElementById(id);
    if (e) {
      const v = c[prop];
      e.textContent = (v !== undefined && v !== null) ? v.toFixed(dec) : '—';
      e.className = 'clv ' + cls;
    }
  }
  const chg = document.getElementById('clChg');
  if(chg && c.open){
    const pct=((c.close-c.open)/c.open*100);
    chg.textContent=`${pct>=0?'+':''}${pct.toFixed(2)}%`;
    chg.style.color=up?'var(--green)':'var(--red)';
  }
}
function fbDecimals(sym) {
  if (fbState.data && fbState.data.length) {
    const price = fbState.data[fbState.data.length-1].close;
    if (price >= 1000)  return 2;
    if (price >= 1)     return 4;
    if (price >= 0.01)  return 6;
    return 8;
  }
  const s=(sym||'').toUpperCase();
  if(s.includes('BTC'))return 2; if(s.includes('ETH'))return 2;
  if(s.includes('BNB'))return 2; if(s.includes('SOL'))return 2;
  return 6;
}

/* ── Countdown Timer ── */
let _fbCdId = null;

function fbStartCountdown() {
  fbStopCountdown();
  let e = document.getElementById('fb-countdown');
  if (!e) {
    e = document.createElement('div');
    e.id = 'fb-countdown';
    e.style.cssText = 'position:absolute;right:1px;z-index:55;pointer-events:none;' +
      'border-radius:2px;overflow:hidden;min-width:70px;text-align:right;display:none;' +
      'transform:translateY(-50%);';
    e.innerHTML =
      '<div id="fb-cd-price" style="padding:3px 6px 1px;font:600 11px/1.2 JetBrains Mono,monospace;color:#fff;white-space:nowrap;"></div>' +
      '<div id="fb-cd-time" style="padding:0 6px 3px;font:500 10px/1.2 JetBrains Mono,monospace;color:rgba(255,255,255,0.8);white-space:nowrap;text-align:right;"></div>';
    document.getElementById('fb-chart-container').appendChild(e);
  }
  // Pill Δ de P&L en vivo de la operación abierta (lado derecho, sigue el precio)
  let de = document.getElementById('fb-delta-pnl');
  if (!de) {
    de = document.createElement('div');
    de.id = 'fb-delta-pnl';
    de.style.cssText = 'position:absolute;z-index:54;pointer-events:none;display:none;' +
      "align-items:center;transform:translateY(-50%);font-family:'JetBrains Mono',monospace;white-space:nowrap;";
    de.innerHTML =
      '<span id="fb-dpnl-notch" style="width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;"></span>' +
      '<span id="fb-dpnl-body" style="display:flex;align-items:center;gap:6px;padding:4px 9px;border-radius:5px;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,0.45);">' +
        '<b id="fb-dpnl-dir" style="font-size:11px;letter-spacing:.3px;font-weight:700;"></b>' +
        '<span id="fb-dpnl-pct" style="font-weight:700;font-size:12px;"></span>' +
      '</span>';
    document.getElementById('fb-chart-container').appendChild(de);
  }
  fbTickCountdown();
  _fbCdId = setInterval(fbTickCountdown, 250);
}

function fbStopCountdown() {
  if (_fbCdId) { clearInterval(_fbCdId); _fbCdId = null; }
  fbState._dpnl = null;
  const de = document.getElementById('fb-delta-pnl');
  if (de) de.style.display = 'none';
}

function fbTickCountdown() {
  const tag = document.getElementById('fb-countdown');
  const pEl = document.getElementById('fb-cd-price');
  const tEl = document.getElementById('fb-cd-time');
  if (!tag || !pEl || !tEl || !fbCandles) return;

  const d = fbState.data;
  if (!d || !d.length) { tag.style.display='none'; return; }

  // Valor que REALMENTE dibuja la serie: en Heikin Ashi es el cierre HA, no el
  // real. La línea de precio nativa sigue ese último valor de la serie, así que
  // posicionamos y rotulamos el tag con ese mismo valor → quedan sincronizados.
  let dispClose, dispOpen;
  if (fbState.chartType === 'heikinashi') {
    const ha = fbToHeikinAshi(d);
    const lh = ha[ha.length-1];
    dispClose = lh.close; dispOpen = lh.open;
  } else {
    const last = d[d.length-1];
    dispClose = last.close; dispOpen = last.open;
  }

  const isUp = dispClose >= dispOpen;
  const bg   = isUp ? '#1ebf88' : '#ff5470';   // verde más oscuro en positivo
  const dec  = fbDecimals(fbState.symbol);

  const y = fbCandles.priceToCoordinate(dispClose);
  if (y===null||isNaN(y)||y<0) { tag.style.display='none'; return; }
  tag.style.top = y+'px';
  tag.style.background = bg;
  tag.style.display = 'block';

  pEl.textContent = dispClose.toFixed(dec);

  const dur = FB_TF_MS[fbState.interval];
  if (dur) {
    const rem = dur - (Date.now() % dur);
    const s = Math.floor(rem/1000);
    const hh = Math.floor(s/3600);
    const mm = Math.floor((s%3600)/60);
    const ss = s%60;
    tEl.textContent = hh>0
      ? `${hh}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
      : `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    tEl.style.opacity = (s<=10 && s%2===0) ? '0.4' : '1';
  }

  fbCandles.applyOptions({ priceLineColor: bg });

  // Δ P&L en vivo: recalcula valor/color en el tick; la posición la mantiene el rAF
  fbUpdateDeltaPnl();
}

/* % NETO en vivo de la operación abierta (igual que la tarjeta de En vivo):
   (pnl_accumulated + flotante) / margen × 100, descontando los TP ya tocados. */
function fbOpenNetPct(sig, mark) {
  const pnl = openPositionPnl({
    entry: sig.entry_price, direction: sig.direction,
    margin_used: sig.margin_used, leverage: sig.leverage,
    tp1_filled: sig.hit_tp1, tp2_filled: sig.hit_tp2,
    tp1: sig.tp1, tp2: sig.tp2, tp3: sig.tp3,
    pnl_accumulated: sig.pnl_accumulated,
  }, mark);
  return pnl ? pnl.netPct : null;
}

function fbUpdateDeltaPnl() {
  const open = (fbState.signals && fbState.signals.open) || [];
  const sig  = open[0];
  if (!sig || !fbState.data.length || !fbCandles) { fbState._dpnl = null; fbPositionDeltaPnl(); return; }

  const lastBar = fbState.data[fbState.data.length-1];

  // Precio mostrado (HA-aware) para la Y — se calcula solo en el tick, no por frame
  let dispClose;
  if (fbState.chartType === 'heikinashi') {
    const ha = fbToHeikinAshi(fbState.data);
    dispClose = ha[ha.length-1].close;
  } else {
    dispClose = lastBar.close;
  }

  const freshMark = lastMarkFetchAt && Date.now() - lastMarkFetchAt < 15000
    ? liveMarkPrices['BITUNIX:' + fbState.symbol.replace('/', '')] : null;
  const net = fbOpenNetPct(sig, freshMark);
  if (net === null) { fbState._dpnl = null; fbPositionDeltaPnl(); return; }

  const isLong = (sig.direction || '').toLowerCase() === 'long';
  const pos = net >= 0;
  const col = pos ? '#1ebf88' : '#ff5470';
  document.getElementById('fb-dpnl-body').style.background = col;
  document.getElementById('fb-dpnl-notch').style.borderRight = '7px solid ' + col;
  document.getElementById('fb-dpnl-dir').textContent = 'Δ ' + (isLong ? 'LONG' : 'SHORT');
  document.getElementById('fb-dpnl-pct').textContent = (pos ? '+' : '') + net.toFixed(2) + '%';

  // Cache para que el rAF lo reposicione cada frame (scroll/zoom fluido, sin saltos)
  fbState._dpnl = { time: lastBar.time, price: dispClose };
  fbPositionDeltaPnl();
}

/* Reposiciona el pill cada frame: barato (solo lookups de coordenadas). */
function fbPositionDeltaPnl() {
  const de = document.getElementById('fb-delta-pnl');
  if (!de) return;
  const c = fbState._dpnl;
  if (!c || !fbChart || !fbCandles) { de.style.display = 'none'; return; }
  const x = fbChart.timeScale().timeToCoordinate(c.time);
  const y = fbCandles.priceToCoordinate(c.price);
  if (x === null || y === null || isNaN(y) || y < 0) { de.style.display = 'none'; return; }
  de.style.right = 'auto';
  de.style.left = (x + 9) + 'px';   // pegado al lado derecho de la vela actual
  de.style.top  = y + 'px';
  de.style.display = 'flex';
}

async function fbReload() {
  fbDisconnectWS();
  fbStopCountdown();
  if(fbState.pollRef)clearInterval(fbState.pollRef);
  await new Promise(r => setTimeout(r, 60));   // dejar cerrar el WS viejo antes de abrir el nuevo
  fbState.data=[];
  if(fbCandles)fbCandles.setData([]);
  if(fbVolume)fbVolume.setData([]);
  fbClearSignals();
  await fbLoadData();
}

// Signal toggle
document.addEventListener('DOMContentLoaded', () => {
  const chk = document.getElementById('chartShowSignals');
  if (chk) chk.addEventListener('change', () => {
    if (chk.checked) fbLoadSignals();
    else fbClearSignals();
  });
});
