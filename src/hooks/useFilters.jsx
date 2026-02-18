import { createContext, useContext, useState, useMemo } from 'react';
import { trades } from '../data/mockData';

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedSymbols, setSelectedSymbols] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    const filteredTrades = useMemo(() => {
        let result = trades;

        if (dateRange.start) {
            result = result.filter(t => t.closeTime >= dateRange.start);
        }
        if (dateRange.end) {
            const endDate = dateRange.end + 'T23:59:59';
            result = result.filter(t => t.closeTime <= endDate);
        }
        if (selectedSymbols.length > 0) {
            result = result.filter(t => selectedSymbols.includes(t.symbol));
        }
        if (selectedTypes.length > 0) {
            result = result.filter(t => selectedTypes.includes(t.type));
        }

        return result;
    }, [dateRange, selectedSymbols, selectedTypes]);

    const allSymbols = useMemo(() => [...new Set(trades.map(t => t.symbol))], []);
    const allTypes = useMemo(() => [...new Set(trades.map(t => t.type))], []);

    return (
        <FilterContext.Provider value={{
            dateRange, setDateRange,
            selectedSymbols, setSelectedSymbols,
            selectedTypes, setSelectedTypes,
            filteredTrades,
            allSymbols, allTypes,
        }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const ctx = useContext(FilterContext);
    if (!ctx) throw new Error('useFilters must be used within FilterProvider');
    return ctx;
}
