// ===== Deriverse Mock Trading Data =====

const SYMBOLS = ['SOL/USDC', 'BONK/USDC', 'JUP/USDC', 'WIF/USDC', 'RNDR/USDC', 'PYTH/USDC'];
const TYPES = ['Spot', 'Perpetual', 'Options'];
const SIDES = ['Long', 'Short'];
const ORDER_TYPES = ['Market', 'Limit'];
const TAGS_POOL = ['Planned', 'FOMO', 'Revenge Trade', 'Breakout', 'Trend Follow', 'Scalp', 'Swing', 'News Play'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTrades(count = 230) {
  const trades = [];
  const now = new Date(2026, 1, 17);

  for (let i = 0; i < count; i++) {
    const daysAgo = randomInt(0, 90);
    const hoursAgo = randomInt(0, 23);
    const openTime = new Date(now);
    openTime.setDate(openTime.getDate() - daysAgo);
    openTime.setHours(hoursAgo, randomInt(0, 59), randomInt(0, 59));

    const durationMinutes = Math.random() < 0.4
      ? randomInt(2, 60)        // scalp
      : Math.random() < 0.7
        ? randomInt(60, 1440)   // day trade
        : randomInt(1440, 10080); // swing

    const closeTime = new Date(openTime.getTime() + durationMinutes * 60 * 1000);
    const symbol = pickRandom(SYMBOLS);
    const side = pickRandom(SIDES);
    const type = pickRandom(TYPES);
    const orderType = pickRandom(ORDER_TYPES);

    const entryPrice = symbol.startsWith('SOL') ? randomBetween(80, 160) :
                       symbol.startsWith('BONK') ? randomBetween(0.00001, 0.00005) :
                       symbol.startsWith('JUP') ? randomBetween(0.5, 3) :
                       symbol.startsWith('WIF') ? randomBetween(0.5, 4) :
                       symbol.startsWith('RNDR') ? randomBetween(3, 12) :
                       randomBetween(0.2, 1.5);

    const pnlPercent = randomBetween(-15, 20);
    const isWin = pnlPercent > 0;
    const size = randomBetween(50, 5000);
    const pnlUsd = size * (pnlPercent / 100);
    const exitPrice = entryPrice * (1 + (side === 'Long' ? pnlPercent : -pnlPercent) / 100);
    const fee = size * randomBetween(0.0005, 0.003);

    const tags = [];
    if (Math.random() < 0.5) tags.push(pickRandom(TAGS_POOL));
    if (Math.random() < 0.2) tags.push(pickRandom(TAGS_POOL.filter(t => !tags.includes(t))));

    const notes = Math.random() < 0.3 ? pickRandom([
      'Entry sesuai rencana, exit terlalu cepat',
      'FOMO entry, seharusnya tunggu pullback',
      'Setup bagus, eksekusi perfect',
      'Oversize karena terlalu yakin',
      'Scalp cepat, ambil profit kecil',
      'Breakout gagal, cut loss tepat waktu',
      'Swing trade, hold 3 hari',
      'Revenge trade setelah loss sebelumnya',
    ]) : '';

    trades.push({
      id: `TRD-${String(i + 1).padStart(4, '0')}`,
      symbol,
      type,
      side,
      orderType,
      entryPrice: +entryPrice.toFixed(symbol.startsWith('BONK') ? 8 : 2),
      exitPrice: +exitPrice.toFixed(symbol.startsWith('BONK') ? 8 : 2),
      size: +size.toFixed(2),
      pnlUsd: +pnlUsd.toFixed(2),
      pnlPercent: +pnlPercent.toFixed(2),
      isWin,
      fee: +fee.toFixed(4),
      openTime: openTime.toISOString(),
      closeTime: closeTime.toISOString(),
      durationMinutes,
      tags,
      notes,
    });
  }

  return trades.sort((a, b) => new Date(b.closeTime) - new Date(a.closeTime));
}

export const trades = generateTrades();

// ===== Derived / Aggregated Data =====

export function getEquityCurve(tradeList) {
  const sorted = [...tradeList].sort((a, b) => new Date(a.closeTime) - new Date(b.closeTime));
  let equity = 10000;
  let peak = equity;
  const curve = [{ date: sorted[0]?.openTime?.slice(0, 10) || '2025-11-19', equity: 10000, drawdown: 0 }];

  sorted.forEach(t => {
    equity += t.pnlUsd;
    if (equity > peak) peak = equity;
    const drawdown = ((equity - peak) / peak) * 100;
    curve.push({
      date: t.closeTime.slice(0, 10),
      equity: +equity.toFixed(2),
      drawdown: +drawdown.toFixed(2),
    });
  });
  return curve;
}

export function getStats(tradeList) {
  const wins = tradeList.filter(t => t.isWin);
  const losses = tradeList.filter(t => !t.isWin);
  const totalPnl = tradeList.reduce((s, t) => s + t.pnlUsd, 0);
  const totalFees = tradeList.reduce((s, t) => s + t.fee, 0);
  const totalVolume = tradeList.reduce((s, t) => s + t.size, 0);
  const avgWin = wins.length ? wins.reduce((s, t) => s + t.pnlUsd, 0) / wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((s, t) => s + t.pnlUsd, 0) / losses.length : 0;

  const equityCurve = getEquityCurve(tradeList);
  const finalEquity = equityCurve[equityCurve.length - 1]?.equity || 10000;
  const maxDrawdown = Math.min(...equityCurve.map(p => p.drawdown));

  return {
    totalTrades: tradeList.length,
    wins: wins.length,
    losses: losses.length,
    winRate: tradeList.length ? (wins.length / tradeList.length * 100) : 0,
    totalPnl,
    totalPnlPercent: ((finalEquity - 10000) / 10000) * 100,
    avgWin,
    avgLoss,
    totalFees,
    totalVolume,
    equity: finalEquity,
    maxDrawdown,
  };
}

export function getVolumeByDay(tradeList) {
  const map = {};
  tradeList.forEach(t => {
    const day = t.closeTime.slice(0, 10);
    if (!map[day]) map[day] = { date: day, volume: 0, fees: 0 };
    map[day].volume += t.size;
    map[day].fees += t.fee;
  });
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date)).slice(-30).map(d => ({
    ...d,
    volume: +d.volume.toFixed(2),
    fees: +d.fees.toFixed(4),
  }));
}

export function getPerformanceByHour(tradeList) {
  const grid = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  days.forEach(day => {
    for (let h = 0; h < 24; h++) {
      grid.push({ day, hour: h, pnl: 0, count: 0 });
    }
  });
  tradeList.forEach(t => {
    const d = new Date(t.openTime);
    const dayIdx = (d.getDay() + 6) % 7;
    const hour = d.getHours();
    const cell = grid[dayIdx * 24 + hour];
    cell.pnl += t.pnlUsd;
    cell.count++;
  });
  return grid;
}

export function getLongShortStats(tradeList) {
  const long = tradeList.filter(t => t.side === 'Long');
  const short = tradeList.filter(t => t.side === 'Short');
  const winRate = arr => arr.length ? (arr.filter(t => t.isWin).length / arr.length * 100) : 0;
  const avgPnl = arr => arr.length ? arr.reduce((s, t) => s + t.pnlUsd, 0) / arr.length : 0;

  return [
    { side: 'Long', winRate: +winRate(long).toFixed(1), avgPnl: +avgPnl(long).toFixed(2), count: long.length },
    { side: 'Short', winRate: +winRate(short).toFixed(1), avgPnl: +avgPnl(short).toFixed(2), count: short.length },
  ];
}

export function getSymbolPerformance(tradeList) {
  const map = {};
  tradeList.forEach(t => {
    if (!map[t.symbol]) map[t.symbol] = { symbol: t.symbol, pnl: 0, wins: 0, losses: 0, count: 0 };
    map[t.symbol].pnl += t.pnlUsd;
    map[t.symbol].count++;
    if (t.isWin) map[t.symbol].wins++; else map[t.symbol].losses++;
  });
  return Object.values(map).map(s => ({
    ...s,
    pnl: +s.pnl.toFixed(2),
    winRate: +(s.wins / s.count * 100).toFixed(1),
  }));
}

export function getOrderTypeStats(tradeList) {
  const market = tradeList.filter(t => t.orderType === 'Market');
  const limit = tradeList.filter(t => t.orderType === 'Limit');
  const winRate = arr => arr.length ? +(arr.filter(t => t.isWin).length / arr.length * 100).toFixed(1) : 0;

  return [
    { type: 'Market', count: market.length, winRate: winRate(market), pnl: +market.reduce((s, t) => s + t.pnlUsd, 0).toFixed(2) },
    { type: 'Limit', count: limit.length, winRate: winRate(limit), pnl: +limit.reduce((s, t) => s + t.pnlUsd, 0).toFixed(2) },
  ];
}

export function getDurationDistribution(tradeList) {
  const buckets = [
    { label: '< 5m', min: 0, max: 5 },
    { label: '5-15m', min: 5, max: 15 },
    { label: '15-60m', min: 15, max: 60 },
    { label: '1-4h', min: 60, max: 240 },
    { label: '4-24h', min: 240, max: 1440 },
    { label: '1-3d', min: 1440, max: 4320 },
    { label: '3-7d', min: 4320, max: 10080 },
    { label: '7d+', min: 10080, max: Infinity },
  ];

  return buckets.map(b => {
    const inBucket = tradeList.filter(t => t.durationMinutes >= b.min && t.durationMinutes < b.max);
    const avgPnl = inBucket.length ? inBucket.reduce((s, t) => s + t.pnlUsd, 0) / inBucket.length : 0;
    return { label: b.label, count: inBucket.length, avgPnl: +avgPnl.toFixed(2) };
  });
}

export function getStreaks(tradeList) {
  const sorted = [...tradeList].sort((a, b) => new Date(a.closeTime) - new Date(b.closeTime));
  let maxWin = 0, maxLoss = 0, curWin = 0, curLoss = 0;
  sorted.forEach(t => {
    if (t.isWin) { curWin++; curLoss = 0; } else { curLoss++; curWin = 0; }
    if (curWin > maxWin) maxWin = curWin;
    if (curLoss > maxLoss) maxLoss = curLoss;
  });
  return { maxWinStreak: maxWin, maxLossStreak: maxLoss };
}

export function getDirectionalBias(tradeList) {
  const long = tradeList.filter(t => t.side === 'Long').length;
  return tradeList.length ? +(long / tradeList.length * 100).toFixed(1) : 50;
}

export function getLargestTrades(tradeList) {
  const sorted = [...tradeList].sort((a, b) => b.pnlUsd - a.pnlUsd);
  return {
    largestGain: sorted[0] || null,
    largestLoss: sorted[sorted.length - 1] || null,
  };
}
