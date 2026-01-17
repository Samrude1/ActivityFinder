import { query, run, get } from '../models/db.js';

export const getFavorites = async (req, res) => {
    try {
        const favorites = await query('SELECT id, activity_data, created_at FROM favorites WHERE user_id = ?', [req.userId]);
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

export const addFavorite = async (req, res) => {
    try {
        const { activity } = req.body;

        if (!activity || !activity.id) {
            return res.status(400).json({ error: 'Invalid activity data' });
        }

        // Check if already favorited
        const isPostgres = process.env.DATABASE_TYPE === 'postgres';
        const jsonQuery = isPostgres
            ? "activity_data::json->>'id' = ?"
            : 'json_extract(activity_data, "$.id") = ?';

        const existing = await query(`SELECT * FROM favorites WHERE user_id = ? AND ${jsonQuery}`,
            [req.userId, activity.id]);

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Activity already in favorites' });
        }

        // Check favorites limit (Free Tier: 20)
        const user = await get('SELECT tier FROM users WHERE id = ?', [req.userId]);
        const isPremium = user && user.tier === 'explorer';

        if (!isPremium) {
            const countResult = await query('SELECT COUNT(*) as count FROM favorites WHERE user_id = ?', [req.userId]);
            const favoritesCount = countResult[0].count;

            if (favoritesCount >= 20) {
                return res.status(403).json({
                    error: 'Free tier limit reached. Upgrade to Premium to save more favorites.',
                    code: 'LIMIT_REACHED'
                });
            }
        }

        // Add favorite
        await run('INSERT INTO favorites (user_id, activity_data) VALUES (?, ?)',
            [req.userId, JSON.stringify(activity)]);

        res.status(201).json({
            message: 'Added to favorites'
        });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { activityId } = req.params;

        const isPostgres = process.env.DATABASE_TYPE === 'postgres';
        const jsonQuery = isPostgres
            ? "activity_data::json->>'id' = ?"
            : 'json_extract(activity_data, "$.id") = ?';

        // Add await here to ensure the deletion completes
        await run(`DELETE FROM favorites WHERE user_id = ? AND ${jsonQuery}`,
            [req.userId, activityId]);

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
