import { Router } from 'express';
import { getOracleContext } from '../controllers/ai.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/context', auth, getOracleContext);

export default router;
