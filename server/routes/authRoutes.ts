import { Router } from 'express';
import { register, login, getMe, updateProfile, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect as any, getMe as any);
router.put('/profile', protect as any, updateProfile as any);

export default router;
