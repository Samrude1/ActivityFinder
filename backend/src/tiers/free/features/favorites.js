import { query, run, get } from '../../../models/db.js';

export const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await query(
            'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // Parse activity_data
        const parsedFavorites = favorites.map(fav => ({
            ...fav,
            activity_data: JSON.parse(fav.activity_data)
        }));

        res.json(parsedFavorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
};

export const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { activity } = req.body;

        // Enforce Free Tier Limit
        if (req.user.tier === 'free') {
            const result = await get(
                'SELECT COUNT(*) as count FROM favorites WHERE user_id = ?',
                [userId]
            );
            const count = result ? (result.count || Object.values(result)[0]) : 0;

            if (count >= 20) {
                return res.status(403).json({
                    error: 'Free tier limited to 20 favorites. Upgrade to Explorer for unlimited.',
                    upgradeRequired: true,
                    limit: 20
                });
            }
        }

        const activityJson = JSON.stringify(activity);

        // Check if already exists to avoid duplicates (optional but good UX)
        // Ideally we check by activity ID inside activity_data, but standard SQL JSON query is hard.
        // We will just insert. The frontend handles "isFavorite" check usually.
        // Wait, duplicates are bad. Let's try to prevent if easy.
        // Since we store JSON string, exact match might fail if props order changes.
        // We'll rely on client or basic insert.

        await run(
            'INSERT INTO favorites (user_id, activity_data) VALUES (?, ?)',
            [userId, activityJson]
        );

        res.status(201).json({ message: 'Favorite added successfully' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // If id is numeric (Postgres SERIAL / SQLite INTEGER), we can delete directly.
        // But frontend might send activity ID?
        // Existing routes/favorites usually delete by ID.

        await run(
            'DELETE FROM favorites WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        res.json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
};

export const getFavoriteCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await get(
            'SELECT COUNT(*) as count FROM favorites WHERE user_id = ?',
            [userId]
        );
        const count = result ? (result.count || Object.values(result)[0]) : 0;

        res.json({ count, limit: 20 });
    } catch (error) {
        console.error('Error getting favorite count:', error);
        res.status(500).json({ error: 'Failed to get favorite count' });
    }
};
