import { Link } from 'react-router-dom';
import type { Activity } from '../types';
import './ActivityCard.css';

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
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite(activity.id);
    };

    return (
        <Link
            to={`/activity/${activity.id}`}
            state={{ activity }}
            className={`activity-card ${featured ? 'featured' : ''}`}
        >
            <div className="activity-card-image-container">
                <img
                    src={activity.image}
                    alt={activity.title}
                    className="activity-card-image"
                    loading={featured ? "eager" : "lazy"}
                    decoding={featured ? "sync" : "async"}
                    fetchPriority={featured ? "high" : "auto"}
                />
                <div className="activity-card-overlay"></div>

                <button
                    className="activity-card-favorite"
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>

                <div className="activity-card-content">
                    <h3 className="activity-card-title">{activity.title}</h3>

                    <div className="activity-card-meta">
                        {activity.price !== undefined && (
                            <div className="activity-card-price">
                                {activity.price === 0 ? (
                                    <span className="price-free">FREE</span>
                                ) : (
                                    <span className="price-paid-badge">Paid</span>
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
        </Link>
    );
}
