import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './PreferencesModal.css';

interface PreferencesModalProps {
    onClose: () => void;
}

export default function PreferencesModal({ onClose }: PreferencesModalProps) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [marketing, setMarketing] = useState(false);
    const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content preferences-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>⚙️ Preferences & Privacy</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="preferences-body">
                    <section className="preference-section">
                        <h3>App Theme</h3>
                        <div className="preference-item">
                            <div className="item-info">
                                <strong>Dark Mode</strong>
                                <p>Switch between light and dark themes</p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={theme === 'dark'}
                                    onChange={handleThemeToggle}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </section>

                    <section className="preference-section">
                        <h3>Notifications</h3>
                        <div className="preference-item">
                            <div className="item-info">
                                <strong>Activity Alerts</strong>
                                <p>Get notified about new events near you</p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={() => setNotifications(!notifications)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </section>

                    <section className="preference-section">
                        <h3>Privacy</h3>
                        <div className="preference-item">
                            <div className="item-info">
                                <strong>Marketing Emails</strong>
                                <p>Receive offers and curated picks (Adventurer+)</p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={marketing}
                                    disabled={user?.tier === 'free'}
                                    onChange={() => setMarketing(!marketing)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        {user?.tier === 'free' && (
                            <p className="premium-note">✨ Marketing preferences available in Explorer tier</p>
                        )}
                    </section>
                </div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={onClose}>Save & Close</button>
                </div>
            </div>
        </div>
    );
}
