import { useFilters } from '../../hooks/useFilters';
import { Calendar, Filter, Wallet, X } from 'lucide-react';
import './HeaderBar.css';

export default function HeaderBar({ title }) {
    const { dateRange, setDateRange, selectedSymbols, setSelectedSymbols, allSymbols, selectedTypes, setSelectedTypes, allTypes } = useFilters();

    const handleSymbolToggle = (symbol) => {
        setSelectedSymbols(prev =>
            prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
        );
    };

    const handleTypeToggle = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const clearFilters = () => {
        setDateRange({ start: '', end: '' });
        setSelectedSymbols([]);
        setSelectedTypes([]);
    };

    const hasFilters = dateRange.start || dateRange.end || selectedSymbols.length || selectedTypes.length;

    return (
        <header className="header-bar">
            <div className="header-bar__left">
                <h1 className="header-bar__title">{title}</h1>
            </div>

            <div className="header-bar__filters">
                {/* Date Range */}
                <div className="header-bar__filter-group">
                    <Calendar size={14} className="header-bar__filter-icon" />
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="header-bar__date-input"
                    />
                    <span className="header-bar__date-sep">—</span>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="header-bar__date-input"
                    />
                </div>

                {/* Symbol Filter */}
                <div className="header-bar__filter-group header-bar__filter-group--pills">
                    <Filter size={14} className="header-bar__filter-icon" />
                    {allSymbols.map(sym => (
                        <button
                            key={sym}
                            className={`header-bar__pill ${selectedSymbols.includes(sym) ? 'header-bar__pill--active' : ''}`}
                            onClick={() => handleSymbolToggle(sym)}
                        >
                            {sym.split('/')[0]}
                        </button>
                    ))}
                </div>

                {/* Type Filter */}
                <div className="header-bar__filter-group header-bar__filter-group--pills">
                    {allTypes.map(type => (
                        <button
                            key={type}
                            className={`header-bar__pill header-bar__pill--type ${selectedTypes.includes(type) ? 'header-bar__pill--active' : ''}`}
                            onClick={() => handleTypeToggle(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {hasFilters && (
                    <button className="header-bar__clear" onClick={clearFilters}>
                        <X size={14} /> Clear
                    </button>
                )}
            </div>

            <div className="header-bar__right">
                <button className="btn btn-primary header-bar__wallet">
                    <Wallet size={16} />
                    <span>Gx7k...m3Qp</span>
                </button>
            </div>
        </header>
    );
}
