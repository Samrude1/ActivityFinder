import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import './Header.css';

interface HeaderProps {
    viewMode: 'list' | 'map';
    onViewModeChange: (mode: 'list' | 'map') => void;
}

export default function Header({ viewMode, onViewModeChange }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">🦉</span>
                    <span className="logo-text">Activity Finder</span>
                </div>

                <nav className="header-nav-center">
                    <a href="#" className="nav-link">Rewards</a>
                    <a href="#" className="nav-link">Discover</a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onViewModeChange(viewMode === 'map' ? 'list' : 'map') }}>
                        Review
                    </a>
                    <a href="#" className="nav-link">Forums</a>
                </nav>

                <div className="header-actions">
                    <button className="icon-btn search-trigger" aria-label="Search" onClick={() => navigate('/search')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>

                    <button className="icon-btn lang-btn" aria-label="Language" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>USD</span>
                    </button>

                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
