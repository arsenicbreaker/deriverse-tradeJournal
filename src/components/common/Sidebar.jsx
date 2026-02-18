import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Lightbulb, ShieldAlert, Settings } from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/insights', icon: Lightbulb, label: 'Insights' },
    { path: '/risk', icon: ShieldAlert, label: 'Risk' },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <>
            <aside className="sidebar">
                {/* Logo */}
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon">
                        <img src="https://deriverse.io/icon.svg" alt="Deriverse Logo" width="32" height="32" />
                    </div>
                    <span className="sidebar__logo-text">Deriverse</span>
                </div>


                {/* Navigation */}
                <nav className="sidebar__nav">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                            >
                                <span className="sidebar__link-indicator" />
                                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                                <span className="sidebar__link-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="sidebar__bottom">
                    <NavLink to="/settings" className="sidebar__link">
                        <Settings size={20} strokeWidth={1.8} />
                        <span className="sidebar__link-label">Settings</span>
                    </NavLink>
                </div>
            </aside>

            {/* Mobile Bottom Bar */}
            <nav className="mobile-nav">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink key={item.path} to={item.path} className={`mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}>
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </>
    );
}
