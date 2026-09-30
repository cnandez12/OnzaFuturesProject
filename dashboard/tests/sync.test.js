const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
test('an open-state change reloads positions and redraws the visible page',async()=>{
  let draws=0, openCalls=0;
  const nodes=new Map();
  const el=id=>{
    if(!nodes.has(id))nodes.set(id,{textContent:'',style:{},classList:{add(){},remove(){}}});
    return nodes.get(id);
  };
  const pulse={total:0,last_closed:null,open_count:1,open_state:'tp1-filled'};
  const fetch=async url=>{
    let data;
    if(url==='/api/sim/pulse')data=pulse;
    else if(url.startsWith('/api/sim/history'))data=[];
    else if(url==='/api/sim/stats')data={};
    else if(url==='/api/sim/open'){openCalls++;data=[{id:1,tp1_filled:true}]}
    else if(url==='/api/sim/symbols')data=[];
    else throw Error(url);
    return {ok:true,status:200,json:async()=>data};
  };
  const context=vm.createContext({
    fetch,sessionStorage:{getItem(){return null}},window:{},console,
    document:{getElementById:el,querySelector(){return {id:'pg-open'}}},
    el,set:(id,value)=>{el(id).textContent=value},CFG:{balance0:100,margin:20},
    trades:[],openPos:[],stats:{},symData:[],lastKnownTotal:0,lastKnownClose:null,lastKnownOpenState:null,
    renderKPIs(){},renderDistributions(){},renderRecent(){},updateOpenBadge(){},
    renderOpen(){draws++},renderHistory(){},renderCurve(){},renderSymbols(){},
    runSimulator(){},
  });
  for(const f of ['api.js','timers.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../static/js',f),'utf8'),context);
  await vm.runInContext('checkPulse()',context);
  assert.equal(openCalls,1);
  assert.equal(draws,1);
  assert.equal(vm.runInContext('lastKnownOpenState',context),'tp1-filled');
});
