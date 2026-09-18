import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { register, login, logout, profile } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
const router = Router();
const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
});
router.post('/register', limit, register);
router.post('/login', limit, login);
router.post('/logout', logout);
router.get('/profile', protect, profile);
export default router;
