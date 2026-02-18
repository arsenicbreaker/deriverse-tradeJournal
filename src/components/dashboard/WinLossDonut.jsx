import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { formatUsd } from '../../utils/formatters';
import './WinLossDonut.css';

export default function WinLossDonut({ stats }) {
    const data = [
        { name: 'Wins', value: stats.wins, color: 'var(--color-win)' },
        { name: 'Losses', value: stats.losses, color: 'var(--color-loss)' },
    ];

    const COLORS = ['#00E676', '#FF5252'];

    return (
        <div className="winloss-donut card">
            <h3 className="winloss-donut__title">Win / Loss Ratio</h3>
            <div className="winloss-donut__chart">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, idx) => (
                                <Cell key={idx} fill={COLORS[idx]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="winloss-donut__center">
                    <span className="winloss-donut__rate mono">{stats.winRate.toFixed(1)}%</span>
                    <span className="winloss-donut__rate-label">Win Rate</span>
                </div>
            </div>
            <div className="winloss-donut__comparison">
                <div className="winloss-donut__stat">
                    <span className="winloss-donut__stat-label">Avg Win</span>
                    <span className="winloss-donut__stat-value mono text-win">{formatUsd(stats.avgWin)}</span>
                </div>
                <div className="winloss-donut__divider" />
                <div className="winloss-donut__stat">
                    <span className="winloss-donut__stat-label">Avg Loss</span>
                    <span className="winloss-donut__stat-value mono text-loss">{formatUsd(stats.avgLoss)}</span>
                </div>
            </div>
        </div>
    );
}
