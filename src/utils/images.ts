// Random fallback images for activities by category
const FALLBACK_IMAGES: Record<string, string[]> = {
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

// Get a random fallback image for a category
export function getFallbackImage(category: string): string {
    const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.Outdoor;
    return images[Math.floor(Math.random() * images.length)];
}

// Ensure activity has a valid image
export function ensureActivityImage(activity: any, category: string): string {
    if (activity.image && activity.image !== '' && !activity.image.includes('placeholder')) {
        return activity.image;
    }
    return getFallbackImage(category);
}
