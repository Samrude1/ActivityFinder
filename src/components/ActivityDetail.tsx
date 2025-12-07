import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { formatDate, formatDistance } from '../utils/format';
import { getFavorites, addFavorite, removeFavorite, isFavorite as checkIsFavorite } from '../services/storage';
import { getAllActivities } from '../services/activityService';
import type { Activity } from '../types';
import './ActivityDetail.css';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ActivityDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const [isFavorite, setIsFavorite] = useState(false);
    const [activity, setActivity] = useState<Activity | undefined>(location.state?.activity);
    const [loading, setLoading] = useState(!activity);

    usePageTitle(activity?.title || 'Activity Detail');

    useEffect(() => {
        window.scrollTo(0, 0);

        // If no activity in state (e.g., direct link), fetch from all activities
        if (!activity && id) {
            loadActivity(id);
        }

        // Check if activity is in favorites
        if (activity) {
            checkIsFavorite(activity.id).then(setIsFavorite);
        }
    }, [activity, id]);

    const loadActivity = async (activityId: string) => {
        setLoading(true);
        // First check if it's in favorites (fastest)
        const favorites = await getFavorites();
        const favActivity = favorites.find((a: Activity) => a.id === activityId);

        if (favActivity) {
            setActivity(favActivity);
            setIsFavorite(true);
            setLoading(false);
            return;
        }

        // Fallback to mock data
        const allActivities = await getAllActivities();
        const found = allActivities.find((a: Activity) => a.id === activityId);

        if (found) {
            setActivity(found);
            const isFav = await checkIsFavorite(found.id);
            setIsFavorite(isFav);
        }
        setLoading(false);
    };

    const handleToggleFavorite = async () => {
        if (!activity) return;

        if (isFavorite) {
            await removeFavorite(activity.id);
            setIsFavorite(false);
        } else {
            await addFavorite(activity);
            setIsFavorite(true);
        }
    };

    const handleShare = async () => {
        if (!activity) return;

        const shareUrl = `${window.location.origin}/activity/${activity.id}`;
        const shareData = {
            title: activity.title,
            text: `Check out this activity: ${activity.title}`,
            url: shareUrl,
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            prompt('Copy this link:', shareUrl);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="activity-detail-page">
                <div className="detail-header">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        ← Back
                    </button>
                </div>
                <div className="detail-container">
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="loading" style={{ width: '40px', height: '40px', borderWidth: '4px', margin: '0 auto' }}></div>
                        <p>Loading activity...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no activity found, redirect back
    if (!activity) {
        return (
            <div className="activity-detail-page">
                <div className="detail-header">
                    <button onClick={() => navigate('/')} className="back-btn">
                        ← Home
                    </button>
                </div>
                <div className="detail-container">
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <h2>Activity Not Found</h2>
                        <p>Sorry, we couldn't load this activity.</p>
                        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>
                            Browse Activities
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const CATEGORY_COLORS: Record<string, string> = {
        Outdoor: '#10b981',
        Cultural: '#8b5cf6',
        Sports: '#ef4444',
        Music: '#ec4899',
        Food: '#f59e0b',
        Family: '#06b6d4',
    };

    return (
        <article className="activity-detail-page">
            <div className="detail-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← Back to Activities
                </button>
            </div>

            <div className="detail-container">
                <div className="detail-image-container">
                    <img src={activity.image} alt={activity.title} className="detail-image" />
                    <span
                        className="detail-category-badge"
                        style={{ backgroundColor: CATEGORY_COLORS[activity.category] }}
                    >
                        {activity.category}
                    </span>
                </div>

                <div className="detail-content">
                    <h1 className="detail-title">{activity.title}</h1>

                    {activity.price !== undefined && (
                        <div className="detail-price">
                            {activity.price === 0 ? (
                                <span className="price-free">🎉 FREE</span>
                            ) : (
                                <span className="price-paid">Paid</span>
                            )}
                        </div>
                    )}

                    <div className="detail-meta">
                        <div className="meta-item">
                            <span className="meta-icon">📅</span>
                            <div>
                                <strong>Date & Time</strong>
                                <p>{formatDate(activity.date)}</p>
                            </div>
                        </div>
                        <div className="meta-item">
                            <span className="meta-icon">📍</span>
                            <div>
                                <strong>Location</strong>
                                <p>{activity.location.address}</p>
                            </div>
                        </div>
                        {activity.distance !== undefined && (
                            <div className="meta-item">
                                <span className="meta-icon">🚶</span>
                                <div>
                                    <strong>Distance</strong>
                                    <p>{formatDistance(activity.distance)} from you</p>
                                </div>
                            </div>
                        )}
                        <div className="meta-item">
                            <span className="meta-icon">🎯</span>
                            <div>
                                <strong>Category</strong>
                                <p>{activity.category}</p>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h2>About This Activity</h2>
                        <p>{activity.description}</p>
                    </div>

                    {activity.keywords && activity.keywords.length > 0 && (
                        <div className="detail-section">
                            <h2>Tags</h2>
                            <div className="tags-container">
                                {activity.keywords.map((keyword: string, index: number) => (
                                    <span key={index} className="tag">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {activity.url && activity.url !== '#' && (
                        <div className="detail-section">
                            <h2>More Information</h2>
                            <p>
                                <a href={activity.url} target="_blank" rel="noopener noreferrer">
                                    View on OpenStreetMap →
                                </a>
                            </p>
                        </div>
                    )}

                    <div className="detail-section">
                        <h2>Getting There</h2>
                        <p>
                            <strong>Address:</strong> {activity.location.address}
                        </p>
                        <p>
                            <strong>Coordinates:</strong> {activity.location.lat.toFixed(4)}, {activity.location.lng.toFixed(4)}
                        </p>
                        <p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${activity.location.lat},${activity.location.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Get directions on Google Maps →
                            </a>
                        </p>
                    </div>

                    <div className="detail-actions">
                        <button
                            className={`btn-primary ${isFavorite ? 'active' : ''}`}
                            onClick={handleToggleFavorite}
                        >
                            {isFavorite ? '❤️ Saved' : '🤍 Save to Favorites'}
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={handleShare}
                        >
                            📤 Share Activity
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
