import { Router } from 'express';
import { getOracleContext, chatWithOracle, clearChatHistory } from '../controllers/ai.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/oracle-context', auth, getOracleContext);
router.post('/chat', auth, chatWithOracle);
router.delete('/history', auth, clearChatHistory);

export default router;
