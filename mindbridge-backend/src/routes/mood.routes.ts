import { Router } from 'express';
import { getMoodLogs, createMoodLog } from '../controllers/mood.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(auth);

router.get('/', getMoodLogs);
router.post('/', createMoodLog);

export default router;
