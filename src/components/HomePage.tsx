import { useState, useEffect } from 'react';
import type { Activity, Location, Category } from '../types';

import { searchActivities } from '../services/activityService';
import { getCurrentLocation } from '../services/geolocation';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import ActivityCard from './ActivityCard';
import MapView from './MapView';
import BottomNavigation from './BottomNavigation';
import AdvancedFilters, { FilterState } from '../tiers/Explorer/features/AdvancedFilters';
import UpgradePrompt from '../tiers/Free/features/UpgradePrompt';
import HomeCustomLists from '../tiers/Explorer/features/HomeCustomLists';
import { AiConciergeModal } from './AiConciergeModal';
import { freeAPI } from '../services/api';
import { SearchAllIcon, HotelsIcon, ThingsToDoIcon, RestaurantsIcon, CruisesIcon, SearchIcon } from './icons';
import './HomePage.css';

type ViewMode = 'list' | 'map';

import { usePageTitle } from '../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    usePageTitle('Home');
    const navigate = useNavigate();
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const { favorites, toggleFavorite: handleToggleFavorite } = useFavorites();
    const [priceFilter] = useState<'all' | 'free' | 'paid'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searching] = useState(false);
    const [radius, setRadius] = useState(25);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
        priceRange: [0, 200],
        minRating: 0,
        accessibility: []
    });
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
    const [showAiConcierge, setShowAiConcierge] = useState(false);




    useEffect(() => {
        getCurrentLocation().then(loc => {
            setUserLocation(loc);
            setSearchQuery(loc.address);
        });
    }, []);

    useEffect(() => {
        if (!userLocation) return;

        setLoading(true);

        if (user?.tier === 'free') {
            freeAPI.searchActivities(
                userLocation,
                radius,
                selectedCategories
            )
                .then(setActivities)
                .catch(error => {
                    if (error.upgradeRequired) {
                        setShowUpgradePrompt(true);
                    }
                    console.error('Search error:', error);
                    setActivities([]);
                })
                .finally(() => setLoading(false));

        } else {
            searchActivities({
                location: userLocation,
                radius,
                categories: selectedCategories,
                priceRange: priceFilter === 'all'
                    ? { min: 0, max: 1000 }
                    : priceFilter === 'free'
                        ? { min: 0, max: 0 }
                        : { min: 1, max: 1000 },
                minRating: advancedFilters.minRating,
                accessibility: advancedFilters.accessibility,
            })
                .then(setActivities)
                .finally(() => setLoading(false));
        }

    }, [userLocation, selectedCategories, priceFilter, radius, advancedFilters, user?.tier]);



    const handleSearchLocation = async (queryOverride?: string) => {
        const queryToUse = typeof queryOverride === 'string' ? queryOverride : searchQuery;
        if (!queryToUse.trim()) return;

        navigate(`/search?q=${encodeURIComponent(queryToUse.trim())}`);
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchLocation();
        }
    };

    return (
        <div className="home-page">
            <Header
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Main Content */}
            <main>

                <div className="mKXaY f e dTtOG TFSSL" data-test-target="feed">
                    <div className="home-content">
                        <div className="container">

                            {/* Tripadvisor Hero Section */}
                            <section className="hero-section">
                                <h1 className="hero-title">Where to?</h1>

                                <div className="search-tabs">
                                    <button className="search-tab active">
                                        <span className="tab-icon">
                                            <SearchAllIcon />
                                        </span>
                                        <span className="tab-text">Search All</span>
                                    </button>
                                    <button className="search-tab ai-highlight-tab" onClick={() => setShowAiConcierge(true)} style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none' }}>
                                        <span className="tab-icon">🪄</span>
                                        <span className="tab-text" style={{ fontWeight: 700 }}>AI Concierge</span>
                                    </button>
                                    <button className="search-tab" onClick={() => navigate('/hotels')}>
                                        <span className="tab-icon">
                                            <HotelsIcon />
                                        </span>
                                        <span className="tab-text">Hotels</span>
                                    </button>
                                    <button className="search-tab" onClick={() => navigate('/things-to-do')}>
                                        <span className="tab-icon">
                                            <ThingsToDoIcon />
                                        </span>
                                        <span className="tab-text">Things to Do</span>
                                    </button>
                                    <button className="search-tab" onClick={() => navigate('/restaurants')}>
                                        <span className="tab-icon">
                                            <RestaurantsIcon />
                                        </span>
                                        <span className="tab-text">Restaurants</span>
                                    </button>
                                    <button className="search-tab" onClick={() => navigate('/cruises')}>
                                        <span className="tab-icon">
                                            <CruisesIcon />
                                        </span>
                                        <span className="tab-text">Cruises</span>
                                    </button>
                                </div>

                                <div className="tripadvisor-search-pill">
                                    <span className="search-icon-large">
                                        <SearchIcon />
                                    </span>
                                    <input
                                        type="text"
                                        className="search-input-large"
                                        placeholder="Places to go, things to do, hotels..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onClick={() => setSearchQuery('')}
                                        onKeyPress={handleSearchKeyPress}
                                    />
                                    <button
                                        className="search-btn-large"
                                        onClick={() => handleSearchLocation()}
                                        disabled={searching}
                                    >
                                        {searching ? '...' : 'Search'}
                                    </button>
                                </div>
                            </section>

                            {/* Essential Location Section */}
                            {viewMode === 'list' && (
                                <section className="essential-location-section">
                                    <div className="section-header">
                                        <h2 className="section-title">Explore Essential Locations</h2>
                                        <p className="section-subtitle">Real-time picks near {userLocation?.address || 'you'} based on your interests</p>
                                    </div>
                                    
                                    <div className="category-pills-scroll">
                                        {['Outdoors', 'Food', 'Museums', 'Arts & theater', 'Nightlife', 'Family friendly', 'Hidden gems', 'Essentials'].map(cat => (
                                            <button
                                                key={cat}
                                                className={`category-pill ${selectedCategories.includes(cat as Category) ? 'active' : ''}`}
                                                onClick={() => setSelectedCategories(prev => prev.includes(cat as Category) ? prev.filter(c => c !== cat) : [...prev, cat as Category])}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    {loading ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Loading activities...</div>
                                    ) : activities.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>No activities found in this area.</div>
                                    ) : (
                                        <div className="essential-grid">
                                            {activities.map((activity) => (
                                                <ActivityCard
                                                    key={activity.id}
                                                    activity={activity}
                                                    isFavorite={favorites.includes(activity.id)}
                                                    onToggleFavorite={(id) => {
                                                        const activityToSave = activities.find(a => a.id === id);
                                                        handleToggleFavorite(id, activityToSave);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Iconic Places and Travelers Choice sections removed for a cleaner real-time experience */}

                            {/* Custom Lists (Explorer Feature) */}
                            {user?.tier === 'explorer' && !loading && viewMode === 'list' && (
                                <HomeCustomLists />
                            )}

                            {/* Loading State Removed */}
                            {viewMode === 'map' ? (
                                /* Map View */
                                <section className="map-section">
                                    <div className="map-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <button
                                            className="main-button"
                                            onClick={() => setViewMode('list')}
                                        >
                                            ← Main
                                        </button>
                                        <div className="radius-selector" style={{ position: 'relative' }}>
                                            <select
                                                value={radius}
                                                onChange={(e) => setRadius(Number(e.target.value))}
                                                className="radius-select"
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: 'var(--radius-full)',
                                                    border: '1px solid var(--border-color)',
                                                    backgroundColor: 'var(--bg-secondary)',
                                                    appearance: 'none',
                                                    paddingRight: '2rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value={10}>10 km</option>
                                                <option value={25}>25 km</option>
                                                <option value={50}>50 km</option>
                                                <option value={100}>100 km</option>
                                            </select>
                                            <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>▼</span>
                                        </div>
                                    </div>
                                    <MapView
                                        activities={activities}
                                        userLocation={userLocation}
                                        favorites={favorites}
                                        onToggleFavorite={(id) => {
                                            const activityToSave = activities.find(a => a.id === id);
                                            handleToggleFavorite(id, activityToSave);
                                        }}
                                        radius={radius}
                                    />
                                </section>
                            ) : (
                                /* List View */
                                <>
                                    {/* Price selection toggle - Hidden or removed based on user request to remove activities */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <BottomNavigation />

            {showAdvancedFilters && (
                <AdvancedFilters
                    initialFilters={advancedFilters}
                    onFilterChange={(filters) => setAdvancedFilters(filters)}
                    onClose={() => setShowAdvancedFilters(false)}
                />
            )}

            {showUpgradePrompt && (
                <UpgradePrompt
                    feature="Unlimited Searches"
                    currentLimit="50/day"
                    tier="Explorer"
                    onClose={() => setShowUpgradePrompt(false)}
                />
            )}

            <AiConciergeModal
                isOpen={showAiConcierge}
                onClose={() => setShowAiConcierge(false)}
                currentLocation={userLocation || { name: 'Current Location', lat: 60.1699, lng: 24.9384 }}
                availableActivities={activities}
                onSelectActivity={(act) => navigate(`/activity/${act.id}`)}
                onToggleFavorite={(act) => handleToggleFavorite(act.id, act)}
                isFavorite={(id) => favorites.includes(id)}
            />
        </div>
    );
}
