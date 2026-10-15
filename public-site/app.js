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
 if(current!=null){const pnl=(current-r.entry_price)/r.entry_price*r.leverage*r.margin_used*r.remaining_fraction*(r.direction==='LONG'?1:-1);card.append(node('p','Flotante restante simulado: '+money(pnl),pnl>=0?'positive':'negative'));}
 const button=node('button','Ver gráfico ↗','button');button.addEventListener('click',()=>choose(r.signal_id));card.append(button);grid.append(card);}
 if(!rows.length)grid.append(node('p','No hay señales abiertas en este corte.'));
 if(rows.length>9){const button=node('button',expanded?'Mostrar menos':'Ver las '+rows.length+' señales abiertas','button');button.addEventListener('click',()=>{expanded=!expanded;renderOpen();});grid.append(button);}
}
async function quote(){if(!data)return;const symbols=[...new Set(data.signals.filter(r=>!r.closed).map(r=>pair(r.symbol)))];
 try{for(let i=0;i<symbols.length;i+=40){const ticks=await get('/tickers?symbols='+symbols.slice(i,i+40).join(','));for(const t of ticks){const v=Number(t.lastPrice??t.markPrice);if(Number.isFinite(v)&&v>0)prices[t.symbol]=v;}}}catch(_){}renderOpen();}
function choose(id){selected=id;$('signal-select').value=id;renderChart();location.hash='grafico';}
async function renderChart(){const r=data?.signals.find(s=>s.signal_id===$('signal-select').value);if(!r)return;selected=r.signal_id;const request=++chartRequest;
 $('chart-heading').replaceChildren(node('h3',cleanSymbol(r.symbol)),node('span',r.direction+' · '+r.timeframe),node('span',r.closed?exitName(r):'Abierta',r.closed?'':'positive'));
 $('signal-detail').replaceChildren();const details=[['ENTRADA',r.entry_price],['STOP ORIGINAL',r.original_stop],['TP1 / TP2 / TP3',r.targets.join(' / ')],['BE',r.be_activated?'Activo en '+r.be_stop_price:'Sin activar'],['MÁXIMO TP',r.max_tp?'TP'+r.max_tp:'Ninguno'],['RESULTADO CERRADO',money(r.pnl_usdt)],['ROI SOBRE MARGEN',pct(r.roi_pct)],['ENTRADA · COLOMBIA',date(r.received_at)]];
 for(const [label,value] of details){const box=node('div');box.append(node('span',label),node('strong',value));$('signal-detail').append(box);}
 $('chart-status').textContent='Cargando velas públicas de Bitunix…';let candles=[];
 const start=Date.parse(r.received_at)-3600000,end=r.closed_at?Date.parse(r.closed_at)+3600000:Date.now(),interval=end-start>6*86400000?'4h':'1h';
 try{candles=await get('/candles?'+new URLSearchParams({symbol:pair(r.symbol),interval,startTime:start,endTime:Math.max(start+3600000,end)}));}catch(_){}
 if(request!==chartRequest)return;drawPrice(r,candles);
 $('chart-status').textContent=candles.length?'Velas públicas de Bitunix · '+interval+' · niveles de la señal TradingView. Pueden diferir del exchange de origen.':'Velas no disponibles para este activo o período. Se muestran únicamente la entrada y los precios de alertas registrados; no se interpola un recorrido de mercado.';
}
function drawPrice(r,raw){const chart=$('price-chart');chart.replaceChildren();const candles=raw.map(c=>({time:Number(c.time),open:Number(c.open),high:Number(c.high),low:Number(c.low),close:Number(c.close)})).filter(c=>[c.time,c.open,c.high,c.low,c.close].every(Number.isFinite)).sort((a,b)=>a.time-b.time);
 const levels=[['Entrada',r.entry_price,'#43ddf1'],['SL original',r.original_stop,'#ff8c9c'],...r.targets.map((v,i)=>['TP'+(i+1),v,'#a67bff'])].filter(l=>Number.isFinite(Number(l[1])));
 const values=[...levels.map(l=>Number(l[1])),...candles.flatMap(c=>[c.low,c.high])];let min=Math.min(...values),max=Math.max(...values);const padding=(max-min||max*.01)*.13;min-=padding;max+=padding;const y=v=>365-(v-min)/(max-min)*325;
 for(let i=0;i<5;i++){const v=min+(max-min)*i/4;chart.append(svg('line',{x1:55,x2:870,y1:y(v),y2:y(v),stroke:'#1b2c43'}),svg('text',{x:2,y:y(v)+4,fill:'#829bb4','font-size':10},Number(v.toPrecision(7)).toString()));}
 levels.forEach(([label,v,color])=>chart.append(svg('line',{x1:55,x2:870,y1:y(v),y2:y(v),stroke:color,'stroke-dasharray':'5 5',opacity:.65}),svg('text',{x:880,y:y(v)+4,fill:color,'font-size':11},label+' '+v)));
 if(candles.length){const x=i=>65+i/(candles.length-1||1)*790,w=Math.max(2,Math.min(9,550/candles.length));candles.forEach((c,i)=>{const color=c.close>=c.open?'#41dfb5':'#ff8c9c';chart.append(svg('line',{x1:x(i),x2:x(i),y1:y(c.high),y2:y(c.low),stroke:color}),svg('rect',{x:x(i)-w/2,y:Math.min(y(c.open),y(c.close)),width:w,height:Math.max(1,Math.abs(y(c.close)-y(c.open))),fill:color}));});chart.append(svg('text',{x:55,y:401,fill:'#829bb4','font-size':10},date(candles[0].time)),svg('text',{x:690,y:401,fill:'#829bb4','font-size':10},date(candles.at(-1).time)));}
 else {const points=[{price:r.entry_price,kind:'Entrada'},...r.legs];points.forEach((p,i)=>{const x=100+i/Math.max(1,points.length-1)*650;chart.append(svg('circle',{cx:x,cy:y(p.price),r:5,fill:'#43ddf1'}),svg('text',{x:x-20,y:400,fill:'#829bb4','font-size':11},p.kind));});}
}
async function load(){if(loading)return;loading=true;try{const fresh=await get('/results');data=fresh;$('updated').textContent='Corte: '+date(data.as_of)+' · Colombia';$('methodology').textContent=data.methodology;
 $('stat-closed').textContent=data.summary.closed;$('stat-win').textContent=pct(data.summary.win_rate);$('stat-return').textContent=pct(data.return_pct);$('stat-return').className=data.return_pct>=0?'accent':'negative';$('stat-open').textContent=data.summary.open;$('stat-base').textContent='Capital base: '+money(data.capital_base);
 const first=data.signals.map(r=>r.received_at).sort()[0];$('method-note').textContent=data.method+' · '+(first?'Registro desde '+date(first)+' · ':'')+'Resultados brutos simulados; no son fills del exchange. Indicadores superiores: registro completo.';
 const selector=$('signal-select');selector.replaceChildren();for(const r of data.signals){const option=node('option',cleanSymbol(r.symbol)+' · '+r.direction+' · '+r.timeframe+' · '+date(r.received_at));option.value=r.signal_id;selector.append(option);}if(selected&&data.signals.some(r=>r.signal_id===selected))selector.value=selected;
 renderHistory();renderOpen();renderChart();quote();}catch(_){$('updated').textContent=data?'Sin conexión: el corte mostrado está desactualizado.':'No se pudo consultar el registro. Intenta nuevamente.';if(!data){$('history').replaceChildren();const td=node('td','Datos temporalmente no disponibles.');td.colSpan=6;const tr=node('tr');tr.append(td);$('history').append(tr);$('open-signals').replaceChildren(node('p','Datos temporalmente no disponibles.'));}}finally{loading=false;}}
['search','from','to'].forEach(id=>$(id).addEventListener('input',()=>{page=0;renderHistory();}));$('reset').addEventListener('click',()=>{['search','from','to'].forEach(id=>$(id).value='');page=0;renderHistory();});$('previous').addEventListener('click',()=>{page--;renderHistory();});$('next').addEventListener('click',()=>{page++;renderHistory();});$('signal-select').addEventListener('change',renderChart);load();setInterval(load,30000);
