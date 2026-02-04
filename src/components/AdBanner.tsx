import { useAuth } from '../contexts/AuthContext';
import { hasFeature } from '../config/tierConfig';
import { useTranslation, Trans } from 'react-i18next';

interface AdBannerProps {
    placement?: 'list' | 'detail' | 'sidebar';
    imageUrl?: string;
    linkUrl?: string;
}

// Mock Affiliate Ads (Real URLs would come from your affiliate dashboard)
const AFFILIATE_ADS = [
    {
        imageUrl: "https://images.unsplash.com/photo-1548625361-b88afed36c75?w=800&q=80", // Surf Image
        linkUrl: "https://www.viator.com/surf-lessons",
        title: "Catch your first wave! 🏄‍♂️"
    },
    {
        imageUrl: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80", // Tours Image
        linkUrl: "https://www.getyourguide.com",
        title: "Discover Local Tours 🗺️"
    }
];

export default function AdBanner({ placement = 'detail', imageUrl, linkUrl }: AdBannerProps) {
    const { user } = useAuth();
    const showAds = hasFeature(user?.tier, 'hasAds');
    const { t } = useTranslation();

    if (!showAds) return null;

    // Logic: Use provided ad, or pick random affiliate, or fallback to House Ad (Upgrade)
    // For this demo, we'll randomize between an Affiliate Ad and the House Ad
    const randomAdIndex = Math.floor(Math.random() * (AFFILIATE_ADS.length + 1));
    const affiliateAd = randomAdIndex < AFFILIATE_ADS.length ? AFFILIATE_ADS[randomAdIndex] : null;

    const finalImage = imageUrl || affiliateAd?.imageUrl;
    const finalLink = linkUrl || affiliateAd?.linkUrl;

    // Render Affiliate/Image Ad
    if (finalImage && finalLink) {
        return (
            <div className="ad-banner" style={{
                margin: placement === 'list' ? '1rem 0' : '2rem 0',
                position: 'relative'
            }}>
                <small style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(0,0,0,0.5)', color: 'white',
                    padding: '2px 6px', borderRadius: '4px',
                    fontSize: '10px', textTransform: 'uppercase'
                }}>
                    {t('ad.sponsored', 'Sponsored')}
                </small>
                <a href={finalLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                    <img
                        src={finalImage}
                        alt="Sponsored"
                        style={{
                            width: '100%',
                            height: placement === 'sidebar' ? 'auto' : '120px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />
                    {affiliateAd?.title && (
                        <div style={{
                            padding: '8px',
                            background: '#f8f9fa',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: '#333'
                        }}>
                            {affiliateAd.title} ↗
                        </div>
                    )}
                </a>
            </div>
        );
    }

    // Fallback: House Ad (Upgrade)
    return (
        <div className="ad-banner" style={{
            background: '#f8f9fa',
            border: '1px solid #e9ecef',
            padding: '1rem',
            margin: placement === 'list' ? '1rem 0' : '2rem 0',
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
