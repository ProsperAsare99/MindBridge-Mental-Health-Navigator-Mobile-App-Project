import { Router } from 'express';
import { getEntries, createEntry } from '../controllers/journal.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getEntries);
router.post('/', createEntry);

export default router;
