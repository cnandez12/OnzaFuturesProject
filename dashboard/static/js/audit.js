/* Audit reads the ledger; it never changes a trade or dispatches an event. */
let auditRequest = 0, auditData = null, auditChart = null;
const auditNames = {partial_no_be:'40/40/20 · stop original', partial_be:'40/40/20 · BE tras TP1', max_tp:'100% al TP máximo · retrospectivo'};
const auditMoney = value => value == null ? '—' : Number(value).toLocaleString('es-CO',{style:'currency',currency:'USD',minimumFractionDigits:2});
const auditDate = value => value ? new Date(value).toLocaleString('es-CO',{timeZone:'America/Bogota'}) : '—';
const auditPercent = value => value == null ? '—' : Number(value).toLocaleString('es-CO',{maximumFractionDigits:2})+'%';
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
function auditPF(s) { return s.profit_factor_unbounded ? '∞ (sin pérdidas)' : s.profit_factor == null ? '—' : String(s.profit_factor); }
function auditQuality(row) {
  return {webhook_simulation_no_fills:'Precios de alertas · stop original',be_inferred_from_original_sl:'BE por regla TP1 · salida inferida',
    be_path_unverified:'BE activo por TP1 · salida según alertas disponibles',be_price_observed_no_fill:'Cruce BE observado',
    highest_tp_full_margin_hindsight:'TP máximo conocido al final · retrospectivo'}[row.quality] || row.quality;
}
function auditDetails(signal) {
  const box=auditNode('details',null,'audit-detail');box.append(auditNode('summary','Ver tramos, los tres escenarios y eventos guardados'));
  box.append(auditNode('p',`Entrada: ${signal.entry_price} · Stop original: ${signal.original_stop ?? '—'} · TP: ${signal.targets.join(' / ')} · Cantidad inicial: ${signal.quantity_initial.toFixed(8)} · Margen histórico: ${auditMoney(signal.margin_used)} · ${signal.leverage}x`));
  box.append(auditNode('p',signal.be_activated ? `BE habilitado automáticamente tras TP1: ${auditDate(signal.be_activated_at)} · Stop en entrada: ${signal.be_stop_price} · Fecha persistida: ${signal.be_persisted?'sí':'pendiente'} · Precio persistido: ${signal.stored_be_stop_price ?? 'pendiente'}` : 'BE inactivo: todavía no hay TP1 aplicado.'));
  for(const [mode,scenario] of Object.keys(auditNames).map(key=>[key,signal.scenarios[key]])) {
    box.append(auditNode('h3',auditNames[mode]));
    box.append(auditNode('p',`${scenario.closed?scenario.close_reason:'Abierta'} · Resultado cerrado: ${auditMoney(scenario.pnl_usdt)} · ROI sobre margen: ${auditPercent(scenario.roi_pct)} · Remanente: ${auditPercent(scenario.remaining_fraction*100)} · ${auditQuality(scenario)}`));
    box.append(auditTable(['Tramo','% inicial','Cantidad','Precio de salida','P&L USDT','ROI / margen','Fecha Colombia','Base del cálculo'],
      scenario.legs.map(l=>[l.kind,auditPercent(l.fraction*100),l.quantity.toFixed(8),l.price,auditMoney(l.pnl_usdt),auditPercent(l.roi_pct),auditDate(l.at),
        ({recorded_alert:'Precio guardado',tp1_rule_inferred:'Entrada por regla BE',price_observation:'Precio observado',highest_tp_hindsight:'TP máximo retrospectivo'})[l.basis] || l.basis])));
  }
  box.append(auditNode('h3','Conciliación con el registro original'));
  box.append(auditNode('p',`Registro guardado: ${auditMoney(signal.recorded_pnl_usdt)} · Reconstrucción sin BE: ${auditMoney(signal.scenarios.partial_no_be.pnl_usdt)} · Diferencia: ${auditMoney(signal.reconciliation_difference_usdt)} · ${signal.reconciliation_status}`));
  box.append(auditNode('h3','Eventos persistidos y entrega por evento'));
  box.append(auditTable(['ID','Evento','Estado local','Precio','ROI recibido','Recibido · Colombia','Aplicado · Colombia','Entrega Onza'],
    signal.events.map(e=>[e.id,e.type,e.state,e.price,auditPercent(e.roi_pct),auditDate(e.received_at),auditDate(e.applied_at),e.onza_status])));
  return box;
}
function renderAuditChart(comparison) {
  if(auditChart) {auditChart.destroy();auditChart=null;}
  const canvas=document.getElementById('audit-curve');if(!canvas || typeof Chart==='undefined')return;
  const dates=[...new Set(Object.values(comparison).flatMap(s=>s.curve.map(p=>p.at)))].sort();
  const colors={partial_no_be:'#4ac7ff',partial_be:'#33db9d',max_tp:'#b994ff'};
  const datasets=Object.keys(auditNames).map(mode=>[mode,comparison[mode]]).map(([mode,s])=>{
    let index=0,value=0;const points=dates.map(date=>{while(index<s.curve.length && s.curve[index].at<=date)value=s.curve[index++].pnl_usdt;return value;});
    return {label:auditNames[mode],data:[0,...points],borderColor:colors[mode],pointRadius:0,borderWidth:2,stepped:true};
  });
  auditChart=new Chart(canvas,{type:'line',data:{labels:['Inicio',...dates.map(auditDate)],datasets},options:{responsive:true,maintainAspectRatio:false,
    interaction:{mode:'index',intersect:false},plugins:{legend:{labels:{color:'#a8bed0'}},tooltip:{callbacks:{label:c=>`${c.dataset.label}: ${auditMoney(c.raw)}`}}},
    scales:{x:{ticks:{color:'#8ba4bb',maxTicksLimit:6},grid:{color:'#1b3145'}},y:{ticks:{color:'#8ba4bb',callback:v=>auditMoney(v)},grid:{color:'#1b3145'},title:{display:true,text:'P&L acumulado de cierres · USDT',color:'#8ba4bb'}}}}});
}
async function renderAudit() {
  const mode=document.getElementById('audit-mode')?.value,summary=document.getElementById('audit-summary'),body=document.getElementById('audit-rows'),status=document.getElementById('audit-status');
  if(!mode || !summary || !body || !status)return;
  const request=++auditRequest;status.textContent='Cargando corte de base de datos…';
  const params=new URLSearchParams({mode});for(const field of ['from','to','status','search']) {const value=document.getElementById(field==='status'?'audit-status-input':'audit-'+field)?.value;if(value)params.set(field,value);}
  document.getElementById('audit-explanation').textContent=(mode==='partial_be'
    ? 'TP1 realiza el 40% y activa automáticamente BE en entrada para el 60% restante. TP2 realiza otro 40%; tras TP2 queda el 20%. Una salida adversa simula el cierre del remanente en entrada.'
    :mode==='partial_no_be'?'TP1/TP2/TP3 realizan 40/40/20. El remanente sale al stop original o al cierre por señal opuesta; se descarta BE para esta simulación.'
    :'Proyección retrospectiva: 100% del margen al TP más alto de una operación cerrada; sin TP, al precio de cierre. Utiliza el máximo conocido al final, no una decisión anticipada.')+
    ' Resultados brutos con margen histórico, sin comisiones, funding ni deslizamiento. Auditoría suma importes redondeados por señal; la barra lateral conserva el P&L global y redondea el total.';
  try {
    const data=await fetchJson('/api/audit/results?'+params);if(request!==auditRequest)return;
    auditData=data;summary.replaceChildren();const s=data.summary;
    auditCard(summary,'Señales / cerradas / abiertas',`${s.signals} / ${s.closed} / ${s.open}`);
    auditCard(summary,'P&L cerrado · USDT',auditMoney(s.pnl_usdt));auditCard(summary,'Win rate cerrado',auditPercent(s.win_rate));
    auditCard(summary,'Profit factor',auditPF(s));auditCard(summary,'Máximo drawdown · USDT',auditMoney(s.max_drawdown_usdt));
    auditCard(summary,'Parciales de abiertas · USDT',mode==='max_tp'?'No vende parciales':auditMoney(s.open_partial_pnl_usdt));
    auditCard(summary,'TP1 / TP2 / TP3 alcanzados',`${s.reached_counts['1']} / ${s.reached_counts['2']} / ${s.reached_counts['3']}`);
    auditCard(summary,'BE habilitado / salidas BE simuladas',`${s.be_activated} / ${s.inferred}`);
    const coverage=data.coverage,r=data.reconciliation;
    document.getElementById('audit-coverage').textContent=`Cobertura global: ${coverage.events_total} eventos guardados · ${Object.entries(coverage.states).map(([k,v])=>`${k}: ${v}`).join(' · ')} · ${coverage.incidents} incidencias (${coverage.incident_events} eventos). Selección: ${coverage.selected_signals} señales. Conciliación del stop original: ${r.matched} coinciden · ${r.mismatched} diferencias · ${r.missing} sin cierre guardado · diferencia ${auditMoney(r.difference_usdt)}. Fechas de entrada en Colombia.`;
    const compare=document.getElementById('audit-comparison');compare.replaceChildren(auditTable(
      ['Estrategia','Cierres','P&L bruto','Win rate','PF','Drawdown USDT','Peor operación','Ganadas / perdidas / neutras'],
      Object.keys(auditNames).map(key=>[key,data.comparison[key]]).map(([key,v])=>[auditNames[key],v.closed,auditMoney(v.pnl_usdt),auditPercent(v.win_rate),auditPF(v),auditMoney(v.max_drawdown_usdt),auditMoney(v.worst_trade_usdt),`${v.wins} / ${v.losses} / ${v.flat}`])));
    const original=data.comparison.partial_no_be,be=data.comparison.partial_be;
    document.getElementById('audit-conclusion').textContent=original.closed
      ? `${be.pnl_usdt>=original.pnl_usdt?'BE tras TP1':'Stop original'} tiene mayor P&L bajo las reglas de esta simulación en ${original.closed} cierres; diferencia BE − original: ${auditMoney(be.pnl_usdt-original.pnl_usdt)}. Compara también el drawdown y la peor pérdida. La activación BE es automática; el registro de alertas no aporta la hora exacta de cada cruce de entrada. El TP máximo es una referencia retrospectiva.`
      :'No hay cierres en la selección para comparar rendimiento.';
    renderAuditChart(data.comparison);body.replaceChildren();
    for(const signal of data.rows) {
      const tr=auditNode('tr');
      [signal.signal_id+' · '+auditDate(signal.received_at),`${signal.symbol} · ${signal.direction} · ${signal.timeframe}`,
       `${auditMoney(signal.margin_used)} · ${signal.leverage}x`,signal.max_tp?`TP${signal.max_tp}`:'Ninguno',
       signal.be_activated?`Activo desde TP1 · ${signal.be_stop_price}${signal.be_applied?' · aplicado':' · omitido en este modo'}`:'Inactivo',
       signal.closed?signal.close_reason:'Abierta',auditMoney(signal.pnl_usdt),auditMoney(signal.recorded_partial_pnl_usdt),
       signal.reconciliation_status==='match'?'Coincide':signal.reconciliation_status==='open'?'Abierta':signal.reconciliation_status==='missing_record'?'Sin registro':auditMoney(signal.reconciliation_difference_usdt)
      ].forEach(value=>auditCell(tr,value));body.append(tr);
      const detailRow=auditNode('tr'),cell=auditCell(detailRow,null);cell.colSpan=9;cell.append(auditDetails(signal));body.append(detailRow);
    }
    if(!data.rows.length){const tr=auditNode('tr'),td=auditCell(tr,'Sin señales para estos filtros.');td.colSpan=9;body.append(tr);}
    const incidents=document.getElementById('audit-incidents');incidents.replaceChildren();
    if(!data.incidents.length)incidents.append(auditNode('p','No hay eventos excluidos por ausencia o inconsistencia de entrada.'));
    for(const incident of data.incidents) {
      const detail=auditNode('details',null,'audit-detail');detail.append(auditNode('summary',`${incident.signal_id} · ${incident.events.length} eventos · ${incident.reason}`));
      detail.append(auditTable(['ID','Evento','Estado','Precio','Recibido Colombia','Entrega Onza'],incident.events.map(e=>[e.id,e.type,e.state,e.price,auditDate(e.received_at),e.onza_status])));incidents.append(detail);
    }
    status.textContent=`${data.rows.length} señales · corte ${auditDate(data.as_of)} · Colombia`;
  }catch(error){if(request!==auditRequest)return;auditData=null;summary.replaceChildren();body.replaceChildren();
    ['audit-comparison','audit-incidents'].forEach(id=>document.getElementById(id)?.replaceChildren());
    if(auditChart){auditChart.destroy();auditChart=null;}document.getElementById('audit-coverage').textContent='No hay un corte válido. Revisa los filtros o vuelve a cargar.';
    document.getElementById('audit-conclusion').textContent='';status.textContent='No se pudo cargar la auditoría';console.error(error);}
}
function exportAudit(format) {
  if(!auditData)return;
  const mode=auditData.summary.mode;let content,type;
  if(format==='json'){content=JSON.stringify(auditData,null,2);type='application/json';}
  else {
    const quote=value=>{let text=value==null?'':String(value);if(typeof value==='string' && /^[=+\-@]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
    const rows=[['signal_id','estrategia','símbolo','dirección','fecha_entrada','margen','apalancamiento','entrada','stop_original','BE_activado','stop_BE','estado','P&L_cerrado_USDT','ROI_margen','tramo','fracción_inicial','precio_salida','P&L_tramo_USDT','fecha_tramo','base_cálculo','remanente','P&L_registro_original','diferencia_original']];
    for(const signal of auditData.rows)for(const [key,s] of Object.keys(auditNames).map(key=>[key,signal.scenarios[key]]))for(const leg of s.legs.length?s.legs:[{}])
      rows.push([signal.signal_id,key,s.symbol,s.direction,s.received_at,s.margin_used,s.leverage,s.entry_price,s.original_stop,s.be_activated,s.be_stop_price,
        s.closed?s.close_reason:'OPEN',s.pnl_usdt,s.roi_pct,leg.kind,leg.fraction,leg.price,leg.pnl_usdt,leg.at,leg.basis,s.remaining_fraction,signal.recorded_pnl_usdt,signal.reconciliation_difference_usdt]);
    content='\ufeff'+rows.map(row=>row.map(quote).join(';')).join('\r\n');type='text/csv;charset=utf-8';
  }
  const url=URL.createObjectURL(new Blob([content],{type})),a=auditNode('a');a.href=url;a.download=`onza-auditoria-${mode}-${auditData.as_of.slice(0,10)}.${format}`;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
