import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Footer from './components/Footer';
import './index.css';

// Lazy load pages
const HomePage = lazy(() => import('./components/HomePage'));
const FavoritesPage = lazy(() => import('./components/FavoritesPage'));
const ActivityDetail = lazy(() => import('./components/ActivityDetail'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const CustomLists = lazy(() => import('./tiers/Explorer/features/CustomLists'));
const CustomListDetail = lazy(() => import('./tiers/Explorer/features/CustomListDetail'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const CategoryPage = lazy(() => import('./components/CategoryPage'));

// Loading fallback for routes
const PageLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'var(--text-secondary)'
    }}>
        <div className="loading" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Suspense fallback={<PageLoader />}>
                    <div style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/activity/:id" element={<ActivityDetail />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/lists" element={<CustomLists />} />
                            <Route path="/lists/:id" element={<CustomListDetail />} />
                            <Route path="/hotels" element={<CategoryPage title="Hotels" icon="🛏️" description="Find the perfect place to stay, from luxury resorts to cozy boutique hotels." />} />
                            <Route path="/things-to-do" element={<CategoryPage title="Things to Do" icon="🎯" description="Discover incredible activities and memorable experiences." />} />
                            <Route path="/restaurants" element={<CategoryPage title="Restaurants" icon="🍽️" description="Explore local culinary delights and top-rated dining spots." />} />
                            <Route path="/cruises" element={<CategoryPage title="Cruises" icon="🚢" description="Set sail on unforgettable journeys and ocean adventures." />} />
                        </Routes>
                    </div>
                </Suspense>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;
