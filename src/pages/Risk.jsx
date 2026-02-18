import { useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import { getStreaks, getDirectionalBias, getLargestTrades } from '../data/mockData';
import { formatUsd, formatPercent, formatDate, formatDuration } from '../utils/formatters';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Trophy, AlertTriangle, Target } from 'lucide-react';
import './Risk.css';

const ScatterTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip__label">{d?.symbol} — {d?.side}</p>
            <p className="chart-tooltip__value" style={{ color: d?.pnlUsd >= 0 ? 'var(--color-win)' : 'var(--color-loss)' }}>
                PnL: {formatUsd(d?.pnlUsd || 0)}
            </p>
            <p className="chart-tooltip__value" style={{ color: 'var(--text-secondary)' }}>
                Size: ${d?.size?.toLocaleString()}
            </p>
        </div>
    );
};

export default function Risk() {
    const { filteredTrades } = useFilters();

    const streaks = useMemo(() => getStreaks(filteredTrades), [filteredTrades]);
    const bias = useMemo(() => getDirectionalBias(filteredTrades), [filteredTrades]);
    const { largestGain, largestLoss } = useMemo(() => getLargestTrades(filteredTrades), [filteredTrades]);

    // Scatter data: each trade's risk (size) vs reward (pnl)
    const scatterData = useMemo(() =>
        filteredTrades.map(t => ({
            x: t.size,
            y: t.pnlUsd,
            symbol: t.symbol,
            side: t.side,
            pnlUsd: t.pnlUsd,
            size: t.size,
        })),
        [filteredTrades]
    );

    const biasLabel = bias > 60 ? 'Long-biased' : bias < 40 ? 'Short-biased' : 'Balanced';
    const biasColor = bias > 60 ? 'var(--color-win)' : bias < 40 ? 'var(--color-loss)' : 'var(--color-neutral)';

    return (
        <div className="risk page-enter">
            {/* Outlier Cards */}
            <div className="risk__outliers stagger-children">
                <div className="risk__outlier card risk__outlier--gain">
                    <div className="risk__outlier-icon">
                        <Trophy size={24} color="var(--color-win)" />
                    </div>
                    <div className="risk__outlier-content">
                        <span className="risk__outlier-label">Largest Gain</span>
                        <span className="risk__outlier-value mono text-win">{formatUsd(largestGain?.pnlUsd || 0)}</span>
                        <span className="risk__outlier-detail">
                            {largestGain?.symbol} · {largestGain?.side} · {largestGain ? formatDate(largestGain.closeTime) : '—'}
                        </span>
                        <span className="risk__outlier-detail">
                            {largestGain ? formatPercent(largestGain.pnlPercent) : ''} · {largestGain ? formatDuration(largestGain.durationMinutes) : ''}
                        </span>
                    </div>
                </div>

                <div className="risk__outlier card risk__outlier--loss">
                    <div className="risk__outlier-icon">
                        <AlertTriangle size={24} color="var(--color-loss)" />
                    </div>
                    <div className="risk__outlier-content">
                        <span className="risk__outlier-label">Largest Loss</span>
                        <span className="risk__outlier-value mono text-loss">{formatUsd(largestLoss?.pnlUsd || 0)}</span>
                        <span className="risk__outlier-detail">
                            {largestLoss?.symbol} · {largestLoss?.side} · {largestLoss ? formatDate(largestLoss.closeTime) : '—'}
                        </span>
                        <span className="risk__outlier-detail">
                            {largestLoss ? formatPercent(largestLoss.pnlPercent) : ''} · {largestLoss ? formatDuration(largestLoss.durationMinutes) : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Directional Bias Gauge */}
            <div className="risk__bias card">
                <div className="risk__bias-header">
                    <h3><Target size={18} /> Directional Bias</h3>
                    <span className="insights__badge" style={{ background: `${biasColor}15`, color: biasColor }}>
                        {biasLabel} ({bias}% Long)
                    </span>
                </div>
                <div className="risk__gauge">
                    <div className="risk__gauge-labels">
                        <span className="text-loss">Bearish</span>
                        <span className="text-muted">Neutral</span>
                        <span className="text-win">Bullish</span>
                    </div>
                    <div className="risk__gauge-track">
                        <div className="risk__gauge-gradient" />
                        <div className="risk__gauge-marker" style={{ left: `${bias}%` }}>
                            <div className="risk__gauge-dot" />
                            <span className="risk__gauge-value mono">{bias}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Streaks + Scatter */}
            <div className="risk__bottom-row">
                {/* Streaks */}
                <div className="risk__streaks card">
                    <h3>Win/Loss Streaks</h3>
                    <div className="risk__streaks-grid">
                        <div className="risk__streak">
                            <div className="risk__streak-icon">
                                <TrendingUp size={20} color="var(--color-win)" />
                            </div>
                            <div className="risk__streak-info">
                                <span className="risk__streak-label">Best Win Streak</span>
                                <span className="risk__streak-value mono text-win">{streaks.maxWinStreak} consecutive</span>
                            </div>
                            <div className="risk__streak-bar">
                                {Array.from({ length: streaks.maxWinStreak }).map((_, i) => (
                                    <div key={i} className="risk__streak-block risk__streak-block--win" style={{ animationDelay: `${i * 0.05}s` }} />
                                ))}
                            </div>
                        </div>
                        <div className="risk__streak">
                            <div className="risk__streak-icon">
                                <TrendingDown size={20} color="var(--color-loss)" />
                            </div>
                            <div className="risk__streak-info">
                                <span className="risk__streak-label">Worst Loss Streak</span>
                                <span className="risk__streak-value mono text-loss">{streaks.maxLossStreak} consecutive</span>
                            </div>
                            <div className="risk__streak-bar">
                                {Array.from({ length: streaks.maxLossStreak }).map((_, i) => (
                                    <div key={i} className="risk__streak-block risk__streak-block--loss" style={{ animationDelay: `${i * 0.05}s` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scatter Plot */}
                <div className="risk__scatter card">
                    <h3>Risk/Reward Distribution</h3>
                    <div className="risk__scatter-chart">
                        <ResponsiveContainer width="100%" height={260}>
                            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,45,82,0.5)" />
                                <XAxis dataKey="x" name="Position Size" fontSize={11} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} label={{ value: 'Position Size', position: 'bottom', fill: '#555775', fontSize: 11 }} />
                                <YAxis dataKey="y" name="PnL" fontSize={11} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} tickFormatter={v => formatUsd(v)} />
                                <Tooltip content={<ScatterTooltip />} />
                                <Scatter data={scatterData} shape="circle">
                                    {scatterData.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.pnlUsd >= 0 ? '#00E676' : '#FF5252'} opacity={0.6} r={4} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
