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
import AdBanner from './AdBanner';
import AdvancedFilters, { FilterState } from '../tiers/Explorer/features/AdvancedFilters';
import ActivitySearch from '../tiers/Free/features/ActivitySearch';
import UpgradePrompt from '../tiers/Free/features/UpgradePrompt';
import HomeCustomLists from '../tiers/Explorer/features/HomeCustomLists';
import { freeAPI } from '../services/api';
import './HomePage.css';

type ViewMode = 'list' | 'map';

import { usePageTitle } from '../hooks/usePageTitle';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
    usePageTitle('Home');
    const { t } = useTranslation();
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [radius, setRadius] = useState(25);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
        priceRange: [0, 200],
        minRating: 0,
        accessibility: []
    });
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

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
            }, user?.tier)
                .then(setActivities)
                .finally(() => setLoading(false));
        }

    }, [userLocation, selectedCategories, priceFilter, radius, advancedFilters, user?.tier]);

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

    const handleSearchLocation = async (queryOverride?: string) => {
        const queryToUse = typeof queryOverride === 'string' ? queryOverride : searchQuery;
        if (!queryToUse.trim()) return;

        setSearching(true);
        const location = await geocodeAddress(queryToUse.trim());

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
    const displayActivities = activities.slice(1)
        .filter(act => {
            if (priceFilter === 'free') return act.price === 0;
            if (priceFilter === 'paid') return (act.price || 0) > 0;
            return true;
        });

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
                            <p className="greeting-subtitle">{t('home.hero.subtitle')}</p>
                        </div>
                        <div className="header-actions">
                            <LanguageSwitcher />
                            <UserMenu />
                            <SettingsMenu
                                onViewModeChange={setViewMode}
                                currentViewMode={viewMode}
                                favoritesCount={favorites.length}
                            />
                        </div>
                    </div>

                    {/* Search Bar */}
                    {user?.tier === 'free' ? (
                        <ActivitySearch
                            onSearch={(query) => {
                                setSearchQuery(query);
                                handleSearchLocation(query);
                            }}
                            searching={searching}
                            val={searchQuery}
                        />
                    ) : (
                        /* Standard Search Bar */
                        <div className="search-bar-container">
                            <div className="search-input-wrapper">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder={t('home.search.placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onClick={() => setSearchQuery('')}
                                    onKeyPress={handleSearchKeyPress}
                                    className="search-input"
                                />
                            </div>

                            <button
                                className="search-btn secondary"
                                onClick={() => setShowAdvancedFilters(true)}
                                title="Advanced Filters"
                            >
                                ⚡
                            </button>



                            <button
                                className="search-btn"
                                onClick={() => handleSearchLocation()}
                                disabled={searching}
                            >
                                {searching ? '...' : t('home.search.button')}
                            </button>
                        </div>
                    )}

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
                                    {t(`home.categories.${category.toLowerCase()}`)}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Custom Lists (Explorer Feature) */}
                    {user?.tier === 'explorer' && !loading && viewMode === 'list' && (
                        <HomeCustomLists />
                    )}

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
                                onToggleFavorite={handleToggleFavorite}
                                radius={radius}
                            />
                        </section>
                    ) : (
                        /* List View */
                        <>
                            {featuredActivity && (
                                <section className="featured-section">
                                    <h2 className="section-title">{t('home.sections.featured')}</h2>
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
                                                ? selectedCategories.map(c => t(`home.categories.${c.toLowerCase()}`)).join(', ')
                                                : t('home.categories.all')}
                                        </h2>
                                        <span className="activity-count">{displayActivities.length} found</span>
                                    </div>
                                    <AdBanner />
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
                                    <h3>{t('common.no_results')}</h3>
                                    <p>Try adjusting your filters or location</p>
                                </div>
                            )}

                            {/* Price selection toggle */}
                            <div className="price-filter-container">
                                <button
                                    onClick={() => setPriceFilter('free')}
                                    className={`price-filter-btn ${priceFilter === 'free' ? 'active' : ''}`}
                                >
                                    {t('tiers.free')}
                                </button>
                                <button
                                    onClick={() => setPriceFilter('paid')}
                                    className={`price-filter-btn ${priceFilter === 'paid' ? 'active' : ''}`}
                                >
                                    {t('card.paid')}
                                </button>
                                <button
                                    onClick={() => setPriceFilter('all')}
                                    className={`price-filter-btn ${priceFilter === 'all' ? 'active' : ''}`}
                                >
                                    {t('home.categories.all')}
                                </button>
                            </div>
                        </>
                    )}
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
        </div>
    );
}
