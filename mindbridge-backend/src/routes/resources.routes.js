import { Router } from 'express';
import { getResources } from '../controllers/resources.controller.js';
import { auth } from '../middleware/auth.middleware.js';
const router = Router();
router.use(auth);
router.get('/', getResources);
export default router;
//# sourceMappingURL=resources.routes.js.map