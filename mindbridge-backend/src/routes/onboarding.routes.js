import { Router } from 'express';
import { saveOnboarding } from '../controllers/onboarding.controller.js';
import { auth } from '../middleware/auth.middleware.js';
const router = Router();
router.post('/', auth, saveOnboarding);
export default router;
//# sourceMappingURL=onboarding.routes.js.map