const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

function loadCalculator(){
  const context=vm.createContext({
    console,
    parseUTC:s=>{if(!s)return new Date(NaN);return /[Zz]|[+-]\d{2}:?\d{2}$/.test(s)?new Date(s):new Date(s+'Z')},
    Chart:class{},el(){return null},set(){},setClass(){},filterByPeriod:a=>a,periodLabel:()=>'',
    CFG:{balance0:1000},stats:{},trades:[],activePeriod:'all',activeYear:null,
    chBal:null,chBars:null,chMonthly:null,
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../static/js/curve.js'),'utf8'),context);
  return (rows,mode='total')=>vm.runInContext(`computeMonthlyPerformance(${JSON.stringify(rows)},1000,${JSON.stringify(mode)})`,context);
}

const calculate=loadCalculator();

test('monthly loss uses the balance at the start of that month',()=>{
  const result=calculate([
    {id:1,symbol:'A',opened_at:'2025-12-01T00:00:00Z',closed_at:'2025-12-31T20:00:00Z',final_profit_usdt:2500,source:'reconstructed'},
    {id:2,symbol:'B',opened_at:'2026-06-01T00:00:00Z',closed_at:'2026-06-10T12:00:00Z',final_profit_usdt:-500,source:'bot'},
  ]);
  const june=result.byYear['2026'][5];
  assert.equal(june.start,3500);
  assert.equal(june.end,3000);
  assert.ok(Math.abs(june.returnPct-(-14.285714285714286))<1e-10);
});

test('monthly percentages compound back to the exact final balance',()=>{
  const result=calculate([
    {id:1,symbol:'A',opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-20T00:00:00Z',final_profit_usdt:200,source:'bot'},
    {id:2,symbol:'B',opened_at:'2026-02-01T00:00:00Z',closed_at:'2026-02-20T00:00:00Z',final_profit_usdt:100,source:'bot'},
    {id:3,symbol:'C',opened_at:'2026-03-01T00:00:00Z',closed_at:'2026-03-20T00:00:00Z',final_profit_usdt:-50,source:'bot'},
  ]);
  assert.equal(result.byYear['2026'][0].returnPct,20);
  assert.ok(Math.abs(result.byYear['2026'][1].returnPct-(100/1200*100))<1e-10);
  const compounded=result.months.reduce((factor,m)=>factor*(1+m.returnPct/100),1);
  assert.ok(Math.abs(1000*compounded-result.finalBalance)<1e-8);
  assert.equal(result.finalBalance,1250);
});

test('year boundaries preserve prior balance and do not reset to initial capital',()=>{
  const result=calculate([
    {id:1,symbol:'A',opened_at:'2025-12-01T00:00:00Z',closed_at:'2025-12-31T23:00:00Z',final_profit_usdt:500,source:'reconstructed'},
    {id:2,symbol:'B',opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-02T00:00:00Z',final_profit_usdt:150,source:'reconstructed'},
  ]);
  assert.equal(result.byYear['2026'][0].start,1500);
  assert.equal(result.byYear['2026'][0].returnPct,10);
});

test('invalid values and possible business duplicates are surfaced',()=>{
  const result=calculate([
    {id:1,symbol:'BTCUSDT',opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-02T00:00:00Z',final_profit_usdt:null,source:'bot'},
    {id:2,symbol:'BTCUSDT',opened_at:'2026-01-01T00:00:00Z',closed_at:'bad-date',final_profit_usdt:10,source:'bot'},
    {id:3,symbol:'BTCUSDT',opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-03T00:00:00Z',final_profit_usdt:5,source:'bot'},
  ]);
  assert.equal(result.diagnostics.invalidPnl,1);
  assert.equal(result.diagnostics.invalidDate,1);
  assert.equal(result.diagnostics.coincidentOpenings,1);
  assert.equal(result.diagnostics.exactDuplicateRows,0);
  assert.equal(result.finalBalance,1005);
});


test('exact economic duplicates expose their monthly P&L impact',()=>{
  const row={symbol:'ETHUSDT',direction:'Long',opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-02T00:00:00Z',entry_price:100,exit_price:110,stop_loss:95,tp1:105,tp2:108,tp3:110,close_reason:'TP3',final_profit_usdt:12,source:'bot'};
  const result=calculate([{...row,id:1},{...row,id:2}]);
  assert.equal(result.diagnostics.exactDuplicateRows,1);
  assert.equal(result.diagnostics.exactDuplicatePnl,12);
  assert.equal(result.byYear['2026'][0].exactDuplicates,1);
  assert.equal(result.finalBalance,1024);
});


test('reset mode starts every month from the configured base balance',()=>{
  const rows=[
    {id:1,symbol:'A',opened_at:'2025-12-01T00:00:00Z',closed_at:'2025-12-31T20:00:00Z',final_profit_usdt:2500,source:'reconstructed'},
    {id:2,symbol:'B',opened_at:'2026-06-01T00:00:00Z',closed_at:'2026-06-10T12:00:00Z',final_profit_usdt:-500,source:'bot'},
  ];
  const total=calculate(rows,'total');
  const reset=calculate(rows,'reset');
  assert.equal(total.byYear['2026'][5].start,3500);
  assert.equal(reset.byYear['2026'][5].start,1000);
  assert.equal(reset.byYear['2026'][5].end,500);
  assert.equal(reset.byYear['2026'][5].returnPct,-50);
  assert.equal(reset.finalBalance,3000);
});

test('monthly ledger presents every historical signal with Bot origin',()=>{
  const result=calculate([
    {id:1,symbol:'A',opened_at:'2026-01-01T00:00:00Z',closed_at:'2026-01-02T00:00:00Z',final_profit_usdt:10,source:'reconstructed'},
    {id:2,symbol:'B',opened_at:'2026-01-03T00:00:00Z',closed_at:'2026-01-04T00:00:00Z',final_profit_usdt:20,source:'bot'},
  ]);
  assert.equal(result.sourceTotals.bot,2);
  assert.equal(result.byYear['2026'][0].bot,2);
});


function loadPnlCalculator(){
  const context=vm.createContext({
    console,
    parseUTC:s=>{if(!s)return new Date(NaN);return /[Zz]|[+-]\d{2}:?\d{2}$/.test(s)?new Date(s):new Date(s+'Z')},
    Chart:class{},el(){return null},set(){},setClass(){},filterByPeriod:a=>a,periodLabel:()=>'',
    document:{querySelectorAll(){return[]}},
    CFG:{balance0:1000},stats:{},trades:[],activePeriod:'all',activeYear:null,
    chBal:null,chBars:null,chMonthly:null,
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../static/js/curve.js'),'utf8'),context);
  return (rows,mode)=>JSON.parse(vm.runInContext(
    `JSON.stringify(computePnlBars(${JSON.stringify(rows)},${JSON.stringify(mode)}))`,context
  ));
}

const calculatePnlBars=loadPnlCalculator();

test('daily P&L adds every closed trade from the same UTC day',()=>{
  const rows=[
    {id:1,closed_at:'2026-09-24T02:00:00Z',final_profit_usdt:15},
    {id:2,closed_at:'2026-09-24T20:00:00Z',final_profit_usdt:-4},
    {id:3,closed_at:'2026-09-25T01:00:00Z',final_profit_usdt:-7},
  ];
  const result=calculatePnlBars(rows,'day');
  assert.deepEqual(result.keys,['2026-09-24','2026-09-25']);
  assert.deepEqual(result.data,[11,-7]);
  assert.deepEqual(result.counts,[2,1]);
});

test('trade P&L keeps each close as an individual bar',()=>{
  const rows=[
    {id:2,closed_at:'2026-09-24T20:00:00Z',final_profit_usdt:-4},
    {id:1,closed_at:'2026-09-24T02:00:00Z',final_profit_usdt:15},
  ];
  const result=calculatePnlBars(rows,'trade');
  assert.deepEqual(result.keys,['1','2']);
  assert.deepEqual(result.data,[15,-4]);
  assert.deepEqual(result.counts,[1,1]);
});

test('daily and trade modes preserve the exact same total P&L',()=>{
  const rows=[
    {id:1,closed_at:'2026-09-23T22:00:00Z',final_profit_usdt:12.5},
    {id:2,closed_at:'2026-09-24T01:00:00Z',final_profit_usdt:-2.25},
    {id:3,closed_at:'2026-09-24T16:00:00Z',final_profit_usdt:8.75},
  ];
  const trade=calculatePnlBars(rows,'trade');
  const day=calculatePnlBars(rows,'day');
  assert.equal(trade.data.reduce((a,v)=>a+v,0),19);
  assert.equal(day.data.reduce((a,v)=>a+v,0),19);
});
