import { useAuth } from '../contexts/AuthContext';
import { hasFeature } from '../config/tierConfig';
import { useTranslation, Trans } from 'react-i18next';

export default function AdBanner() {
    const { user } = useAuth();
    const showAds = hasFeature(user?.tier, 'hasAds');
    const { t } = useTranslation();

    if (!showAds) return null;

    return (
        <div className="ad-banner" style={{
            background: '#f8f9fa',
            border: '1px solid #e9ecef',
            padding: '1rem',
            margin: '2rem 0',
            textAlign: 'center',
            borderRadius: '8px',
            color: '#6c757d'
        }}>
            <small style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('ad.sponsored', 'Sponsored')}
            </small>
            <div className="ad-content">
                <Trans i18nKey="ad.content">
                    <strong>Upgrade to Explorer</strong> to remove ads and unlock offline maps!
                </Trans>
            </div>
            <button
                onClick={() => window.location.href = '/profile'}
                style={{
                    marginTop: '0.5rem',
                    background: 'transparent',
                    border: '1px solid currentColor',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                }}
            >
                {t('ad.learn_more', 'Learn More')}
            </button>
        </div>
    );
}
