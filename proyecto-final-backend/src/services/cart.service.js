import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

function asObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Identificador inválido.");
  }
  return new mongoose.Types.ObjectId(id);
}

function normalizeQty(value, fallback = 1) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function createCart(req, res) {
  try {
    const userId = asObjectId(req.user?.id);
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, products: [] });
      return res.status(201).json(cart);
    }

    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getOrCreateMyCart(req, res) {
  try {
    const userId = asObjectId(req.user?.id);
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      select: "titulo precio stock codigo categoria",
    });

    if (!cart) cart = await Cart.create({ user: userId, products: [] });

    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getCart(req, res) {
  try {
    const cid = asObjectId(req.params.cid);
    const cart = await Cart.findById(cid).populate({
      path: "products.product",
      select: "titulo precio stock codigo categoria",
    });

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function addProduct(req, res) {
  try {
    const cid = asObjectId(req.params.cid);
    const pid = asObjectId(req.params.pid);
    const quantity = normalizeQty(req.body?.quantity, 1);

    const [cart, product] = await Promise.all([
      Cart.findById(cid),
      Product.findById(pid).select("precio stock titulo"),
    ]);

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    const idx = cart.products.findIndex(
      (p) => p.product.toString() === pid.toString()
    );

    if (idx === -1) {
      cart.products.push({ product: pid, quantity });
    } else {
      cart.products[idx].quantity += quantity;
    }

    await cart.save();
    const populated = await cart.populate({
      path: "products.product",
      select: "titulo precio stock codigo categoria",
    });

    return res.json(populated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function setQuantity(req, res) {
  try {
    const cid = asObjectId(req.params.cid);
    const pid = asObjectId(req.params.pid);
    const quantity = Number(req.body?.quantity);

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const idx = cart.products.findIndex(
      (p) => p.product.toString() === pid.toString()
    );

    if (idx === -1)
      return res
        .status(404)
        .json({ error: "El producto no está en el carrito" });

    if (!Number.isFinite(quantity) || quantity <= 0) {
      cart.products.splice(idx, 1);
    } else {
      cart.products[idx].quantity = Math.floor(quantity);
    }

    await cart.save();
    const populated = await cart.populate({
      path: "products.product",
      select: "titulo precio stock codigo categoria",
    });

    return res.json(populated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function removeProduct(req, res) {
  try {
    const cid = asObjectId(req.params.cid);
    const pid = asObjectId(req.params.pid);

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const before = cart.products.length;
    cart.products = cart.products.filter(
      (p) => p.product.toString() !== pid.toString()
    );

    if (before === cart.products.length)
      return res
        .status(404)
        .json({ error: "El producto no estaba en el carrito" });

    await cart.save();

    const populated = await cart.populate({
      path: "products.product",
      select: "titulo precio stock codigo categoria",
    });

    return res.json(populated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function clearCart(req, res) {
  try {
    const cid = asObjectId(req.params.cid);
    const cart = await Cart.findById(cid);

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    return res.json({ ok: true, message: "Carrito vacío" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getMyCart(req, res) {
  try {
    const userId = asObjectId(req.user?.id);

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      select: "titulo precio stock codigo categoria",
    });

    if (!cart)
      return res.status(404).json({ error: "El usuario no tiene carrito" });

    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
