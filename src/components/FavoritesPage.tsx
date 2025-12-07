import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Activity } from '../types';
import { getFavorites } from '../services/storage';
import ActivityCard from './ActivityCard';
import './FavoritesPage.css';

export default function FavoritesPage() {
    const navigate = useNavigate();
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

    const handleToggleFavorite = () => {
        loadFavorites(); // Reload after toggle
    };

    if (loading) {
        return (
            <div className="favorites-page">
                <div className="favorites-header">
                    <div className="favorites-header-content">
                        <button onClick={() => navigate('/')} className="back-btn">
                            ← Back
                        </button>
                        <h1>My Favorites</h1>
                    </div>
                </div>
                <div className="favorites-container">
                    <div className="loading-container">
                        <div className="loading"></div>
                        <p>Loading favorites...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <div className="favorites-header-content">
                    <button onClick={() => navigate('/')} className="back-btn">
                        ← Back
                    </button>
                    <h1>My Favorites ❤️</h1>
                </div>
            </div>

            <div className="favorites-container">
                {favorites.length === 0 ? (
                    <div className="empty-favorites">
                        <div className="empty-icon">💔</div>
                        <h2>No Favorites Yet</h2>
                        <p>Start exploring and save your favorite activities!</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Discover Activities
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
