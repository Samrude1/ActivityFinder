import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { formatDate } from '../utils/format';
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
    const [recFavorites, setRecFavorites] = useState<Set<number>>(new Set());
    const [reviewSearch, setReviewSearch] = useState('');
    const [reviewFilter, setReviewFilter] = useState('Most Recent');

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

    // Default mock data if missing
    const features = activity.features || ["Free cancellation", "Mobile ticket", "Instant confirmation"];
    const gallery = activity.gallery || [activity.image];
    const cancellationPolicy = activity.cancellationPolicy || "For a full refund, cancel at least 24 hours in advance of the start date of the experience.";
    const duration = activity.duration || "Variable";

    const toggleAccordion = (index: number) => {
        const newExpanded = new Set(expandedAccordions);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedAccordions(newExpanded);
    };

    const toggleRecFavorite = (id: number) => {
        const newFavs = new Set(recFavorites);
        if (newFavs.has(id)) {
            newFavs.delete(id);
        } else {
            newFavs.add(id);
        }
        setRecFavorites(newFavs);
    };

    const accordionData = [
        { title: "What's included", content: "• Private surfing lesson\n• Surfboard and leash\n• Rash guard/wetsuit\n• Professional instructor\n• Basic refreshments" },
        { title: "What to expect", content: "You'll start with a 20-minute land lesson covering safety and basic techniques. Then, you'll head into the water for hands-on practice with your instructor. Expect to catch your first waves and get a great workout!" },
        { title: "Meeting and pickup", content: "Meeting point: Playa Hermosa Surf Shop, 100m West of the Main Entrance. Please arrive 15 minutes before your scheduled start time." },
        { title: "Accessibility", content: "• Not wheelchair accessible\n• Near public transportation\n• Surfaces are not wheelchair accessible\n• Not recommended for travelers with back problems" },
        { title: "Additional information", content: "• Confirmation will be received at time of booking\n• Most travelers can participate\n• This is a private tour/activity. Only your group will participate" },
        { title: "Cancellation policy", content: cancellationPolicy },
        { title: "Help", content: "Visit our Help Center or contact support at support@activityfinder.com for assistance with your booking." }
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
                    <div className="gallery-main">
                        <img src={gallery[0]} alt={activity.title} />
                        <button className="gallery-btn">View all photos</button>
                    </div>
                    <div className="gallery-side">
                        {gallery[1] && <img src={gallery[1]} alt="Gallery 2" />}
                        {gallery[2] && <img src={gallery[2]} alt="Gallery 3" />}
                    </div>
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
                                {activity.description}
                                <span className="read-more-link"> ...Read more</span>
                            </p>

                            <div className="guarantees-list">
                                <div className="guarantee-row">
                                    <div className="guarantee-icon">↺</div>
                                    <p><strong>Free cancellation</strong> • Full refund if cancelled up to 24 hours before the experience starts (local time).</p>
                                </div>
                                <div className="guarantee-row">
                                    <div className="guarantee-icon">💳</div>
                                    <p><strong>Reserve now & pay later</strong> • Secure your spot while staying flexible.</p>
                                </div>
                                <div className="guarantee-row">
                                    <div className="guarantee-icon">🏷️</div>
                                    <p><strong>Lowest price guarantee</strong> • Find a lower price online? Get the difference refunded!</p>
                                </div>
                            </div>
                        </section>

                        <section className="detail-section reviews-section">
                            <div className="section-header-row">
                                <h2>Why travelers love this</h2>
                                <div className="rating-summary">
                                    <span className="rating-score">5.0</span>
                                    <span className="stars">●●●●●</span>
                                    <span className="review-count">({activity.reviewCount || 113} reviews)</span>
                                </div>
                            </div>

                            <div className="reviews-grid">
                                <div className="review-card">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar-img" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/women/44.jpg)' }}></div>
                                        <div>
                                            <div className="reviewer-name">Cora G</div>
                                            <div className="review-date">Written January 19, 2026</div>
                                        </div>
                                    </div>
                                    <div className="stars">●●●●●</div>
                                    <p className="review-text">"{activity.reviewSnippet || "Richard is one of the best surf instructors I've met. His instructions are clear and he patiently goes..."}"</p>
                                    <div className="read-more-review">Read more ⌄</div>
                                </div>

                                <div className="review-card">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar-img" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/women/68.jpg)' }}></div>
                                        <div>
                                            <div className="reviewer-name">Kirsten</div>
                                            <div className="review-date">Written January 19, 2026</div>
                                        </div>
                                    </div>
                                    <div className="stars">●●●●●</div>
                                    <p className="review-text">"I had two classes. One with John and one with Richi. I improved immensely within these two classes..."</p>
                                    <div className="read-more-review">Read more ⌄</div>
                                </div>
                            </div>
                        </section>

                        <div className="divider-line"></div>

                        <section className="detail-section bottom-features">
                            {features.map((feature: string, idx: number) => (
                                <div key={idx} className="feature-row">
                                    <span className="feature-icon-black">✓</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                            <div className="feature-row">
                                <span className="feature-icon-black">⏱️</span>
                                <span>Duration: {duration}</span>
                            </div>
                            <div className="feature-row">
                                <span className="feature-icon-black">🕒</span>
                                <span>Start time: Check availability</span>
                            </div>
                            <div className="feature-row">
                                <span className="feature-icon-black">🗣️</span>
                                <span>Live guide: English, Spanish</span>
                            </div>
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

                        {/* Detailed Reviews Section */}
                        <section className="detailed-reviews-section">
                            <div className="contribute-block">
                                <h3>Contribute</h3>
                                <div className="contribute-btns">
                                    <button className="btn-outline">Write a review</button>
                                    <button className="btn-outline">Upload a photo</button>
                                </div>
                            </div>

                            <div className="reviews-tabs-header">
                                <span className="active">Reviews</span>
                                <span>Q&A</span>
                            </div>
                            <div className="reviews-divider"></div>

                            <div className="reviews-layout">
                                <div className="rating-breakdown-col">
                                    <div className="big-rating-score">
                                        5.0 <span className="stars">●●●●●</span> <span className="count">(113)</span>
                                    </div>
                                    <div className="rating-bars">
                                        <div className="rating-bar-row">
                                            <span>Excellent</span>
                                            <div className="bar-container"><div className="bar-fill" style={{ width: '99%' }}></div></div>
                                            <span>112</span>
                                        </div>
                                        <div className="rating-bar-row">
                                            <span>Very good</span>
                                            <div className="bar-container"><div className="bar-fill" style={{ width: '0%' }}></div></div>
                                            <span>0</span>
                                        </div>
                                        <div className="rating-bar-row">
                                            <span>Average</span>
                                            <div className="bar-container"><div className="bar-fill" style={{ width: '0%' }}></div></div>
                                            <span>0</span>
                                        </div>
                                        <div className="rating-bar-row">
                                            <span>Poor</span>
                                            <div className="bar-container"><div className="bar-fill" style={{ width: '0%' }}></div></div>
                                            <span>0</span>
                                        </div>
                                        <div className="rating-bar-row">
                                            <span>Terrible</span>
                                            <div className="bar-container"><div className="bar-fill" style={{ width: '1%' }}></div></div>
                                            <span>1</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="reviews-list-col">
                                    <div className="reviews-search-row">
                                        <div className="search-input-wrapper">
                                            <span className="search-icon">🔍</span>
                                            <input
                                                type="text"
                                                placeholder="Search reviews..."
                                                value={reviewSearch}
                                                onChange={(e) => setReviewSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="reviews-filters-row">
                                        <button className="filter-chip">Filters</button>
                                        <button className="filter-chip">English ⌄</button>
                                        <div className="dropdown-filter">
                                            <select
                                                className="filter-chip-select"
                                                value={reviewFilter}
                                                onChange={(e) => setReviewFilter(e.target.value)}
                                            >
                                                <option>Most Recent</option>
                                                <option>Highest Rated</option>
                                                <option>Lowest Rated</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="popular-mentions">
                                        <h4>Popular mentions</h4>
                                        <div className="mentions-tags">
                                            {["pura vida", "playa hermosa", "richard", "teacher", "lesson", "board", "beginners", "surf", "waves", "beach", "session", "vibes", "instructions", "jokes", "basics", "guidance"].map(tag => (
                                                <span key={tag} className="mention-tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="review-divider-light"></div>
                                    <div className="auto-translate-note">
                                        These reviews have been automatically translated from their original language. ⓘ
                                        <button className="btn-dark-pill">Show original reviews</button>
                                    </div>

                                    {/* Cora G Review */}
                                    <div className="full-review-card">
                                        <div className="reviewer-header">
                                            <div className="reviewer-avatar-small" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/women/44.jpg)' }}></div>
                                            <div className="reviewer-meta">
                                                <div className="name">Cora G</div>
                                                <div className="contrib-count">6 contributions</div>
                                            </div>
                                            <div className="thumbs-up">👍 0 •••</div>
                                        </div>
                                        <div className="review-stars-row">
                                            <span className="stars">●●●●●</span>
                                        </div>
                                        <h4 className="review-title">Best Beginner Surf Experience Ever!</h4>
                                        <div className="review-date-line">Jan 2026 • Couples</div>
                                        <p className="review-body">
                                            Richard is one of the best surf instructors I’ve met. His instructions are clear and he patiently goes over the steps until you get it . In addition, he has this beautiful spirit that makes you want to keep trying. Our very first time surfing, both my husband and I got up and had a great ride. Do this!!
                                        </p>
                                        <div className="review-footer">
                                            Written January 19, 2026<br />
                                            <span className="disclaimer">This review is the subjective opinion of a Tripadvisor member and not of Tripadvisor LLC. Tripadvisor performs checks on reviews.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="booking-sidebar">
                        <div className="booking-card">
                            <div className="price-header">
                                <span className="price-label">From ${activity.price || 70}.00</span>
                                <span className="price-unit">per adult</span>
                            </div>

                            <h3 className="sidebar-section-title">Select date and travelers</h3>

                            <div className="booking-selectors">
                                <button className="selector-btn date-selector">
                                    📅 {formatDate(activity.date)}
                                </button>
                                <button className="selector-btn people-selector">
                                    👥 2
                                </button>
                            </div>

                            <div className="booking-policies">
                                <div className="policy-row">
                                    <div className="policy-icon-wrapper">
                                        <span className="policy-icon-symbol">↺</span>
                                    </div>
                                    <p className="policy-text">
                                        <strong>Cancellation policy</strong> • Cancel anytime before Jan 26 for full refund.
                                    </p>
                                </div>
                                <div className="policy-row">
                                    <div className="policy-icon-wrapper">
                                        <span className="policy-icon-symbol">💳</span>
                                    </div>
                                    <p className="policy-text">
                                        <strong>Reserve now & pay later</strong> • Secure your spot while staying flexible.
                                    </p>
                                </div>
                            </div>

                            <div className="availability-info">
                                1 option available for 1/27
                            </div>

                            <div className="option-selection-card">
                                <h4 className="option-title">{activity.title}</h4>
                                <div className="price-breakdown">
                                    <div className="price-row">
                                        <span>2 Adults x ${activity.price || 70}.00</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Total</span>
                                        <span className="total-amount">${((activity.price || 70) * 2).toFixed(2)}</span>
                                    </div>
                                    <div className="price-note">(Price includes taxes and booking fees)</div>
                                </div>

                                <div className="time-slots">
                                    <button className="time-slot active">6:30 AM</button>
                                    <button className="time-slot">9:00 AM</button>
                                    <button className="time-slot">11:00 AM</button>
                                </div>
                                <a href="#" className="see-more-times">See 1 More Time</a>
                            </div>

                            <div className="book-ahead-note">
                                <span className="calendar-icon">📅</span>
                                <div>
                                    <strong>Book ahead</strong> • This is booked 28 days in advance on average.
                                </div>
                            </div>

                            <button className="btn-reserve-now">Reserve Now</button>
                        </div>
                    </aside>
                </div>

                {/* Similar Experiences & More From Trip */}
                <section className="recommendations-section">
                    <h2 className="recommendations-title">Similar experiences</h2>
                    <div className="cards-scroll-container">
                        {/* Mocking similar items by using the same activity but slightly different for visuals if needed, or just mapping a few */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rec-card">
                                <div className="rec-card-image" style={{ backgroundImage: `url(${activity.image})` }}>
                                    <button
                                        className={`rec-fav-btn ${recFavorites.has(i) ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleRecFavorite(i); }}
                                    >
                                        {recFavorites.has(i) ? '❤️' : '🤍'}
                                    </button>
                                </div>
                                <div className="rec-card-content">
                                    <h3 className="rec-card-title">{activity.title} {i}</h3>
                                    <div className="rec-rating">
                                        <span className="stars">●●●●●</span>
                                        <span className="rec-review-count">(45)</span>
                                    </div>
                                    <div className="rec-category">{activity.category}</div>
                                    <div className="rec-price">from ${activity.price} per adult</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="recommendations-section">
                    <h2 className="recommendations-title">Get more from your trip</h2>
                    <div className="cards-scroll-container">
                        {[5, 6, 7, 8].map((i) => (
                            <div key={i} className="rec-card">
                                <div className="rec-card-image" style={{ backgroundImage: `url(${activity.gallery && activity.gallery[1] ? activity.gallery[1] : activity.image})` }}>
                                    <button
                                        className={`rec-fav-btn ${recFavorites.has(i) ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleRecFavorite(i); }}
                                    >
                                        {recFavorites.has(i) ? '❤️' : '🤍'}
                                    </button>
                                </div>
                                <div className="rec-card-content">
                                    <h3 className="rec-card-title">Tour of sloths, exotic birds, frogs. {i}</h3>
                                    <div className="rec-rating">
                                        <span className="stars">●●●●●</span>
                                        <span className="rec-review-count">(461)</span>
                                    </div>
                                    <div className="rec-category">Walking Tours</div>
                                    <div className="rec-price">from $30.00 per adult</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {showAds && <div className="ad-container"><AdBanner /></div>}
            </main>
        </article>
    );
}
