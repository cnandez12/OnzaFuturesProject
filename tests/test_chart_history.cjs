const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{for(const path of ['dashboard/static/js/fb-chart.js','public-site/fb-chart.js']){
 const source=fs.readFileSync(path,'utf8');const code=source.slice(source.indexOf('async function fbBinanceDirectHistory'),source.indexOf('\nfunction fbRender()'));
 const nodes={clSym:{},'fb-wm-sym':{}};let sockets=0,rendered=0,notice='',calls=0;
 const row={time:Date.now()-900000,open:'10',high:'11',low:'9',close:'10',baseVol:'1'};
 const context=vm.createContext({console:{warn(){}},AbortSignal,Date,Number,Set,Promise,Math,Array,Object,Error,URL,URLSearchParams,location:{origin:'https://example.test'},
 FB_REST:'/candles',FB_CANDLES:400,FB_CHUNK:200,FB_TF_MS:{'15m':900000},
 fbState:{symbol:'EPICUSDT',interval:'15m',tzOff:-5,data:[]},publicFocusedSignal:null,
 fbChartSource:(source,status)=>{context.fbState.marketSource=source;context.fbState.marketStatus=status;},fbStartBinanceUpdates(){},fbSetLive(){},fbHistoryNotice:(text)=>notice=text,fbRender:()=>rendered++,fbConnectWS:()=>sockets++,
 fbStartSignalPoll(){},fbStartCountdown(){},fbUpdateLegend(){},fbLoadSymbolStats(){},
 document:{getElementById:id=>nodes[id]},fetch:async()=>{calls++;return {ok:false,json:async()=>({code:'market_unavailable'})}}});
 vm.runInContext(code,context);
 await vm.runInContext('fbLoadData()',context);
 assert.match(notice,/Bitunix/);assert.match(notice,/EPIC/);assert.equal(sockets,0);assert.equal(rendered,0);assert.equal(calls,4,'negative Bitunix response must immediately try Binance once per chunk');
 context.fbState.symbol='BTCUSDT';context.fetch=async()=>({ok:true,json:async()=>[row,{...row,time:row.time-900000}]});
 await vm.runInContext('fbLoadData()',context);assert.equal(context.fbState.data.length,2);assert.equal(sockets,1);assert.equal(notice,'');
 let primaryRequests=0,backupRequests=0;
 context.fetch=async url=>{
  if(!url.includes('source=binance')){primaryRequests++;return primaryRequests===1?{ok:true,json:async()=>[row]}:{ok:false,json:async()=>({code:'upstream_error'})};}
  backupRequests++;return {ok:true,headers:{get:()=> 'TRADING'},json:async()=>[{...row,open:'20',high:'21',low:'19',close:'20'},{...row,time:row.time-900000,open:'20',high:'21',low:'19',close:'20'}]};
 };
 await vm.runInContext('fbLoadData()',context);
 assert.equal(context.fbState.marketSource,'BINANCE');assert.equal(backupRequests,2);
 assert.ok(context.fbState.data.every(c=>c.close===20),'backup reload must discard all Bitunix candles');
 assert.equal(sockets,1,'Binance backup cannot open a Bitunix socket');
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
 if(path.startsWith('public')){
  context.publicFocusedSignal={symbol:'NEWUSDT',closed:true,closed_at:new Date().toISOString()};
  context.pair=s=>s;context.publicFittingInterval=(r,iv)=>iv;
  context.fetch=async()=>({ok:true,json:async()=>[row,{...row,time:row.time-900000}]});
  const before=sockets;await vm.runInContext('fbLoadData()',context);
  assert.equal(context.fbState.viewHistorical,true);assert.equal(sockets,before,'historical chart must not append current websocket candles');
  context.publicFocusedSignal=null;
 }
 context.fetch=async url=>url.startsWith('https://fapi.binance.com/fapi/v1/exchangeInfo')
  ?{ok:true,json:async()=>({symbols:[{symbol:'EPICUSDT',contractType:'PERPETUAL',quoteAsset:'USDT',marginAsset:'USDT',status:'SETTLING'}]})}
  :url.startsWith('https://fapi.binance.com/fapi/v1/klines')?{ok:true,json:async()=>[[1000,'10','11','9','10','5',2000,'50']]}
  :{ok:false,json:async()=>({code:'upstream_error',upstream_status:451})};
 const direct=await vm.runInContext("fbHistoryChunk('/candles?source=binance&symbol=EPICUSDT&interval=15m&startTime=1000&endTime=2000')",context);
 assert.equal(direct[0].close,'10');assert.equal(direct.marketStatus,'SETTLING');
 const poller=source.slice(source.indexOf('function fbStartBinanceUpdates()'),source.indexOf('function fbConnectWS()'));
 let refreshes=0,updates=0;context.fbState.marketSource='BINANCE';context.fbState.marketStatus='SETTLING';
 context.fbHistoryChunk=async()=>{refreshes++;return [{...row,close:'11'}]};
 context.setInterval=()=>42;context.fbBuildSeriesData=()=>updates++;context.fbTickCountdown=()=>{};
 vm.runInContext(poller,context);vm.runInContext('fbStartBinanceUpdates()',context);
 await new Promise(resolve=>setImmediate(resolve));assert.equal(refreshes,0,'inactive contract cannot claim live updates');
 context.fbState.marketStatus='TRADING';vm.runInContext('fbStartBinanceUpdates()',context);
 await new Promise(resolve=>setImmediate(resolve));assert.equal(refreshes,1);assert.equal(updates,1);
 console.log('PASS history failures, recovery and race guard:',path);
}})().catch(e=>{console.error(e);process.exitCode=1});
