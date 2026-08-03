import type { Location } from '../types';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

const GEOCODE_CACHE: Record<string, Location> = {};

// Geocode an address to get coordinates
export async function geocodeAddress(address: string): Promise<Location | null> {
    const cacheKey = address.toLowerCase().trim();
    if (GEOCODE_CACHE[cacheKey]) {
        console.log('Returning cached geocode result');
        return GEOCODE_CACHE[cacheKey];
    }

    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(address)}&format=json&limit=5`,
            {
                headers: {
                    'User-Agent': 'FreeActivityFinder/1.0' // Required by Nominatim
                }
            }
        );

        if (!response.ok) {
            throw new Error('Geocoding failed');
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.log('Geocoding: no results for', address);
            return null;  // Don't cache null
        }

        // Find a valid result that is a geographic place, fallback to the first result
        const validResult = data.find((item: any) => {
            if (item.class === 'boundary' && item.type === 'administrative') return true;
            if (item.class === 'place') return true;
            return false;
        });

        const finalResult = validResult || data[0];

        if (!finalResult) {
            return null;  // Don't cache null
        }

        console.log('Geocoding result:', finalResult.display_name, finalResult.lat, finalResult.lon);

        const location = {
            lat: parseFloat(finalResult.lat),
            lng: parseFloat(finalResult.lon),
            address: finalResult.display_name
        };

        GEOCODE_CACHE[cacheKey] = location;
        return location;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;  // Don't cache errors
    }
}

// Reverse geocode coordinates to get address
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
            {
                headers: {
                    'User-Agent': 'FreeActivityFinder/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Reverse geocoding failed');
        }

        const data = await response.json();
        return data.display_name || 'Unknown location';
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return 'Unknown location';
    }
}
