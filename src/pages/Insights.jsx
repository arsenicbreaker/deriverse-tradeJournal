import { useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import { getPerformanceByHour, getLongShortStats, getSymbolPerformance, getOrderTypeStats, getDurationDistribution } from '../data/mockData';
import { formatUsd } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Insights.css';

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip__label">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="chart-tooltip__value" style={{ color: p.color || p.fill }}>{p.name}: {typeof p.value === 'number' ? (p.name.includes('Rate') ? p.value + '%' : formatUsd(p.value)) : p.value}</p>
            ))}
        </div>
    );
};

export default function Insights() {
    const { filteredTrades } = useFilters();

    const heatmapData = useMemo(() => getPerformanceByHour(filteredTrades), [filteredTrades]);
    const longShort = useMemo(() => getLongShortStats(filteredTrades), [filteredTrades]);
    const symbolPerf = useMemo(() => getSymbolPerformance(filteredTrades), [filteredTrades]);
    const orderTypes = useMemo(() => getOrderTypeStats(filteredTrades), [filteredTrades]);
    const duration = useMemo(() => getDurationDistribution(filteredTrades), [filteredTrades]);

    // Heatmap color scale
    const maxPnl = Math.max(...heatmapData.map(d => Math.abs(d.pnl)), 1);
    const heatColor = (v) => {
        if (v === 0) return 'rgba(42,45,82,0.3)';
        const intensity = Math.min(Math.abs(v) / maxPnl, 1);
        if (v > 0) return `rgba(0, 230, 118, ${0.15 + intensity * 0.6})`;
        return `rgba(255, 82, 82, ${0.15 + intensity * 0.6})`;
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Best/worst hour insight
    const bestHour = [...heatmapData].sort((a, b) => b.pnl - a.pnl)[0];
    const worstHour = [...heatmapData].sort((a, b) => a.pnl - b.pnl)[0];

    // Best order type insight
    const bestOrderType = orderTypes[0]?.winRate > orderTypes[1]?.winRate ? orderTypes[0] : orderTypes[1];
    const orderDiff = Math.abs(orderTypes[0]?.winRate - orderTypes[1]?.winRate).toFixed(1);

    // Duration insight
    const avgDuration = filteredTrades.length ? filteredTrades.reduce((s, t) => s + t.durationMinutes, 0) / filteredTrades.length : 0;
    const traderType = avgDuration < 30 ? 'Scalper' : avgDuration < 240 ? 'Day Trader' : avgDuration < 1440 ? 'Swing Trader' : 'Position Trader';

    const DONUT_COLORS = ['#9945FF', '#14F195'];

    return (
        <div className="insights page-enter">
            {/* Row 1: Heatmap + Long/Short */}
            <div className="insights__row">
                {/* Heatmap */}
                <div className="insights__heatmap card">
                    <div className="insights__card-header">
                        <h3>Performance by Hour & Day</h3>
                        {bestHour?.count > 0 && (
                            <span className="insights__badge insights__badge--win">
                                🔥 Best: {bestHour.day} {bestHour.hour}:00 ({formatUsd(bestHour.pnl)})
                            </span>
                        )}
                    </div>
                    <div className="insights__heatmap-grid">
                        <div className="insights__heatmap-row insights__heatmap-row--header">
                            <span className="insights__heatmap-day" />
                            {hours.filter(h => h % 3 === 0).map(h => (
                                <span key={h} className="insights__heatmap-hour-label">{h}</span>
                            ))}
                        </div>
                        {days.map(day => (
                            <div key={day} className="insights__heatmap-row">
                                <span className="insights__heatmap-day">{day}</span>
                                {hours.map(h => {
                                    const cell = heatmapData.find(d => d.day === day && d.hour === h);
                                    return (
                                        <div
                                            key={h}
                                            className="insights__heatmap-cell"
                                            style={{ background: heatColor(cell?.pnl || 0) }}
                                            title={`${day} ${h}:00 — ${cell?.count || 0} trades, PnL: ${formatUsd(cell?.pnl || 0)}`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Long vs Short */}
                <div className="insights__longshort card">
                    <h3>Long vs Short Performance</h3>
                    <div className="insights__longshort-bars">
                        {longShort.map(s => (
                            <div key={s.side} className="insights__ls-item">
                                <div className="insights__ls-header">
                                    <span className={`badge ${s.side === 'Long' ? 'badge-win' : 'badge-loss'}`}>{s.side}</span>
                                    <span className="mono text-secondary">{s.count} trades</span>
                                </div>
                                <div className="insights__ls-bar-track">
                                    <div
                                        className={`insights__ls-bar-fill ${s.side === 'Long' ? 'insights__ls-bar-fill--win' : 'insights__ls-bar-fill--loss'}`}
                                        style={{ width: `${s.winRate}%` }}
                                    />
                                    <span className="insights__ls-bar-label mono">{s.winRate}% WR</span>
                                </div>
                                <span className={`mono ${s.avgPnl >= 0 ? 'text-win' : 'text-loss'}`}>Avg: {formatUsd(s.avgPnl)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 2: Symbol + Order Type */}
            <div className="insights__row">
                {/* Symbol Performance */}
                <div className="insights__symbol card">
                    <h3>Performance by Symbol</h3>
                    <div className="insights__symbol-chart">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={symbolPerf} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,45,82,0.5)" horizontal={false} />
                                <XAxis type="number" fontSize={11} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} tickFormatter={v => formatUsd(v)} />
                                <YAxis type="category" dataKey="symbol" fontSize={11} tick={{ fill: '#8B8CA7' }} tickLine={false} axisLine={false} width={80} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="pnl" name="PnL" radius={[0, 4, 4, 0]}>
                                    {symbolPerf.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.pnl >= 0 ? '#00E676' : '#FF5252'} opacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Type */}
                <div className="insights__ordertype card">
                    <div className="insights__card-header">
                        <h3>Order Type Analysis</h3>
                        <span className="insights__badge insights__badge--info">
                            🎯 {bestOrderType?.type} orders {orderDiff}% more profitable
                        </span>
                    </div>
                    <div className="insights__ordertype-chart">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={orderTypes} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="count" nameKey="type" stroke="none">
                                    {orderTypes.map((_, idx) => (
                                        <Cell key={idx} fill={DONUT_COLORS[idx]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="insights__ordertype-legend">
                        {orderTypes.map((ot, idx) => (
                            <div key={ot.type} className="insights__ot-item">
                                <span className="insights__ot-dot" style={{ background: DONUT_COLORS[idx] }} />
                                <span className="insights__ot-label">{ot.type}</span>
                                <span className="mono">{ot.winRate}% WR</span>
                                <span className={`mono ${ot.pnl >= 0 ? 'text-win' : 'text-loss'}`}>{formatUsd(ot.pnl)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Duration Distribution */}
            <div className="insights__duration card">
                <div className="insights__card-header">
                    <h3>Trade Duration Distribution</h3>
                    <span className="insights__badge insights__badge--neutral">
                        ⏱️ You're a {traderType} (avg {avgDuration < 60 ? Math.round(avgDuration) + 'min' : (avgDuration / 60).toFixed(1) + 'h'})
                    </span>
                </div>
                <div className="insights__duration-chart">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={duration} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,45,82,0.5)" />
                            <XAxis dataKey="label" fontSize={11} tick={{ fill: '#8B8CA7' }} tickLine={false} axisLine={false} />
                            <YAxis fontSize={11} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="count" name="Trades" radius={[4, 4, 0, 0]}>
                                {duration.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.avgPnl >= 0 ? '#00E676' : '#FF5252'} opacity={0.7} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
