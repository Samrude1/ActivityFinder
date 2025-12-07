import type { Activity, Category, Location } from '../types';
import { API_ENDPOINTS } from '../config/api';
import { ensureActivityImage } from '../utils/images';

// Offline fallback data (used when API is unreachable)
export const OFFLINE_FALLBACK_ACTIVITIES: Activity[] = [
    {
        id: '1',
        title: 'Free Yoga in Central Park',
        description: 'Join us for a relaxing outdoor yoga session. All levels welcome. Bring your own mat.',
        date: '2025-12-08T10:00:00',
        location: { lat: 60.1699, lng: 24.9384, address: 'Central Park, Helsinki' },
        category: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        url: '#',
        price: 0,
        keywords: ['yoga', 'meditation', 'wellness', 'outdoor', 'exercise']
    },
    {
        id: '2',
        title: 'Museum Free Entry Day',
        description: 'Explore the National Museum for free. Special exhibitions on Finnish history.',
        date: '2025-12-10T09:00:00',
        location: { lat: 60.1756, lng: 24.9342, address: 'National Museum, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1565359471403-3f8e0c9e3d7e?w=400',
        url: '#',
        price: 0,
        keywords: ['museum', 'history', 'culture', 'art', 'exhibition']
    },
    {
        id: '3',
        title: 'Community Basketball Game',
        description: 'Open pickup basketball game. Everyone welcome, just bring your energy!',
        date: '2025-12-07T16:00:00',
        location: { lat: 60.1872, lng: 24.9208, address: 'Sports Center, Helsinki' },
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
        url: '#',
        price: 0,
        keywords: ['basketball', 'sports', 'team', 'game', 'fitness']
    },
    {
        id: '4',
        title: 'Live Jazz Performance',
        description: 'Free outdoor jazz concert featuring local artists. Bring a blanket and enjoy!',
        date: '2025-12-09T18:00:00',
        location: { lat: 60.1641, lng: 24.9402, address: 'Market Square, Helsinki' },
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400',
        url: '#',
        price: 0,
        keywords: ['jazz', 'music', 'concert', 'live', 'performance']
    },
    {
        id: '5',
        title: 'Food Festival Samples',
        description: 'Free food samples from local vendors. Taste the flavors of Helsinki!',
        date: '2025-12-11T12:00:00',
        location: { lat: 60.1695, lng: 24.9354, address: 'Esplanade Park, Helsinki' },
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        url: '#',
        price: 0,
        keywords: ['food', 'festival', 'tasting', 'local', 'cuisine']
    },
    {
        id: '6',
        title: 'Kids Art Workshop',
        description: 'Free creative workshop for children aged 5-12. All materials provided.',
        date: '2025-12-12T14:00:00',
        location: { lat: 60.1733, lng: 24.9410, address: 'Community Center, Helsinki' },
        category: 'Family',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
        url: '#',
        price: 0,
        keywords: ['kids', 'children', 'art', 'workshop', 'creative', 'family']
    },
    {
        id: '7',
        title: 'Hiking Group Meetup',
        description: 'Join our weekly hiking group. Explore beautiful nature trails together.',
        date: '2025-12-08T09:00:00',
        location: { lat: 60.2055, lng: 24.9625, address: 'Nature Reserve, Helsinki' },
        category: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
        url: '#',
        price: 0,
        keywords: ['hiking', 'nature', 'outdoor', 'walking', 'trails']
    },
    {
        id: '8',
        title: 'Library Book Reading',
        description: 'Author reading and Q&A session. Free coffee and snacks provided.',
        date: '2025-12-13T17:00:00',
        location: { lat: 60.1719, lng: 24.9414, address: 'City Library, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        url: '#',
        price: 0,
        keywords: ['books', 'reading', 'author', 'literature', 'library']
    },
    {
        id: '9',
        title: 'Beach Volleyball Tournament',
        description: 'Free entry beach volleyball tournament. Form a team or join one!',
        date: '2025-12-14T11:00:00',
        location: { lat: 60.1534, lng: 24.9496, address: 'Beach, Helsinki' },
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400',
        url: '#',
        price: 0,
        keywords: ['volleyball', 'beach', 'sports', 'tournament', 'team']
    },
    {
        id: '10',
        title: 'Open Mic Night',
        description: 'Share your talent! Music, poetry, comedy - all welcome. Free entry.',
        date: '2025-12-15T19:00:00',
        location: { lat: 60.1681, lng: 24.9378, address: 'Café Central, Helsinki' },
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
        url: '#',
        price: 0,
        keywords: ['music', 'poetry', 'comedy', 'performance', 'open mic']
    },
    {
        id: '11',
        title: 'Farmers Market',
        description: 'Fresh local produce and free cooking demonstrations by local chefs.',
        date: '2025-12-07T08:00:00',
        location: { lat: 60.1702, lng: 24.9419, address: 'Market Hall, Helsinki' },
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
        url: '#',
        price: 0,
        keywords: ['market', 'food', 'local', 'produce', 'cooking']
    },
    {
        id: '12',
        title: 'Family Movie Night',
        description: 'Free outdoor movie screening. Family-friendly film under the stars.',
        date: '2025-12-16T20:00:00',
        location: { lat: 60.1689, lng: 24.9367, address: 'Park Amphitheater, Helsinki' },
        category: 'Family',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
        url: '#',
        price: 0,
        keywords: ['movie', 'film', 'family', 'outdoor', 'cinema']
    },
    {
        id: '13',
        title: 'Photography Walk',
        description: 'Join fellow photographers for a scenic walk. All skill levels welcome!',
        date: '2025-12-09T14:00:00',
        location: { lat: 60.1650, lng: 24.9450, address: 'Waterfront, Helsinki' },
        category: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
        url: '#',
        price: 0,
        keywords: ['photography', 'walk', 'camera', 'scenic', 'outdoor']
    },
    {
        id: '14',
        title: 'Chess in the Park',
        description: 'Outdoor chess games for all ages. Boards provided, just bring your strategy!',
        date: '2025-12-10T15:00:00',
        location: { lat: 60.1680, lng: 24.9320, address: 'City Park, Helsinki' },
        category: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400',
        url: '#',
        price: 0,
        keywords: ['chess', 'game', 'strategy', 'outdoor', 'park']
    },
    {
        id: '15',
        title: 'Street Art Tour',
        description: 'Guided walking tour of local street art and murals. Free and fascinating!',
        date: '2025-12-11T11:00:00',
        location: { lat: 60.1620, lng: 24.9480, address: 'Arts District, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400',
        url: '#',
        price: 0,
        keywords: ['art', 'street art', 'tour', 'walking', 'culture', 'murals']
    },
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
    try {
        const response = await fetch(url, options);
        if (!response.ok && retries > 0 && response.status !== 400 && response.status !== 404) {
            throw new Error(`Request failed: ${response.status}`);
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

// Fetch Points of Interest from OpenStreetMap Overpass API
async function fetchOpenStreetMapPOIs(location: Location, radiusKm: number): Promise<Activity[]> {
    const cacheKey = `osm_pois_${location.lat.toFixed(4)}_${location.lng.toFixed(4)}_${radiusKm}`;

    try {
        // Check cache
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log('Returning cached OSM results');
                return data;
            }
        }

        const query = `
      [out:json][timeout:25];
      (
        node["leisure"~"park|sports_centre|playground"](around:${radiusKm * 1000},${location.lat},${location.lng});
        node["amenity"~"theatre|cinema|library|community_centre|restaurant|cafe|fast_food"](around:${radiusKm * 1000},${location.lat},${location.lng});
        node["tourism"~"museum|gallery|attraction"](around:${radiusKm * 1000},${location.lat},${location.lng});
      );
      out body;
    `;

        const response = await fetchWithRetry(API_ENDPOINTS.overpass, {
            method: 'POST',
            body: query,
        });

        if (!response.ok) throw new Error('Overpass API error');

        const data = await response.json();

        if (!data.elements || data.elements.length === 0) return [];

        const activities: Activity[] = data.elements.slice(0, 20).map((poi: any, index: number) => {
            const name = poi.tags?.name || 'Local Activity';
            const leisure = poi.tags?.leisure;
            const amenity = poi.tags?.amenity;
            const tourism = poi.tags?.tourism;
            const cuisine = poi.tags?.cuisine;

            let category: Category = 'Outdoor';
            let keywords: string[] = [];

            if (amenity === 'restaurant' || amenity === 'cafe' || amenity === 'fast_food') {
                category = 'Food';
                keywords = ['food', 'restaurant', 'dining', cuisine || 'local'];
            } else if (tourism === 'museum' || tourism === 'gallery' || amenity === 'theatre' || amenity === 'library') {
                category = 'Cultural';
                keywords = ['culture', 'art', tourism || amenity || ''];
            } else if (leisure === 'sports_centre') {
                category = 'Sports';
                keywords = ['sports', 'fitness', 'exercise'];
            } else if (leisure === 'park' || leisure === 'playground') {
                category = 'Outdoor';
                keywords = ['park', 'outdoor', 'nature'];
            } else if (amenity === 'community_centre') {
                category = 'Family';
                keywords = ['community', 'family', 'events'];
            }

            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + (index % 7) + 1);
            futureDate.setHours(10 + (index % 10), 0, 0, 0);

            return {
                id: `osm-${poi.id}`,
                title: name,
                description: `Visit this ${tourism || leisure || amenity || 'location'} in your area. ${cuisine ? `Cuisine: ${cuisine}.` : ''} Check local listings for events and activities.`,
                date: futureDate.toISOString(),
                location: {
                    lat: poi.lat,
                    lng: poi.lon,
                    address: poi.tags?.['addr:street'] || name
                },
                category,
                image: ensureActivityImage(poi, category),
                url: `https://www.openstreetmap.org/node/${poi.id}`,
                distance: calculateDistance(location.lat, location.lng, poi.lat, poi.lon),
                price: category === 'Food' ? 15 : 0, // Mark food places as paid (approx $15)
                keywords
            };
        });

        // Save to cache
        sessionStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: activities
        }));

        return activities;
    } catch (error) {
        console.error('OpenStreetMap Overpass API error:', error);
        // Return potentially stale cache if available and request failed
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            console.log('Returning stale cached OSM results due to error');
            return JSON.parse(cached).data;
        }
        return [];
    }
}

export interface SearchOptions {
    location: Location;
    radius: number;
    categories: Category[];
    priceRange?: { min: number; max: number };
    keywords?: string;
    dateRange?: {
        start: Date | null;
        end: Date | null;
    };
}

// Export function to get all activities (for favorites page)
export async function getAllActivities(): Promise<Activity[]> {
    return OFFLINE_FALLBACK_ACTIVITIES.map(activity => ({
        ...activity,
        image: ensureActivityImage(activity, activity.category)
    }));
}

export async function searchActivities(options: SearchOptions): Promise<Activity[]> {
    let results: Activity[] = [];

    const osmResults = await fetchOpenStreetMapPOIs(options.location, options.radius);

    if (osmResults.length > 0) {
        console.log(`Found ${osmResults.length} points of interest from OpenStreetMap`);
        results = osmResults;
    }

    // Only use fallback if NO results found from API
    if (results.length === 0) {
        console.log('No API results found. Using offline fallback data.');
        const fallbackWithDistance = OFFLINE_FALLBACK_ACTIVITIES.map(activity => ({
            ...activity,
            image: ensureActivityImage(activity, activity.category),
            distance: calculateDistance(
                options.location.lat,
                options.location.lng,
                activity.location.lat,
                activity.location.lng
            )
        }));
        results = fallbackWithDistance;
    }

    // Filter by radius
    results = results.filter((activity, index, self) =>
        activity.distance !== undefined &&
        activity.distance <= options.radius &&
        index === self.findIndex(a => a.title === activity.title)
    );

    // Filter by categories
    if (options.categories.length > 0) {
        results = results.filter(activity =>
            options.categories.includes(activity.category)
        );
    }

    // Filter by price range
    if (options.priceRange) {
        results = results.filter(activity => {
            const price = activity.price || 0;
            return price >= options.priceRange!.min && price <= options.priceRange!.max;
        });
    }

    // Filter by keywords
    if (options.keywords && options.keywords.trim()) {
        const searchTerms = options.keywords.toLowerCase().split(' ');
        results = results.filter(activity => {
            const searchableText = `${activity.title} ${activity.description} ${activity.keywords?.join(' ') || ''}`.toLowerCase();
            return searchTerms.some(term => searchableText.includes(term));
        });
    }

    // Filter by date range
    if (options.dateRange?.start || options.dateRange?.end) {
        results = results.filter(activity => {
            const activityDate = new Date(activity.date);
            if (options.dateRange!.start && activityDate < options.dateRange!.start) return false;
            if (options.dateRange!.end && activityDate > options.dateRange!.end) return false;
            return true;
        });
    }

    results.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return results.slice(0, 30);
}
