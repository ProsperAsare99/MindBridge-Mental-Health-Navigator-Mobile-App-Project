import { Router } from 'express';
import { getOracleContext, chatWithOracle } from '../controllers/ai.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/context', auth, getOracleContext);
router.post('/chat', auth, chatWithOracle);

export default router;
