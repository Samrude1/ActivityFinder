import type { Activity } from '../types';
import { favoritesAPI } from './api';

const STORAGE_KEY = 'activity_favorites';

// Get all favorites from backend (if logged in) or localStorage (fallback)
export async function getFavorites(): Promise<Activity[]> {
    try {
        // Try to get from backend first
        const favorites = await favoritesAPI.getFavorites();
        return favorites;
    } catch (error) {
        // Fallback to localStorage if not logged in
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        try {
            return JSON.parse(stored);
        } catch {
            return [];
        }
    }
}

// Add favorite (sync to backend if logged in)
export async function addFavorite(activity: Activity): Promise<void> {
    try {
        // Try backend first
        await favoritesAPI.addFavorite(activity);
    } catch (error) {
        // Fallback to localStorage
        const favorites = await getFavorites();
        if (!favorites.find(a => a.id === activity.id)) {
            favorites.push(activity);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }
    }

    // Dispatch event for reactive updates
    window.dispatchEvent(new CustomEvent('favorites-updated'));
}

// Remove favorite (sync to backend if logged in)
export async function removeFavorite(activityId: string): Promise<void> {
    try {
        // Try backend first
        await favoritesAPI.removeFavorite(activityId);
    } catch (error) {
        // Fallback to localStorage
        const favorites = await getFavorites();
        const filtered = favorites.filter(a => a.id !== activityId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    // Dispatch event for reactive updates
    window.dispatchEvent(new CustomEvent('favorites-updated'));
}

// Check if activity is favorited
export async function isFavorite(activityId: string): Promise<boolean> {
    const favorites = await getFavorites();
    return favorites.some(a => a.id === activityId);
}

// Get favorite IDs only
export async function getFavoriteIds(): Promise<string[]> {
    const favorites = await getFavorites();
    return favorites.map(a => a.id);
}
