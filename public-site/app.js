const API='https://onzafuturesproject-production.up.railway.app/api/public';
const $=id=>document.getElementById(id), money=v=>v==null?'—':Number(v).toLocaleString('es-CO',{style:'currency',currency:'USD'}), pct=v=>v==null?'—':Number(v).toLocaleString('es-CO',{maximumFractionDigits:2})+'%', date=v=>new Date(v).toLocaleString('es-CO',{timeZone:'America/Bogota',dateStyle:'medium',timeStyle:'short'});
let data=null,page=0,selected=null,chartRequest=0,prices={},expanded=false,loading=false;
function node(tag,text,cls){const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;}
function svg(tag,attrs,text){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));if(text!=null)e.textContent=text;return e;}
const cleanSymbol=s=>s.replace(/USD\.P$/,'').replace(/USDT$/,'');
const pair=s=>cleanSymbol(s)+'USDT';
const exitName=r=>({BE_INFERRED:'BE en entrada',BE_OBSERVED:'BE observado',SL:'Stop loss',CLOSE:'Señal opuesta',TP3:'TP3 completo'})[r.close_reason]||r.close_reason;
async function get(path){const r=await fetch(API+path);if(!r.ok)throw Error('Datos no disponibles');return r.json();}
function historyRows(){const search=$('search').value.trim().toUpperCase(),from=$('from').value,to=$('to').value;return data.signals.filter(r=>{
 const day=new Date(r.received_at).toLocaleDateString('en-CA',{timeZone:'America/Bogota'});
 return r.closed&&(!search||(r.symbol+' '+r.direction).includes(search))&&(!from||day>=from)&&(!to||day<=to);
}).sort((a,b)=>b.closed_at.localeCompare(a.closed_at));}
function renderHistory(){if(!data)return;const rows=historyRows(),body=$('history');body.replaceChildren();page=Math.max(0,Math.min(page,Math.max(0,Math.ceil(rows.length/10)-1)));
 for(const r of rows.slice(page*10,page*10+10)){const tr=node('tr'),asset=node('td');asset.append(node('strong',cleanSymbol(r.symbol)),node('small',r.direction+' · '+r.timeframe));tr.append(asset);
 [date(r.received_at),r.max_tp?'TP'+r.max_tp:'Sin TP',exitName(r)].forEach(v=>tr.append(node('td',v)));
 tr.append(node('td',pct(r.roi_pct),r.roi_pct>=0?'positive':'negative'));const cell=node('td'),button=node('button','Ver recorrido ↗');button.addEventListener('click',()=>choose(r.signal_id));cell.append(button);tr.append(cell);body.append(tr);}
 if(!rows.length){const td=node('td','No hay cierres para estos filtros.');td.colSpan=6;body.append(node('tr'));body.lastChild.append(td);}
 $('history-count').textContent=rows.length+' cierres · página '+(page+1)+' de '+Math.max(1,Math.ceil(rows.length/10));$('previous').disabled=page===0;$('next').disabled=(page+1)*10>=rows.length;
 const points=[0];let sum=0;rows.slice().sort((a,b)=>a.closed_at.localeCompare(b.closed_at)).forEach(r=>points.push(sum+=r.pnl_usdt));drawEquity(points);
}
function drawEquity(points){const chart=$('equity');chart.replaceChildren();const low=Math.min(0,...points),high=Math.max(0,...points),range=high-low||1,x=i=>65+i/(points.length-1||1)*860,y=v=>195-(v-low)/range*160;
 for(let i=0;i<4;i++){const value=low+range*i/3;chart.append(svg('line',{x1:65,x2:950,y1:y(value),y2:y(value),stroke:'#213349'}),svg('text',{x:0,y:y(value)+4,fill:'#8da7bf','font-size':10},money(value)));}
 chart.append(svg('polyline',{points:points.map((v,i)=>x(i)+','+y(v)).join(' '),fill:'none',stroke:'#43ddf1','stroke-width':3}));
 if(points.length===1)chart.append(svg('text',{x:420,y:115,fill:'#98adc3','font-size':13},'Sin cierres en la selección'));
}
function renderOpen(){if(!data)return;const rows=data.signals.filter(r=>!r.closed),grid=$('open-signals');grid.replaceChildren();$('live-count').textContent=rows.length;
 for(const r of rows.slice(0,expanded?rows.length:9)){const card=node('article',null,'live-card'),head=node('div',null,'live-head');head.append(node('h3',cleanSymbol(r.symbol)),node('span',r.direction+' · '+r.timeframe,r.direction==='LONG'?'positive':'negative'));card.append(head);
 const levels=node('div',null,'levels');for(let i=1;i<=3;i++)levels.append(node('span','TP'+i,i<=r.max_tp?'level hit':'level'));card.append(levels);
 const current=prices[pair(r.symbol)];card.append(node('p','Entrada: '+r.entry_price+' · Precio actual: '+(current??'No disponible')),
 node('p',r.be_activated?'BE activado en entrada: '+r.be_stop_price:'Stop original: '+r.original_stop),node('p','Parciales registrados: '+money(r.recorded_partial_pnl_usdt)));
 if(current!=null){const pnl=(current-r.entry_price)/r.entry_price*r.leverage*r.margin_used*r.remaining_fraction*(r.direction==='LONG'?1:-1);card.append(node('p','Flotante de la cantidad restante: '+money(pnl),pnl>=0?'positive':'negative'));}
 const button=node('button','Ver gráfico ↗','button');button.addEventListener('click',()=>choose(r.signal_id));card.append(button);grid.append(card);}
 if(!rows.length)grid.append(node('p','No hay señales abiertas en este corte.'));
 if(rows.length>9){const button=node('button',expanded?'Mostrar menos':'Ver las '+rows.length+' señales abiertas','button');button.addEventListener('click',()=>{expanded=!expanded;renderOpen();});grid.append(button);}
}
async function quote(){if(!data)return;const symbols=[...new Set(data.signals.filter(r=>!r.closed).map(r=>pair(r.symbol)))];
 try{for(let i=0;i<symbols.length;i+=40){const ticks=await get('/tickers?symbols='+symbols.slice(i,i+40).join(','));for(const t of ticks){const v=Number(t.lastPrice??t.markPrice);if(Number.isFinite(v)&&v>0)prices[t.symbol]=v;const mark=Number(t.markPrice??t.lastPrice);if(Number.isFinite(mark)&&mark>0)liveMarkPrices["BITUNIX:"+t.symbol]=mark;lastMarkFetchAt=Date.now();}}}catch(_){}renderOpen();}
function choose(id){selected=id;$('signal-select').value=id;renderChart(true);location.hash='grafico';}
function updatePublicChartDetails(r){
 $('chart-heading').replaceChildren(node('h3',cleanSymbol(r.symbol)),node('span',r.direction+' · '+r.timeframe),node('span',r.closed?exitName(r):'Abierta',r.closed?'':'positive'));
 $('signal-detail').replaceChildren();const details=[['ENTRADA',r.entry_price],['STOP ORIGINAL',r.original_stop],['TP1 / TP2 / TP3',r.targets.join(' / ')],['BE',r.be_activated?'Activo en '+r.be_stop_price:'Sin activar'],['MÁXIMO TP',r.max_tp?'TP'+r.max_tp:'Ninguno'],['RESULTADO CERRADO',money(r.pnl_usdt)],['ROI SOBRE MARGEN',pct(r.roi_pct)],['ENTRADA · COLOMBIA',date(r.received_at)]];
 for(const [label,value] of details){const box=node('div');box.append(node('span',label),node('strong',value));$('signal-detail').append(box);}
}
function publicChartFollowSymbol(raw){
 const current=data?.signals.find(r=>r.signal_id===selected);if(current&&pair(current.symbol)===raw)return;
 const r=data?.signals.find(r=>pair(r.symbol)===raw);if(!r)return;selected=r.signal_id;$('signal-select').value=selected;updatePublicChartDetails(r);
}
function renderChart(focus=false){
 const r=data?.signals.find(s=>s.signal_id===$('signal-select').value);if(!r)return;
 selected=r.signal_id;updatePublicChartDetails(r);openOriginalChart(r,focus).catch(()=>{$('chart-status').textContent='No se pudo cargar el gráfico. Selecciona otra operación o actualiza la página.';});
}
async function load(){if(loading)return;loading=true;try{const fresh=await get('/results');data=fresh;$('updated').textContent='Corte: '+date(data.as_of)+' · Colombia';$('methodology').textContent=data.methodology;
 $('stat-closed').textContent=data.summary.closed;$('stat-win').textContent=pct(data.summary.win_rate);$('stat-return').textContent=pct(data.return_pct);$('stat-return').className=data.return_pct>=0?'accent':'negative';$('stat-open').textContent=data.summary.open;$('stat-base').textContent='Capital base: '+money(data.capital_base);
 const first=data.signals.map(r=>r.received_at).sort()[0];$('method-note').textContent=data.method+' · '+(first?'Registro desde '+date(first)+' · ':'')+'Resultados calculados desde alertas; consulta la metodología. Indicadores superiores: registro completo.';
 const selector=$('signal-select');selector.replaceChildren();for(const r of data.signals){const option=node('option',cleanSymbol(r.symbol)+' · '+r.direction+' · '+r.timeframe+' · '+date(r.received_at));option.value=r.signal_id;selector.append(option);}if(selected&&data.signals.some(r=>r.signal_id===selected))selector.value=selected;
 renderHistory();renderOpen();renderChart();quote();renderPremiumFeed();}catch(_){$('updated').textContent=data?'Sin conexión: el corte mostrado está desactualizado.':'No se pudo consultar el registro. Intenta nuevamente.';if(!data){$('history').replaceChildren();const td=node('td','Datos temporalmente no disponibles.');td.colSpan=6;const tr=node('tr');tr.append(td);$('history').append(tr);$('open-signals').replaceChildren(node('p','Datos temporalmente no disponibles.'));}}finally{loading=false;}}
['search','from','to'].forEach(id=>$(id).addEventListener('input',()=>{page=0;renderHistory();}));$('reset').addEventListener('click',()=>{['search','from','to'].forEach(id=>$(id).value='');page=0;renderHistory();});$('previous').addEventListener('click',()=>{page--;renderHistory();});$('next').addEventListener('click',()=>{page++;renderHistory();});$('signal-select').addEventListener('change',()=>renderChart(true));load();setInterval(load,30000);setInterval(quote,5000);
