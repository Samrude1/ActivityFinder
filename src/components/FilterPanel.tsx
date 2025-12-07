import type { Category } from '../types';
import './FilterPanel.css';

interface FilterPanelProps {
    selectedCategories: Category[];
    onCategoriesChange: (categories: Category[]) => void;
}

const CATEGORIES: { name: Category; icon: string; color: string }[] = [
    { name: 'Outdoor', icon: '🌳', color: 'var(--cat-outdoor)' },
    { name: 'Cultural', icon: '🎭', color: 'var(--cat-cultural)' },
    { name: 'Sports', icon: '⚽', color: 'var(--cat-sports)' },
    { name: 'Music', icon: '🎵', color: 'var(--cat-music)' },
    { name: 'Food', icon: '🍕', color: 'var(--cat-food)' },
    { name: 'Family', icon: '👨‍👩‍👧', color: 'var(--cat-family)' },
];

export default function FilterPanel({ selectedCategories, onCategoriesChange }: FilterPanelProps) {
    const toggleCategory = (category: Category) => {
        if (selectedCategories.includes(category)) {
            onCategoriesChange(selectedCategories.filter(c => c !== category));
        } else {
            onCategoriesChange([...selectedCategories, category]);
        }
    };

    const clearFilters = () => {
        onCategoriesChange([]);
    };

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <h3 className="filter-title">Categories</h3>
                {selectedCategories.length > 0 && (
                    <button onClick={clearFilters} className="clear-btn">
                        Clear all
                    </button>
                )}
            </div>

            <div className="category-chips">
                {CATEGORIES.map(({ name, icon, color }) => (
                    <button
                        key={name}
                        onClick={() => toggleCategory(name)}
                        className={`category-chip ${selectedCategories.includes(name) ? 'active' : ''}`}
                        style={{
                            '--category-color': color,
                        } as React.CSSProperties}
                        aria-pressed={selectedCategories.includes(name)}
                    >
                        <span className="category-icon">{icon}</span>
                        <span className="category-name">{name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
