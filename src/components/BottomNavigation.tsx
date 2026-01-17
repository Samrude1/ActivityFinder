import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';
import { useTranslation } from 'react-i18next';

export default function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const navItems = [
        { path: '/', icon: '🏠', label: t('nav.home') },
        { path: '/favorites', icon: '❤️', label: t('nav.favorites') },
        { path: '/profile', icon: '👤', label: t('nav.profile') },
    ];

    return (
        <nav className="bottom-navigation">
            <div className="bottom-nav-container">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="bottom-nav-icon">{item.icon}</span>
                        <span className="bottom-nav-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
