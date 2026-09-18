import { Router } from 'express';
import {
  placeOrder,
  myOrders,
  allOrders,
  getOrder,
  updateStatus,
} from '../controllers/orderController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
const router = Router();
router.use(protect);
router.route('/').post(placeOrder).get(admin, allOrders);
router.get('/my', myOrders);
router.get('/:id', getOrder);
router.put('/:id/status', admin, updateStatus);
export default router;
