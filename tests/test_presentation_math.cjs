const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({});vm.runInContext(fs.readFileSync('dashboard/static/js/trade-math.js','utf8'),c);
for (const direction of ['LONG','SHORT']) {
 c.p={entry:100,direction,margin_used:250,leverage:20,tp1_filled:true,pnl_accumulated:40};c.mark=direction==='LONG'?101:99;
 const r=vm.runInContext('openPositionPnl(p,mark)',c);
 assert.equal(r.remaining,.6);assert.equal(r.accumulated,40);assert.equal(r.floating,30);assert.equal(r.net,70);assert.ok(Math.abs(r.netPct-28)<1e-10);
}
c.t={entry_price:100,exit_price:100,direction:'LONG',margin_used:250,leverage:20,hit_tp1:true,tp1_exit_price:101,tp1:101,final_profit_usdt:20,recorded_final_profit_usdt:20,source_recorded_final_profit_usdt:-1000};
assert.equal(vm.runInContext('tradeScenario(t,[.4,.4,.2]).rate*250*20',c),20);
console.log('PASS: realized partials + remaining exposure; simulator uses presentation amounts');
