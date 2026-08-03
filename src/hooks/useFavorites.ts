import { useState, useEffect } from 'react';
import { getFavoriteIds, addFavorite, removeFavorite, isFavorite } from '../services/storage';
import type { Activity } from '../types';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        updateFavorites();
        window.addEventListener('favorites-updated', updateFavorites);
        return () => window.removeEventListener('favorites-updated', updateFavorites);
    }, []);

    const updateFavorites = async () => {
        const favIds = await getFavoriteIds();
        setFavorites(favIds);
    };

    const toggleFavorite = async (activityId: string, activityToSave?: Activity) => {
        const isFav = await isFavorite(activityId);
        if (isFav) {
            await removeFavorite(activityId);
        } else if (activityToSave) {
            await addFavorite(activityToSave);
        }
        await updateFavorites();
    };

    return { favorites, toggleFavorite, updateFavorites };
}
