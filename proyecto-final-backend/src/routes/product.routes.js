import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import {
  validateCreateProduct,
  validateUpdateProduct
} from '../validators/product.validator.js';

const router = express.Router();

// 🟢 Rutas protegidas: solo usuarios autenticados
router.get('/', verifyToken, getAllProducts);
router.get('/:id', verifyToken, getProductById);

// 🔐 Rutas protegidas para admin con validación
router.post('/', verifyToken, isAdmin, validateCreateProduct, createProduct);
router.put('/:id', verifyToken, isAdmin, validateUpdateProduct, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
