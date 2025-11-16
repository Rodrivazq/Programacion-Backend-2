import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  createCart,
  getOrCreateMyCart,
  getCart,
  addProduct,
  setQuantity,
  removeProduct,
  clearCart,
  getMyCart,
} from "../services/cart.service.js";
import { purchaseCart } from "../controllers/purchase.controller.js";

const router = Router();

// POST /api/carritos
// Crea el carrito del usuario autenticado (o devuelve el existente).
router.post("/", authMiddleware, createCart);

// GET /api/carritos/mio
// Obtiene o crea el carrito del usuario.
router.get("/mio", authMiddleware, getOrCreateMyCart);

// GET /api/carritos/mio/solo
// Obtiene el carrito del usuario sin crearlo si no existe.
router.get("/mio/solo", authMiddleware, getMyCart);

// GET /api/carritos/:cid
// Obtiene un carrito por ID.
router.get("/:cid", authMiddleware, getCart);

// POST /api/carritos/:cid/productos/:pid
// Agrega un producto al carrito o incrementa su cantidad.
router.post("/:cid/productos/:pid", authMiddleware, addProduct);

// PUT /api/carritos/:cid/productos/:pid
// Actualiza la cantidad de un producto. Si es 0, lo elimina.
router.put("/:cid/productos/:pid", authMiddleware, setQuantity);

// DELETE /api/carritos/:cid/productos/:pid
// Elimina un producto específico del carrito.
router.delete("/:cid/productos/:pid", authMiddleware, removeProduct);

// DELETE /api/carritos/:cid
// Vacía el carrito completo.
router.delete("/:cid", authMiddleware, clearCart);

// POST /api/carritos/:cid/purchase
// Finaliza la compra del carrito y genera un ticket.
router.post("/:cid/purchase", authMiddleware, purchaseCart);

export default router;
