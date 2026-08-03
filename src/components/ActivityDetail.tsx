import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getFavorites, addFavorite, removeFavorite, isFavorite as checkIsFavorite } from '../services/storage';
import { getAllActivities } from '../services/activityService';
import type { Activity } from '../types';
import './ActivityDetail.css';
import AdBanner from './AdBanner';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import BackButton from './BackButton';
import { useTranslation } from 'react-i18next';

export default function ActivityDetail() {
    const { user } = useAuth();
    const showAds = !user || user.tier === 'free';
    // const navigate = useNavigate(); // Removed unused
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const [isFavorite, setIsFavorite] = useState(false);
    const [activity, setActivity] = useState<Activity | undefined>(location.state?.activity);
    const [loading, setLoading] = useState(!activity);
    const { t } = useTranslation();
    const [expandedAccordions, setExpandedAccordions] = useState<Set<number>>(new Set());
    const [activeTab, setActiveTab] = useState('Overview');

    usePageTitle(activity?.title || t('detail.title_default', 'Activity Detail'));

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!activity && id) {
            loadActivity(id);
        } else if (activity) {
            checkIsFavorite(activity.id).then(setIsFavorite);
        }
    }, [activity, id]);

    const loadActivity = async (activityId: string) => {
        setLoading(true);
        const favorites = await getFavorites();
        const favActivity = favorites.find((a: Activity) => a.id === activityId);

        if (favActivity) {
            setActivity(favActivity);
            setIsFavorite(true);
            setLoading(false);
            return;
        }

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
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied!');
        } catch (e) {
            console.error('Share failed', e);
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (!activity) return <div className="error-container">Activity not found</div>;

    const features = activity.features || [];
    const gallery = activity.gallery || [activity.image];

    const toggleAccordion = (index: number) => {
        const newExpanded = new Set(expandedAccordions);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedAccordions(newExpanded);
    };

    const accordionData = [
        { title: "Location", content: `Address: ${activity.location.address}` },
        { title: "Help", content: "Visit our Help Center or contact support at support@activityfinder.com for assistance." }
    ];

    return (
        <article className="activity-detail-page">
            {/* Global Header matching screenshot */}
            <header className="global-app-header">
                <div className="header-inner-container">
                    <div className="header-brand">
                        <div className="brand-logo-circle"><div className="owl-eyes">oo</div></div>
                        <span className="brand-text">ActivityFinder</span>
                    </div>

                    <div className="header-search-pill">
                        <span className="header-search-icon">🔍</span>
                        <input type="text" placeholder="Search" className="header-search-input" />
                    </div>

                    <div className="header-right-actions">
                        <nav className="header-nav-links">
                            <a href="#" className="nav-link">Rewards</a>
                            <a href="#" className="nav-link">Discover</a>
                            <a href="#" className="nav-link">Review</a>
                        </nav>
                        <div className="header-tools">
                            <div className="tool-item">🌐 <span className="currency-code">USD</span></div>
                            <button className="btn-header-signin">Sign in</button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="detail-header-nav">
                <div className="container">
                    <BackButton label={t('detail.back', 'All Things to Do')} />
                </div>
            </div>

            <main className="detail-container">
                <header className="activity-header">
                    <h1 className="activity-title">{activity.title}</h1>
                    <div className="activity-meta-line">
                        <div className="rating-badge">
                            <span className="stars">●●●●●</span>
                            <span className="review-count">{activity.reviewCount || 100} reviews</span>
                        </div>
                        <span className="separator">•</span>
                        <span className="category-link">{activity.category}</span>
                        <span className="separator">•</span>
                        <span className="location-link">{activity.location.address}</span>

                        <div className="header-action-btns">
                            <button className={`action-btn ${isFavorite ? 'active' : ''}`} onClick={handleToggleFavorite}>
                                {isFavorite ? '❤️ Favored' : '🤍 Save'}
                            </button>
                            <button className="action-btn" onClick={handleShare}>
                                🔗 Share
                            </button>
                        </div>
                    </div>
                </header>

                <div className="gallery-layout-grid">
                    <div className="gallery-main" style={{ gridColumn: gallery.length === 1 ? '1 / -1' : undefined }}>
                        <img src={gallery[0]} alt={activity.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    </div>
                    {gallery.length > 1 && (
                        <div className="gallery-side">
                            {gallery[1] && <img src={gallery[1]} alt="Gallery 2" />}
                            {gallery[2] && <img src={gallery[2]} alt="Gallery 3" />}
                        </div>
                    )}
                </div>

                <div className="content-layout-grid">
                    <div className="main-content-column">
                        <div className="content-tabs">
                            {['Overview', 'Details', 'Operator', 'Reviews'].map(tab => (
                                <button
                                    key={tab}
                                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="tab-border"></div>

                        <section className="detail-section about-section">
                            <h2>About</h2>
                            <p className="description-text">
                                {activity.description || "No description available."}
                            </p>
                        </section>

                        <section className="detail-section reviews-section">
                            <div className="section-header-row">
                                <h2>Reviews & Ratings</h2>
                                <div className="rating-summary">
                                    <span className="rating-score">{activity.rating}</span>
                                    <span className="stars">●●●●●</span>
                                    <span className="review-count">({activity.reviewCount || 0} reviews)</span>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-secondary)' }}>More reviews are available on the provider's website.</p>
                        </section>

                        <div className="divider-line"></div>

                        <section className="detail-section bottom-features">
                            {features.map((feature: string, idx: number) => (
                                <div key={idx} className="feature-row">
                                    <span className="feature-icon-black">✓</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </section>

                        <div className="accordion-list">
                            {accordionData.map((item, index) => (
                                <div key={index} className="accordion-item-wrapper">
                                    <div className="accordion-item" onClick={() => toggleAccordion(index)}>
                                        <h3 className="accordion-header">{item.title}</h3>
                                        <span className={`accordion-icon ${expandedAccordions.has(index) ? 'open' : ''}`}>
                                            {expandedAccordions.has(index) ? '⌄' : '⌄'}
                                        </span>
                                    </div>
                                    {expandedAccordions.has(index) && (
                                        <div className="accordion-content">
                                            {item.content.split('\n').map((line: string, i: number) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="booking-sidebar">
                        <div className="booking-card">
                            <h3 className="sidebar-section-title">Provider Details</h3>
                            
                            {activity.price ? (
                                <div className="price-header" style={{ marginBottom: '1.5rem' }}>
                                    <span className="price-label">Price Level</span>
                                    <span className="price-unit" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{'$'.repeat(activity.price)}</span>
                                </div>
                            ) : null}

                            <div className="booking-policies">
                                <div className="policy-row">
                                    <div className="policy-icon-wrapper">
                                        <span className="policy-icon-symbol">📱</span>
                                    </div>
                                    <p className="policy-text">
                                        <strong>View full details</strong> • Discover more photos, exact location, and detailed information directly from the source.
                                    </p>
                                </div>
                            </div>

                            {activity.url && activity.url !== '#' ? (
                                <a href={activity.url} target="_blank" rel="noopener noreferrer" className="btn-reserve-now" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                                    {activity.id?.startsWith('tm-') ? 'Get Tickets' 
                                      : activity.url.includes('google.com/maps') ? 'View on Google Maps' 
                                      : 'Visit Website'}
                                </a>
                            ) : (
                                <button className="btn-reserve-now" disabled style={{ opacity: 0.5 }}>Website Unavailable</button>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Fake Recommendations sections removed */}

                {showAds && <div className="ad-container"><AdBanner /></div>}
            </main>
        </article>
    );
}
