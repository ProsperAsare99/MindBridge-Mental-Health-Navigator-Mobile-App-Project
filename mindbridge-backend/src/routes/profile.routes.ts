import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(auth);

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
