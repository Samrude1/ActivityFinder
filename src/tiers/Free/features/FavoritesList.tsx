import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { freeAPI } from '../../../services/api';
import UpgradePrompt from './UpgradePrompt';
import { getLimit } from '../../../config/tierConfig';
import '../FreeTier.css';

// This component replaces the list inside FavoritesPage for free users,
// OR handles the logic.

// Interface removed

export default function FavoritesList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpgrade, setShowUpgrade] = useState(false);

    const limit = getLimit(user?.tier, 'maxFavorites');
    const hasUnlimited = limit === Infinity;
    const isOverLimit = !hasUnlimited && favorites.length >= limit;

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            // Use freeAPI if free, or core? Both likely work if endpoint handles it.
            // But freeAPI calls /api/free/favorites.
            const data = await freeAPI.getFavorites();
            setFavorites(data);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            await freeAPI.removeFavorite(id);
            setFavorites(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Failed to remove favorite');
        }
    };

    // Render list (simplified for now, ideally reuses ActivityCard but with Remove button)
    // Dependencies on ActivityCard meant I should likely import it.
    // import ActivityCard from '../../../components/ActivityCard'; 

    return (
        <div className="free-favorites-container">
            {isOverLimit && (
                <div className="favorites-limit-header">
                    <div className="limit-badge-pill">
                        ❤️ Used: {favorites.length}/{limit}
                    </div>
                </div>
            )}

            {loading ? (
                <div>Loading favorites...</div>
            ) : favorites.length === 0 ? (
                <div className="empty-state">
                    <p>No favorites yet.</p>
                    <button className="btn-secondary" onClick={() => navigate('/')}>
                        Discover Activities
                    </button>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map(fav => (
                        <div key={fav.id} className="favorite-item-card">
                            <div className="fav-image" style={{ backgroundImage: `url(${fav.activity_data.image})` }}></div>
                            <div className="fav-content">
                                <h3>{fav.activity_data.title}</h3>
                                <p>{fav.activity_data.location?.address}</p>
                                <button onClick={() => handleRemove(fav.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .favorites-limit-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-md);
                    background-color: var(--bg-card);
                    margin-bottom: var(--space-2xl);
                    border-bottom: 1px solid #eee;
                }
                .favorites-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--space-md);
                    padding: var(--space-md);
                }
                .favorite-item-card {
                    background-color: var(--bg-card);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .fav-image {
                    height: 150px;
                    background-size: cover;
                    background-position: center;
                }
                .fav-content {
                    padding: var(--space-md);
                }
            `}</style>

            {showUpgrade && (
                <UpgradePrompt
                    feature="Unlimited Favorites"
                    currentLimit={`${limit} max`}
                    tier="Explorer"
                    onClose={() => setShowUpgrade(false)}
                />
            )}
        </div>
    );
}
