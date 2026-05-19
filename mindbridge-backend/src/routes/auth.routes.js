import { Router } from 'express';
import { register, login, getMe, updatePassword } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.middleware.js';
const router = Router();
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);
// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', login);
// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, getMe);
// @route   POST /api/auth/update-password
// @desc    Update user password
// @access  Private
router.post('/update-password', auth, updatePassword);
export default router;
//# sourceMappingURL=auth.routes.js.map