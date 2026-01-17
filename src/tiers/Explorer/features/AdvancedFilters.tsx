import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './AdvancedFilters.css';
import { useAuth } from '../../../contexts/AuthContext';
import { hasFeature } from '../../../config/tierConfig';

interface AdvancedFiltersProps {
    initialFilters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onClose: () => void;
}

export interface FilterState {
    priceRange: [number, number];
    minRating: number;
    accessibility: string[];
}

const ACCESSIBILITY_OPTIONS = [
    { id: 'wheelchair', label: 'Wheelchair Accessible', icon: '♿' },
    { id: 'deaf-friendly', label: 'Deaf-Friendly', icon: '🦻' },
    { id: 'blind-friendly', label: 'Blind-Friendly', icon: '🦯' },
    { id: 'family-friendly', label: 'Family-Friendly', icon: '👨‍👩‍👧' }
];

export default function AdvancedFilters({ initialFilters, onFilterChange, onClose }: AdvancedFiltersProps) {
    const { user } = useAuth();
    const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange);
    const [minRating, setMinRating] = useState(initialFilters.minRating);
    const [accessibility, setAccessibility] = useState<string[]>(initialFilters.accessibility);

    // Check if user has Explorer tier or higher
    const hasExplorerAccess = hasFeature(user?.tier, 'hasAdvancedFilters');

    const handleAccessibilityToggle = (id: string) => {
        setAccessibility(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleApplyFilters = () => {
        onFilterChange({
            priceRange,
            minRating,
            accessibility
        });
        onClose();
    };

    const handleReset = () => {
        setPriceRange([0, 200]);
        setMinRating(0);
        setAccessibility([]);
    };

    if (!hasExplorerAccess) {
        return (
            <div className="advanced-filters-locked">
                <div className="lock-overlay">
                    <div className="lock-icon">🔒</div>
                    <h3>Advanced Filters</h3>
                    <p>Unlock advanced filtering with Explorer tier</p>
                    <div className="upgrade-features">
                        <div className="feature-item">✨ Price range filtering</div>
                        <div className="feature-item">⭐ Rating filters</div>
                        <div className="feature-item">♿ Accessibility options</div>
                    </div>
                    <button className="upgrade-btn" onClick={() => window.location.href = '/profile'}>
                        Upgrade to Explorer
                    </button>
                    <button className="close-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="advanced-filters">
            <div className="filters-header">
                <h3>Advanced Filters</h3>
                <span className="explorer-badge">👑 Explorer Feature</span>
                <button className="close-icon" onClick={onClose}>✕</button>
            </div>

            <div className="filters-content">
                {/* Price Range */}
                <div className="filter-section">
                    <label className="filter-label">
                        💰 Price Range
                        <span className="filter-value">
                            ${priceRange[0]} - ${priceRange[1] === 200 ? '200+' : priceRange[1]}
                        </span>
                    </label>
                    <div className="slider-container">
                        <Slider
                            range
                            min={0}
                            max={200}
                            value={priceRange}
                            onChange={(value) => setPriceRange(value as [number, number])}
                            trackStyle={[{ backgroundColor: '#667eea' }]}
                            handleStyle={[
                                { borderColor: '#667eea', backgroundColor: '#fff' },
                                { borderColor: '#667eea', backgroundColor: '#fff' }
                            ]}
                            railStyle={{ backgroundColor: '#e2e8f0' }}
                        />
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="filter-section">
                    <label className="filter-label">
                        ⭐ Minimum Rating
                        <span className="filter-value">{minRating > 0 ? `${minRating}+ stars` : 'Any'}</span>
                    </label>
                    <div className="rating-selector">
                        {[0, 1, 2, 3, 4, 5].map(rating => (
                            <button
                                key={rating}
                                className={`rating-btn ${minRating === rating ? 'active' : ''}`}
                                onClick={() => setMinRating(rating)}
                            >
                                {rating === 0 ? 'Any' : `${rating}★`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Accessibility Options */}
                <div className="filter-section">
                    <label className="filter-label">♿ Accessibility Options</label>
                    <div className="accessibility-options">
                        {ACCESSIBILITY_OPTIONS.map(option => (
                            <label key={option.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={accessibility.includes(option.id)}
                                    onChange={() => handleAccessibilityToggle(option.id)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="option-icon">{option.icon}</span>
                                <span className="option-label">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="filters-footer">
                <button className="reset-btn" onClick={handleReset}>
                    Reset All
                </button>
                <button className="apply-btn" onClick={handleApplyFilters}>
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
