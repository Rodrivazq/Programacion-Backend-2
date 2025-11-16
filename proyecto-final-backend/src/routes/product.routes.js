import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validators/product.validator.js";

const router = express.Router();

// GET /api/productos
// Lista completa de productos.
router.get("/", verifyToken, getAllProducts);

// GET /api/productos/:id
// Obtiene un producto por ID.
router.get("/:id", verifyToken, getProductById);

// POST /api/productos
// Crea un producto (solo admin).
router.post("/", verifyToken, isAdmin, validateCreateProduct, createProduct);

// PUT /api/productos/:id
// Actualiza un producto (solo admin).
router.put("/:id", verifyToken, isAdmin, validateUpdateProduct, updateProduct);

// DELETE /api/productos/:id
// Elimina un producto (solo admin).
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
