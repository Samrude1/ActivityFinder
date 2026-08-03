import { get, run } from '../../../models/db.js';

export const enforceSearchLimit = async (req, res, next) => {
    // Only enforce for free tier (guests are allowed unlimited mock searches for now)
    if (!req.user || req.user.tier !== 'free') return next();

    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        // Get count
        let limitData = await get(
            'SELECT * FROM user_search_limits WHERE user_id = ?',
            [userId]
        );

        if (limitData) {
            // Check if date needs reset
            if (limitData.last_reset_date !== today) {
                await run(
                    'UPDATE user_search_limits SET search_count = 0, last_reset_date = ? WHERE user_id = ?',
                    [today, userId]
                );
                limitData.search_count = 0;
            }
        } else {
            // Create record
            await run(
                'INSERT INTO user_search_limits (user_id, search_count, last_reset_date) VALUES (?, 0, ?)',
                [userId, today]
            );
            limitData = { search_count: 0 };
        }

        if (limitData.search_count >= 50) {
            return res.status(429).json({
                error: 'Daily search limit reached (50/day). Upgrade to Explorer for unlimited searches.',
                upgradeRequired: true,
                limit: 50,
                count: limitData.search_count
            });
        }

        // Increment count
        await run(
            'UPDATE user_search_limits SET search_count = search_count + 1 WHERE user_id = ?',
            [userId]
        );

        next();
    } catch (error) {
        console.error('Error in search limit middleware:', error);
        // Fail open if DB error, don't block user
        next();
    }
};

export const getSearchCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        let limitData = await get(
            'SELECT search_count, last_reset_date FROM user_search_limits WHERE user_id = ?',
            [userId]
        );

        // Handle date reset in read view as well
        let count = 0;
        if (limitData && limitData.last_reset_date === today) {
            count = limitData.search_count;
        }

        res.json({ count, limit: 50 });
    } catch (error) {
        console.error('Error getting search count:', error);
        res.status(500).json({ error: 'Failed to get search count' });
    }
};
