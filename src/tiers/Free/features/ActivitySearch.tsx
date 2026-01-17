import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { freeAPI } from '../../../services/api'; // Import freeAPI
import { getLimit } from '../../../config/tierConfig';
import UpgradePrompt from './UpgradePrompt';
import '../FreeTier.css';

// We import the standard HomePage or Search logic logic here?
// Ideally we re-use the UI from HomePage but intercept the search action.
// Since HomePage has the search UI embedded, we might need to "inject" logic into HomePage via this component,
// OR logic was moved to backend.
// HomePage currently has:
// <div className="search-bar-container"> ... <input value={searchQuery} /> ... <button onClick={handleSearchLocation}>
//
// The plan says: "Wrap existing search with limit tracking".
// But `HomePage` is a page, not a small component.
// Refactoring HomePage to extract `SearchBar` would be ideal.
// For now, I'll create `ActivitySearch` as a component that Renders the Search Bar and Handles Logic.
// Then I'll replace the search bar in `HomePage` with this component (conditionally or unconditionally passing props).

interface ActivitySearchProps {
    onSearch: (query: string) => void;
    searching?: boolean;
    val?: string; // If controlling value externally
}

export default function ActivitySearch({ onSearch, searching }: ActivitySearchProps) {
    const { user } = useAuth();
    const [searchCount, setSearchCount] = useState(0);
    const [limitReached, setLimitReached] = useState(false);
    const [query, setQuery] = useState('');
    const showBanner = true;

    const searchLimit = getLimit(user?.tier, 'maxSearchesPerDay');
    const hasUnlimited = searchLimit === Infinity;

    useEffect(() => {
        if (!hasUnlimited) {
            freeAPI.getSearchCount()
                .then(data => setSearchCount(data.count))
                .catch(err => console.error('Failed to get search stats', err));
        }
    }, [hasUnlimited]);

    const handleSearchClick = async () => {
        if (!query.trim()) return;

        if (!hasUnlimited && searchCount >= searchLimit) {
            setLimitReached(true);
            return;
        }

        // Optimistic update or wait for backend?
        // Backend middleware increments count.
        // We can increment locally to key consistent UI.
        onSearch(query);

        if (!hasUnlimited) {
            // Give the backend a moment to process the search and increment count
            setTimeout(() => {
                freeAPI.getSearchCount()
                    .then(data => setSearchCount(data.count))
                    .catch(err => console.error('Failed to update search count', err));
            }, 500);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="free-tier-search-wrapper">
            {!hasUnlimited && showBanner && (
                <div className="search-limit-banner">
                    <span>⚡ <strong>{searchCount}</strong>/{searchLimit} daily searches used</span>
                    {searchLimit > 0 && searchCount > (searchLimit * 0.8) && <small>Limit approaching!</small>}
                </div>
            )}

            <div className="search-bar-container" style={{ maxWidth: '100%', margin: '0' }}>
                <div className="search-input-wrapper">
                    <span className="search-icon">📍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search city like 'Helsinki'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={searching}
                    />
                </div>
                <button
                    className="search-btn"
                    onClick={handleSearchClick}
                    disabled={searching}
                >
                    {searching ? '...' : 'Go'}
                </button>
            </div>

            {limitReached && (
                <UpgradePrompt
                    feature="Unlimited Searches"
                    currentLimit={`${searchLimit}/day`}
                    tier="Explorer"
                    onClose={() => setLimitReached(false)}
                />
            )}
        </div>
    );
}
