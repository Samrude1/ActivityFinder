import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { geocodeAddress } from '../services/geocoding';
import { useAuth } from '../contexts/AuthContext';
import { freeAPI } from '../services/api';
import type { Activity } from '../types';
import ActivityCard from './ActivityCard';
import { getFavoriteIds, addFavorite, removeFavorite, isFavorite } from '../services/storage';
import './SearchPage.css';

const CITY_DATA: Record<string, { image: string, country: string, description: string }> = {
    'helsinki': {
        image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1200&q=80',
        country: 'Finland',
        description: 'Sitting on the edge of the Baltic, the modern, cosmopolitan city of Helsinki is a hub of design and culture. The beauty of the surrounding nature blends seamlessly with high-tech achievements and contemporary trends.'
    },
    'paris': {
        image: 'https://images.unsplash.com/photo-1502602868886-0eb0ec2f932f?w=1200&q=80',
        country: 'France',
        description: 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.'
    },
    'new york': {
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
        country: 'United States',
        description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers.'
    },
    'tokyo': {
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
        country: 'Japan',
        description: 'Tokyo, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods.'
    },
    'milan': {
        image: 'https://images.unsplash.com/photo-1534685785745-60a2cea0ec34?w=1200&q=80',
        country: 'Italy',
        description: 'Milan, a metropolis in Italy\'s northern Lombardy region, is a global capital of fashion and design. Home to the national stock exchange, it’s a financial hub also known for its high-end restaurants and shops.'
    },
    'default': {
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
        country: '',
        description: 'Discover amazing activities, hidden gems, and iconic places in this destination. Plan your perfect trip with our comprehensive guide to local experiences and attractions.'
    }
};

function getCityInfo(query: string) {
    const q = query.toLowerCase();
    for (const key in CITY_DATA) {
        if (key !== 'default' && q.includes(key)) {
            return CITY_DATA[key];
        }
    }
    return CITY_DATA['default'];
}

const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-img"></div>
        <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
        </div>
    </div>
);

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(!!query);
    const [isValidCity, setIsValidCity] = useState<boolean | null>(null);
    const [activeFilter, setActiveFilter] = useState('Essentials');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = () => {
        if (searchInput.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const cityInfo = getCityInfo(query);

    useEffect(() => {
        updateFavorites();
        window.addEventListener('favorites-updated', updateFavorites);
        return () => window.removeEventListener('favorites-updated', updateFavorites);
    }, []);

    const updateFavorites = async () => {
        const favIds = await getFavoriteIds();
        setFavoriteIds(favIds);
    };

    const handleToggleFavorite = async (activityId: string) => {
        const isFav = await isFavorite(activityId);
        if (isFav) {
            await removeFavorite(activityId);
        } else {
            const activityToSave = activities.find(a => a.id === activityId);
            if (activityToSave) {
                await addFavorite(activityToSave);
            }
        }
        updateFavorites();
    };

    useEffect(() => {
        if (!query) return;

        let isMounted = true;
        setLoading(true);
        setIsValidCity(null);

        geocodeAddress(query).then(async loc => {
            if (!isMounted) return;
            if (loc) {
                setIsValidCity(true);
                try {
                    const cacheKey = `search_v2_${loc.lat.toFixed(4)}_${loc.lng.toFixed(4)}_${15}`;
                    const cached = sessionStorage.getItem(cacheKey);
                    
                    if (cached) {
                        if (isMounted) {
                            setActivities(JSON.parse(cached));
                            setLoading(false);
                        }
                    } else {
                        // Fetch real data from backend
                        const results = await freeAPI.searchActivities(loc, 15, []);
                        if (isMounted) {
                            setActivities(results);
                            sessionStorage.setItem(cacheKey, JSON.stringify(results));
                        }
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    if (isMounted) setActivities([]);
                }
                if (isMounted) setLoading(false);
            } else {
                if (isMounted) setIsValidCity(false);
                if (isMounted) setLoading(false);
            }
        });

        return () => { isMounted = false; };
    }, [query, user?.tier]);



    return (
        <div className="search-page">
            <Header
                viewMode="list"
                onViewModeChange={() => { }}
            />

            <main className="search-main">
                <div className="search-content">
                    {isValidCity === false && !loading && (
                        <div className="error-section" style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '600px', margin: '0 auto' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
                            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-md)' }}>City not found</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: '1.6' }}>
                                We couldn't find a valid city matching "<strong>{query}</strong>". The location might be too small, misspelled, or not a recognized city/town.
                            </p>
                            <button className="main-button" onClick={() => navigate('/')}>Return Home</button>
                        </div>
                    )}
                    {!query && (
                        <div className="empty-search-state" style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '600px', margin: '0 auto' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌎</div>
                            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-lg)' }}>Where do you want to go?</h2>
                            <div className="tripadvisor-search-pill" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', padding: '0.5rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', margin: '0 auto' }}>
                                <span className="search-icon-large" style={{ padding: '0 1rem', color: 'var(--text-primary)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </span>
                                <input
                                    type="text"
                                    className="search-input-large"
                                    placeholder="Places to go, things to do..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem', fontSize: '1rem', background: 'transparent' }}
                                />
                                <button
                                    className="search-btn-large"
                                    onClick={handleSearch}
                                    style={{ backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    )}
                    {isValidCity === true && !loading && (
                        <div className="city-hero-section">
                            <div className="breadcrumbs">
                                <span>Explore</span>
                                <span className="breadcrumb-separator">&gt;</span>
                                <span>{cityInfo.country || 'Global'}</span>
                                <span className="breadcrumb-separator">&gt;</span>
                                <span className="current">{query || 'Destination'}</span>
                            </div>
                            <div className="city-hero-image-container">
                                <img src={cityInfo.image} alt={query} className="city-hero-image" />
                            </div>
                            <div className="city-hero-content">
                                <div className="city-title-row">
                                    <h1 className="city-title">{query.split(',')[0]} {cityInfo.country ? `, ${cityInfo.country}` : ''}</h1>
                                    <button className="save-city-btn">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                        Save
                                    </button>
                                </div>
                                <p className="city-description">{cityInfo.description}</p>
                            </div>
                        </div>
                    )}
                    {loading ? (
                        <div className="search-layout list">
                            <div className="search-list-container">
                                <div className="skeleton-grid">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
                                </div>
                            </div>
                        </div>
                    ) : isValidCity === true ? (
                        <div className="search-layout list">
                            <div className="search-list-container">
                                <div className="filter-chips-section">
                                    <h2 className="filter-chips-title">Essential {query.split(',')[0]}</h2>
                                    <p className="filter-chips-subtitle">Pick a category to filter your recs</p>
                                    <div className="filter-chips-container">
                                        <button className={`filter-chip ${activeFilter === 'Essentials' ? 'active' : ''}`} onClick={() => setActiveFilter('Essentials')}>
                                            <span className="chip-icon">☆</span> All Results
                                        </button>
                                        <button className={`filter-chip ${activeFilter === 'Outdoors' ? 'active' : ''}`} onClick={() => setActiveFilter('Outdoors')}>
                                            <span className="chip-icon">⛰️</span> Outdoors
                                        </button>
                                        <button className={`filter-chip ${activeFilter === 'Food' ? 'active' : ''}`} onClick={() => setActiveFilter('Food')}>
                                            <span className="chip-icon">🍽️</span> Food
                                        </button>
                                        <button className={`filter-chip ${activeFilter === 'Museums' ? 'active' : ''}`} onClick={() => setActiveFilter('Museums')}>
                                            <span className="chip-icon">🏛️</span> Museums
                                        </button>
                                        <button className={`filter-chip ${activeFilter === 'Arts & theater' ? 'active' : ''}`} onClick={() => setActiveFilter('Arts & theater')}>
                                            <span className="chip-icon">🎭</span> Culture
                                        </button>
                                        <button className={`filter-chip ${activeFilter === 'Nightlife' ? 'active' : ''}`} onClick={() => setActiveFilter('Nightlife')}>
                                            <span className="chip-icon">🍸</span> Nightlife
                                        </button>
                                        <button className={`filter-chip ${activeFilter === 'Music' ? 'active' : ''}`} onClick={() => setActiveFilter('Music')}>
                                            <span className="chip-icon">🎵</span> Music
                                        </button>
                                        <button className={`filter-chip ${activeFilter === 'Sports' ? 'active' : ''}`} onClick={() => setActiveFilter('Sports')}>
                                            <span className="chip-icon">⚽</span> Sports
                                        </button>
                                    </div>
                                </div>
                                <div className="activities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', padding: '20px 0' }}>
                                    {activities.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>No activities found for this destination.</div>
                                    ) : (
                                    activities
                                            .filter(a => {
                                                if (activeFilter === 'Essentials') return true;
                                                if (activeFilter === 'Outdoors') return a.category === 'Outdoors';
                                                if (activeFilter === 'Food') return a.category === 'Food';
                                                if (activeFilter === 'Museums') return a.category === 'Museums';
                                                if (activeFilter === 'Arts & theater') return ['Arts & theater', 'Museums', 'Cultural'].includes(a.category);
                                                if (activeFilter === 'Nightlife') return a.category === 'Nightlife';
                                                if (activeFilter === 'Music') return a.category === 'Music';
                                                if (activeFilter === 'Sports') return a.category === 'Sports';
                                                return true;
                                            })
                                            .map((activity) => (
                                                <ActivityCard
                                                    key={activity.id}
                                                    activity={activity}
                                                    isFavorite={favoriteIds.includes(activity.id)}
                                                    onToggleFavorite={handleToggleFavorite}
                                                />
                                            ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
}
