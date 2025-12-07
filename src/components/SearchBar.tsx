import { useState, useEffect } from 'react';
import type { Location } from '../types';
import { getCurrentLocation } from '../services/geolocation';
import { geocodeAddress } from '../services/geocoding';
import './SearchBar.css';

interface SearchBarProps {
    onLocationChange: (location: Location) => void;
    radius: number;
    onRadiusChange: (radius: number) => void;
    currentLocation: Location | null;
}

export default function SearchBar({
    onLocationChange,
    radius,
    onRadiusChange,
    currentLocation
}: SearchBarProps) {
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [error, setError] = useState('');

    // Update input when currentLocation changes
    useEffect(() => {
        if (currentLocation) {
            setAddressInput(currentLocation.address);
        }
    }, [currentLocation]);

    const handleUseCurrentLocation = async () => {
        setLoading(true);
        setError('');
        const location = await getCurrentLocation();
        onLocationChange(location);
        setLoading(false);
    };

    const handleSearch = async () => {
        if (!addressInput.trim()) {
            setError('Please enter a location');
            return;
        }

        setSearching(true);
        setError('');

        // Use Nominatim geocoding
        const location = await geocodeAddress(addressInput.trim());

        if (location) {
            onLocationChange(location);
            setError('');
        } else {
            setError('Location not found. Try a different address.');
        }

        setSearching(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleBlur = () => {
        // If input is empty on blur, restore current location
        if (!addressInput.trim() && currentLocation) {
            setAddressInput(currentLocation.address);
        }
    };

    return (
        <div className="search-bar">
            <div className="search-bar-content">
                <div className="search-location">
                    <label htmlFor="location" className="search-label">
                        📍 Location
                    </label>
                    <div className="location-input-group">
                        <input
                            id="location"
                            type="text"
                            value={addressInput}
                            onChange={(e) => setAddressInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onBlur={handleBlur}
                            placeholder="Enter city, address, or landmark"
                            className="location-input"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={searching}
                            className="location-btn secondary"
                            aria-label="Search location"
                            title="Search"
                        >
                            {searching ? <span className="loading"></span> : '🔍'}
                        </button>
                        <button
                            onClick={handleUseCurrentLocation}
                            disabled={loading}
                            className="location-btn"
                            aria-label="Use current location"
                            title="Use my location"
                        >
                            {loading ? <span className="loading"></span> : '📍'}
                        </button>
                    </div>
                    {error && <p className="search-error">{error}</p>}
                </div>

                <div className="search-radius">
                    <label htmlFor="radius" className="search-label">
                        📏 Radius: {radius}km
                    </label>
                    <select
                        id="radius"
                        value={radius}
                        onChange={(e) => onRadiusChange(Number(e.target.value))}
                        className="radius-select"
                    >
                        <option value={1}>1 km</option>
                        <option value={5}>5 km</option>
                        <option value={10}>10 km</option>
                        <option value={25}>25 km</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
