const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const fixture=process.argv[2]?JSON.parse(fs.readFileSync(process.argv[2],'utf8')):null;
const controls={'sim-balance':fixture?'10000':'100','sim-margin':'250','sim-leverage':'20','sim-period':'all','sim-compounding':'fixed','sim-source':'all','sim-tp1-size':'40','sim-tp2-size':'40','sim-tp3-size':'20','sim-max-pos':''};
const nodes=new Map();const el=id=>{if(!nodes.has(id))nodes.set(id,{value:controls[id]??'',checked:false,style:{},addEventListener(){},classList:{add(){},remove(){}}});return nodes.get(id)};
const trades=fixture||[
 {symbol:'A',entry_price:100,stop_loss:99,exit_price:99,direction:'LONG',margin_used:1250,leverage:20,final_profit_usdt:-250,close_reason:'SL',opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-01T01:00:00Z'},
 {symbol:'B',entry_price:100,stop_loss:98,exit_price:103,direction:'LONG',margin_used:625,leverage:20,final_profit_usdt:225,tp1:101,tp2:102,tp3:103,hit_tp1:true,hit_tp2:true,hit_tp3:true,close_reason:'TP3',opened_at:'2026-01-01T00:10:00Z',closed_at:'2026-01-01T02:00:00Z'}];
const ctx=vm.createContext({trades,CFG:{balance0:10000,margin:250,leverage:20},document:{getElementById:el,addEventListener(){}},el,set:(id,v)=>el(id).textContent=v,setClass(){},parseUTC:s=>new Date(s),chSim:null,Chart:class{destroy(){}},reasonClass:()=>'',fmtScenario:r=>r.reason});
vm.runInContext(fs.readFileSync('dashboard/static/js/trade-math.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('dashboard/static/js/simulator.js','utf8'),ctx);
vm.runInContext('runSimulator()',ctx);
assert.equal(el('sr-count').textContent,String(trades.length));assert.equal(el('sr-missed').textContent,'0');assert.equal(el('sr-balance').textContent,fixture?'$64646.98':'$75.00');
assert.match(el('sim-data-notice').textContent,/independientes/);
console.log('PASS: fixed stop risk, all independent entries despite insufficient capital and negative intermediate balance');
