import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import './UserMenu.css';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, login, register, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (authMode === 'login') {
                await login(email, password);
            } else {
                if (!username) {
                    setError('Username is required');
                    setLoading(false);
                    return;
                }
                await register(username, email, password);
            }
            setShowAuthModal(false);
            setEmail('');
            setPassword('');
            setUsername('');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <>
            <div className="user-menu">
                {user ? (
                    <>
                        <button className="user-avatar" onClick={() => setIsOpen(!isOpen)}>
                            {user.username.charAt(0).toUpperCase()}
                        </button>
                        {isOpen && (
                            <>
                                <div className="menu-overlay" onClick={() => setIsOpen(false)} />
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <div className="user-info">
                                            <strong>{user.username}</strong>
                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item" onClick={() => { navigate('/profile'); setIsOpen(false); }}>
                                        <span>👤</span> Profile
                                    </button>
                                    <button className="dropdown-item" onClick={() => { navigate('/favorites'); setIsOpen(false); }}>
                                        <span>❤️</span> Favorites
                                    </button>
                                    <button className="dropdown-item" onClick={toggleTheme}>
                                        <span>{theme === 'light' ? '🌙' : '☀️'}</span> {theme === 'light' ? 'Dark' : 'Light'} Mode
                                    </button>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item danger" onClick={handleLogout}>
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <button className="login-btn" onClick={() => setShowAuthModal(true)}>
                        Login / Sign Up
                    </button>
                )}
            </div>

            {/* Auth Modal */}
            {showAuthModal && createPortal(
                <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowAuthModal(false)}>✕</button>

                        <div className="auth-tabs">
                            <button
                                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                                onClick={() => { setAuthMode('login'); setError(''); }}
                            >
                                Login
                            </button>
                            <button
                                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                                onClick={() => { setAuthMode('register'); setError(''); }}
                            >
                                Register
                            </button>
                        </div>

                        <form onSubmit={handleAuth} className="auth-form">
                            {authMode === 'register' && (
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                                {authMode === 'register' && (
                                    <small>Minimum 8 characters</small>
                                )}
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create Account'}
                            </button>

                            <div className="auth-toggle" style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {authMode === 'login' ? (
                                    <>
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            className="toggle-link"
                                            onClick={() => { setAuthMode('register'); setError(''); }}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            className="toggle-link"
                                            onClick={() => { setAuthMode('login'); setError(''); }}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
                                        >
                                            Login
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>

                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
