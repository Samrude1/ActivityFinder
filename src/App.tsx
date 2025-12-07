import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Lazy load pages
const HomePage = lazy(() => import('./components/HomePage'));
const FavoritesPage = lazy(() => import('./components/FavoritesPage'));
const ActivityDetail = lazy(() => import('./components/ActivityDetail'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));

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
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/activity/:id" element={<ActivityDetail />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Suspense>
        </AuthProvider>
    );
}

export default App;
