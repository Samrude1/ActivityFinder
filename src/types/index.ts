export type Category = 'Outdoor' | 'Cultural' | 'Sports' | 'Music' | 'Food' | 'Family';

export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export interface Activity {
    id: string;
    title: string;
    description: string;
    date: string;
    location: Location;
    category: Category;
    image: string;
    url: string;
    distance?: number;
    price?: number; // Price in local currency (0 = free)
    keywords?: string[]; // Keywords for search
}

export interface FilterState {
    categories: Category[];
    radius: number;
    priceRange: {
        min: number;
        max: number;
    };
    keywords: string;
    dateRange?: {
        start: Date | null;
        end: Date | null;
    };
}
