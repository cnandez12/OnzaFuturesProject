/* Pure pricing math for recorded and hypothetical partial exits.
   The bot's recorded USDT result is authoritative for its original 40/40/20 split.
   Scenario changes apply only the price-derived delta to that result. */
const RECORDED_TP_SPLIT = [0.40, 0.40, 0.20];

function tradePriceModel(t, weights) {
  const entry = Number(t.entry_price);
  const exit = Number(t.exit_price);
  const direction = String(t.direction || '').toUpperCase();
  if (!(entry > 0) || !(exit > 0) || !['LONG', 'SHORT'].includes(direction)) return null;
  const sign = direction === 'LONG' ? 1 : -1;
  const hits = [!!t.hit_tp1, !!t.hit_tp2, !!t.hit_tp3 || t.close_reason === 'TP3'];
  const fills = [t.tp1_exit_price, t.tp2_exit_price, t.tp3_exit_price];
  const targets = [t.tp1, t.tp2, t.tp3];
  let remaining = 1, rate = 0, exitFactor = 0, estimatedFills = 0;
  const legs = [null, null, null];
  for (let i = 0; i < 3; i++) {
    if (!hits[i] || weights[i] <= 0) continue;
    const saved = Number(fills[i]);
    const price = saved > 0 ? saved : Number(targets[i]);
    if (!(price > 0)) return null;
    if (!(saved > 0)) estimatedFills++;
    const legRate = sign * (price - entry) / entry * weights[i];
    rate += legRate;
    legs[i] = { price, rate: legRate, estimated: !(saved > 0) };
    exitFactor += price / entry * weights[i];
    remaining -= weights[i];
  }
  if (remaining < -1e-8) return null;
  if (remaining > 1e-8) {
    rate += sign * (exit - entry) / entry * remaining;
    exitFactor += exit / entry * remaining;
  }
  return { rate, exitFactor, estimatedFills, legs };
}

function tradeScenario(t, weights) {
  const originalNotional = Number(t.margin_used) * Number(t.leverage);
  const recordedUsdt = Number(t.final_profit_usdt);
  const original = tradePriceModel(t, RECORDED_TP_SPLIT);
  const proposed = tradePriceModel(t, weights);
  if (!(originalNotional > 0) || !Number.isFinite(recordedUsdt)) return null;
  const recordedRate = recordedUsdt / originalNotional;
  const isOriginal = weights.every((w, i) => Math.abs(w - RECORDED_TP_SPLIT[i]) < 1e-8);
  if (!original || !proposed) {
    if (!isOriginal) return null; // insufficient prices: never invent a changed split
    return { rate: recordedRate, exitFactor: 1, discrepancy: null, estimatedFills: 0 };
  }
  return {
    rate: recordedRate + proposed.rate - original.rate,
    exitFactor: proposed.exitFactor,
    discrepancy: original.rate * originalNotional - recordedUsdt,
    estimatedFills: Math.max(original.estimatedFills, proposed.estimatedFills),
  };
}

function openPositionPnl(p, markPrice) {
  const entry = Number(p.entry);
  const margin = Number(p.margin_used);
  const leverage = Number(p.leverage);
  const accumulated = Number(p.pnl_accumulated || 0);
  const direction = String(p.direction || '').toUpperCase();
  if (!(entry > 0) || !(margin > 0) || !(leverage > 0) || !Number.isFinite(accumulated)) return null;
  const remaining = Math.max(0, 1 - (p.tp1_filled ? .4 : 0) - (p.tp2_filled ? .4 : 0));
  const mark = Number(markPrice);
  const floating = mark > 0 && ['LONG', 'SHORT'].includes(direction)
    ? (direction === 'LONG' ? mark - entry : entry - mark) * (margin * leverage / entry) * remaining
    : null;
  return {
    margin,
    accumulated,
    floating,
    net: floating === null ? null : accumulated + floating,
    floatingPct: floating === null ? null : floating / margin * 100,
    netPct: floating === null ? null : (accumulated + floating) / margin * 100,
  };
}

function tradeTpContributionPct(t, index) {
  const model = tradePriceModel(t, RECORDED_TP_SPLIT);
  const leverage = Number(t.leverage);
  if (!model || !model.legs[index] || !(leverage > 0)) return null;
  return model.legs[index].rate * leverage * 100;
}
