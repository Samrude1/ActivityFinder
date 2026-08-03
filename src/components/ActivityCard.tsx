import { useNavigate } from 'react-router-dom';
import type { Activity } from '../types';
import './ActivityCard.css';
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
    const navigate = useNavigate();
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

                <button
                    className={`activity-card-favorite-circle ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="3" fill={isFavorite ? "currentColor" : "none"}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            <div className="activity-card-content">
                <div className="activity-card-badge">Likely To Sell Out</div>
                <h3 className="activity-card-title">{activity.title}</h3>

                {activity.rating && (
                    <div className="activity-card-rating">
                        <span className="rating-value">{Number(activity.rating).toFixed(1)}</span>
                        <div className="rating-circles">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`rating-circle ${star <= Math.round(Number(activity.rating)) ? 'filled' : ''}`}></span>
                            ))}
                        </div>
                        <span className="review-count">({activity.reviewCount})</span>
                    </div>
                )}

                <div className="activity-card-bottom">
                    {activity.price !== undefined && (
                        <div className="activity-card-price-container">
                            {activity.price === 0 ? (
                                <span className="price-text">{t('card.free')}</span>
                            ) : (
                                <span className="price-text">from ${activity.price} per adult</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

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
