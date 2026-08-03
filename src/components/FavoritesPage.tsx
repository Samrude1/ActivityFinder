import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Activity } from '../types';
import { getFavorites, removeFavorite } from '../services/storage';
import ActivityCard from './ActivityCard';
import './FavoritesPage.css';
import './FavoritesPage.css';
import CalendarExport from '../tiers/Explorer/features/CalendarExport';
import BackButton from './BackButton';
import { useTranslation } from 'react-i18next';

export default function FavoritesPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [favorites, setFavorites] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
        window.addEventListener('favorites-updated', loadFavorites);
        return () => window.removeEventListener('favorites-updated', loadFavorites);
    }, []);

    const loadFavorites = async () => {
        setLoading(true);
        const favs = await getFavorites();
        setFavorites(favs);
        setLoading(false);
    };

    const handleToggleFavorite = async (id: string) => {
        await removeFavorite(id);
        loadFavorites(); // Reload after removal
    };

    if (loading) {
        return (
            <div className="favorites-page">
                <div className="favorites-header">
                    <div className="favorites-header-content">
                        <BackButton to="/" />
                        <h1>My Favorites</h1>
                    </div>
                </div>
                <div className="favorites-container">
                    <div className="loading-container">
                        <div className="loading"></div>
                        <p>{t('common.loading')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <div className="favorites-header-content">
                    <BackButton to="/" />
                    <h1>{t('nav.favorites')} ❤️</h1>
                    {favorites.length > 0 && (
                        <CalendarExport
                            activities={favorites}
                            buttonStyle={{ padding: '8px 16px', fontSize: '0.9rem' }}
                        />
                    )}
                </div>
            </div>
            
            <div className="favorites-container">
                {favorites.length === 0 ? (
                    <div className="empty-favorites">
                        <div className="empty-icon">💔</div>
                        <h2>{t('favorites.empty_title', 'No Favorites Yet')}</h2>
                        <p>{t('favorites.empty_desc', 'Start exploring and save your favorite activities!')}</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            {t('favorites.discover', 'Discover Activities')}
                        </button>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                isFavorite={true}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
