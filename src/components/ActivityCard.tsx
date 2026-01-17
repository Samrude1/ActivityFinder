import { useNavigate } from 'react-router-dom';
import type { Activity } from '../types';
import './ActivityCard.css';
import { useAuth } from '../contexts/AuthContext';
import { hasFeature } from '../config/tierConfig';
import { useState } from 'react';
import ListPickerModal from './ListPickerModal';
import { useTranslation } from 'react-i18next';

interface ActivityCardProps {
    activity: Activity;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    featured?: boolean;
}

export default function ActivityCard({
    activity,
    isFavorite,
    onToggleFavorite,
    featured = false
}: ActivityCardProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const hasCustomLists = hasFeature(user?.tier, 'hasCustomLists');
    const [showListPicker, setShowListPicker] = useState(false);
    const { t } = useTranslation();

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite(activity.id);
    };

    const handleCardClick = () => {
        navigate(`/activity/${activity.id}`, { state: { activity } });
    };

    return (
        <div
            className={`activity-card ${featured ? 'featured' : ''}`}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        >
            <div className="activity-card-image-container">
                <img
                    src={activity.image}
                    alt={activity.title}
                    className="activity-card-image"
                    loading={featured ? "eager" : "lazy"}
                />
                <div className="activity-card-overlay"></div>

                <div className="activity-card-actions">
                    <button
                        className="activity-card-favorite"
                        onClick={handleFavoriteClick}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>

                    {hasCustomLists && (
                        <button
                            className="activity-card-list-add"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowListPicker(true);
                            }}
                            title="Add to Custom List"
                        >
                            ➕
                        </button>
                    )}
                </div>

                <div className="activity-card-content">
                    <h3 className="activity-card-title">{activity.title}</h3>

                    {activity.rating && (
                        <div className="activity-card-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                            <span style={{ color: '#fbbf24' }}>{'⭐'.repeat(5)}</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{activity.rating.toFixed(1)}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>({activity.reviewCount})</span>
                        </div>
                    )}

                    {activity.reviewSnippet && (
                        <p className="activity-card-review" style={{
                            fontStyle: 'italic',
                            fontSize: '0.9em',
                            color: 'var(--text-secondary)',
                            margin: '0 0 12px 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            "{activity.reviewSnippet}"
                        </p>
                    )}

                    <div className="activity-card-meta">
                        {activity.price !== undefined && (
                            <div className="activity-card-price">
                                {activity.price === 0 ? (
                                    <span className="price-free">{t('card.free')}</span>
                                ) : (
                                    <span className="price-paid-badge">{t('card.paid')}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {activity.location && (
                        <div className="activity-card-location">
                            <span className="location-icon">📍</span>
                            <span className="location-text">{activity.location.address}</span>
                        </div>
                    )}
                </div>
            </div>

            {featured && (
                <button className="activity-card-cta">
                    See more
                    <span className="cta-arrow">→</span>
                </button>
            )}

            {showListPicker && (
                <ListPickerModal
                    activity={activity}
                    onClose={() => setShowListPicker(false)}
                    onAddSuccess={() => setShowListPicker(false)}
                />
            )}
        </div>
    );
}
