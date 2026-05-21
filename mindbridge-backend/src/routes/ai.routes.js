import { Router } from 'express';
import { getOracleContext, chatWithOracle, clearChatHistory, deleteChatMessage, deleteBulkChatMessages, saveAssessmentResult } from '../controllers/ai.controller.js';
import { auth } from '../middleware/auth.middleware.js';
const router = Router();
router.get('/oracle-context', auth, getOracleContext);
router.post('/assessments', auth, saveAssessmentResult);
router.post('/chat', auth, chatWithOracle);
router.delete('/history', auth, clearChatHistory);
router.delete('/history/bulk-delete', auth, deleteBulkChatMessages);
router.delete('/history/:id', auth, deleteChatMessage);
export default router;
//# sourceMappingURL=ai.routes.js.map