import { useState } from 'react';
import './AdvancedSearch.css';

interface AdvancedSearchProps {
    onSearch: (filters: { keywords: string; priceRange: { min: number; max: number } }) => void;
    onClose: () => void;
}

export default function AdvancedSearch({ onSearch, onClose }: AdvancedSearchProps) {
    const [keywords, setKeywords] = useState('');
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(50);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            keywords,
            priceRange: { min: priceMin, max: priceMax }
        });
        onClose();
    };

    const handleReset = () => {
        setKeywords('');
        setPriceMin(0);
        setPriceMax(50);
        onSearch({
            keywords: '',
            priceRange: { min: 0, max: 1000 }
        });
        onClose();
    };

    return (
        <div className="advanced-search-overlay" onClick={onClose}>
            <div className="advanced-search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Advanced Search</h2>
                    <button onClick={onClose} className="close-btn" aria-label="Close">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="form-group">
                        <label htmlFor="keywords">
                            🔍 Keywords
                        </label>
                        <input
                            id="keywords"
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g., yoga, music, art, food"
                            className="form-input"
                        />
                        <small className="form-hint">
                            Search in titles, descriptions, and tags
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price-range">
                            💰 Price Range: ${priceMin} - ${priceMax === 1000 ? '∞' : `$${priceMax}`}
                        </label>
                        <div className="price-inputs">
                            <div className="price-input-group">
                                <label htmlFor="price-min">Min</label>
                                <input
                                    id="price-min"
                                    type="number"
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(Number(e.target.value))}
                                    min="0"
                                    max={priceMax}
                                    className="form-input small"
                                />
                            </div>
                            <span className="price-separator">to</span>
                            <div className="price-input-group">
                                <label htmlFor="price-max">Max</label>
                                <input
                                    id="price-max"
                                    type="number"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(Number(e.target.value))}
                                    min={priceMin}
                                    max="1000"
                                    className="form-input small"
                                />
                            </div>
                        </div>
                        <small className="form-hint">
                            Set max to 0 to show only free activities
                        </small>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={handleReset} className="btn-secondary">
                            Reset Filters
                        </button>
                        <button type="submit" className="btn-primary">
                            Apply Filters
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
