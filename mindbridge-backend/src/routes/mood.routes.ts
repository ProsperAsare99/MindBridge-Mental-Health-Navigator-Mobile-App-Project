import { Router } from 'express';
import { getMoodLogs, createMoodLog } from '../controllers/mood.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getMoodLogs);
router.post('/', createMoodLog);

export default router;
