import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import HeaderBar from '../components/common/HeaderBar';
import { FilterProvider } from '../hooks/useFilters';
import './AppShell.css';

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/journal': 'Journal',
    '/insights': 'Insights',
    '/risk': 'Risk Management',
};

export default function AppShell() {
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'Dashboard';

    return (
        <FilterProvider>
            <div className="app-shell">
                <Sidebar />
                <div className="app-shell__main">
                    <HeaderBar title={title} />
                    <div className="app-shell__content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </FilterProvider>
    );
}
