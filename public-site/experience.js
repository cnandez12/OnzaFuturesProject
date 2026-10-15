function renderPremiumFeed(){
 if(!data)return;const rows=data.signals.filter(r=>r.closed).sort((a,b)=>b.closed_at.localeCompare(a.closed_at));
 const feed=document.getElementById('hero-feed');feed.replaceChildren();
 for(const r of rows.slice(0,3)){const row=node('div',null,'terminal-row'),asset=node('div');asset.append(node('strong',cleanSymbol(r.symbol)+' / '+r.direction),node('small',exitName(r)+' · '+r.timeframe));row.append(asset,node('strong',pct(r.roi_pct),r.roi_pct>=0?'positive':'negative'));feed.append(row);}
 const ticker=document.getElementById('market-ticker');ticker.replaceChildren();
 for(let repeat=0;repeat<2;repeat++)for(const r of rows.slice(0,12)){const item=node('span');item.append(node('strong',cleanSymbol(r.symbol)),node('i',pct(r.roi_pct),r.roi_pct>=0?'positive':'negative'));ticker.append(item);}
 document.querySelectorAll('.stats strong').forEach(el=>{el.classList.remove('updated');requestAnimationFrame(()=>el.classList.add('updated'));});
}
document.addEventListener('DOMContentLoaded',()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('.overview,.how,#resultados,#en-vivo,.cta,.faq,.methodology').forEach(el=>{if(!reduced)el.classList.add('reveal');observer.observe(el);});
 const shell=document.getElementById('public-chart-shell');
 const statsMedia=window.matchMedia('(min-width:721px)');let statsChosen=false;
 function showStats(shown){shell.classList.toggle('show-chart-stats',shown);shell.classList.toggle('hide-chart-stats',!shown);document.getElementById('chart-stats-toggle').setAttribute('aria-pressed',String(shown));}
 showStats(statsMedia.matches);statsMedia.addEventListener('change',event=>{if(!statsChosen)showStats(event.matches);});
 document.getElementById('chart-stats-toggle').addEventListener('click',event=>{
  statsChosen=true;showStats(!shell.classList.contains('show-chart-stats'));
 });
 const full=document.getElementById('chart-fullscreen');
 function closeFull(){shell.classList.remove('fullscreen-chart');full.textContent='Ampliar gráfico ↗';full.setAttribute('aria-pressed','false');document.body.style.overflow='';}
 full.addEventListener('click',()=>{const enabled=shell.classList.toggle('fullscreen-chart');full.textContent=enabled?'Cerrar vista ampliada ×':'Ampliar gráfico ↗';full.setAttribute('aria-pressed',String(enabled));document.body.style.overflow=enabled?'hidden':'';});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFull();});
});
