import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './VolumeFeesBar.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip__label">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="chart-tooltip__value" style={{ color: p.color }}>
                    {p.name}: ${p.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
};

export default function VolumeFeesBar({ data }) {
    return (
        <div className="volume-fees card">
            <h3 className="volume-fees__title">Volume & Fees</h3>
            <div className="volume-fees__chart">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,45,82,0.5)" />
                        <XAxis dataKey="date" fontSize={10} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis fontSize={10} tick={{ fill: '#555775' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="volume" fill="#9945FF" radius={[3, 3, 0, 0]} opacity={0.8} name="Volume" />
                        <Bar dataKey="fees" fill="#14F195" radius={[3, 3, 0, 0]} opacity={0.8} name="Fees" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
