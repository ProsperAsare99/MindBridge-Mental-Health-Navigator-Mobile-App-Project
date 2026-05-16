import { Router } from 'express';
import { getMoodLogs, createMoodLog, getInsights } from '../controllers/mood.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(auth);

router.get('/', getMoodLogs);
router.get('/insights', getInsights);
router.post('/', createMoodLog);

export default router;
