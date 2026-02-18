import { useNavigate } from 'react-router-dom';
import { formatUsd, formatPercent, formatDuration, formatDateTime, pnlClass } from '../../utils/formatters';
import { ArrowUpRight } from 'lucide-react';
import './RecentTrades.css';

export default function RecentTrades({ trades }) {
    const navigate = useNavigate();
    const recent = trades.slice(0, 5);

    return (
        <div className="recent-trades card">
            <div className="recent-trades__header">
                <h3 className="recent-trades__title">Recent Trades</h3>
                <button className="btn btn-ghost recent-trades__view-all" onClick={() => navigate('/journal')}>
                    View All <ArrowUpRight size={14} />
                </button>
            </div>
            <div className="recent-trades__table-wrap">
                <table className="recent-trades__table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Side</th>
                            <th>PnL</th>
                            <th>Duration</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recent.map(t => (
                            <tr key={t.id} className="recent-trades__row">
                                <td className="recent-trades__symbol">
                                    <span className="recent-trades__symbol-name">{t.symbol.split('/')[0]}</span>
                                    <span className="recent-trades__type badge badge-info">{t.type}</span>
                                </td>
                                <td>
                                    <span className={`badge ${t.side === 'Long' ? 'badge-win' : 'badge-loss'}`}>
                                        {t.side}
                                    </span>
                                </td>
                                <td className={`mono ${pnlClass(t.pnlUsd)}`}>{formatUsd(t.pnlUsd)}</td>
                                <td className="mono text-secondary">{formatDuration(t.durationMinutes)}</td>
                                <td className="text-muted">{formatDateTime(t.closeTime)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
