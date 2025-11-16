import mongoose from "mongoose";
import PurchaseService from "../services/purchase.service.js";

const service = new PurchaseService();

/**
 * Controlador para procesar la compra de un carrito.
 * POST /api/carritos/:cid/purchase
 */
export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;

    // El ID del usuario autenticado viene del middleware de auth
    const userId = req.user?.id;

    // Validaciones básicas
    if (!cid || !mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        status: "error",
        message: "El ID del carrito no es válido",
      });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "El ID del usuario autenticado no es válido",
      });
    }

    // Ejecutar compra
    const result = await service.purchaseCart({
      cartId: cid,
      purchaserUserId: userId,
    });

    return res.status(201).json({
      status: "success",
      message: result.partial
        ? "Compra parcial: algunos productos no tenían stock suficiente"
        : "Compra procesada correctamente",
      ticket: result.ticket,
      rejected: result.rejected,
      partial: result.partial,
    });
  } catch (e) {
    console.error("Error al procesar compra:", e);

    // Errores esperados para devolver código 400
    const known = [
      "Carrito inexistente",
      "Carrito vacío",
      "No hay ítems con stock suficiente",
      "Stock insuficiente",
      "ID inválido",
    ];

    const isKnown = known.some((msg) => e.message?.includes(msg));

    return res.status(isKnown ? 400 : 500).json({
      status: "error",
      message: e.message || "Error inesperado en la compra",
    });
  }
};
