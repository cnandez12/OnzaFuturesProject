const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const path of ['dashboard/static/js/fb-chart.js','public-site/fb-chart.js']){
 const source=fs.readFileSync(path,'utf8');
 const ranges=source.slice(source.indexOf('function fbFlatPriceRange'),source.indexOf('function fbRender()'));
 const status=source.slice(source.indexOf('function fbSetLive'),source.indexOf('/* ── Signals polling'));
 const label={},dot={},el={style:{},querySelector:s=>s.includes('last')?label:dot};dot.style={};
 const ctx=vm.createContext({fbState:{data:[{close:.1837}],marketSource:'BINANCE',marketStatus:'SETTLING'},document:{getElementById:()=>el}});
 vm.runInContext(ranges+status,ctx);vm.runInContext('fbSetLive(false)',ctx);assert.equal(label.textContent,'SIN NEGOCIACIÓN');
 ctx.fbState.marketSource='BITUNIX';ctx.fbState.viewHistorical=true;vm.runInContext('fbSetLive(true)',ctx);assert.equal(label.textContent,'HISTÓRICO');
 ctx.fbState.viewHistorical=false;vm.runInContext('fbSetLive(true)',ctx);assert.equal(label.textContent,'LIVE');
 ctx.base={priceRange:{minValue:.18369999,maxValue:.18370001}};
 const range=vm.runInContext('fbFlatPriceRange(base)',ctx).priceRange;assert.ok(range.maxValue-range.minValue>.003);
 ctx.base={priceRange:{minValue:.17,maxValue:.20}};assert.equal(vm.runInContext('fbFlatPriceRange(base)===base',ctx),true);
 console.log('PASS inactive/historical/live status and flat chart scale:',path);
}
