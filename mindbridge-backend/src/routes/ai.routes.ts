import { Router } from 'express';
import { getOracleContext } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/context', authenticateToken, getOracleContext);

export default router;
