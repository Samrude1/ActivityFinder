import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getLimit } from '../../../config/tierConfig';
import UpgradePrompt from '../../Free/features/UpgradePrompt';
import { useTranslation } from 'react-i18next';


interface OfflineMapsModalProps {
    onClose: () => void;
}

interface CityMap {
    id: string;
    name: string;
    size: string;
    status: 'downloaded' | 'downloading' | 'available';
    progress?: number;
}

const AVAILABLE_CITIES: CityMap[] = [
    { id: 'helsinki', name: 'Helsinki', size: '45 MB', status: 'available' },
    { id: 'tampere', name: 'Tampere', size: '32 MB', status: 'available' },
    { id: 'turku', name: 'Turku', size: '28 MB', status: 'available' },
    { id: 'oulu', name: 'Oulu', size: '25 MB', status: 'available' },
    { id: 'rovaniemi', name: 'Rovaniemi', size: '22 MB', status: 'available' },
    { id: 'porvoo', name: 'Porvoo', size: '15 MB', status: 'available' },
    { id: 'espoo', name: 'Espoo', size: '30 MB', status: 'available' },
    { id: 'vantaa', name: 'Vantaa', size: '28 MB', status: 'available' }
];

export default function OfflineMapsModal({ onClose }: OfflineMapsModalProps) {
    const { user } = useAuth();
    const [myMaps, setMyMaps] = useState<CityMap[]>([]);
    const [downloading, setDownloading] = useState<string | null>(null);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const { t } = useTranslation();

    const limit = getLimit(user?.tier, 'maxOfflineMaps');
    // Tier check: if limit is 0, user cannot access this at all (or sees empty state + upgrade)
    // But typically the entry point is gated. Here we assume entry point might be visible but protected.
    // Actually, Explorer has 5 maps. Free has 0.

    const handleDownload = (city: CityMap) => {
        if (myMaps.length >= limit) {
            setShowUpgrade(true);
            return;
        }

        setDownloading(city.id);

        // Simulate download
        setTimeout(() => {
            setMyMaps(prev => [...prev, { ...city, status: 'downloaded' }]);
            setDownloading(null);
        }, 1500);
    };

    const handleRemove = (cityId: string) => {
        setMyMaps(prev => prev.filter(m => m.id !== cityId));
    };

    const isDownloaded = (cityId: string) => myMaps.some(m => m.id === cityId);

    return (
        <div className="modal-overlay">
            <div className="modal-content offline-maps-modal">
                <div className="modal-header">
                    <h2>🗺️ {t('offline_maps.title', 'Offline Maps')}</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="usage-stats">
                    <div className="usage-bar">
                        <div
                            className="usage-fill"
                            style={{ width: `${(myMaps.length / limit) * 100}%` }}
                        ></div>
                    </div>
                    <span>{t('offline_maps.usage', { count: myMaps.length, limit: limit === Infinity ? '∞' : limit })}</span>
                </div>

                <div className="cities-list">
                    {AVAILABLE_CITIES.map(city => {
                        const downloaded = isDownloaded(city.id);
                        const isDownloading = downloading === city.id;

                        return (
                            <div key={city.id} className="city-item">
                                <div className="city-info">
                                    <span className="city-name">{city.name}</span>
                                    <span className="city-size">{city.size}</span>
                                </div>
                                <div className="city-action">
                                    {downloaded ? (
                                        <button
                                            className="btn-remove"
                                            onClick={() => handleRemove(city.id)}
                                        >
                                            🗑️
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-download"
                                            disabled={isDownloading}
                                            onClick={() => handleDownload(city)}
                                        >
                                            {isDownloading ? '⏳' : '⬇️'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showUpgrade && (
                    <UpgradePrompt
                        feature={t('offline_maps.more_feature', 'More Offline Maps')}
                        currentLimit={`${limit} cities`}
                        tier="Adventurer"
                        onClose={() => setShowUpgrade(false)}
                    />
                )}
            </div>

            <style>{`
                .offline-maps-modal {
                    max-width: 500px;
                    width: 100%;
                    margin: auto; /* Ensure centering in flex container */
                }
                .modal-overlay {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .usage-stats {
                    margin-bottom: var(--space-lg);
                    background-color: var(--bg-secondary);
                    padding: 10px;
                    border-radius: var(--radius-md);
                }
                .usage-bar {
                    height: 8px;
                    background-color: var(--border-color);
                    border-radius: var(--radius-xs);
                    overflow: hidden;
                    margin-bottom: 5px;
                }
                .usage-fill {
                    height: 100%;
                    background: #667eea;
                    transition: width 0.3s ease;
                }
                .cities-list {
                    max-height: 400px;
                    overflow-y: auto;
                }
                .city-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-md);
                    border-bottom: 1px solid #eee;
                }
                .city-info {
                    display: flex;
                    flex-direction: column;
                }
                .city-size {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .btn-download {
                    background-color: var(--bg-hover);
                    color: #5a67d8;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-full);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-remove {
                    background-color: var(--bg-card)5f5;
                    color: var(--danger);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-full);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
