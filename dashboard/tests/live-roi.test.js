const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../static/js/fb-chart.js'), 'utf8');
const ctx = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function fbOpenNetPct('), source.indexOf('function fbUpdateDeltaPnl(')),ctx);
const signal = {entry_price:89.61,leverage:20,direction:'LONG',hit_tp1:true,tp1:90.41};
test('live LONG turns negative below entry even after TP1', () => {
  const result=ctx.fbOpenNetPct(signal,89.2015);
  assert.equal(result.toFixed(2),'-9.12');
  assert.equal(ctx.fbOpenNetPct(signal,89.61),0);
  assert.ok(ctx.fbOpenNetPct(signal,90.41)>0);
});
test('live SHORT reverses sign and does not depend on TP history', () => {
  const short={...signal,direction:'SHORT',hit_tp2:true};
  assert.equal(ctx.fbOpenNetPct(short,89.2015).toFixed(2),'9.12');
  assert.ok(ctx.fbOpenNetPct(short,90)<0);
});
test('missing or invalid price hides ROI instead of showing the last TP', () => {
  for(const mark of [null,undefined,NaN,Infinity,0,-1]) assert.equal(ctx.fbOpenNetPct(signal,mark),null);
});
