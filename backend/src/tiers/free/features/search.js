// Backend search logic using Overpass API (OpenStreetMap), Wikimedia, and Ticketmaster API
import dotenv from 'dotenv';
dotenv.config();

// Utility for Haversine distance
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

// In-memory cache for search results
const SEARCH_CACHE = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

const getOsmSelectors = (categories) => {
    if (!categories || categories.length === 0) {
        // No categories = fetch a broad mix of everything
        return [
            'nwr["tourism"~"attraction|museum|gallery|viewpoint"]',
            'nwr["amenity"~"restaurant|cafe|theatre|arts_centre|bar"]',
            'nwr["leisure"~"park|nature_reserve"]'
        ];
    }
    
    const selectors = [];
    let hasOsmCategory = false;
    
    categories.forEach(c => {
        switch (c) {
            case 'Food':
                selectors.push('nwr["amenity"~"restaurant|cafe|fast_food"]'); hasOsmCategory = true; break;
            case 'Cultural':
                selectors.push('nwr["amenity"~"arts_centre|theatre"]', 'nwr["tourism"~"museum|gallery"]', 'nwr["historic"~"yes"]'); hasOsmCategory = true; break;
            case 'Outdoor':
            case 'Outdoors':
                selectors.push('nwr["leisure"~"park|nature_reserve"]', 'nwr["natural"~"beach"]'); hasOsmCategory = true; break;
            case 'Family friendly':
            case 'Family':
                selectors.push('nwr["tourism"~"zoo|theme_park"]', 'nwr["leisure"~"playground"]'); hasOsmCategory = true; break;
            case 'Nightlife':
                selectors.push('nwr["amenity"~"bar|pub|nightclub"]'); hasOsmCategory = true; break;
            case 'Museums':
                selectors.push('nwr["tourism"="museum"]'); hasOsmCategory = true; break;
            case 'Hidden gems':
                selectors.push('nwr["tourism"="artwork"]', 'nwr["historic"="memorial"]'); hasOsmCategory = true; break;
            case 'Essentials':
            case 'Travelers\' Choice':
                selectors.push('nwr["tourism"~"attraction|viewpoint"]'); hasOsmCategory = true; break;
            // Sports and Music are primarily Ticketmaster, but we can add OSM fallbacks
            case 'Sports':
                selectors.push('nwr["leisure"~"sports_centre|stadium|pitch"]'); hasOsmCategory = true; break;
            case 'Arts & theater':
                selectors.push('nwr["amenity"~"arts_centre|theatre"]'); hasOsmCategory = true; break;
            case 'Music':
                selectors.push('nwr["amenity"~"nightclub|bar"]'); hasOsmCategory = true; break;
        }
    });
    
    if (!hasOsmCategory && categories.length > 0) return []; // Only TM categories selected
    
    return [...new Set(selectors)];
};

const getTmClassifications = (categories) => {
    if (!categories || categories.length === 0) return null; // Fetch any events if no category
    const classifications = [];
    categories.forEach(c => {
        if (c === 'Music') classifications.push('Music');
        if (c === 'Sports') classifications.push('Sports');
        if (c === 'Arts & theater' || c === 'Cultural') classifications.push('Arts & Theatre');
        if (c === 'Family' || c === 'Family friendly') classifications.push('Family');
    });
    return classifications.length > 0 ? classifications.join(',') : 'NONE';
};

const mapTagsToCategory = (tags) => {
    if (tags.amenity && tags.amenity.match(/restaurant|cafe|fast_food/)) return 'Food';
    if (tags.tourism === 'museum') return 'Museums';
    if (tags.amenity && tags.amenity.match(/arts_centre|theatre/)) return 'Arts & theater';
    if (tags.amenity && tags.amenity.match(/bar|pub|nightclub/)) return 'Nightlife';
    if (tags.leisure && tags.leisure.match(/park|nature_reserve/)) return 'Outdoors';
    return 'Essentials';
};

const getPlaceholderImage = (category, seed) => {
    const keywords = {
        'Food': 'restaurant',
        'Museums': 'museum',
        'Arts & theater': 'theater',
        'Nightlife': 'bar',
        'Outdoors': 'nature',
        'Music': 'concert',
        'Sports': 'sports',
        'Essentials': 'landmark'
    };
    const keyword = keywords[category] || 'city';
    return `https://loremflickr.com/800/600/${keyword}?lock=${seed}`;
};

const getWikimediaImage = async (wikipediaTag) => {
    try {
        const parts = wikipediaTag.split(':');
        const lang = parts.length > 1 ? parts[0] : 'en';
        const title = parts.length > 1 ? parts[1] : parts[0];
        
        const url = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=600`;
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000); // 2 second timeout for Wikipedia
        
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
            const pageId = Object.keys(pages)[0];
            if (pageId !== '-1' && pages[pageId].thumbnail) {
                return pages[pageId].thumbnail.source;
            }
        }
    } catch (e) {
        console.error('Wikimedia fetch error:', e.message);
    }
    return null;
};

const fetchOverpassActivities = async (location, radius, categories) => {
    const selectors = getOsmSelectors(categories);
    if (selectors.length === 0) return []; // No OSM categories selected

    const radiusMeters = Math.min(radius * 1000, 50000); // Max 50km
    const overpassQuery = `
        [out:json][timeout:25];
        (
          ${selectors.map(s => `${s}(around:${radiusMeters},${location.lat},${location.lng});`).join('\n  ')}
        );
        out center 60;
    `;
    
    const overpassUrl = `https://maps.mail.ru/osm/tools/overpass/api/interpreter`;
    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: 'data=' + encodeURIComponent(overpassQuery),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!response.ok) {
            console.error(`Overpass API error: ${response.status}`);
            return [];
        }

        const data = await response.json();
        console.log(`[search] Overpass raw elements: ${data.elements?.length}`);
        
        if (!data.elements || data.elements.length === 0) return [];

        let elements = data.elements.filter(el => el.tags && el.tags.name);
        console.log(`[search] Overpass named elements: ${elements.length}`);
        elements = elements.slice(0, 60); // Allow more items for frontend filtering

        return await Promise.all(elements.map(async (element, index) => {
            const placeLat = element.lat || element.center?.lat || location.lat;
            const placeLng = element.lon || element.center?.lon || location.lng;
            const category = mapTagsToCategory(element.tags);

            let mainImage = null;
            if (element.tags.wikipedia) {
                mainImage = await getWikimediaImage(element.tags.wikipedia);
            }
            
            if (!mainImage) {
                mainImage = getPlaceholderImage(category, element.id);
            }

            const gallery = [
                mainImage,
                getPlaceholderImage(category, element.id + 1),
                getPlaceholderImage(category, element.id + 2)
            ];

            const addressParts = [element.tags['addr:street'], element.tags['addr:housenumber'], element.tags['addr:city']].filter(Boolean);
            const address = addressParts.length > 0 ? addressParts.join(' ') : 'Location in area';
            
            const features = [
                element.tags.opening_hours ? `Hours: ${element.tags.opening_hours}` : null,
                element.tags.phone ? `Phone: ${element.tags.phone}` : null,
                element.tags.website ? `Website: ${element.tags.website}` : null,
                element.tags['diet:vegetarian'] === 'yes' ? 'Vegetarian Options' : null,
                element.tags['diet:vegan'] === 'yes' ? 'Vegan Options' : null,
                element.tags.wheelchair === 'yes' ? 'Wheelchair Accessible' : null,
                element.tags.fee === 'no' ? 'Free Entry' : null
            ].filter(Boolean);

            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(element.tags.name + ' ' + address)}`;

            return {
                id: `osm-${element.type}-${element.id}`,
                title: element.tags.name,
                description: element.tags.description || `A notable ${category.toLowerCase()} location in ${element.tags['addr:city'] || 'the area'}.`,
                date: new Date(new Date().getTime() + 86400000).toISOString(),
                location: { lat: placeLat, lng: placeLng, address },
                category,
                image: mainImage,
                gallery,
                features,
                url: element.tags.website || mapsUrl,
                mapsUrl,
                distance: calculateDistance(location.lat, location.lng, placeLat, placeLng),
                keywords: Object.keys(element.tags),
                rating: (4.0 + (element.id % 10) / 10).toFixed(1), // Mock rating between 4.0 and 4.9
                reviewCount: 50 + (element.id % 500),
                awardYear: index === 0 ? 2026 : null
            };
        }));
    } catch (e) {
        console.error('Overpass fetch error:', e.message);
        return [];
    }
};

const fetchTicketmasterActivities = async (location, radius, categories) => {
    const classifications = getTmClassifications(categories);
    if (classifications === 'NONE') return []; // No TM categories selected
    
    const apiKey = process.env.TICKETMASTER_API_KEY;
    if (!apiKey || apiKey === 'dummy_tm_key') return []; // TM key not provided

    let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&latlong=${location.lat},${location.lng}&radius=${radius}&unit=km&size=15&sort=distance,asc`;
    
    if (classifications) {
        url += `&classificationName=${encodeURIComponent(classifications)}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Ticketmaster API error: ${response.status}`);
            return [];
        }

        const data = await response.json();
        const events = data._embedded?.events;
        if (!events || events.length === 0) return [];

        return events.map((event, index) => {
            const venue = event._embedded?.venues?.[0];
            const placeLat = venue?.location?.latitude ? parseFloat(venue.location.latitude) : location.lat;
            const placeLng = venue?.location?.longitude ? parseFloat(venue.location.longitude) : location.lng;
            
            const segment = event.classifications?.[0]?.segment?.name || 'Events';
            let category = 'Arts & theater';
            if (segment.toLowerCase().includes('music')) category = 'Music';
            else if (segment.toLowerCase().includes('sports')) category = 'Sports';

            // Get high res image
            let mainImage = null;
            if (event.images && event.images.length > 0) {
                const sortedImages = event.images.sort((a, b) => b.width - a.width);
                mainImage = sortedImages[0].url;
            }

            const gallery = event.images ? event.images.slice(0, 3).map(i => i.url) : [mainImage];
            
            let address = 'Venue in area';
            if (venue) {
                address = [venue.name, venue.address?.line1, venue.city?.name].filter(Boolean).join(', ');
            }

            return {
                id: `tm-${event.id}`,
                title: event.name,
                description: event.info || event.pleaseNote || `${category} event at ${venue?.name || 'a local venue'}.`,
                date: event.dates?.start?.dateTime || event.dates?.start?.localDate || new Date().toISOString(),
                location: { lat: placeLat, lng: placeLng, address },
                category,
                image: mainImage,
                gallery,
                url: event.url || '#',
                distance: calculateDistance(location.lat, location.lng, placeLat, placeLng),
                keywords: [segment, event.classifications?.[0]?.genre?.name].filter(Boolean),
                rating: 4.8, // Events are highly rated
                reviewCount: 300 + index * 50,
                awardYear: null
            };
        });
    } catch (e) {
        console.error('Ticketmaster fetch error:', e.message);
        return [];
    }
};

export const searchActivities = async (req, res) => {
    const { location, radius = 25, categories = [] } = req.body;
    const user = req.user; // from optionalAuthMiddleware

    console.log(`[search] Request received:`, { location, radius, categories, user: user?.email });

    if (!location || !location.lat || !location.lng) {
        return res.status(400).json({ error: 'Location (lat, lng) is required' });
    }

    // Check cache
    const cacheKey = `${location.lat.toFixed(4)}_${location.lng.toFixed(4)}_${radius}_${categories.sort().join(',')}`;
    const cached = SEARCH_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[search] Serving from cache: ${cacheKey}`);
        return res.json(cached.data);
    }

    try {       // Run both fetches concurrently
        const [overpassResults, tmResults] = await Promise.all([
            fetchOverpassActivities(location, radius, categories),
            fetchTicketmasterActivities(location, radius, categories)
        ]);

        // Combine and sort by distance
        console.log(`[search] Overpass returned ${overpassResults.length} results, TM returned ${tmResults.length} results`);
        const activities = [...overpassResults, ...tmResults];
        activities.sort((a, b) => a.distance - b.distance);

        const finalResults = activities.slice(0, 30);
        
        // Save to cache
        SEARCH_CACHE.set(cacheKey, { timestamp: Date.now(), data: finalResults });
        
        res.json(finalResults);
    } catch (error) {
        console.error('Backend search critical error:', error);
        res.status(500).json({ error: 'Failed to search activities' });
    }
};
