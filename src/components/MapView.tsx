import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import type { Activity, Location } from '../types';
import { formatDate, formatDistance } from '../utils/format';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icons in React-Leaflet
import L from 'leaflet';

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
    activities: Activity[];
    userLocation: Location | null;
    favorites: string[];
    onToggleFavorite: (id: string) => void;
    radius: number;
}

export default function MapView({ activities, userLocation, favorites, onToggleFavorite, radius }: MapViewProps) {
    if (!userLocation) {
        return (
            <div className="map-loading">
                <div className="loading" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
                <p>Loading map...</p>
            </div>
        );
    }

    const center: [number, number] = [userLocation.lat, userLocation.lng];

    // Category colors
    const CATEGORY_COLORS: Record<string, string> = {
        Outdoor: '#10b981',
        Cultural: '#8b5cf6',
        Sports: '#ef4444',
        Music: '#ec4899',
        Food: '#f59e0b',
        Family: '#06b6d4',
    };

    return (
        <div className="map-view">
            <MapContainer
                center={center}
                zoom={12}
                style={{ height: '600px', width: '100%', borderRadius: 'var(--radius-lg)' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User location marker */}
                <Marker position={center}>
                    <Popup>
                        <div className="map-popup">
                            <strong>📍 Your Location</strong>
                            <p>{userLocation.address}</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Search radius circle */}
                <Circle
                    center={center}
                    radius={radius * 1000}
                    pathOptions={{
                        color: '#2563eb',
                        fillColor: '#2563eb',
                        fillOpacity: 0.1,
                    }}
                />

                {/* Activity markers */}
                {activities.map(activity => (
                    <Marker
                        key={activity.id}
                        position={[activity.location.lat, activity.location.lng]}
                    >
                        <Popup maxWidth={300} minWidth={250}>
                            <div className="map-popup-card">
                                {/* Activity Image */}
                                <div className="popup-image-container">
                                    <img
                                        src={activity.image}
                                        alt={activity.title}
                                        className="popup-image"
                                    />
                                    <span
                                        className="popup-category-badge"
                                        style={{ backgroundColor: CATEGORY_COLORS[activity.category] }}
                                    >
                                        {activity.category}
                                    </span>
                                </div>

                                {/* Activity Content */}
                                <div className="popup-content">
                                    <h4 className="popup-title">{activity.title}</h4>

                                    <p className="popup-description">{activity.description}</p>

                                    <div className="popup-meta">
                                        <div className="popup-meta-item">
                                            <span className="popup-icon">📅</span>
                                            <span>{formatDate(activity.date)}</span>
                                        </div>
                                        {activity.distance !== undefined && (
                                            <div className="popup-meta-item">
                                                <span className="popup-icon">🚶</span>
                                                <span>{formatDistance(activity.distance)} away</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="popup-actions">
                                        <button
                                            onClick={() => onToggleFavorite(activity.id)}
                                            className={`popup-favorite-btn ${favorites.includes(activity.id) ? 'active' : ''}`}
                                        >
                                            {favorites.includes(activity.id) ? '❤️ Saved' : '🤍 Save'}
                                        </button>
                                        <Link
                                            to={`/activity/${activity.id}`}
                                            state={{ activity }}
                                            className="popup-link"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {activities.length === 0 && (
                <div className="map-overlay">
                    <div className="map-empty">
                        <p>🔍 No activities found in this area</p>
                    </div>
                </div>
            )}
        </div>
    );
}
