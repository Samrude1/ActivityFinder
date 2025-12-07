import { query, run } from '../models/db.js';

export const getFavorites = (req, res) => {
    try {
        const favorites = query('SELECT id, activity_data, created_at FROM favorites WHERE user_id = ?', [req.userId]);
        const favoritesData = favorites.map(f => ({
            id: f.id,
            ...JSON.parse(f.activity_data),
            savedAt: f.created_at
        }));

        res.json({ favorites: favoritesData });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addFavorite = (req, res) => {
    try {
        const { activity } = req.body;

        if (!activity || !activity.id) {
            return res.status(400).json({ error: 'Invalid activity data' });
        }

        // Check if already favorited
        const existing = query('SELECT * FROM favorites WHERE user_id = ? AND json_extract(activity_data, "$.id") = ?',
            [req.userId, activity.id]);

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Activity already in favorites' });
        }

        // Add favorite
        run('INSERT INTO favorites (user_id, activity_data) VALUES (?, ?)',
            [req.userId, JSON.stringify(activity)]);

        res.status(201).json({
            message: 'Added to favorites'
        });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const removeFavorite = (req, res) => {
    try {
        const { activityId } = req.params;

        run('DELETE FROM favorites WHERE user_id = ? AND json_extract(activity_data, "$.id") = ?',
            [req.userId, activityId]);

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
