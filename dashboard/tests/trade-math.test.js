const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../static/js/trade-math.js'), 'utf8'), context);
const { tradeScenario, openPositionPnl, tradeTpContributionPct } = context;
const close = (a,b) => assert.ok(Math.abs(a-b) < 1e-10, `${a} != ${b}`);
const base = {
  entry_price: 100, exit_price: 130, direction: 'LONG',
  margin_used: 20, leverage: 20, hit_tp1: true, hit_tp2: true, hit_tp3: true,
  tp1: 110, tp2: 120, tp3: 130,
  tp1_exit_price: 110, tp2_exit_price: 120, tp3_exit_price: 130,
  final_profit_usdt: 72, close_reason: 'TP3',
};
test('TP1, TP2 and TP3 use each sold fraction and saved fill', () => {
  close(tradeScenario(base, [.4,.4,.2]).rate * 400, 72);
  close(tradeScenario(base, [.2,.4,.4]).rate * 400, 88);
});
test('partial TP plus break even closes only remaining fraction at exit', () => {
  const t = {...base, hit_tp3:false, exit_price:100, close_reason:'BREAKEVEN', final_profit_usdt:48};
  close(tradeScenario(t,[.4,.4,.2]).rate * 400, 48);
});
test('stop after TP1 preserves realized profit and closes remaining at actual exit', () => {
  const t = {...base, hit_tp2:false, hit_tp3:false, exit_price:95, close_reason:'SL', final_profit_usdt:4};
  close(tradeScenario(t,[.4,.4,.2]).rate * 400, 4);
});
test('recorded P&L remains authoritative when an old row cannot reconcile', () => {
  const t = {...base, final_profit_usdt:80};
  close(tradeScenario(t,[.4,.4,.2]).rate * 400, 80);
  close(tradeScenario(t,[.2,.4,.4]).rate * 400, 96);
  close(tradeScenario(t,[.4,.4,.2]).discrepancy, -8);
});
test('open position keeps highest TP despite price retracement', () => {
  const p = {entry:100,direction:'LONG',margin_used:20,leverage:20,tp1:110,tp1_filled:true,tp2_filled:false,pnl_accumulated:16};
  const r = openPositionPnl(p,105);
  close(r.accumulated,40);close(r.floating,20);close(r.net,40);close(r.netPct,200);
  const stale = openPositionPnl(p,null);
  close(stale.accumulated,40);assert.equal(stale.floating,null);close(stale.net,40);
});

test('SHORT legs reverse price direction without changing sold fractions', () => {
  const t = {...base, direction:'SHORT', tp1:90, tp2:80, tp3:70,
    tp1_exit_price:90, tp2_exit_price:80, tp3_exit_price:null,
    hit_tp3:false, exit_price:110, close_reason:'SL', final_profit_usdt:40};
  close(tradeScenario(t,[.4,.4,.2]).rate * 400, 40);
  const open = openPositionPnl({entry:100,direction:'SHORT',margin_used:20,leverage:20,
    tp1:90,tp1_filled:true,tp2_filled:false,pnl_accumulated:16},95);
  close(open.floating,20);close(open.net,40);
});

test('historical unweighted TP fields do not alter weighted TP display', () => {
  const legacy = {...base, tp1_profit_pct:200, tp2_profit_pct:400, tp3_profit_pct:600};
  close(tradeTpContributionPct(legacy,0),80);
  close(tradeTpContributionPct(legacy,1),160);
  close(tradeTpContributionPct(legacy,2),120);
});

test('simulator uses preserved accounting instead of dashboard max TP profit', () => {
  const t = {...base, final_profit_usdt:120, recorded_final_profit_usdt:72};
  close(tradeScenario(t,[.4,.4,.2]).rate * 400,72);
});
