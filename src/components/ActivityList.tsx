import type { Activity } from '../types';
import ActivityCard from './ActivityCard';
import AdBanner from './AdBanner';
import { useAuth } from '../contexts/AuthContext';
import './ActivityList.css';

interface ActivityListProps {
    activities: Activity[];
    favorites: string[];
    onToggleFavorite: (id: string) => void;
}

export default function ActivityList({ activities, favorites, onToggleFavorite }: ActivityListProps) {
    const { user } = useAuth();
    const showAds = !user || user.tier === 'free';

    if (activities.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No activities found</h3>
                <p className="empty-text">
                    Try adjusting your search radius or filters to find more activities.
                </p>
            </div>
        );
    }

    return (
        <div className="activity-list">
            {activities.map((activity, index) => (
                <div key={activity.id}>
                    <ActivityCard
                        activity={activity}
                        isFavorite={favorites.includes(activity.id)}
                        onToggleFavorite={onToggleFavorite}
                    />
                    {showAds && index === 2 && <AdBanner placement="list" />}
                </div>
            ))}
        </div>
    );
}
