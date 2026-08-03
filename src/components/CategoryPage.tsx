import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface CategoryPageProps {
    title: string;
    icon: string;
    description: string;
}

export default function CategoryPage({ title, icon, description }: CategoryPageProps) {
    const navigate = useNavigate();

    return (
        <div className="home-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header
                viewMode="list"
                onViewModeChange={() => {}}
            />

            <main style={{ flex: 1, padding: 'var(--space-4xl) var(--space-md)', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-3xl) 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>{icon}</div>
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>{title}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 'var(--space-2xl)' }}>
                        {description}
                    </p>
                    
                    <div style={{ 
                        padding: 'var(--space-2xl)', 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderRadius: 'var(--radius-xl)',
                        border: '1px dashed var(--border-color)'
                    }}>
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Coming Soon</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            We are currently building this section. Check back later for amazing {title.toLowerCase()}!
                        </p>
                        <button 
                            className="main-button" 
                            style={{ marginTop: 'var(--space-xl)' }}
                            onClick={() => navigate('/')}
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
}
