import type { Activity, Category, Location } from '../types';
import { freeAPI } from './api';

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

// Export function to get all activities (for favorites page fallback)
export async function getAllActivities(): Promise<Activity[]> {
    // This could call a real "popular" endpoint if we had one.
    return [];
}

export async function searchActivities(options: SearchOptions): Promise<Activity[]> {
    try {
        let results: Activity[] = [];
        
        // 1. Fetch from our secure backend which proxies Google Places API
        try {
            results = await freeAPI.searchActivities(
                options.location,
                options.radius,
                options.categories
            );
        } catch (apiError: any) {
            console.error('Backend search failed:', apiError);
            if (apiError.upgradeRequired) {
                throw apiError; // Throw limit error to UI
            }
        }

        // 2. Client-side filtering (price, rating, keywords)
        // Note: location, radius, and categories are handled by backend

        if (options.priceRange) {
            results = results.filter(activity => {
                const price = activity.price || 0;
                return price >= options.priceRange!.min && price <= options.priceRange!.max;
            });
        }

        if (options.minRating && options.minRating > 0) {
            results = results.filter(activity => {
                const rating = activity.rating || 0;
                return rating >= options.minRating!;
            });
        }

        if (options.keywords && options.keywords.trim()) {
            const searchTerms = options.keywords.toLowerCase().split(' ');
            results = results.filter(activity => {
                const searchableText = `${activity.title} ${activity.description} ${activity.keywords?.join(' ') || ''}`.toLowerCase();
                return searchTerms.some((term: string) => searchableText.includes(term));
            });
        }

        return results;
    } catch (error) {
        console.error('searchActivities error:', error);
        throw error;
    }
}
