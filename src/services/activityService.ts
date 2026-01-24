import type { Activity, Category, Location } from '../types';
import { API_ENDPOINTS } from '../config/api';
import { ensureActivityImage } from '../utils/images';

// Mock review snippets for 5-star validation
const REVIEW_SNIPPETS = [
    "Absolutely amazing experience! Highly recommended.",
    "Best time ever! 5/5 stars.",
    "A hidden gem. Loved every minute of it.",
    "Can't wait to go back again! Perfect day out.",
    "Simply wonderful. Great for everyone."
];

// Offline fallback data (used when API is unreachable)
export const OFFLINE_FALLBACK_ACTIVITIES: Activity[] = [
    {
        id: '1',
        title: 'Central Park (Keskuspuisto)',
        description: 'A vast and beautiful forest right in the city. Perfect for jogging, biking, or a peaceful escape into nature.',
        date: '2025-12-08T10:00:00',
        location: { lat: 60.1983, lng: 24.9272, address: 'Keskuspuisto, Helsinki' },
        category: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1519331379826-f9478558d191?w=400',
        url: '#',
        price: 0,
        keywords: ['nature', 'forest', 'hiking', 'outdoor', 'exercise'],
        rating: 4.8,
        reviewCount: 342,
        reviewSnippet: "A true sanctuary in the city. The trails are endless and beautiful year-round.",
        features: ["Free cancellation", "Good for kids", "Pet friendly", "Public restrooms"],
        duration: "2-3 hours",
        cancellationPolicy: "Free cancellation up to 24 hours before the start of the activity.",
        gallery: [
            'https://images.unsplash.com/photo-1519331379826-f9478558d191?w=800',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'
        ]
    },
    {
        id: '2',
        title: 'National Library of Finland',
        description: 'One of the most beautiful libraries in the world. Stunning architecture and a quiet atmosphere for reading.',
        date: '2025-12-10T09:00:00',
        location: { lat: 60.1702, lng: 24.9507, address: 'Unioninkatu 36, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400',
        url: '#',
        price: 0,
        keywords: ['library', 'history', 'architecture', 'culture', 'books'],
        rating: 4.7,
        reviewCount: 128,
        reviewSnippet: "Absolutely breathtaking architecture. A must-visit for book lovers and history buffs."
    },
    {
        id: '3',
        title: 'Allas Sea Pool',
        description: 'Unique sea swimming complex with saunas and heated pools. Experience the Baltic Sea in style.',
        date: '2025-12-07T16:00:00',
        location: { lat: 60.1652, lng: 24.9529, address: 'Katajanokanlaituri 2a, Helsinki' },
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
        url: '#',
        price: 18,
        keywords: ['swimming', 'sauna', 'wellness', 'scenic', 'pool'],
        rating: 4.4,
        reviewCount: 2150,
        reviewSnippet: "Invigorating cold plunge and hot sauna! The view of the harbor is unbeatable."
    },
    {
        id: '4',
        title: 'Helsinki Market Square',
        description: 'Bustling outdoor market selling fresh food, produce, and souvenirs by the waterfront.',
        date: '2025-12-09T10:00:00',
        location: { lat: 60.1675, lng: 24.9536, address: 'Eteläranta, Helsinki' },
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400',
        url: '#',
        price: 0,
        keywords: ['market', 'food', 'local', 'souvenirs', 'outdoor'],
        rating: 4.3,
        reviewCount: 8900,
        reviewSnippet: "Vibrant atmosphere with delicious salmon soup and fresh berries. A classic Helsinki experience."
    },
    {
        id: '5',
        title: 'Esplanadi Park',
        description: 'The green heart of Helsinki. A beautiful promenade perfect for picnics and people-watching.',
        date: '2025-12-11T12:00:00',
        location: { lat: 60.1675, lng: 24.9474, address: 'Pohjoisesplanadi, Helsinki' },
        category: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        url: '#',
        price: 0,
        keywords: ['park', 'promenade', 'leisure', 'city center', 'picnic'],
        rating: 4.6,
        reviewCount: 4500,
        reviewSnippet: "Lovely urban park with great vibe. Perfect for a summer stroll or sitting on a bench."
    },
    {
        id: '6',
        title: 'Oodi Central Library',
        description: 'A modern architectural masterpiece. More than just a library - a living room for the city.',
        date: '2025-12-12T14:00:00',
        location: { lat: 60.1740, lng: 24.9381, address: 'Töölönlahdenkatu 4, Helsinki' },
        category: 'Family',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
        url: '#',
        price: 0,
        keywords: ['library', 'modern', 'architecture', 'family', 'events'],
        rating: 4.8,
        reviewCount: 6200,
        reviewSnippet: "Incredible space! It feels like the future of libraries. Great café and top-floor views."
    },
    {
        id: '7',
        title: 'Suomenlinna Sea Fortress',
        description: 'World Heritage site on islands off Helsinki. Historic fortifications and beautiful walking paths.',
        date: '2025-12-08T09:00:00',
        location: { lat: 60.1462, lng: 24.9881, address: 'Suomenlinna, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=400',
        url: '#',
        price: 0,
        keywords: ['history', 'fortress', 'island', 'hiking', 'unesco'],
        rating: 4.7,
        reviewCount: 12500,
        reviewSnippet: "A fascinating mix of history and nature. The ferry ride over is part of the fun!"
    },
    {
        id: '8',
        title: 'Löyly Helsinki',
        description: 'Iconic public sauna complex with unique architecture and sea views.',
        date: '2025-12-13T17:00:00',
        location: { lat: 60.1506, lng: 24.9299, address: 'Hernesaarenranta 4, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1545243424-0ce743321e11?w=400',
        url: '#',
        price: 24,
        keywords: ['sauna', 'design', 'architecture', 'sea', 'restaurant'],
        rating: 4.4,
        reviewCount: 3100,
        reviewSnippet: "Stylish sauna with a great restaurant. Jumping into the Baltic Sea was a thrill!"
    },
    {
        id: '9',
        title: 'Hietaniemi Beach',
        description: 'The most popular beach in Helsinki. Sandy shores, volleyball courts, and summer vibes.',
        date: '2025-12-14T11:00:00',
        location: { lat: 60.1718, lng: 24.9042, address: 'Hiekkarannantie, Helsinki' },
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        url: '#',
        price: 0,
        keywords: ['beach', 'volleyball', 'summer', 'swimming', 'sun'],
        rating: 4.5,
        reviewCount: 1800,
        reviewSnippet: "Great sandy beach close to the center. Perfect for volleyball and hanging out."
    },
    {
        id: '10',
        title: 'Old Market Hall',
        description: 'Historic indoor market serving local delicacies, salmon soup, and pastries.',
        date: '2025-12-15T12:00:00',
        location: { lat: 60.1663, lng: 24.9529, address: 'Eteläranta, Helsinki' },
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
        url: '#',
        price: 0,
        keywords: ['market', 'food', 'historic', 'lunch', 'salmon'],
        rating: 4.5,
        reviewCount: 3800,
        reviewSnippet: "Charming old building with fantastic food stalls. The salmon soup is legendary."
    },
    {
        id: '11',
        title: 'Sibelius Monument',
        description: 'Abstract sculpture dedicated to Finnish composer Jean Sibelius within a pleasant park.',
        date: '2025-12-07T14:00:00',
        location: { lat: 60.1821, lng: 24.9134, address: 'Sibeliuksen puisto, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1534234828563-02511c953530?w=400',
        url: '#',
        price: 0,
        keywords: ['monument', 'sculpture', 'park', 'history', 'art'],
        rating: 4.3,
        reviewCount: 6500,
        reviewSnippet: "Impressive sculpture in a lovely setting. Looks amazing when the sun shines through the pipes."
    },
    {
        id: '12',
        title: 'Temppeliaukio Rock Church',
        description: 'Unique church excavated directly into solid rock. incredible acoustics and architecture.',
        date: '2025-12-16T10:00:00',
        location: { lat: 60.1730, lng: 24.9252, address: 'Lutherinkatu 3, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1514561066953-294b63e80d47?w=400',
        url: '#',
        price: 5,
        keywords: ['church', 'architecture', 'landmark', 'rock', 'music'],
        rating: 4.6,
        reviewCount: 14000,
        reviewSnippet: "Stunning and unique architecture. The atmosphere inside is incredibly peaceful."
    },
    {
        id: '13',
        title: 'Uspenski Cathedral',
        description: 'Striking red-brick Orthodox cathedral overlooking the city. A masterpiece of Russian influence.',
        date: '2025-12-09T14:00:00',
        location: { lat: 60.1686, lng: 24.9600, address: 'Kanavakatu 1, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1575647565158-9475143097d7?w=400',
        url: '#',
        price: 0,
        keywords: ['cathedral', 'history', 'landmark', 'view', 'orthodox'],
        rating: 4.5,
        reviewCount: 5200,
        reviewSnippet: "Beautiful exterior and impressive interior. Offers great views of the harbor."
    },
    {
        id: '14',
        title: 'Seurasaari Open-Air Museum',
        description: 'Walk through Finnish history in this island museum with traditional wooden buildings.',
        date: '2025-12-10T11:00:00',
        location: { lat: 60.1837, lng: 24.8875, address: 'Seurasaari, Helsinki' },
        category: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1449433604928-11f879687e83?w=400',
        url: '#',
        price: 10,
        keywords: ['museum', 'history', 'outdoor', 'nature', 'walking'],
        rating: 4.6,
        reviewCount: 3100,
        reviewSnippet: "Like stepping back in time. Very peaceful island with friendly squirrels everywhere!"
    },
    {
        id: '15',
        title: 'Linnanmäki Amusement Park',
        description: 'Finland’s oldest and most popular amusement park. Fun for the whole family.',
        date: '2025-12-11T13:00:00',
        location: { lat: 60.1883, lng: 24.9404, address: 'Tivolikuja 1, Helsinki' },
        category: 'Family',
        image: 'https://images.unsplash.com/photo-1545648583-05b1062b3252?w=400',
        url: '#',
        price: 0, // Entry is free
        keywords: ['fun', 'amusement park', 'rides', 'family', 'rollercoaster'],
        rating: 4.5,
        reviewCount: 11000,
        reviewSnippet: "Classic amusement park fun. Entry is free, which is great if you just want to soak up the atmosphere."
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
        node["leisure"~"park|sports_centre|playground|nature_reserve|water_park"](around:${radiusKm * 1000},${location.lat},${location.lng});
        way["leisure"~"park|sports_centre|playground|nature_reserve|water_park"](around:${radiusKm * 1000},${location.lat},${location.lng});
        
        node["amenity"~"theatre|cinema|library|community_centre|restaurant|cafe|fast_food|bar|pub|marketplace"](around:${radiusKm * 1000},${location.lat},${location.lng});
        way["amenity"~"theatre|cinema|library|community_centre|restaurant|cafe|fast_food|bar|pub|marketplace"](around:${radiusKm * 1000},${location.lat},${location.lng});
        
        node["tourism"~"museum|gallery|attraction|zoo|theme_park|viewpoint|historic"](around:${radiusKm * 1000},${location.lat},${location.lng});
        way["tourism"~"museum|gallery|attraction|zoo|theme_park|viewpoint|historic"](around:${radiusKm * 1000},${location.lat},${location.lng});
        
        node["historic"~"monument|memorial|castle|ruins"](around:${radiusKm * 1000},${location.lat},${location.lng});
        way["historic"~"monument|memorial|castle|ruins"](around:${radiusKm * 1000},${location.lat},${location.lng});
      );
      out center;
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
            const historic = poi.tags?.historic;
            const cuisine = poi.tags?.cuisine;

            let category: Category = 'Outdoor';
            let keywords: string[] = [];

            if (amenity === 'restaurant' || amenity === 'cafe' || amenity === 'fast_food' || amenity === 'bar' || amenity === 'pub') {
                category = 'Food';
                keywords = ['food', 'dining', cuisine || 'local', amenity];
            } else if (tourism === 'museum' || tourism === 'gallery' || amenity === 'theatre' || amenity === 'library' || tourism === 'historic' || historic) {
                category = 'Cultural';
                keywords = ['culture', 'art', 'history', tourism || amenity || historic || ''];
            } else if (leisure === 'sports_centre' || leisure === 'stadium' || leisure === 'water_park') {
                category = 'Sports';
                keywords = ['sports', 'fitness', 'exercise', leisure];
            } else if (leisure === 'park' || leisure === 'playground' || leisure === 'nature_reserve' || tourism === 'viewpoint' || tourism === 'zoo') {
                category = 'Outdoor';
                keywords = ['park', 'outdoor', 'nature', leisure || tourism || ''];
            } else if (amenity === 'community_centre' || amenity === 'marketplace') {
                category = 'Family';
                keywords = ['community', 'family', 'events', amenity];
            } else if (amenity === 'cinema' || amenity === 'arts_centre') {
                category = 'Music'; // Mapping to Music/Entertainment for now to fill category
                keywords = ['entertainment', 'movie', 'arts'];
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
                keywords,
                rating: 5.0,
                reviewCount: Math.floor(Math.random() * (500 - 50 + 1)) + 50,
                reviewSnippet: REVIEW_SNIPPETS[Math.floor(Math.random() * REVIEW_SNIPPETS.length)],
                features: ["Free cancellation", "Instant confirmation", "Mobile ticket"],
                duration: "2 hours",
                cancellationPolicy: "For a full refund, cancel at least 24 hours in advance of the start date of the experience.",
                gallery: [
                    ensureActivityImage(poi, category),
                    ensureActivityImage(poi, category), // Duplicate for demo
                    ensureActivityImage(poi, category)
                ]
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
    minRating?: number;
    accessibility?: string[];
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
        ...activity,
        image: ensureActivityImage(activity, activity.category),
        features: activity.features || ["Free cancellation", "Good for groups"],
        duration: activity.duration || "Variable",
        cancellationPolicy: activity.cancellationPolicy || "Free cancellation available.",
        gallery: activity.gallery || [ensureActivityImage(activity, activity.category)]
    }));
}

const SEARCH_LIMIT = 50;
const STORAGE_KEYS = {
    COUNT: 'free_tier_search_count',
    DATE: 'free_tier_search_date'
};

function checkSearchLimit() {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem(STORAGE_KEYS.DATE);
    let count = parseInt(localStorage.getItem(STORAGE_KEYS.COUNT) || '0');

    if (storedDate !== today) {
        // Reset for new day
        count = 0;
        localStorage.setItem(STORAGE_KEYS.DATE, today);
    }

    if (count >= SEARCH_LIMIT) {
        throw new Error(`Daily search limit reached (${SEARCH_LIMIT}). Upgrade to Premium for unlimited searches.`);
    }

    localStorage.setItem(STORAGE_KEYS.COUNT, (count + 1).toString());
}

export async function searchActivities(options: SearchOptions, userTier: string = 'free'): Promise<Activity[]> {
    try {
        if (userTier === 'free') {
            checkSearchLimit();
        }
    } catch (error: any) {
        console.error(error.message);
        // Return empty or rethrow depending on desired UX. Rethrowing to let UI handle it.
        throw error;
    }

    let results: Activity[] = [];

    const osmResults = await fetchOpenStreetMapPOIs(options.location, options.radius);

    if (osmResults.length > 0) {
        console.log(`Found ${osmResults.length} points of interest from OpenStreetMap`);
        results = osmResults;
    }

    // Only use fallback if NO results found from API
    if (results.length === 0) {
        console.log('No API results found. Generating local fallback data.');

        // Dynamic fallback: Move the static fallback activities to the user's current location
        // This ensures the user ALWAYS sees something for demo purposes
        const fallbackWithDistance = OFFLINE_FALLBACK_ACTIVITIES.map((activity, index) => {
            // Generate a random offset to scatter points around the user
            // roughly +/- 0.02 degrees (approx 2km)
            const latOffset = (Math.random() - 0.5) * 0.04;
            const lngOffset = (Math.random() - 0.5) * 0.04;

            const newLat = options.location.lat + latOffset;
            const newLng = options.location.lng + lngOffset;

            return {
                ...activity,
                id: `fallback-${activity.id}-${index}`, // Ensure unique IDs
                location: {
                    lat: newLat,
                    lng: newLng,
                    address: `${options.location.address} (Demo Location)`
                },
                distance: calculateDistance(
                    options.location.lat,
                    options.location.lng,
                    newLat,
                    newLng
                )
            };
        });
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

    // Filter by rating (Simulated as OSM doesn't always have ratings, using constant 4.0 for demo fallback)
    if (options.minRating && options.minRating > 0) {
        results = results.filter(() => {
            const rating = 4.0; // Mock rating for now
            return rating >= options.minRating!;
        });
    }

    // Filter by accessibility
    if (options.accessibility && options.accessibility.length > 0) {
        results = results.filter(activity => {
            if (!activity.keywords) return false;
            return options.accessibility!.some(acc =>
                activity.keywords!.includes(acc) ||
                activity.description.toLowerCase().includes(acc.toLowerCase())
            );
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
