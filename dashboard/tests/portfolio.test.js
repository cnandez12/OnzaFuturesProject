const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function run(trades, options={}) {
  const nodes = new Map();
  const values = {
    'sim-balance': String(options.balance || 100), 'sim-margin': String(options.margin || 20),
    'sim-leverage': '20', 'sim-period': 'all', 'sim-source': 'all',
    'sim-compounding': options.compounding || 'pct', 'sim-pct': String(options.risk || 50),
    'sim-max-pos': '', 'sim-tp1-size':'40', 'sim-tp2-size':'40', 'sim-tp3-size':'20',
    'sim-fee-pct': String(options.fee || 0),
  };
  const el = id => {
    if (!nodes.has(id)) nodes.set(id, {
      value: values[id] || '', checked: id === 'sim-fees-enabled' && !!options.fee,
      textContent:'', innerHTML:'', style:{}, className:'', addEventListener(){},
    });
    return nodes.get(id);
  };
  const context = vm.createContext({
    document:{getElementById:el,addEventListener(){}}, el,
    set:(id,v)=>{el(id).textContent=v},setClass(){},
    CFG:{balance0:100,margin:20,leverage:20},trades,chSim:null,
    parseUTC:s=>new Date(s),fmtScenario:()=>'',reasonClass:()=>'',
    Chart:class{destroy(){}},console,
  });
  for(const file of ['trade-math.js','simulator.js'])
    vm.runInContext(fs.readFileSync(path.join(__dirname,'../static/js',file),'utf8'),context);
  vm.runInContext('runSimulator()',context);
  return id=>el(id).textContent;
}
const base = {direction:'LONG',entry_price:100,exit_price:100,margin_used:20,leverage:20,
  hit_tp1:false,hit_tp2:false,hit_tp3:false,close_reason:'Closed',symbol:'TEST'};
test('overlapping profits credit at close, not when the trade opens',()=>{
  const a={...base,id:1,exit_price:95,final_profit_usdt:-20,
    opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-01T04:00:00Z'};
  const b={...base,id:2,exit_price:110,final_profit_usdt:40,
    opened_at:'2026-01-01T01:00:00Z',closed_at:'2026-01-01T02:00:00Z'};
  const result=run([a,b]);
  assert.equal(result('sr-balance'),'$150.00');
  assert.equal(result('sr-max-active'),'2');
});
test('fee is charged on entry and each exit notional',()=>{
  const t={...base,id:3,exit_price:110,final_profit_usdt:40,
    opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-01T01:00:00Z'};
  const result=run([t],{balance:1000,compounding:'fixed',margin:20,fee:0.1});
  assert.equal(result('sr-fees'),'$0.84');
  assert.equal(result('sr-balance'),'$1039.16');
});
