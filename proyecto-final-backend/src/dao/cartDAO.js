import mongoose from "mongoose";
import Cart from "../models/cart.model.js";

const { ObjectId } = mongoose.Types;
const isId = (v) => ObjectId.isValid(String(v));

/**
 * DAO de Carritos.
 * Maneja las operaciones directas con la colección `carts`.
 * Las respuestas incluyen el populate básico de los productos.
 */
export default class CartDao {
  // Buscar carrito por ID (incluye populate)
  async findById(cid, opts = {}) {
    if (!isId(cid)) return null;

    const q = Cart.findById(cid)
      .populate({ path: "products.product", select: "title price stock" });

    if (opts.session) q.session(opts.session);
    return q.exec();
  }

  // Buscar carrito por usuario, crear si no existe
  async findOrCreateByUser(userId, opts = {}) {
    if (!isId(userId)) return null;

    const q = Cart.findOne({ user: userId })
      .populate({ path: "products.product", select: "title price stock" });

    if (opts.session) q.session(opts.session);

    let cart = await q.exec();

    if (!cart) {
      const created = await Cart.create([{ user: userId, products: [] }], {
        session: opts.session,
      });
      cart = created[0];

      cart = await cart.populate({
        path: "products.product",
        select: "title price stock",
      });
    }

    return cart;
  }

  // Vaciar por completo el carrito
  async clear(cid, opts = {}) {
    if (!isId(cid)) return null;

    const q = Cart.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    ).populate({ path: "products.product", select: "title price stock" });

    if (opts.session) q.session(opts.session);
    return q.exec();
  }

  // Reemplazar todos los productos del carrito
  async setProducts(cid, products, opts = {}) {
    if (!isId(cid)) return null;

    const cleaned = (Array.isArray(products) ? products : [])
      .filter((p) => p && isId(p.product))
      .map((p) => ({
        product: p.product,
        quantity: Math.max(
          1,
          Number.isFinite(+p.quantity) ? Math.floor(+p.quantity) : 1
        ),
      }));

    const q = Cart.findByIdAndUpdate(
      cid,
      { products: cleaned },
      { new: true }
    ).populate({ path: "products.product", select: "title price stock" });

    if (opts.session) q.session(opts.session);
    return q.exec();
  }

  // Agregar o sumar cantidad a un producto del carrito
  async addProduct(cid, productId, quantity = 1, opts = {}) {
    if (!isId(cid) || !isId(productId)) return null;

    const session = opts.session;
    const cart = session
      ? await Cart.findById(cid).session(session)
      : await Cart.findById(cid);

    if (!cart) return null;

    const qty = Math.max(1, Number.isFinite(+quantity) ? Math.floor(+quantity) : 1);
    const idx = cart.products.findIndex(
      (p) => p.product?.toString() === String(productId)
    );

    if (idx >= 0) {
      cart.products[idx].quantity += qty;
    } else {
      cart.products.push({ product: productId, quantity: qty });
    }

    await cart.save({ session });

    return cart.populate({
      path: "products.product",
      select: "title price stock",
    });
  }

  // Actualizar cantidad exacta de un producto en el carrito
  async updateQuantity(cid, productId, quantity, opts = {}) {
    if (!isId(cid) || !isId(productId)) return null;

    const session = opts.session;
    const cart = session
      ? await Cart.findById(cid).session(session)
      : await Cart.findById(cid);

    if (!cart) return null;

    const item = cart.products.find(
      (p) => p.product?.toString() === String(productId)
    );
    if (!item) return null;

    const qty = Math.floor(+quantity);

    if (!Number.isFinite(qty) || qty <= 0) {
      cart.products = cart.products.filter(
        (p) => p.product?.toString() !== String(productId)
      );
    } else {
      item.quantity = qty;
    }

    await cart.save({ session });

    return cart.populate({
      path: "products.product",
      select: "title price stock",
    });
  }

  // Eliminar un producto del carrito
  async removeProduct(cid, productId, opts = {}) {
    if (!isId(cid) || !isId(productId)) return null;

    const q = Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({ path: "products.product", select: "title price stock" });

    if (opts.session) q.session(opts.session);
    return q.exec();
  }
}
