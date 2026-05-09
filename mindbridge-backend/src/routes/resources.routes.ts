import { Router } from 'express';
import { getResources } from '../controllers/resources.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getResources);

export default router;
