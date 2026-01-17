import express from 'express';
import {
    createList,
    getUserLists,
    getList,
    updateList,
    deleteList,
    addItemToList,
    removeItemFromList
} from './features/customLists.js';
import { exportToCalendar } from './features/calendarExport.js';

const router = express.Router();

// Custom Lists endpoints
router.post('/lists', createList);
router.get('/lists', getUserLists);
router.get('/lists/:id', getList);
router.put('/lists/:id', updateList);
router.delete('/lists/:id', deleteList);
router.post('/lists/:id/items', addItemToList);
router.delete('/lists/:id/items/:itemId', removeItemFromList);

// Export endpoints
router.post('/export/calendar', exportToCalendar);

export default router;
