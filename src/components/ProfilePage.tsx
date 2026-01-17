import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './ProfilePage.css';
import OfflineMapsModal from '../tiers/Explorer/features/OfflineMapsModal';
import PreferencesModal from './PreferencesModal';
import BackButton from './BackButton';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
    const { user, logout, updateUserTier } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedTier, setSelectedTier] = useState<'free' | 'explorer' | null>(user?.tier || null);
    const [showOfflineMaps, setShowOfflineMaps] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    const tiers = [
        {
            id: 'free' as const,
            icon: '🆓',
            name: t('tiers.free', 'Free'),
            price: t('tiers.free', 'Free'),
            features: [
                t('tiers.features.browse_all', 'Search and browse all activities'),
                t('tiers.features.map_list', 'View on map and list'),
                t('tiers.features.basic_filter', 'Basic category filtering'),
                t('tiers.features.favorites_limit', 'Save up to 20 favorites'),
                t('tiers.features.user_account', 'User account'),
                t('tiers.features.ads', 'Ads displayed'),
                t('tiers.features.search_limit', 'Limited to 50 searches per day')
            ]
        },
        {
            id: 'explorer' as const,
            icon: '🧭',
            name: t('tiers.explorer', 'Explorer'),
            price: '$4.99/month',
            features: [
                t('tiers.features.ad_free', 'Ad-free experience'),
                t('tiers.features.unlimited_favs', 'Unlimited favorites'),
                t('tiers.features.unlimited_search', 'Unlimited searches'),
                t('tiers.features.advanced_filter', 'Advanced filters (price, rating, accessibility)'),
                t('tiers.features.offline_maps', 'Offline maps (download up to 5 cities)'),
                t('tiers.features.custom_lists', 'Custom lists (organize collections)'),
                t('tiers.features.calendar_export', 'Export to calendar'),
                t('tiers.features.priority_support', 'Priority customer support'),
                t('tiers.features.early_access', 'Early access to new features')
            ]
        }
    ];

    if (!user) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="profile-empty">
                        <div className="empty-icon">👤</div>
                        <h2>{t('profile.not_logged_in', 'Not Logged In')}</h2>
                        <p>{t('profile.login_required', 'Please log in to view your profile')}</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            {t('common.go_home', 'Go Home')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="container">
                    <BackButton to="/" />
                </div>
            </header>

            <div className="container profile-content">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="profile-name">{user.username}</h1>
                    <p className="profile-email">{user.email}</p>
                </div>

                <div className="profile-sections">
                    <button className="profile-section-btn" onClick={() => navigate('/favorites')}>
                        <span className="section-icon">❤️</span>
                        <div className="section-content">
                            <h3>{t('profile.saved_activities', 'Saved Activities')}</h3>
                            <p>{t('profile.saved_desc', 'View your favorite places')}</p>
                        </div>
                        <span className="section-arrow">→</span>
                    </button>

                    <button className="profile-section-btn" onClick={() => setShowPreferences(true)}>
                        <span className="section-icon">⚙️</span>
                        <div className="section-content">
                            <h3>{t('common.settings', 'Settings')}</h3>
                            <p>{t('profile.settings_desc', 'Preferences and privacy')}</p>
                        </div>
                        <span className="section-arrow">→</span>
                    </button>

                    <button className="profile-section-btn" onClick={logout}>
                        <span className="section-icon">🚪</span>
                        <div className="section-content">
                            <h3>{t('nav.logout', 'Logout')}</h3>
                            <p>{t('profile.logout_desc', 'Sign out of your account')}</p>
                        </div>
                        <span className="section-arrow">→</span>
                    </button>
                </div>

                <div className="profile-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="profile-section-btn" onClick={() => navigate('/lists')}>
                        <span className="section-icon">📋</span>
                        <div className="section-content">
                            <h3>{t('nav.custom_lists', 'Custom Lists')}</h3>
                        </div>
                    </button>

                    <button className="profile-section-btn" onClick={() => setShowOfflineMaps(true)}>
                        <span className="section-icon">🗺️</span>
                        <div className="section-content">
                            <h3>{t('settings.offline_maps', 'Offline Maps')}</h3>
                        </div>
                    </button>

                </div>

                <div className="tier-section">
                    <h2 className="tier-section-title">{t('profile.subscription', 'Your Subscription')}</h2>

                    {/* Current Tier Display */}
                    <div className="current-tier-card">
                        <div className="current-tier-header">
                            <div className="current-tier-info">
                                <span className="current-tier-icon">{tiers.find(t => t.id === user.tier)?.icon}</span>
                                <div>
                                    <h3 className="current-tier-name">{tiers.find(t => t.id === user.tier)?.name} {t('tiers.plan', 'Plan')}</h3>
                                    <p className="current-tier-status">{t('tiers.active', 'Active')}</p>
                                </div>
                            </div>
                            <div className="current-tier-price">{tiers.find(t => t.id === user.tier)?.price}</div>
                        </div>

                        {/* Early Access Badge for Explorer+ */}
                        {user.tier === 'explorer' && (
                            <div className="early-access-banner" style={{
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                margin: '10px 0',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ fontSize: '1.1rem' }}>🚀</span>
                                <div>
                                    <strong>Early Access Active</strong>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>You're first in line for new features!</div>
                                </div>
                            </div>
                        )}

                        <div className="current-tier-features">
                            {tiers.find(t => t.id === user.tier)?.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="current-tier-feature">
                                    <span className="feature-check">✓</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            className="view-all-tiers-btn"
                            onClick={() => setSelectedTier(selectedTier ? null : user.tier)}
                        >
                            {selectedTier ? t('tiers.hide_other', 'Hide Other Plans') : t('tiers.view_all', 'View All Plans')}
                            <span className={`expand-icon ${selectedTier ? 'expanded' : ''}`}>▼</span>
                        </button>
                    </div>

                    {/* Expandable Tier Options */}
                    {selectedTier && (
                        <div className="tier-options">
                            <h3 className="tier-options-title">{t('tiers.available_plans', 'Available Plans')}</h3>
                            <div className="tier-grid">
                                {tiers.map((tier) => (
                                    <div
                                        key={tier.id}
                                        className={`tier-option-card ${user.tier === tier.id ? 'current-plan' : ''}`}
                                    >
                                        <div className="tier-option-header">
                                            <span className="tier-option-icon">{tier.icon}</span>
                                            <h4 className="tier-option-name">{tier.name}</h4>
                                            {user.tier === tier.id && (
                                                <span className="current-plan-badge">{t('tiers.current_plan', 'Current Plan')}</span>
                                            )}
                                        </div>

                                        <div className="tier-option-price">{tier.price}</div>

                                        <ul className="tier-option-features">
                                            {tier.features.map((feature, index) => (
                                                <li key={index}>
                                                    <span className="feature-check">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        {user.tier !== tier.id && (
                                            <button
                                                className={`tier-action-btn ${tier.id === 'free' ? 'downgrade' : 'upgrade'}`}
                                                onClick={async () => {
                                                    try {
                                                        // Instantly switch tier for authorized users
                                                        await updateUserTier(tier.id);
                                                        // Optional: Add a toast notification here
                                                        console.log(`Switched to ${tier.name} tier`);
                                                        // Force reload to ensure all features are active
                                                        window.location.reload();
                                                    } catch (error) {
                                                        console.error('Failed to update tier:', error);
                                                        alert('Failed to update tier. Please try again.');
                                                    }
                                                }}
                                            >
                                                {tier.id === 'free' ? 'Downgrade to Free' : `Upgrade to ${tier.name}`}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showOfflineMaps && <OfflineMapsModal onClose={() => setShowOfflineMaps(false)} />}
            {showPreferences && <PreferencesModal onClose={() => setShowPreferences(false)} />}
        </div>
    );
}
