export const CITY_DATA: Record<string, { image: string, country: string, description: string }> = {
    'helsinki': {
        image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1200&q=80',
        country: 'Finland',
        description: 'Sitting on the edge of the Baltic, the modern, cosmopolitan city of Helsinki is a hub of design and culture. The beauty of the surrounding nature blends seamlessly with high-tech achievements and contemporary trends.'
    },
    'paris': {
        image: 'https://images.unsplash.com/photo-1502602868886-0eb0ec2f932f?w=1200&q=80',
        country: 'France',
        description: 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.'
    },
    'new york': {
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
        country: 'United States',
        description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers.'
    },
    'tokyo': {
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
        country: 'Japan',
        description: 'Tokyo, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods.'
    },
    'milan': {
        image: 'https://images.unsplash.com/photo-1534685785745-60a2cea0ec34?w=1200&q=80',
        country: 'Italy',
        description: 'Milan, a metropolis in Italy\'s northern Lombardy region, is a global capital of fashion and design. Home to the national stock exchange, it’s a financial hub also known for its high-end restaurants and shops.'
    },
    'default': {
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
        country: '',
        description: 'Discover amazing activities, hidden gems, and iconic places in this destination. Plan your perfect trip with our comprehensive guide to local experiences and attractions.'
    }
};

export function getCityInfo(query: string) {
    const q = query.toLowerCase();
    for (const key in CITY_DATA) {
        if (key !== 'default' && q.includes(key)) {
            return CITY_DATA[key];
        }
    }
    return CITY_DATA['default'];
}
