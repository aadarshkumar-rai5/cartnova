import { Router } from 'express';
import { listUsers, dashboard } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
const router = Router();
router.use(protect, admin);
router.get('/', listUsers);
router.get('/stats', dashboard);
export default router;
