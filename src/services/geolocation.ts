import type { Location } from '../types';

// Default location (Helsinki, Finland)
const DEFAULT_LOCATION: Location = {
    lat: 60.1699,
    lng: 24.9384,
    address: 'Helsinki, Finland'
};

export async function getCurrentLocation(): Promise<Location> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(DEFAULT_LOCATION);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: 'Current Location'
                });
            },
            () => {
                // If user denies or error occurs, use default
                resolve(DEFAULT_LOCATION);
            },
            {
                timeout: 3000,
                enableHighAccuracy: false
            }
        );
    });
}
