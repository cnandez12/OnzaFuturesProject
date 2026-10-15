const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const assets=fs.existsSync(path.join(__dirname,'dist'))?path.join(__dirname,'dist'):__dirname;
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.className='';this.value='';this.text='';this.classList={add:(name)=>{this.className+=' '+name;}};}
 set textContent(value){this.text=String(value);this.children=[];}
 get textContent(){return this.text+this.children.map(child=>child.textContent).join(' ');}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.text='';this.children=children;}
 addEventListener(){}
}
const elements=new Map(),document={createElement:tag=>new Element(tag),getElementById:id=>{if(!elements.has(id))elements.set(id,new Element('div'));return elements.get(id);}};
const context=vm.createContext({document,URL,console,location:{origin:'https://example.test'},fetch:()=>new Promise(()=>{}),setInterval(){}});
vm.runInContext(fs.readFileSync(path.join(assets,'chart-adapter.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(assets,'app.js'),'utf8'),context);
const active={signal_id:'A',symbol:'AUSDT',direction:'LONG',timeframe:'15M',closed:false,max_tp:2,be_activated:true,be_stop_price:100,
 prices_visible:true,featured:true,featured_reason:'TP2 alcanzado',entry_price:100,original_stop:95,targets:[102,104,108],
 margin_used:100,leverage:2,remaining_fraction:.2,recorded_partial_pnl_usdt:8,received_at:'2026-10-15T00:00:00Z',
 open_performance:{mark_price:105,pnl_usdt:10,roi_pct:10}};
const closed={...active,signal_id:'B',closed:true,closed_at:'2026-10-14T00:00:00Z',close_reason:'BE_INFERRED',pnl_usdt:3,roi_pct:3};
const positive={...active,signal_id:'C',max_tp:0,featured_reason:'Rendimiento abierto positivo'};
const fallback={...closed,signal_id:'D',pnl_usdt:2,roi_pct:2};
const protectedRow={signal_id:'N',symbol:'NUSDT',direction:'LONG',timeframe:'15M',closed:false,max_tp:0,prices_visible:false,received_at:'2026-10-15T00:00:00Z'};
context.fixture={signals:[active,closed,positive,fallback,protectedRow,{...closed,signal_id:'LOSS',featured:false,pnl_usdt:-2}],
 featured_signal_ids:['A','C','B','D'],featured_policy:'Selección de destacadas. No representa el registro completo.',app_url:'https://example.test/app'};
vm.runInContext('data=fixture;renderOpen()',context);
let cards=elements.get('open-signals').children;
assert.equal(cards.filter(card=>card.className.includes('preview-signal')).length,4);
assert.equal(cards.filter(card=>card.className.includes('closed-highlight')).length,2);
assert.equal(elements.get('live-count').textContent,'3','Closed backups do not increase the live count');
for(const card of cards.filter(card=>card.className.includes('closed-highlight'))){
 assert.ok(card.textContent.includes('CERRADA · RESULTADO POSITIVO'));
 assert.ok(card.textContent.includes('Resultado cerrado:'));
 assert.equal(card.textContent.includes('Resultado abierto'),false);
}
assert.equal(cards.some(card=>/undefined|NaN/.test(card.textContent)),false);
assert.ok(cards.find(card=>card.className.includes('protected-signal')).textContent.includes('reservados'));
assert.ok(elements.get('featured-note').textContent.includes('No representa el registro completo'));
assert.equal(context.livePerformance(active,105).pnl_usdt,10);
assert.equal(context.livePerformance({...active,direction:'SHORT'},95).pnl_usdt,10);
context.fixture.featured_signal_ids=['C','B','D'];context.fixture.signals[0].prices_visible=false;
vm.runInContext('renderOpen()',context);
cards=elements.get('open-signals').children;
assert.equal(cards.filter(card=>card.className.includes('preview-signal')).length,3,'A revoked preview is immediately masked');
assert.ok(cards.filter(card=>card.className.includes('protected-signal')).every(card=>!card.textContent.includes('Entrada:')));
console.log('Featured UI: four highlights, closed fallback labels, live counts, actual open P&L and revoked-price masking passed.');
