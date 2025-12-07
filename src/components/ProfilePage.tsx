import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="profile-empty">
                        <div className="empty-icon">👤</div>
                        <h2>Not Logged In</h2>
                        <p>Please log in to view your profile</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="container">
                    <button onClick={() => navigate('/')} className="back-btn">
                        ← Back
                    </button>
                </div>
            </header>

            <div className="container profile-content">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="profile-name">{user.username}</h1>
                    <p className="profile-email">{user.email}</p>
                </div>

                <div className="profile-sections">
                    <button className="profile-section-btn" onClick={() => navigate('/favorites')}>
                        <span className="section-icon">❤️</span>
                        <div className="section-content">
                            <h3>Saved Activities</h3>
                            <p>View your favorite places</p>
                        </div>
                        <span className="section-arrow">→</span>
                    </button>

                    <button className="profile-section-btn">
                        <span className="section-icon">⚙️</span>
                        <div className="section-content">
                            <h3>Settings</h3>
                            <p>Preferences and privacy</p>
                        </div>
                        <span className="section-arrow">→</span>
                    </button>

                    <button className="profile-section-btn" onClick={logout}>
                        <span className="section-icon">🚪</span>
                        <div className="section-content">
                            <h3>Logout</h3>
                            <p>Sign out of your account</p>
                        </div>
                        <span className="section-arrow">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
