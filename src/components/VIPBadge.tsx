import { useAuth } from '../contexts/AuthContext';
import { hasFeature } from '../config/tierConfig';

interface VIPBadgeProps {
    showLabel?: boolean;
    className?: string;
}

export default function VIPBadge({ showLabel = true, className = '' }: VIPBadgeProps) {
    const { user } = useAuth();
    const isVIP = hasFeature(user?.tier, 'hasVipBadge');

    if (!isVIP) return null;

    return (
        <div
            className={`vip-badge ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                color: '#8a6e00',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                border: '1px solid #eebb00',
                boxShadow: '0 2px 4px rgba(253, 185, 49, 0.2)'
            }}
            title="VIP Member"
        >
            <span style={{ fontSize: '1rem' }}>👑</span>
            {showLabel && <span>VIP</span>}
        </div>
    );
}
