import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, ComposedChart } from 'recharts';
import './EquityCurve.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip__label">{label}</p>
            <p className="chart-tooltip__value" style={{ color: 'var(--sol-teal)' }}>
                Equity: ${payload[0]?.value?.toLocaleString()}
            </p>
            {payload[1] && (
                <p className="chart-tooltip__value" style={{ color: 'var(--color-loss)' }}>
                    Drawdown: {payload[1]?.value?.toFixed(2)}%
                </p>
            )}
        </div>
    );
};

export default function EquityCurve({ data }) {
    return (
        <div className="equity-curve card">
            <div className="equity-curve__header">
                <h3 className="equity-curve__title">Equity Curve & Drawdown</h3>
            </div>
            <div className="equity-curve__chart">
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#14F195" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#14F195" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF5252" stopOpacity={0.15} />
                                <stop offset="100%" stopColor="#FF5252" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,45,82,0.5)" />
                        <XAxis dataKey="date" fontSize={11} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="equity" fontSize={11} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                        <YAxis yAxisId="dd" orientation="right" fontSize={11} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar yAxisId="dd" dataKey="drawdown" fill="url(#drawdownGradient)" radius={[2, 2, 0, 0]} />
                        <Area yAxisId="equity" type="monotone" dataKey="equity" stroke="#14F195" strokeWidth={2} fill="url(#equityGradient)" dot={false} activeDot={{ r: 4, fill: '#14F195', stroke: '#0a0b1e', strokeWidth: 2 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
