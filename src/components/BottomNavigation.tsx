import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

export default function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/', icon: '🏠', label: 'Home' },
        { path: '/favorites', icon: '❤️', label: 'Saved' },
        { path: '/profile', icon: '👤', label: 'Profile' },
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
