import { useState, useEffect } from 'react';
import type { Activity, Category, Location } from '../types';
import { searchActivities } from '../services/activityService';
import { getCurrentLocation } from '../services/geolocation';
import { geocodeAddress } from '../services/geocoding';
import { getFavoriteIds, addFavorite, removeFavorite, isFavorite } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import ActivityCard from './ActivityCard';
import MapView from './MapView';
import BottomNavigation from './BottomNavigation';
import SettingsMenu from './SettingsMenu';
import UserMenu from './UserMenu';
import SkeletonCard from './SkeletonCard';
import './HomePage.css';

type ViewMode = 'list' | 'map';

import { usePageTitle } from '../hooks/usePageTitle';

export default function HomePage() {
    usePageTitle('Home');
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showPaid, setShowPaid] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [radius, setRadius] = useState(25);

    const categories: Category[] = ['Outdoor', 'Cultural', 'Sports', 'Music', 'Food', 'Family'];

    useEffect(() => {
        getCurrentLocation().then(loc => {
            setUserLocation(loc);
            setSearchQuery(loc.address);
        });
        updateFavorites();
        window.addEventListener('favorites-updated', updateFavorites);
        return () => window.removeEventListener('favorites-updated', updateFavorites);
    }, []);

    const updateFavorites = async () => {
        const favIds = await getFavoriteIds();
        setFavorites(favIds);
    };

    useEffect(() => {
        if (!userLocation) return;

        setLoading(true);
        searchActivities({
            location: userLocation,
            radius,
            categories: selectedCategories,
            priceRange: showPaid ? { min: 0, max: 1000 } : { min: 0, max: 0 },
        })
            .then(setActivities)
            .finally(() => setLoading(false));
    }, [userLocation, selectedCategories, showPaid, radius]);

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

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        const location = await geocodeAddress(searchQuery.trim());

        if (location) {
            setUserLocation(location);
            setSearchQuery(location.address);
        } else {
            alert('Location not found! Staying at current location.');
            setSearchQuery(userLocation?.address || ''); // Reset to last valid address
        }
        setSearching(false);
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchLocation();
        }
    };

    const featuredActivity = activities[0];
    const displayActivities = activities.slice(1);

    return (
        <div className="home-page">
            {/* Header */}
            <header className="home-header">
                <div className="container">
                    <div className="header-top">
                        <div className="greeting">
                            <h1 className="greeting-text">
                                Hello, {user?.username || 'Explorer'} 👋
                            </h1>
                            <p className="greeting-subtitle">Discover amazing activities near you</p>
                        </div>
                        <div className="header-actions">
                            <UserMenu />
                            <SettingsMenu
                                onViewModeChange={setViewMode}
                                currentViewMode={viewMode}
                                favoritesCount={favorites.length}
                            />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="search-bar-container">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search location (e.g., Helsinki, Porvoo)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={() => setSearchQuery('')}
                                onKeyPress={handleSearchKeyPress}
                                className="search-input"
                            />
                        </div>

                        <div className="radius-selector" style={{ position: 'relative' }}>
                            <select
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                                className="radius-select"
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-secondary)',
                                    appearance: 'none',
                                    paddingRight: '2.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value={10}>10 km</option>
                                <option value={25}>25 km</option>
                                <option value={50}>50 km</option>
                                <option value={100}>100 km</option>
                            </select>
                            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }}>▼</span>
                        </div>

                        <button
                            className="search-btn"
                            onClick={handleSearchLocation}
                            disabled={searching}
                        >
                            {searching ? '...' : 'Go'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="home-content">
                <div className="container">
                    {/* Category Pills */}
                    <section className="categories-section">
                        <div className="category-pills">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategories(prev =>
                                            prev.includes(category)
                                                ? prev.filter(c => c !== category)
                                                : [...prev, category]
                                        );
                                    }}
                                    className={`category-pill ${selectedCategories.includes(category) ? 'active' : ''}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Loading State */}
                    {loading ? (
                        <div className="loading-container" style={{ display: 'block' }}>
                            <div className="activities-grid">
                                {[...Array(6)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        </div>
                    ) : viewMode === 'map' ? (
                        /* Map View */
                        <section className="map-section">
                            <button
                                className="main-button"
                                onClick={() => setViewMode('list')}
                            >
                                ← Main
                            </button>
                            <MapView
                                activities={activities}
                                userLocation={userLocation}
                                favorites={favorites}
                                onToggleFavorite={handleToggleFavorite}
                                radius={radius}
                            />
                        </section>
                    ) : (
                        /* List View */
                        <>
                            {featuredActivity && (
                                <section className="featured-section">
                                    <h2 className="section-title">Featured Activity</h2>
                                    <ActivityCard
                                        activity={featuredActivity}
                                        isFavorite={favorites.includes(featuredActivity.id)}
                                        onToggleFavorite={handleToggleFavorite}
                                        featured
                                    />
                                </section>
                            )}

                            {/* All Activities Grid */}
                            {displayActivities.length > 0 ? (
                                <section className="all-activities-section">
                                    <div className="section-header">
                                        <h2 className="section-title">
                                            {selectedCategories.length > 0
                                                ? `${selectedCategories.join(', ')} Activities`
                                                : 'All Activities'}
                                        </h2>
                                        <span className="activity-count">{displayActivities.length} found</span>
                                    </div>
                                    <div className="activities-grid">
                                        {displayActivities.map((activity) => (
                                            <ActivityCard
                                                key={activity.id}
                                                activity={activity}
                                                isFavorite={favorites.includes(activity.id)}
                                                onToggleFavorite={handleToggleFavorite}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">🔍</div>
                                    <h3>No activities found</h3>
                                    <p>Try adjusting your filters or location</p>
                                </div>
                            )}

                            {/* Toggle for paid activities */}
                            <div className="paid-toggle-container">
                                <button
                                    onClick={() => setShowPaid(!showPaid)}
                                    className={`paid-toggle ${showPaid ? 'active' : ''}`}
                                >
                                    {showPaid ? '✓ ' : ''}Show Paid Activities
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
}
