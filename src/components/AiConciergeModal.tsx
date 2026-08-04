import React, { useState } from 'react';
import { Activity } from '../types';
import { fetchAiItinerary, AiItineraryResponse } from '../services/aiService';
import './AiConciergeModal.css';

interface AiConciergeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLocation: { name?: string; address?: string; lat: number; lng: number };
    availableActivities: Activity[];
    onSelectActivity: (activity: Activity) => void;
    onToggleFavorite: (activity: Activity) => void;
    isFavorite: (id: string) => boolean;
}

export const AiConciergeModal: React.FC<AiConciergeModalProps> = ({
    isOpen,
    onClose,
    currentLocation,
    availableActivities,
    onSelectActivity,
    onToggleFavorite,
    isFavorite
}) => {
    const [userQuery, setUserQuery] = useState('');
    const [selectedStyle, setSelectedStyle] = useState<string>('balanced');
    const [durationDays, setDurationDays] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AiItineraryResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [upgradeNotice, setUpgradeNotice] = useState<string | null>(null);

    if (!isOpen) return null;

    const QUICK_PROMPTS = [
        { label: '🌿 Outdoor & Nature', query: 'Show me scenic outdoor nature spots, parks, and nice walking routes.' },
        { label: '🏛️ Art & Culture Tour', query: 'Best museums, historic landmarks, and cultural highlights.' },
        { label: '☕ Foodie & Cozy Cafes', query: 'Popular local food spots, authentic coffee shops, and dinner recommendations.' },
        { label: '🌧️ Indoor & Rainy Day', query: 'Great indoor places to visit when weather is rainy or cold.' },
        { label: '👨‍👩‍👧 Family Friendly', query: 'Fun, safe activities suitable for families with kids.' }
    ];

    const handleGenerate = async (queryText?: string) => {
        const promptToUse = queryText || userQuery;
        if (!promptToUse.trim() && !queryText) return;

        setLoading(true);
        setError(null);
        setUpgradeNotice(null);

        try {
            const res = await fetchAiItinerary({
                location: currentLocation,
                userQuery: promptToUse,
                preferences: [selectedStyle],
                durationDays,
                availableActivities
            });

            if (!res.success && res.upgradeRequired) {
                setUpgradeNotice(res.error || 'Daily AI limit reached.');
                setLoading(false);
                return;
            }

            if (res.itinerary) {
                setResult(res.itinerary);
            } else {
                setError('Failed to generate itinerary. Please try again.');
            }
        } catch (err: any) {
            console.error('AI Concierge error:', err);
            setError(err.message || 'Error communicating with AI service');
        } finally {
            setLoading(false);
        }
    };

    const locationName = currentLocation.name || currentLocation.address || 'Current Location';

    return (
        <div className="ai-modal-overlay" onClick={onClose}>
            <div className="ai-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="ai-modal-header">
                    <div className="ai-modal-title">
                        <span className="ai-sparkle-badge">🪄 AI Concierge</span>
                        <h2>Smart Travel Assistant</h2>
                        <p className="ai-subtitle">Destination: <strong>{locationName}</strong></p>
                    </div>
                    <button className="ai-close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
                </div>

                {/* Body Content */}
                <div className="ai-modal-body">
                    {/* Prompt input area */}
                    <div className="ai-input-section">
                        <label htmlFor="ai-prompt-input" className="ai-input-label">What would you like to experience?</label>
                        <div className="ai-input-wrapper">
                            <input
                                id="ai-prompt-input"
                                type="text"
                                className="ai-text-input"
                                placeholder={`e.g. "2-day relaxed trip with cozy cafes and local museums"`}
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                disabled={loading}
                            />
                            <button
                                className="ai-submit-btn"
                                onClick={() => handleGenerate()}
                                disabled={loading || !userQuery.trim()}
                            >
                                {loading ? <span className="ai-spinner"></span> : 'Generate Itinerary'}
                            </button>
                        </div>

                        {/* Quick Prompts */}
                        <div className="ai-quick-prompts">
                            <span className="ai-quick-title">Popular Ideas:</span>
                            <div className="ai-chips-scroll">
                                {QUICK_PROMPTS.map((p, idx) => (
                                    <button
                                        key={idx}
                                        className="ai-chip-btn"
                                        onClick={() => {
                                            setUserQuery(p.query);
                                            handleGenerate(p.query);
                                        }}
                                        disabled={loading}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Options Bar */}
                        <div className="ai-options-bar">
                            <div className="ai-option-group">
                                <span>Duration:</span>
                                <select
                                    value={durationDays}
                                    onChange={(e) => setDurationDays(Number(e.target.value))}
                                    disabled={loading}
                                >
                                    <option value={1}>1 Day</option>
                                    <option value={2}>2 Days</option>
                                    <option value={3}>3 Days</option>
                                </select>
                            </div>
                            <div className="ai-option-group">
                                <span>Vibe:</span>
                                <select
                                    value={selectedStyle}
                                    onChange={(e) => setSelectedStyle(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="balanced">Balanced</option>
                                    <option value="budget">Budget Friendly</option>
                                    <option value="relaxing">Relaxed & Leisurely</option>
                                    <option value="action">Action Packed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="ai-loading-skeleton">
                            <div className="ai-pulse-ball"></div>
                            <p>Crafting personalized recommendations for <strong>{currentLocation.name}</strong>...</p>
                            <span className="ai-loading-subtext">Searching Google Places, OpenStreetMap & Event databases</span>
                        </div>
                    )}

                    {/* Upgrade Notice for Free Tier Limit */}
                    {upgradeNotice && (
                        <div className="ai-upgrade-banner">
                            <div className="ai-upgrade-content">
                                <h3>⚡ Explorer Tier Required</h3>
                                <p>{upgradeNotice}</p>
                                <button className="ai-upgrade-cta" onClick={() => alert('Redirecting to Explorer Subscription page...')}>
                                    Upgrade to Explorer ($4.99/mo)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="ai-error-box">
                            <p>⚠️ {error}</p>
                        </div>
                    )}

                    {/* Generated Itinerary Result */}
                    {result && !loading && (
                        <div className="ai-result-container">
                            <div className="ai-result-header">
                                <h3>{result.title}</h3>
                                <p className="ai-summary-text">{result.summary}</p>
                                
                                <div className="ai-meta-pills">
                                    <span className="ai-pill budget">💰 {result.estimatedBudget}</span>
                                    {result.highlights?.map((h, i) => (
                                        <span key={i} className="ai-pill highlight">✨ {h}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Schedule Timeline */}
                            <div className="ai-timeline">
                                <h4>📅 Suggested Day Schedule</h4>
                                {result.schedule.map((item, index) => (
                                    <div key={index} className="ai-timeline-item">
                                        <div className="ai-timeline-badge">{item.timeSlot}</div>
                                        <div className="ai-timeline-card">
                                            <div className="ai-card-header">
                                                <span className="ai-category-tag">{item.category}</span>
                                                <h5 className="ai-item-title">{item.activityTitle}</h5>
                                            </div>
                                            <p className="ai-item-desc">{item.description}</p>
                                            
                                            {item.tip && (
                                                <div className="ai-item-tip">
                                                    💡 <strong>Insider Tip:</strong> {item.tip}
                                                </div>
                                            )}

                                            {item.activityRef && (
                                                <div className="ai-matched-activity">
                                                    <div className="ai-matched-thumb">
                                                        <img src={item.activityRef.image} alt={item.activityRef.title} />
                                                    </div>
                                                    <div className="ai-matched-info">
                                                        <h6>{item.activityRef.title}</h6>
                                                        <p>{item.activityRef.location?.address}</p>
                                                    </div>
                                                    <div className="ai-matched-actions">
                                                        <button 
                                                            className={`ai-fav-btn ${isFavorite(item.activityRef.id) ? 'fav-active' : ''}`}
                                                            onClick={() => item.activityRef && onToggleFavorite(item.activityRef)}
                                                        >
                                                            {isFavorite(item.activityRef.id) ? '❤️ Saved' : '🤍 Save'}
                                                        </button>
                                                        <button 
                                                            className="ai-view-btn"
                                                            onClick={() => {
                                                                if (item.activityRef) {
                                                                    onSelectActivity(item.activityRef);
                                                                    onClose();
                                                                }
                                                            }}
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
