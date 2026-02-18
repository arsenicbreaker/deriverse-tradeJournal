import { useState, useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import { formatUsd, formatPercent, formatPrice, formatDuration, formatDateTime, pnlClass } from '../utils/formatters';
import { Search, ChevronDown, ChevronUp, X, Plus, MessageSquare } from 'lucide-react';
import './Journal.css';

const PRESET_TAGS = ['Planned', 'FOMO', 'Revenge Trade', 'Breakout', 'Trend Follow', 'Scalp', 'Swing', 'News Play'];

export default function Journal() {
    const { filteredTrades } = useFilters();
    const [search, setSearch] = useState('');
    const [sideFilter, setSideFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [sortCol, setSortCol] = useState('closeTime');
    const [sortDir, setSortDir] = useState('desc');
    const [expandedId, setExpandedId] = useState(null);
    const [tradeNotes, setTradeNotes] = useState({});
    const [tradeTags, setTradeTags] = useState({});
    const [page, setPage] = useState(1);
    const perPage = 15;

    const processed = useMemo(() => {
        let result = [...filteredTrades];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(t =>
                t.symbol.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
            );
        }
        if (sideFilter) result = result.filter(t => t.side === sideFilter);
        if (tagFilter) {
            result = result.filter(t => {
                const allTags = [...t.tags, ...(tradeTags[t.id] || [])];
                return allTags.includes(tagFilter);
            });
        }

        result.sort((a, b) => {
            let va = a[sortCol], vb = b[sortCol];
            if (sortCol === 'closeTime') { va = new Date(va); vb = new Date(vb); }
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [filteredTrades, search, sideFilter, tagFilter, sortCol, sortDir, tradeTags]);

    const totalPages = Math.ceil(processed.length / perPage);
    const paginated = processed.slice((page - 1) * perPage, page * perPage);

    const handleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('desc'); }
    };

    const SortIcon = ({ col }) => {
        if (sortCol !== col) return null;
        return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
    };

    const toggleTag = (tradeId, tag) => {
        setTradeTags(prev => {
            const current = prev[tradeId] || [];
            return {
                ...prev,
                [tradeId]: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag],
            };
        });
    };

    return (
        <div className="journal page-enter">
            {/* Filter Bar */}
            <div className="journal__filters card">
                <div className="journal__search">
                    <Search size={16} className="journal__search-icon" />
                    <input
                        type="text"
                        placeholder="Search symbol or ID..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="journal__search-input"
                    />
                </div>

                <div className="journal__filter-pills">
                    <button className={`header-bar__pill ${!sideFilter ? 'header-bar__pill--active' : ''}`} onClick={() => setSideFilter('')}>All</button>
                    <button className={`header-bar__pill ${sideFilter === 'Long' ? 'header-bar__pill--active' : ''}`} onClick={() => setSideFilter('Long')}>Long</button>
                    <button className={`header-bar__pill ${sideFilter === 'Short' ? 'header-bar__pill--active' : ''}`} onClick={() => setSideFilter('Short')}>Short</button>
                </div>

                <select className="journal__tag-select" value={tagFilter} onChange={e => { setTagFilter(e.target.value); setPage(1); }}>
                    <option value="">All Tags</option>
                    {PRESET_TAGS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>

                <span className="journal__count mono">{processed.length} trades</span>
            </div>

            {/* Trade Table */}
            <div className="journal__table-wrap card">
                <table className="journal__table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('symbol')}>Symbol <SortIcon col="symbol" /></th>
                            <th onClick={() => handleSort('side')}>Side <SortIcon col="side" /></th>
                            <th>Type</th>
                            <th onClick={() => handleSort('entryPrice')}>Entry <SortIcon col="entryPrice" /></th>
                            <th onClick={() => handleSort('exitPrice')}>Exit <SortIcon col="exitPrice" /></th>
                            <th onClick={() => handleSort('pnlUsd')}>PnL <SortIcon col="pnlUsd" /></th>
                            <th onClick={() => handleSort('pnlPercent')}>PnL % <SortIcon col="pnlPercent" /></th>
                            <th onClick={() => handleSort('durationMinutes')}>Duration <SortIcon col="durationMinutes" /></th>
                            <th>Fee</th>
                            <th onClick={() => handleSort('closeTime')}>Time <SortIcon col="closeTime" /></th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(t => {
                            const isExpanded = expandedId === t.id;
                            const allTags = [...new Set([...t.tags, ...(tradeTags[t.id] || [])])];
                            const notes = tradeNotes[t.id] !== undefined ? tradeNotes[t.id] : t.notes;

                            return (
                                <tbody key={t.id}>
                                    <tr className={`journal__row ${isExpanded ? 'journal__row--expanded' : ''}`} onClick={() => setExpandedId(isExpanded ? null : t.id)}>
                                        <td className="journal__symbol-cell">
                                            <span className="journal__symbol-name">{t.symbol.split('/')[0]}</span>
                                            <span className="journal__symbol-pair">/{t.symbol.split('/')[1]}</span>
                                        </td>
                                        <td><span className={`badge ${t.side === 'Long' ? 'badge-win' : 'badge-loss'}`}>{t.side}</span></td>
                                        <td><span className="badge badge-info">{t.type}</span></td>
                                        <td className="mono">{formatPrice(t.entryPrice)}</td>
                                        <td className="mono">{formatPrice(t.exitPrice)}</td>
                                        <td className={`mono ${pnlClass(t.pnlUsd)}`}>{formatUsd(t.pnlUsd)}</td>
                                        <td className={`mono ${pnlClass(t.pnlPercent)}`}>{formatPercent(t.pnlPercent)}</td>
                                        <td className="mono text-secondary">{formatDuration(t.durationMinutes)}</td>
                                        <td className="mono text-muted">${t.fee.toFixed(2)}</td>
                                        <td className="text-muted">{formatDateTime(t.closeTime)}</td>
                                        <td>
                                            <div className="journal__tags-cell">
                                                {allTags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="badge badge-neutral">{tag}</span>
                                                ))}
                                                {allTags.length > 2 && <span className="text-muted">+{allTags.length - 2}</span>}
                                                {notes && <MessageSquare size={12} className="text-secondary" />}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Detail */}
                                    {isExpanded && (
                                        <tr className="journal__detail-row">
                                            <td colSpan={11}>
                                                <div className="journal__detail">
                                                    <div className="journal__detail-notes">
                                                        <label className="journal__detail-label">📝 Notes</label>
                                                        <textarea
                                                            className="journal__detail-textarea"
                                                            placeholder="Add your notes about this trade..."
                                                            value={notes}
                                                            onChange={e => setTradeNotes(prev => ({ ...prev, [t.id]: e.target.value }))}
                                                            onClick={e => e.stopPropagation()}
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <div className="journal__detail-tags">
                                                        <label className="journal__detail-label">🏷️ Tags</label>
                                                        <div className="journal__detail-tag-list">
                                                            {PRESET_TAGS.map(tag => (
                                                                <button
                                                                    key={tag}
                                                                    className={`journal__detail-tag ${allTags.includes(tag) ? 'journal__detail-tag--active' : ''}`}
                                                                    onClick={e => { e.stopPropagation(); toggleTag(t.id, tag); }}
                                                                >
                                                                    {allTags.includes(tag) ? <X size={10} /> : <Plus size={10} />}
                                                                    {tag}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="journal__pagination">
                    <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>◀ Prev</button>
                    <div className="journal__pagination-pages">
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            let p;
                            if (totalPages <= 7) p = i + 1;
                            else if (page <= 4) p = i + 1;
                            else if (page >= totalPages - 3) p = totalPages - 6 + i;
                            else p = page - 3 + i;
                            return (
                                <button
                                    key={p}
                                    className={`journal__pagination-btn ${page === p ? 'journal__pagination-btn--active' : ''}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            );
                        })}
                    </div>
                    <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next ▶</button>
                    <span className="journal__pagination-info mono">
                        {(page - 1) * perPage + 1}-{Math.min(page * perPage, processed.length)} of {processed.length}
                    </span>
                </div>
            )}
        </div>
    );
}
