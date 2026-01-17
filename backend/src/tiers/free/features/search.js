// Node 18+ has global fetch available, no import needed

// Fallback images (copied from frontend utils for isolation)
const FALLBACK_IMAGES = {
    Outdoor: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    ],
    Cultural: [
        'https://images.unsplash.com/photo-1565359471403-3f8e0c9e3d7e?w=400',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400',
        'https://images.unsplash.com/photo-1580913428706-c311e67898b3?w=400',
    ],
    Sports: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
    ],
    Music: [
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    ],
    Food: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    ],
    Family: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
        'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400',
    ],
};

function getFallbackImage(category) {
    const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.Outdoor;
    return images[Math.floor(Math.random() * images.length)];
}

function ensureActivityImage(activity, category) {
    // In backend we might not have 'activity.image' populated properly from OSM results unless we parse it specially.
    // OSM tags usually don't have direct image URLs, mostly wikipedia/wikimedia refs.
    // For now we use fallback logic mostly.
    return getFallbackImage(category);
}

// Haversine distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Offline fallback data with Helsinki coordinates
const OFFLINE_ACTIVITIES = [
    {
        id: 'fallback-1',
        title: 'Esplanade Park Picnic',
        description: 'Enjoy a relaxing picnic in the beautiful Esplanade Park. Greenery in the heart of the city.',
        date: new Date().toISOString(),
        location: { lat: 60.1675, lng: 24.9442, address: 'Pohjoisesplanadi, Helsinki' },
        category: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        url: '#',
        price: 0,
        keywords: ['park', 'picnic', 'outdoor', 'relax']
    },
    {
        id: 'fallback-2',
        title: 'Helsinki Cathedral Tour',
        description: 'Visit the iconic white cathedral. A symbol of Helsinki offering great views.',
        date: new Date().toISOString(),
        location: { lat: 60.1704, lng: 24.9522, address: 'Unioninkatu 29, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1565359471403-3f8e0c9e3d7e?w=400',
        url: '#',
        price: 0,
        keywords: ['cathedral', 'culture', 'history', 'landmark']
    },
    {
        id: 'fallback-3',
        title: 'Market Square Coffee',
        description: 'Traditional market coffee and cinnamon bun by the sea. Fresh breeze guaranteed.',
        date: new Date().toISOString(),
        location: { lat: 60.1666, lng: 24.9536, address: 'Eteläranta, Helsinki' },
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        url: '#',
        price: 15,
        keywords: ['coffee', 'market', 'food', 'sea']
    },
    {
        id: 'fallback-4',
        title: 'Löyly Sauna Experience',
        description: 'Modern public sauna and restaurant. Dip in the Baltic Sea if you dare!',
        date: new Date().toISOString(),
        location: { lat: 60.1517, lng: 24.9299, address: 'Hernesaarenranta 4, Helsinki' },
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
        url: '#',
        price: 25,
        keywords: ['sauna', 'swim', 'wellness', 'sports']
    },
    {
        id: 'fallback-5',
        title: 'Oodi Library Visit',
        description: 'Explore the modern central library. A masterpiece of architecture and community space.',
        date: new Date().toISOString(),
        location: { lat: 60.1740, lng: 24.9382, address: 'Töölönlahdenkatu 4, Helsinki' },
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        url: '#',
        price: 0,
        keywords: ['library', 'books', 'architecture', 'culture']
    }
];

export const searchActivities = async (req, res) => {
    try {
        console.log('Free Tier Search Request Body:', JSON.stringify(req.body));
        const { location, radius = 25, categories } = req.body;

        if (!location || !location.lat || !location.lng) {
            return res.status(400).json({ error: 'Valid location (lat, lng) is required' });
        }

        // Convert radius km to meters for Overpass
        const radiusMeters = radius * 1000;

        const query = `
      [out:json][timeout:25];
      (
        node["leisure"~"park|sports_centre|playground"](around:${radiusMeters},${location.lat},${location.lng});
        node["amenity"~"theatre|cinema|library|community_centre|restaurant|cafe|fast_food"](around:${radiusMeters},${location.lat},${location.lng});
        node["tourism"~"museum|gallery|attraction"](around:${radiusMeters},${location.lat},${location.lng});
      );
      out body;
    `;

        let activities = [];

        try {
            const response = await fetch(OVERPASS_API, {
                method: 'POST',
                body: query,
            });

            if (!response.ok) {
                const text = await response.text();
                // Rate limited or other error? Log and throw to trigger fallback
                console.warn(`Overpass API unavailable (${response.status}):`, text);
                throw new Error(`Overpass API unavailable: ${response.status}`);
            }

            const data = await response.json();

            if (data.elements && data.elements.length > 0) {
                activities = data.elements.slice(0, 50).map((poi, index) => {
                    // ... (mapping logic same as before)
                    const name = poi.tags?.name || 'Local Activity';
                    const leisure = poi.tags?.leisure;
                    const amenity = poi.tags?.amenity;
                    const tourism = poi.tags?.tourism;
                    const cuisine = poi.tags?.cuisine;

                    let category = 'Outdoor';
                    let keywords = [];

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

                    const distance = calculateDistance(location.lat, location.lng, poi.lat, poi.lon);

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
                        distance: distance,
                        price: category === 'Food' ? 15 : 0,
                        keywords
                    };
                });
            }
        } catch (apiError) {
            console.log('Falling back to offline activities due to API error:', apiError.message);
            // Use fallback data
            activities = OFFLINE_ACTIVITIES.map(a => ({
                ...a,
                distance: calculateDistance(location.lat, location.lng, a.location.lat, a.location.lng)
            }));
        }

        // Backend filtering
        // Filter by radius
        activities = activities.filter(a => a.distance <= radius);

        // Filter by categories
        if (categories && Array.isArray(categories) && categories.length > 0) {
            activities = activities.filter(a => categories.includes(a.category));
        }

        // Sort by distance
        activities.sort((a, b) => a.distance - b.distance);

        res.json(activities.slice(0, 30));
    } catch (error) {
        console.error('Backend search critical error:', error);
        res.status(500).json({ error: 'Failed to search activities' });
    }
};
