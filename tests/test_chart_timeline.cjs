const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const path of ['dashboard/static/js/fb-chart.js','public-site/fb-chart.js']) {
 const source=fs.readFileSync(path,'utf8');
 const fn=source.slice(source.indexOf('function fbDrawSignals()'),source.indexOf('let fbZoneRAF'));
 const data=[1000,1900,2800].map(time=>({time,low:90,high:110}));
 const base={symbol:'APEUSDT',direction:'LONG',entry_price:100,stop_loss:80,tp1:120,leverage:20};
 const ctx=vm.createContext({fbState:{data,interval:'15m',tzOff:0,symbol:'APEUSDT',signals:{closed:[],open:[]}},
 FB_TF_MS:{'15m':900000},CFG:{leverage:20},fbCandles:null,fbDecimals:()=>2,
 fbClearSignals(){},fbRenderZones(){},fmtScenario:()=> 'TP1 + BE',document:{getElementById:()=>({})}});
 vm.runInContext(fn,ctx);
 const run=(closed,open=[])=>{ctx.fbState.signals={closed,open};vm.runInContext('fbDrawSignals()',ctx);return ctx.fbState._zonesData};
 const iso=t=>new Date(t*1000).toISOString();
 let zones=run([{...base,opened_at:iso(1500),closed_at:iso(2850),exit_price:100,hit_tp1:true,close_reason:'BE_INFERRED',final_profit_pct:20}]);
 assert.equal(zones.find(z=>z.type==='sigtag').time,1000,'entry must stay in its containing candle');
 const close=zones.find(z=>z.type==='tplbl');assert.equal(close.time,2800);assert.equal(close.price,100);assert.match(close.line1,/Cierre LONG/);assert.match(close.line1,/inferido/);
 zones=run([{...base,opened_at:iso(50),closed_at:iso(2850),exit_price:100,final_profit_pct:0}]);
 assert.equal(zones.filter(z=>z.type==='sigtag').length,0,'old entry cannot snap to first visible candle');
 assert.equal(zones.filter(z=>z.type==='tplbl').length,1,'visible closure retained for entry outside range');
 zones=run([{...base,opened_at:iso(1500),closed_at:iso(5000),exit_price:100}], [{...base,direction:'SHORT',opened_at:iso(2850)}]);
 assert.equal(zones.filter(z=>z.type==='tplbl').length,0,'future closure must not move to an unrelated candle');
 assert.ok(zones.some(z=>z.type==='sigtag'&&/SHORT/.test(z.text)));
 console.log('PASS timeline:',path);
}
