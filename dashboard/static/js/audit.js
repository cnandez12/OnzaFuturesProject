/* Una vista; los tres resultados salen del mismo registro de eventos. */
let auditRequest = 0;

function auditCell(row, value) {
  const cell = document.createElement('td');
  cell.textContent = value == null ? '—' : String(value);
  cell.style.padding = '10px 12px';
  cell.style.borderBottom = '1px solid var(--border)';
  row.appendChild(cell);
}

function auditCard(container, label, value) {
  const card = document.createElement('div');
  card.className = 'kpi-card';
  const name = document.createElement('div');
  name.className = 'kpi-label';
  name.textContent = label;
  const number = document.createElement('div');
  number.className = 'kpi-value';
  number.textContent = value;
  card.append(name, number);
  container.appendChild(card);
}

async function renderAudit() {
  const mode = document.getElementById('audit-mode')?.value;
  const summaryBox = document.getElementById('audit-summary');
  const body = document.getElementById('audit-rows');
  const status = document.getElementById('audit-status');
  if (!mode || !summaryBox || !body || !status) return;
  const requestId = ++auditRequest;
  const explanation = document.getElementById('audit-explanation');
  explanation.textContent = mode === 'partial_be'
    ? 'Al llegar TP1 se habilita BE sobre el 60% restante. Un cierre en entrada inferido por una alerta adversa es teórico: la alerta no prueba un fill en Bitunix ni descarta gaps, comisiones o deslizamiento.'
    : mode === 'partial_no_be'
      ? 'Los parciales cierran 40/40/20; el resto conserva el stop original. La activación de BE se guarda como hecho de la señal, sin aplicarla aquí.'
      : 'Se registra el TP más alto informado. Este modo no supone venta de toda la posición ni calcula P&L.';
  status.textContent = 'Cargando…';
  try {
    const data = await fetchJson('/api/audit/results?mode=' + encodeURIComponent(mode));
    if (requestId !== auditRequest) return;
    const s = data.summary;
    summaryBox.replaceChildren();
    auditCard(summaryBox, 'Señales / cerradas', `${s.signals} / ${s.closed}`);
    auditCard(summaryBox, 'TP1 · TP2 · TP3 máximo', `${s.max_tp_counts['1']} · ${s.max_tp_counts['2']} · ${s.max_tp_counts['3']}`);
    auditCard(summaryBox, 'BE habilitado en TP1', String(s.be_activated));
    if (mode === 'max_tp') {
      auditCard(summaryBox, 'Resultado monetario', 'No aplica');
    } else {
      auditCard(summaryBox, 'P&L bruto teórico', `${s.pnl_usdt >= 0 ? '+' : ''}$${Number(s.pnl_usdt).toFixed(2)}`);
      auditCard(summaryBox, 'Win rate cerrado', s.win_rate == null ? '—' : `${s.win_rate}%`);
      auditCard(summaryBox, mode === 'partial_be' ? 'PF hipotético con BE' : 'PF bruto teórico',
        s.profit_factor == null ? '—' : String(s.profit_factor));
      if (mode === 'partial_be') auditCard(summaryBox, 'BE inferido / sin recorrido verificable', `${s.inferred} / ${s.unverified}`);
    }
    body.replaceChildren();
    const quality = {
      webhook_simulation_no_fills: 'Simulación sin fills',
      be_inferred_from_original_sl: 'BE inferido, sin fill',
      be_path_unverified: 'Recorrido BE sin verificar',
      tp_reached_by_webhook_no_fills: 'TP comunicado, sin fill'
    };
    for (const signal of data.rows) {
      const tr = document.createElement('tr');
      auditCell(tr, `${signal.signal_id}\n${new Date(signal.received_at).toLocaleString('es')}`);
      auditCell(tr, signal.source_exchange);
      auditCell(tr, signal.max_tp ? `TP${signal.max_tp}` : 'Ninguno');
      auditCell(tr, signal.be_activated ? 'Sí' : 'No');
      auditCell(tr, signal.closed ? signal.close_reason : 'Abierta');
      auditCell(tr, mode === 'max_tp' || signal.pnl_usdt == null ? '—' : `${signal.pnl_usdt >= 0 ? '+' : ''}$${Number(signal.pnl_usdt).toFixed(2)}`);
      auditCell(tr, (quality[signal.quality] || signal.quality)
        + (signal.margin_recorded ? '' : ' · margen actual usado'));
      auditCell(tr, signal.onza_delivery === 'delivered' ? 'Entregado' : 'Pendiente / revisar');
      body.appendChild(tr);
    }
    status.textContent = `${data.rows.length} señales · ${new Date().toLocaleTimeString('es')}`;
  } catch (error) {
    if (requestId !== auditRequest) return;
    status.textContent = 'No se pudo cargar la auditoría';
    console.error('Audit load failed:', error);
  }
}
