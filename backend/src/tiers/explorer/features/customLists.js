import { v4 as uuidv4 } from 'uuid';
import { query, run, get } from '../../../models/db.js';

// Helper function to check if user has Explorer tier or higher
const hasExplorerAccess = (tier) => {
    return tier === 'explorer';
};

// Create a new custom list
export const createList = async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        const userId = req.user.id;
        const userTier = req.user.tier;

        // Check tier access
        if (!hasExplorerAccess(userTier)) {
            return res.status(403).json({
                error: 'Custom Lists is an Explorer feature. Upgrade to access this feature.'
            });
        }

        // Validate input
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'List name is required' });
        }

        const listId = uuidv4();
        const listIcon = icon || '📋';

        await run(
            `INSERT INTO custom_lists (id, user_id, name, description, icon) VALUES (?, ?, ?, ?, ?)`,
            [listId, userId, name.trim(), description || '', listIcon]
        );

        const newList = await get(
            `SELECT * FROM custom_lists WHERE id = ?`,
            [listId]
        );

        res.status(201).json(newList);
    } catch (error) {
        console.error('Error creating list:', error);
        res.status(500).json({ error: 'Failed to create list' });
    }
};

// Get all lists for the authenticated user
export const getUserLists = async (req, res) => {
    try {
        if (!req.user) {
            console.error('[DEV ERROR] req.user is undefined in getUserLists');
            return res.status(500).json({ error: 'Auth context missing' });
        }
        const userId = req.user.id;
        const userTier = req.user.tier;

        // Check tier access
        if (!hasExplorerAccess(userTier)) {
            return res.status(403).json({
                error: 'Custom Lists is an Explorer feature. Upgrade to access this feature.'
            });
        }

        const lists = await query(
            `SELECT * FROM custom_lists WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );

        // Get item counts for each list
        const listsWithCounts = await Promise.all(lists.map(async (list) => {
            const countResult = await get(
                `SELECT COUNT(*) as count FROM list_items WHERE list_id = ?`,
                [list.id]
            );
            return {
                ...list,
                itemCount: countResult ? countResult.count : 0
            };
        }));

        res.json(listsWithCounts);
    } catch (error) {
        console.error('[DEV ERROR] Error fetching lists:', error);
        res.status(500).json({ error: 'Failed to fetch lists', details: error.message });
    }
};

// Get a specific list with its items
export const getList = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userTier = req.user.tier;

        // Check tier access
        if (!hasExplorerAccess(userTier)) {
            return res.status(403).json({
                error: 'Custom Lists is an Explorer feature. Upgrade to access this feature.'
            });
        }

        // Get the list
        const list = await get(
            `SELECT * FROM custom_lists WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Get list items
        const items = await query(
            `SELECT * FROM list_items WHERE list_id = ? ORDER BY added_at DESC`,
            [id]
        );

        // Parse activity data
        const itemsWithData = items.map(item => ({
            ...item,
            activity: JSON.parse(item.activity_data)
        }));

        res.json({
            ...list,
            items: itemsWithData
        });
    } catch (error) {
        console.error('Error fetching list:', error);
        res.status(500).json({ error: 'Failed to fetch list' });
    }
};

// Update a list
export const updateList = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon } = req.body;
        const userId = req.user.id;
        const userTier = req.user.tier;

        // Check tier access
        if (!hasExplorerAccess(userTier)) {
            return res.status(403).json({
                error: 'Custom Lists is an Explorer feature. Upgrade to access this feature.'
            });
        }

        // Check if list exists and belongs to user
        const list = await get(
            `SELECT * FROM custom_lists WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Validate input
        if (name && name.trim() === '') {
            return res.status(400).json({ error: 'List name cannot be empty' });
        }

        // Update fields
        const updates = [];
        const params = [];

        if (name) {
            updates.push('name = ?');
            params.push(name.trim());
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (icon) {
            updates.push('icon = ?');
            params.push(icon);
        }
        updates.push('updated_at = CURRENT_TIMESTAMP');

        params.push(id, userId);

        await run(
            `UPDATE custom_lists SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            params
        );

        const updatedList = await get(
            `SELECT * FROM custom_lists WHERE id = ?`,
            [id]
        );

        res.json(updatedList);
    } catch (error) {
        console.error('Error updating list:', error);
        res.status(500).json({ error: 'Failed to update list' });
    }
};

// Delete a list
export const deleteList = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userTier = req.user.tier;

        // Check tier access
        if (!hasExplorerAccess(userTier)) {
            return res.status(403).json({
                error: 'Custom Lists is an Explorer feature. Upgrade to access this feature.'
            });
        }

        // Check if list exists and belongs to user
        const list = await get(
            `SELECT * FROM custom_lists WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Delete the list (CASCADE will delete items)
        await run(
            `DELETE FROM custom_lists WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).json({ error: 'Failed to delete list' });
    }
};

// Add an item to a list
export const addItemToList = async (req, res) => {
    try {
        const { id } = req.params;
        const { activityData } = req.body;
        const userId = req.user.id;
        const userTier = req.user.tier;

        // Check tier access
        if (!hasExplorerAccess(userTier)) {
            return res.status(403).json({
                error: 'Custom Lists is an Explorer feature. Upgrade to access this feature.'
            });
        }

        // Check if list exists and belongs to user
        const list = await get(
            `SELECT * FROM custom_lists WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Validate activity data
        if (!activityData) {
            return res.status(400).json({ error: 'Activity data is required' });
        }

        const itemId = uuidv4();
        const activityDataStr = typeof activityData === 'string'
            ? activityData
            : JSON.stringify(activityData);

        await run(
            `INSERT INTO list_items (id, list_id, activity_data) VALUES (?, ?, ?)`,
            [itemId, id, activityDataStr]
        );

        const newItem = await get(
            `SELECT * FROM list_items WHERE id = ?`,
            [itemId]
        );

        res.status(201).json({
            ...newItem,
            activity: JSON.parse(newItem.activity_data)
        });
    } catch (error) {
        console.error('Error adding item to list:', error);
        res.status(500).json({ error: 'Failed to add item to list' });
    }
};

// Remove an item from a list
export const removeItemFromList = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const userId = req.user.id;
        const userTier = req.user.tier;

        // Check tier access
        if (!hasExplorerAccess(userTier)) {
            return res.status(403).json({
                error: 'Custom Lists is an Explorer feature. Upgrade to access this feature.'
            });
        }

        // Check if list exists and belongs to user
        const list = await get(
            `SELECT * FROM custom_lists WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Check if item exists in the list
        const item = await get(
            `SELECT * FROM list_items WHERE id = ? AND list_id = ?`,
            [itemId, id]
        );

        if (!item) {
            return res.status(404).json({ error: 'Item not found in list' });
        }

        // Delete the item
        await run(
            `DELETE FROM list_items WHERE id = ? AND list_id = ?`,
            [itemId, id]
        );

        res.json({ message: 'Item removed from list successfully' });
    } catch (error) {
        console.error('Error removing item from list:', error);
        res.status(500).json({ error: 'Failed to remove item from list' });
    }
};
