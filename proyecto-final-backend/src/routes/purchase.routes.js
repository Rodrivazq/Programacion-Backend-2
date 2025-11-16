import { Router } from "express";
import { purchaseCart } from "../controllers/purchase.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// POST /api/carritos/:cid/purchase
// Procesa la compra del carrito indicado.
router.post("/carritos/:cid/purchase", authMiddleware, purchaseCart);

export default router;