export function formatUsd(value) {
    const abs = Math.abs(value);
    const prefix = value < 0 ? '-' : value > 0 ? '+' : '';
    if (abs >= 1000000) return `${prefix}$${(abs / 1000000).toFixed(2)}M`;
    if (abs >= 1000) return `${prefix}$${(abs / 1000).toFixed(1)}k`;
    return `${prefix}$${abs.toFixed(2)}`;
}

export function formatPercent(value) {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(2)}%`;
}

export function formatPrice(value, decimals = 2) {
    if (value < 0.001) return value.toFixed(8);
    if (value < 1) return value.toFixed(4);
    return value.toFixed(decimals);
}

export function formatDuration(minutes) {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    if (minutes < 1440) return `${(minutes / 60).toFixed(1)}h`;
    return `${(minutes / 1440).toFixed(1)}d`;
}

export function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

export function formatDateTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function pnlColor(value) {
    if (value > 0) return 'var(--color-win)';
    if (value < 0) return 'var(--color-loss)';
    return 'var(--text-muted)';
}

export function pnlClass(value) {
    if (value > 0) return 'text-win';
    if (value < 0) return 'text-loss';
    return 'text-muted';
}
