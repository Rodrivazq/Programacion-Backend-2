import CartDao from "../dao/cartDAO.js";
import CartItemDto from "../dto/cartItemDTO.js";

export default class CartRepository {
  constructor() {
    this.dao = new CartDao();
  }

  // Obtiene un carrito por ID (con productos poblados)
  async getById(cid, opts = {}) {
    const cart = await this.dao.findById(cid, opts);
    if (!cart) return null;

    const products = Array.isArray(cart.products) ? cart.products : [];
    const items = products.map((p) => new CartItemDto(p));

    return {
      id: cart._id?.toString?.() ?? String(cart._id),
      raw: cart,
      items,
    };
  }

  // Obtiene (o crea) el carrito asociado a un usuario
  async findOrCreateByUser(userId, opts = {}) {
    const cart = await this.dao.findOrCreateByUser(userId, opts);
    if (!cart) return null;

    const items = (cart.products ?? []).map((p) => new CartItemDto(p));

    return {
      id: cart._id?.toString?.() ?? String(cart._id),
      raw: cart,
      items,
    };
  }

  // Vacía completamente el carrito
  async clear(cid, opts = {}) {
    return this.dao.clear(cid, opts);
  }

  // Reemplaza los productos del carrito (por ejemplo, dejando solo los rechazados)
  async setItems(cid, itemsRaw, opts = {}) {
    return this.dao.setProducts(cid, itemsRaw, opts);
  }

  // Agrega un producto o suma cantidad si ya existe
  async addProduct(cid, productId, quantity = 1, opts = {}) {
    return this.dao.addProduct(cid, productId, quantity, opts);
  }

  // Actualiza la cantidad exacta de un producto
  async updateQuantity(cid, productId, quantity, opts = {}) {
    return this.dao.updateQuantity(cid, productId, quantity, opts);
  }

  // Elimina un producto del carrito
  async removeProduct(cid, productId, opts = {}) {
    return this.dao.removeProduct(cid, productId, opts);
  }
}
