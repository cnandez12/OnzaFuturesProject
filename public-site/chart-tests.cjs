const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const assets=fs.existsSync(path.join(__dirname,'dist'))?path.join(__dirname,'dist'):__dirname;
const sample={signal_id:'BTC_1',symbol:'BTCUSD.P',direction:'LONG',entry_price:100,original_stop:95,
 targets:[102,104,108],max_tp:1,be_activated:true,recorded_partial_pnl_usdt:8,margin_used:100,leverage:20,
 roi_pct:8,pnl_usdt:8,closed:true,close_reason:'BE_INFERRED',received_at:'2026-10-01T00:00:00Z',closed_at:'2026-10-02T00:00:00Z'};
const context=vm.createContext({URL,console,data:{signals:[sample]},selected:sample.signal_id,
 location:{origin:'https://example.test'},pair:s=>s.replace(/USD\.P$/,'USDT'),
 document:{addEventListener(){}},publicChartFollowSymbol(){}});
vm.runInContext(fs.readFileSync(path.join(assets,'chart-adapter.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(assets,'fb-chart.js'),'utf8'),context);
(async()=>{
 const signals=await context.fetchJson('/api/chart/signals?symbol=BTCUSDT');
 assert.equal(signals.closed.length,1);assert.equal(signals.open.length,0);
 assert.equal(signals.closed[0].be_active,true);assert.equal(signals.closed[0].current_sl,100);
 assert.equal(signals.closed[0].final_profit_pct,8);assert.equal(context.fmtScenario(signals.closed[0]),'TP1 · BE');
 assert.equal((await context.fetchJson('/api/chart/pairs'))[0].pair,'BTCUSDT');
 const stats=await context.fetchJson('/api/chart/symbol_stats?symbol=BTCUSDT');assert.equal(stats.total,1);assert.equal(stats.wins,1);
 const ha=context.fbToHeikinAshi([{time:1,open:100,high:110,low:90,close:105},{time:2,open:105,high:115,low:100,close:110}]);
 assert.equal(ha[0].open,102.5);assert.equal(ha[0].close,101.25);assert.equal(ha[1].open,101.875);
 assert.equal(context.fbOpenNetPct({entry_price:100,leverage:20,direction:'LONG'},102),40);
 assert.equal(context.fbOpenNetPct({entry_price:100,leverage:20,direction:'SHORT'},98),40);
 assert.equal(context.fbOpenNetPct({entry_price:0,leverage:20,direction:'LONG'},102),null);
 for(const file of ['index.html','app.js','fb-chart.js'])assert.equal(/\bsimulad[oa]s?\b/i.test(fs.readFileSync(path.join(assets,file),'utf8')),false);
 assert.ok(fs.readFileSync(path.join(assets,'index.html'),'utf8').includes('https://t.me/+is8YITl6H_c2MGIy'));
 console.log('Original chart calculations, public ledger adapter, BE, branding and wording: passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
