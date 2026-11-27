const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({URL,location:{origin:'https://cryptopilotfutures.up.railway.app'},pair:s=>s.replace('USD.P','USDT')});
vm.runInContext(fs.readFileSync('public-site/chart-adapter.js','utf8'),context);
(async()=>{
 const row=(id,closed=false,visible=true)=>({signal_id:id,symbol:'APEUSD.P',closed,prices_visible:visible,targets:[2,3,4],max_tp:0});
 context.data={signals:[row('focus'),row('old',true),row('other')]};context.selected='focus';
 let out=await vm.runInContext("fetchJson('/api/chart/signals?symbol=APEUSDT')",context);
 assert.equal(out.closed.length,0);assert.equal(out.open.length,1);assert.equal(out.open[0].id,'focus');
 context.selected='old';out=await vm.runInContext("fetchJson('/api/chart/signals?symbol=APEUSDT')",context);
 assert.equal(out.open.length,0);assert.equal(out.closed[0].id,'old');
 context.data.signals.push(row('reserved',false,false));context.selected='reserved';
 out=await vm.runInContext("fetchJson('/api/chart/signals?symbol=APEUSDT')",context);
 assert.equal(out.open.length+out.closed.length,0);
 const source=fs.readFileSync('public-site/fb-chart.js','utf8');assert.ok(source.includes("const FB_REST = '/api/public/candles';"));
 console.log('PASS: isolated overlays, closed selection, protected levels and same-origin candle endpoint');
})().catch(e=>{console.error(e);process.exitCode=1});
