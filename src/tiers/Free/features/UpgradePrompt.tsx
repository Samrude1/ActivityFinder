
import { useNavigate } from 'react-router-dom';
import '../FreeTier.css';
import { useTranslation, Trans } from 'react-i18next';

interface UpgradePromptProps {
    feature: string;
    currentLimit: string;
    tier: 'Explorer' | 'Adventurer' | 'Business';
    onClose?: () => void;
}

export default function UpgradePrompt({ feature, currentLimit, tier, onClose }: UpgradePromptProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const tierPrices = {
        Explorer: '$4.99/month',
        Adventurer: '$9.99/month',
        Business: '$29.99/month'
    };

    return (
        <div className="upgrade-modal-overlay">
            <div className="upgrade-modal-content">
                <div className="upgrade-icon">🔒</div>
                <h2>{t('upgrade.unlock_feature', { feature })}</h2>
                <div className="limit-info">
                    <span className="limit-label">{t('upgrade.free_limit', 'Free Tier Limit')}</span>
                    <span className="limit-value">{currentLimit}</span>
                </div>

                <p className="upgrade-description">
                    <Trans i18nKey="upgrade.desc" values={{ tier }}>
                        Upgrade to <strong>{tier}</strong> to remove this limit and access exclusive premium features.
                    </Trans>
                </p>

                <div className="price-tag">
                    {tierPrices[tier]}
                </div>

                <div className="upgrade-actions">
                    <button
                        className="btn-upgrade-primary"
                        onClick={() => navigate('/profile?tab=subscription')}
                    >
                        {t('upgrade.cta', 'Upgrade Now')}
                    </button>
                    {onClose && (
                        <button className="btn-maybe-later" onClick={onClose}>
                            {t('upgrade.later', 'Maybe Later')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
