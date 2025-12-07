import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import './SettingsMenu.css';

interface SettingsMenuProps {
    onViewModeChange: (mode: 'list' | 'map') => void;
    currentViewMode: 'list' | 'map';
    favoritesCount: number;
}

export default function SettingsMenu({ onViewModeChange, currentViewMode, favoritesCount }: SettingsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="settings-menu-container">
            <button
                className="settings-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Settings"
            >
                ⚙️
            </button>

            {isOpen && (
                <>
                    <div className="settings-overlay" onClick={() => setIsOpen(false)} />
                    <div className="settings-dropdown">
                        <div className="settings-header">
                            <h3>Settings</h3>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                        </div>

                        <div className="settings-section">
                            <h4>View</h4>
                            <div className="settings-options">
                                <button
                                    className={`settings-option ${currentViewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => {
                                        onViewModeChange('list');
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="option-icon">📋</span>
                                    <span>List View</span>
                                    {currentViewMode === 'list' && <span className="check">✓</span>}
                                </button>
                                <button
                                    className={`settings-option ${currentViewMode === 'map' ? 'active' : ''}`}
                                    onClick={() => {
                                        onViewModeChange('map');
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="option-icon">🗺️</span>
                                    <span>Map View</span>
                                    {currentViewMode === 'map' && <span className="check">✓</span>}
                                </button>
                            </div>
                        </div>

                        <div className="settings-divider" />

                        <div className="settings-section">
                            <h4>Quick Access</h4>
                            <div className="settings-options">
                                <button
                                    className="settings-option"
                                    onClick={() => {
                                        navigate('/favorites');
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="option-icon">❤️</span>
                                    <span>Favorites</span>
                                    {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
                                </button>
                                <button
                                    className="settings-option"
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="option-icon">👤</span>
                                    <span>Account</span>
                                </button>
                            </div>
                        </div>

                        <div className="settings-divider" />

                        <div className="settings-section">
                            <h4>Appearance</h4>
                            <div className="settings-options">
                                <button
                                    className="settings-option"
                                    onClick={toggleTheme}
                                >
                                    <span className="option-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                                    <span>Dark Mode</span>
                                    <div className={`toggle ${theme === 'dark' ? 'active' : ''}`}>
                                        <div className="toggle-thumb" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {user && (
                            <>
                                <div className="settings-divider" />
                                <div className="settings-section">
                                    <button
                                        className="settings-option danger"
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                            navigate('/');
                                        }}
                                    >
                                        <span className="option-icon">🚪</span>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
