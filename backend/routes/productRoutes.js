import { Router } from 'express';
import {
  listProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
} from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
const router = Router();
router.route('/').get(listProducts).post(protect, admin, addProduct);
router
  .route('/:id')
  .get(getProduct)
  .put(protect, admin, editProduct)
  .delete(protect, admin, deleteProduct);
export default router;
