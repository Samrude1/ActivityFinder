import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import './SettingsMenu.css';
import OfflineMapsModal from '../tiers/Explorer/features/OfflineMapsModal';
import { useTranslation } from 'react-i18next';

interface SettingsMenuProps {
    onViewModeChange: (mode: 'list' | 'map') => void;
    currentViewMode: 'list' | 'map';
    favoritesCount: number;
}

export default function SettingsMenu({ onViewModeChange, currentViewMode, favoritesCount }: SettingsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showOfflineMaps, setShowOfflineMaps] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                            <h3>{t('common.settings', 'Settings')}</h3>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                        </div>

                        <div className="settings-section">
                            <h4>{t('settings.view', 'View')}</h4>
                            <div className="settings-options">
                                <button
                                    className={`settings-option ${currentViewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => {
                                        onViewModeChange('list');
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="option-icon">📋</span>
                                    <span>{t('settings.list_view', 'List View')}</span>
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
                                    <span>{t('settings.map_view', 'Map View')}</span>
                                    {currentViewMode === 'map' && <span className="check">✓</span>}
                                </button>
                            </div>
                        </div>

                        <div className="settings-divider" />

                        <div className="settings-section">
                            <h4>{t('settings.quick_access', 'Quick Access')}</h4>
                            <div className="settings-options">
                                <button
                                    className="settings-option"
                                    onClick={() => {
                                        navigate('/favorites');
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="option-icon">❤️</span>
                                    <span>{t('nav.favorites')}</span>
                                    {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
                                </button>
                                <button
                                    className="settings-option"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setShowOfflineMaps(true);
                                    }}
                                >
                                    <span className="option-icon">🗺️</span>
                                    <span>{t('settings.offline_maps', 'Offline Maps')}</span>
                                    {showOfflineMaps && <span className="badge">New</span>}
                                </button>
                                <button
                                    className="settings-option"
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="option-icon">👤</span>
                                    <span>{t('nav.profile', 'Account')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="settings-divider" />

                        <div className="settings-section">
                            <h4>{t('settings.appearance', 'Appearance')}</h4>
                            <div className="settings-options">
                                <button
                                    className="settings-option"
                                    onClick={toggleTheme}
                                >
                                    <span className="option-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                                    <span>{t('settings.dark_mode', 'Dark Mode')}</span>
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
                                        <span>{t('nav.logout', 'Logout')}</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
            {showOfflineMaps && <OfflineMapsModal onClose={() => setShowOfflineMaps(false)} />}
        </div>
    );
}
