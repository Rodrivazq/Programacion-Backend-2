import mongoose from "mongoose";
import { randomUUID } from "crypto";

import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

import TicketRepository from "../repositories/ticketRepository.js";
import CartRepository from "../repositories/cartRepository.js";
import ProductRepository from "../repositories/productRepository.js";

// Helpers  
function asObjectId(value, label = "ID") {
  const str =
    typeof value === "object" && value !== null
      ? value.toString()
      : String(value || "");
  if (!mongoose.Types.ObjectId.isValid(str)) throw new Error(`${label} inválido`);
  return new mongoose.Types.ObjectId(str);
}

const asQty = (n) => (Number.isFinite(+n) && +n >= 0 ? Math.floor(+n) : 0);

export default class PurchaseService {
  constructor() {
    this.tickets = new TicketRepository();
    this.carts = new CartRepository();
    this.products = new ProductRepository();
  }

  /**
   * Procesa la compra de un carrito
   * @param {{cartId:string, purchaserUserId:string}} params
   * @returns {Promise<{ticket:Object, rejected:Array, partial:boolean}>}
   */
  async purchaseCart({ cartId, purchaserUserId }) {
    const cartObjectId = asObjectId(cartId, "ID de carrito");
    const userObjectId = asObjectId(purchaserUserId, "ID de usuario");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1) Obtener carrito con productos poblados
      const cart = await Cart.findById(cartObjectId)
        .populate({ path: "products.product", select: "title price stock" })
        .session(session);

      if (!cart) throw new Error("Carrito inexistente");
      if (!cart.products?.length) throw new Error("Carrito vacío");

      const purchasable = [];
      const rejected = [];

      // 2) Separar ítems comprables y rechazados según stock
      for (const item of cart.products) {
        const prod = item.product;
        const qty = asQty(item.quantity);
        if (!prod || qty <= 0) continue;

        const stock = asQty(prod.stock);
        const price = Number(prod.price) || 0;
        const title = prod.title || "Producto sin título";

        if (stock >= qty) {
          purchasable.push({
            product: prod._id,
            title,
            price,
            quantity: qty,
            subtotal: qty * price,
          });
        } else {
          rejected.push({ product: prod._id, wanted: qty, available: stock });
        }
      }

      if (!purchasable.length) {
        throw new Error("No hay ítems con stock suficiente");
      }

      // 3) Descontar stock dentro de la transacción
      for (const item of purchasable) {
        const prod = await Product.findById(item.product).session(session);
        if (!prod) throw new Error("Producto no encontrado");

        if (asQty(prod.stock) < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.title}`);
        }

        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: -item.quantity } },
          { session }
        );
      }

      // 4) Crear ticket
      const amount = purchasable.reduce((acc, it) => acc + it.subtotal, 0);
      const code = randomUUID();

      const ticketDTO = await this.tickets.create(
        { code, purchaser: userObjectId, items: purchasable, amount },
        { session }
      );

      // 5) Actualizar carrito (dejar rechazados o vaciar)
      if (rejected.length) {
        cart.products = rejected.map((r) => ({
          product: r.product,
          quantity: r.wanted,
        }));
      } else {
        cart.products = [];
      }
      await cart.save({ session });

      // 6) Confirmar transacción
      await session.commitTransaction();

      return { ticket: ticketDTO, rejected, partial: rejected.length > 0 };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
