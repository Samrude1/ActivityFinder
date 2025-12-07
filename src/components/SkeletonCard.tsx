import './SkeletonCard.css';

export default function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-content">
                <div className="skeleton-title" />
                <div className="skeleton-meta">
                    <div className="skeleton-badge" />
                </div>
                <div className="skeleton-text" />
            </div>
        </div>
    );
}
