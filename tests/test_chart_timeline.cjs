const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const path of ['dashboard/static/js/fb-chart.js','public-site/fb-chart.js']) {
 const source=fs.readFileSync(path,'utf8');
 const fn=source.slice(source.indexOf('function fbIntervalForTF'),source.indexOf('let fbZoneRAF'));
 const data=[1000,1900,2800].map(time=>({time,low:90,high:110}));
 const base={symbol:'APEUSDT',direction:'LONG',entry_price:100,stop_loss:80,tp1:120,leverage:20};
 const ctx=vm.createContext({fbState:{data,interval:'15m',tzOff:0,symbol:'APEUSDT',signals:{closed:[],open:[]}},
 FB_TF_MS:{'15m':900000},CFG:{leverage:20},fbCandles:null,fbDecimals:()=>2,
 fbProjectionScope(){},fbClearSignals(){ctx.fbState._zonesData=[];},fbRenderZones(){},fmtScenario:()=> 'TP1 + BE',document:{getElementById:()=>({})}});
 vm.runInContext(fn,ctx);
 const run=(closed,open=[])=>{ctx.fbState.signals={closed,open};vm.runInContext('fbDrawSignals()',ctx);return ctx.fbState._zonesData};
 const iso=t=>new Date(t*1000).toISOString();
 let zones=run([{...base,opened_at:iso(1500),closed_at:iso(2850),exit_price:100,hit_tp1:true,close_reason:'BE_INFERRED',final_profit_pct:20}]);
 assert.equal(zones.find(z=>z.type==='sigtag').time,1000,'entry must stay in its containing candle');
 const close=zones.find(z=>z.type==='tplbl');assert.equal(close.time,2800);assert.equal(close.price,100);assert.match(close.line1,/CLOSE SIGNAL LONG/);assert.match(close.line1,/inferido/);
 zones=run([{...base,opened_at:iso(50),closed_at:iso(2850),exit_price:100,final_profit_pct:0}]);
 assert.equal(zones.filter(z=>z.type==='sigtag').length,0,'old entry cannot snap to first visible candle');
 assert.equal(zones.filter(z=>z.type==='tplbl').length,1,'visible closure retained for entry outside range');
 zones=run([{...base,opened_at:iso(1500),closed_at:iso(5000),exit_price:100}], [{...base,direction:'SHORT',opened_at:iso(2850)}]);
 assert.equal(zones.filter(z=>z.type==='tplbl').length,0,'future closure must not move to an unrelated candle');
 assert.ok(zones.some(z=>z.type==='sigtag'&&/SHORT/.test(z.text)));
 zones=run([], [{...base,id:1,timeframe:'15M',opened_at:iso(1500),pnl_accumulated:0},{...base,id:2,timeframe:'15M',direction:'SHORT',entry_price:105,opened_at:iso(2850)}]);
 const boxes=zones.filter(z=>z.type==='box');assert.ok(boxes.length>0);assert.ok(boxes.every(z=>z.tO===2800),'only the latest entry can own projected shadows');
 const unclosed=zones.find(z=>z.type==='tplbl');assert.match(unclosed.line1,/LONG 15M.*sin cierre registrado/);assert.match(unclosed.line2,/0.00/);
 assert.ok(!zones.some(z=>z.type==='tplbl'&&/CLOSE SIGNAL/.test(z.line1)),'different timeframe entry cannot invent an actual closure');
 zones=run([{...base,opened_at:iso(1500),closed_at:iso(2850),exit_price:105,final_profit_pct:12,final_profit_usdt:30}],[]);
 assert.match(zones.find(z=>z.type==='tplbl').line2,/\+\$30.00 USDT/);
 const perTF=[{...base,id:1,timeframe:'1H',opened_at:iso(1500),pnl_accumulated:0},{...base,id:2,timeframe:'30M',direction:'SHORT',entry_price:105,opened_at:iso(2850)}];
 ctx.FB_TF_MS['30m']=1800000;ctx.FB_TF_MS['1h']=3600000;ctx.fbState.interval='30m';
 zones=run([],perTF);assert.ok(zones.some(z=>z.type==='sigtag'&&/SHORT/.test(z.text)));assert.ok(!zones.some(z=>z.type==='sigtag'&&/LONG/.test(z.text)));
 ctx.fbState.interval='1h';zones=run([],perTF);assert.ok(zones.some(z=>z.type==='sigtag'&&/LONG/.test(z.text)));assert.ok(!zones.some(z=>z.type==='sigtag'&&/SHORT/.test(z.text)));
 ctx.fbState.interval='15m';zones=run([],perTF);assert.equal(zones.filter(z=>z.type==='box').length,0);
 console.log('PASS timeline:',path);
}
