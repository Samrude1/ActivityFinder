import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import UserMenu from './UserMenu';
import './Header.css';

interface HeaderProps {
    viewMode: 'list' | 'map';
    onViewModeChange: (mode: 'list' | 'map') => void;
    favoritesCount: number;
    onFavoritesClick: () => void;
}

export default function Header({
    viewMode,
    onViewModeChange,
    favoritesCount,
    onFavoritesClick
}: HeaderProps) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">🌟</span>
                    <span className="logo-text">Activity Finder</span>
                </div>

                <div className="header-actions">
                    <button
                        className="favorites-btn"
                        onClick={onFavoritesClick}
                        aria-label="Favorites"
                    >
                        ❤️ <span className="favorites-count">{favoritesCount}</span>
                    </button>

                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => onViewModeChange('list')}
                        >
                            List
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                            onClick={() => onViewModeChange('map')}
                        >
                            Map
                        </button>
                    </div>

                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
