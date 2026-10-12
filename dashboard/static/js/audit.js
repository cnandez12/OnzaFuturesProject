/* Audit reads the ledger; it never changes a trade or dispatches an event. */
let auditRequest = 0, auditData = null, auditChart = null;
const auditNames = {partial_no_be:'40/40/20 Â· stop original', partial_be:'40/40/20 Â· BE tras TP1', max_tp:'100% al TP mÃ¡ximo Â· retrospectivo'};
const auditMoney = value => value == null ? 'â€”' : Number(value).toLocaleString('es-CO',{style:'currency',currency:'USD',minimumFractionDigits:2});
const auditDate = value => value ? new Date(value).toLocaleString('es-CO',{timeZone:'America/Bogota'}) : 'â€”';
const auditPercent = value => value == null ? 'â€”' : Number(value).toLocaleString('es-CO',{maximumFractionDigits:2})+'%';
function auditNode(tag, text, className) {
  const node=document.createElement(tag); if(text != null) node.textContent=String(text); if(className) node.className=className; return node;
}
function auditCell(row,value) { const cell=auditNode('td',value); row.appendChild(cell); return cell; }
function auditCard(container,label,value) {
  const card=auditNode('div',null,'kpi-card'); card.append(auditNode('div',label,'kpi-label'),auditNode('div',value,'kpi-value')); container.append(card);
}
function auditTable(headers,rows) {
  const wrap=auditNode('div',null,'audit-scroll'), table=auditNode('table',null,'audit-table');
  const head=auditNode('thead'), hr=auditNode('tr'); headers.forEach(h=>hr.append(auditNode('th',h)));head.append(hr);
  const body=auditNode('tbody');rows.forEach(values=>{const tr=auditNode('tr');values.forEach(v=>auditCell(tr,v));body.append(tr);});
  table.append(head,body);wrap.append(table);return wrap;
}
function auditPF(s) { return s.profit_factor_unbounded ? 'âˆž (sin pÃ©rdidas)' : s.profit_factor == null ? 'â€”' : String(s.profit_factor); }
function auditQuality(row) {
  return {webhook_simulation_no_fills:'Precios de alertas Â· stop original',be_inferred_from_original_sl:'BE por regla TP1 Â· salida inferida',
    be_path_unverified:'BE activo por TP1 Â· salida segÃºn alertas disponibles',be_price_observed_no_fill:'Cruce BE observado',
    highest_tp_full_margin_hindsight:'TP mÃ¡ximo conocido al final Â· retrospectivo'}[row.quality] || row.quality;
}
function auditDetails(signal) {
  const box=auditNode('details',null,'audit-detail');box.append(auditNode('summary','Ver tramos, los tres escenarios y eventos guardados'));
  box.append(auditNode('p',`Entrada: ${signal.entry_price} Â· Stop original: ${signal.original_stop ?? 'â€”'} Â· TP: ${signal.targets.join(' / ')} Â· Cantidad inicial: ${signal.quantity_initial.toFixed(8)} Â· Margen histÃ³rico: ${auditMoney(signal.margin_used)} Â· ${signal.leverage}x`));
  box.append(auditNode('p',signal.be_activated ? `BE habilitado automÃ¡ticamente tras TP1: ${auditDate(signal.be_activated_at)} Â· Stop en entrada: ${signal.be_stop_price} Â· Fecha persistida: ${signal.be_persisted?'sÃ­':'pendiente'} Â· Precio persistido: ${signal.stored_be_stop_price ?? 'pendiente'}` : 'BE inactivo: todavÃ­a no hay TP1 aplicado.'));
  for(const [mode,scenario] of Object.entries(signal.scenarios)) {
    box.append(auditNode('h3',auditNames[mode]));
    box.append(auditNode('p',`${scenario.closed?scenario.close_reason:'Abierta'} Â· Resultado cerrado: ${auditMoney(scenario.pnl_usdt)} Â· ROI sobre margen: ${auditPercent(scenario.roi_pct)} Â· Remanente: ${auditPercent(scenario.remaining_fraction*100)} Â· ${auditQuality(scenario)}`));
    box.append(auditTable(['Tramo','% inicial','Cantidad','Precio de salida','P&L USDT','ROI / margen','Fecha Colombia','Base del cÃ¡lculo'],
      scenario.legs.map(l=>[l.kind,auditPercent(l.fraction*100),l.quantity.toFixed(8),l.price,auditMoney(l.pnl_usdt),auditPercent(l.roi_pct),auditDate(l.at),
        ({recorded_alert:'Precio guardado',tp1_rule_inferred:'Entrada por regla BE',price_observation:'Precio observado',highest_tp_hindsight:'TP mÃ¡ximo retrospectivo'})[l.basis] || l.basis])));
  }
  box.append(auditNode('h3','ConciliaciÃ³n con el registro original'));
  box.append(auditNode('p',`Registro guardado: ${auditMoney(signal.recorded_pnl_usdt)} Â· ReconstrucciÃ³n sin BE: ${auditMoney(signal.scenarios.partial_no_be.pnl_usdt)} Â· Diferencia: ${auditMoney(signal.reconciliation_difference_usdt)} Â· ${signal.reconciliation_status}`));
  box.append(auditNode('h3','Eventos persistidos y entrega por evento'));
  box.append(auditTable(['ID','Evento','Estado local','Precio','ROI recibido','Recibido Â· Colombia','Aplicado Â· Colombia','Entrega Onza'],
    signal.events.map(e=>[e.id,e.type,e.state,e.price,auditPercent(e.roi_pct),auditDate(e.received_at),auditDate(e.applied_at),e.onza_status])));
  return box;
}
function renderAuditChart(comparison) {
  if(auditChart) {auditChart.destroy();auditChart=null;}
  const canvas=document.getElementById('audit-curve');if(!canvas || typeof Chart==='undefined')return;
  const dates=[...new Set(Object.values(comparison).flatMap(s=>s.curve.map(p=>p.at)))].sort();
  const colors={partial_no_be:'#4ac7ff',partial_be:'#33db9d',max_tp:'#b994ff'};
  const datasets=Object.entries(comparison).map(([mode,s])=>{
    let index=0,value=0;const points=dates.map(date=>{while(index<s.curve.length && s.curve[index].at<=date)value=s.curve[index++].pnl_usdt;return value;});
    return {label:auditNames[mode],data:[0,...points],borderColor:colors[mode],pointRadius:0,borderWidth:2,stepped:true};
  });
  auditChart=new Chart(canvas,{type:'line',data:{labels:['Inicio',...dates.map(auditDate)],datasets},options:{responsive:true,maintainAspectRatio:false,
    interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{color:'#a8bed0'}},tooltip:{callbacks:{label:c=>`${c.dataset.label}: ${auditMoney(c.raw)}`}}},
    scales:{x:{ticks:{color:'#8ba4bb',maxTicksLimit:6},grid:{color:'#1b3145'}},y:{ticks:{color:'#8ba4bb',callback:v=>auditMoney(v)},grid:{color:'#1b3145'},title:{display:true,text:'P&L acumulado de cierres Â· USDT',color:'#8ba4bb'}}}}});
}
async function renderAudit() {
  const mode=document.getElementById('audit-mode')?.value,summary=document.getElementById('audit-summary'),body=document.getElementById('audit-rows'),status=document.getElementById('audit-status');
  if(!mode || !summary || !body || !status)return;
  const request=++auditRequest;status.textContent='Cargando corte de base de datosâ€¦';
  const params=new URLSearchParams({mode});for(const field of ['from','to','status','search']) {const value=document.getElementById(field==='status'?'audit-status-input':'audit-'+field)?.value;if(value)params.set(field,value);}
  document.getElementById('audit-explanation').textContent=(mode==='partial_be'
    ? 'TP1 realiza el 40% y activa automÃ¡ticamente BE en entrada para el 60% restante. TP2 realiza otro 40%; tras TP2 queda el 20%. Una salida adversa simula el cierre del remanente en entrada.'
    :mode==='partial_no_be'?'TP1/TP2/TP3 realizan 40/40/20. El remanente sale al stop original o al cierre por seÃ±al opuesta; se descarta BE para esta simulaciÃ³n.'
    :'ProyecciÃ³n retrospectiva: 100% del margen al TP mÃ¡s alto de una operaciÃ³n cerrada; sin TP, al precio de cierre. Utiliza el mÃ¡ximo conocido al final, no una decisiÃ³n anticipada.')+
    ' Todos los resultados son brutos, con margen histÃ³rico; la barra lateral conserva el P&L global del dashboard.';
  try {
    const data=await fetchJson('/api/audit/results?'+params);if(request!==auditRequest)return;
    auditData=data;summary.replaceChildren();const s=data.summary;
    auditCard(summary,'SeÃ±ales / cerradas / abiertas',`${s.signals} / ${s.closed} / ${s.open}`);
    auditCard(summary,'P&L cerrado Â· USDT',auditMoney(s.pnl_usdt));auditCard(summary,'Win rate cerrado',auditPercent(s.win_rate));
    auditCard(summary,'Profit factor',auditPF(s));auditCard(summary,'MÃ¡ximo drawdown Â· USDT',auditMoney(s.max_drawdown_usdt));
    auditCard(summary,'Parciales de abiertas Â· USDT',mode==='max_tp'?'No vende parciales':auditMoney(s.open_partial_pnl_usdt));
    auditCard(summary,'TP1 / TP2 / TP3 alcanzados',`${s.reached_counts['1']} / ${s.reached_counts['2']} / ${s.reached_counts['3']}`);
    auditCard(summary,'BE habilitado / salidas BE simuladas',`${s.be_activated} / ${s.inferred}`);
    const coverage=data.coverage,r=data.reconciliation;
    document.getElementById('audit-coverage').textContent=`Cobertura global: ${coverage.events_total} eventos guardados Â· ${Object.entries(coverage.states).map(([k,v])=>`${k}: ${v}`).join(' Â· ')} Â· ${coverage.incidents} incidencias (${coverage.incident_events} eventos). SelecciÃ³n: ${coverage.selected_signals} seÃ±ales. ConciliaciÃ³n del stop original: ${r.matched} coinciden Â· ${r.mismatched} diferencias Â· ${r.missing} sin cierre guardado Â· diferencia ${auditMoney(r.difference_usdt)}. Fechas de entrada en Colombia.`;
    const compare=document.getElementById('audit-comparison');compare.replaceChildren(auditTable(
      ['Estrategia','Cierres','P&L bruto','Win rate','PF','Drawdown USDT','Peor operaciÃ³n','Ganadas / perdidas / neutras'],
      Object.entries(data.comparison).map(([key,v])=>[auditNames[key],v.closed,auditMoney(v.pnl_usdt),auditPercent(v.win_rate),auditPF(v),auditMoney(v.max_drawdown_usdt),auditMoney(v.worst_trade_usdt),`${v.wins} / ${v.losses} / ${v.flat}`])));
    const original=data.comparison.partial_no_be,be=data.comparison.partial_be;
    document.getElementById('audit-conclusion').textContent=original.closed
      ? `${be.pnl_usdt>=original.pnl_usdt?'BE tras TP1':'Stop original'} tiene mayor P&L bajo las reglas de esta simulaciÃ³n en ${original.closed} cierres; diferencia BE âˆ’ original: ${auditMoney(be.pnl_usdt-original.pnl_usdt)}. Compara tambiÃ©n el drawdown y la peor pÃ©rdida. La activaciÃ³n BE es automÃ¡tica; el registro de alertas no aporta la hora exacta de cada cruce de entrada. El TP mÃ¡ximo es una referencia retrospectiva.`
      :'No hay cierres en la selecciÃ³n para comparar rendimiento.';
    renderAuditChart(data.comparison);body.replaceChildren();
    for(const signal of data.rows) {
      const tr=auditNode('tr');
      [signal.signal_id+' Â· '+auditDate(signal.received_at),`${signal.symbol} Â· ${signal.direction} Â· ${signal.timeframe}`,
       `${auditMoney(signal.margin_used)} Â· ${signal.leverage}x`,signal.max_tp?`TP${signal.max_tp}`:'Ninguno',
       signal.be_activated?`Activo desde TP1 Â· ${signal.be_stop_price}${signal.be_applied?' Â· aplicado':' Â· omitido en este modo'}`:'Inactivo',
       signal.closed?signal.close_reason:'Abierta',auditMoney(signal.pnl_usdt),auditMoney(signal.recorded_partial_pnl_usdt),
       signal.reconciliation_status==='match'?'Coincide':signal.reconciliation_status==='open'?'Abierta':signal.reconciliation_status==='missing_record'?'Sin registro':auditMoney(signal.reconciliation_difference_usdt)
      ].forEach(value=>auditCell(tr,value));body.append(tr);
      const detailRow=auditNode('tr'),cell=auditCell(detailRow,null);cell.colSpan=9;cell.append(auditDetails(signal));body.append(detailRow);
    }
    if(!data.rows.length){const tr=auditNode('tr'),td=auditCell(tr,'Sin seÃ±ales para estos filtros.');td.colSpan=9;body.append(tr);}
    const incidents=document.getElementById('audit-incidents');incidents.replaceChildren();
    if(!data.incidents.length)incidents.append(auditNode('p','No hay eventos excluidos por ausencia o inconsistencia de entrada.'));
    for(const incident of data.incidents) {
      const detail=auditNode('details',null,'audit-detail');detail.append(auditNode('summary',`${incident.signal_id} Â· ${incident.events.length} eventos Â· ${incident.reason}`));
      detail.append(auditTable(['ID','Evento','Estado','Precio','Recibido Colombia','Entrega Onza'],incident.events.map(e=>[e.id,e.type,e.state,e.price,auditDate(e.received_at),e.onza_status])));incidents.append(detail);
    }
    status.textContent=`${data.rows.length} seÃ±ales Â· corte ${auditDate(data.as_of)} Â· Colombia`;
  }catch(error){if(request!==auditRequest)return;auditData=null;summary.replaceChildren();body.replaceChildren();
    ['audit-comparison','audit-incidents'].forEach(id=>document.getElementById(id)?.replaceChildren());
    if(auditChart){auditChart.destroy();auditChart=null;}document.getElementById('audit-coverage').textContent='No hay un corte vÃ¡lido. Revisa los filtros o vuelve a cargar.';
    document.getElementById('audit-conclusion').textContent='';status.textContent='No se pudo cargar la auditorÃ­a';console.error(error);}
}
function exportAudit(format) {
  if(!auditData)return;
  const mode=auditData.summary.mode;let content,type;
  if(format==='json'){content=JSON.stringify(auditData,null,2);type='application/json';}
  else {
    const quote=value=>{let text=value==null?'':String(value);if(typeof value==='string' && /^[=+\-@]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
    const rows=[['signal_id','estrategia','sÃ­mbolo','direcciÃ³n','fecha_entrada','margen','apalancamiento','entrada','stop_original','BE_activado','stop_BE','estado','P&L_cerrado_USDT','ROI_margen','tramo','fracciÃ³n_inicial','precio_salida','P&L_tramo_USDT','fecha_tramo','base_cÃ¡lculo','remanente','P&L_registro_original','diferencia_original']];
    for(const signal of auditData.rows)for(const [key,s] of Object.entries(signal.scenarios))for(const leg of s.legs.length?s.legs:[{}])
      rows.push([signal.signal_id,key,s.symbol,s.direction,s.received_at,s.margin_used,s.leverage,s.entry_price,s.original_stop,s.be_activated,s.be_stop_price,
        s.closed?s.close_reason:'OPEN',s.pnl_usdt,s.roi_pct,leg.kind,leg.fraction,leg.price,leg.pnl_usdt,leg.at,leg.basis,s.remaining_fraction,signal.recorded_pnl_usdt,signal.reconciliation_difference_usdt]);
    content='\ufeff'+rows.map(row=>row.map(quote).join(';')).join('\r\n');type='text/csv;charset=utf-8';
  }
  const url=URL.createObjectURL(new Blob([content],{type})),a=auditNode('a');a.href=url;a.download=`onza-auditoria-${mode}-${auditData.as_of.slice(0,10)}.${format}`;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
