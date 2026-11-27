const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{for(const path of ['dashboard/static/js/fb-chart.js','public-site/fb-chart.js']){
 const source=fs.readFileSync(path,'utf8');const code=source.slice(source.indexOf('async function fbHistoryChunk'),source.indexOf('\nfunction fbRender()'));
 const nodes={clSym:{},'fb-wm-sym':{}};let sockets=0,rendered=0,notice='',calls=0;
 const row={time:Date.now()-900000,open:'10',high:'11',low:'9',close:'10',baseVol:'1'};
 const context=vm.createContext({console:{warn(){}},AbortSignal,Date,Number,Set,Promise,Math,Array,Object,Error,
 FB_REST:'/candles',FB_CANDLES:400,FB_CHUNK:200,FB_TF_MS:{'15m':900000},
 fbState:{symbol:'EPICUSDT',interval:'15m',tzOff:-5,data:[]},publicFocusedSignal:null,
 fbSetLive(){},fbHistoryNotice:(text)=>notice=text,fbRender:()=>rendered++,fbConnectWS:()=>sockets++,
 fbStartSignalPoll(){},fbStartCountdown(){},fbUpdateLegend(){},fbLoadSymbolStats(){},
 document:{getElementById:id=>nodes[id]},fetch:async()=>{calls++;return {ok:false,json:async()=>({code:'market_unavailable'})}}});
 vm.runInContext(code,context);
 await vm.runInContext('fbLoadData()',context);
 assert.match(notice,/Bitunix/);assert.match(notice,/EPIC/);assert.equal(sockets,0);assert.equal(rendered,0);assert.equal(calls,2,'permanent rejection must not retry');
 context.fbState.symbol='BTCUSDT';context.fetch=async()=>({ok:true,json:async()=>[row,{...row,time:row.time-900000}]});
 await vm.runInContext('fbLoadData()',context);assert.equal(context.fbState.data.length,2);assert.equal(sockets,1);assert.equal(notice,'');
 let emptyCalls=0;context.fetch=async()=>({ok:true,json:async()=>++emptyCalls===1?[]:[row]});
 assert.equal((await vm.runInContext("fbHistoryChunk('/candles')",context)).length,1);assert.equal(emptyCalls,2);
 context.fetch=async()=>{throw Error('timeout')};await vm.runInContext('fbLoadData()',context);assert.match(notice,/No se pudo cargar/);assert.equal(sockets,1);
 let release;context.fbState.symbol='OLDUSDT';context.fetch=()=>new Promise(resolve=>release=resolve);
 // Only one chunk for the race case; the old response resolves after the new symbol.
 context.FB_CANDLES=200;
 const old=vm.runInContext('fbLoadData()',context);
 context.fbState.symbol='NEWUSDT';context.fetch=async()=>({ok:true,json:async()=>[{...row,close:'11'},{...row,time:row.time-900000}]});
 await vm.runInContext('fbLoadData()',context);release({ok:true,json:async()=>[row]});await old;
 assert.equal(context.fbState.data.length,2);assert.equal(nodes.clSym.textContent,'NEWUSDT');
 console.log('PASS history failures, recovery and race guard:',path);
}})().catch(e=>{console.error(e);process.exitCode=1});
