import { formatUsd, formatPercent, pnlColor } from '../../utils/formatters';
import './StatCard.css';

export default function StatCard({ label, value, format = 'usd', icon, subtitle, delay = 0 }) {
    const Icon = icon;

    const displayValue = format === 'usd'
        ? formatUsd(value)
        : format === 'percent'
            ? formatPercent(value)
            : value;

    const valueColor = format === 'usd' || format === 'percent'
        ? pnlColor(value)
        : 'var(--text-primary)';

    return (
        <div className="stat-card card" style={{ animationDelay: `${delay}ms` }}>
            <div className="stat-card__header">
                <span className="stat-card__label">{label}</span>
                {Icon && <Icon size={18} className="stat-card__icon" />}
            </div>
            <div className="stat-card__value mono" style={{ color: valueColor }}>
                {displayValue}
            </div>
            {subtitle && <div className="stat-card__subtitle">{subtitle}</div>}
        </div>
    );
}
