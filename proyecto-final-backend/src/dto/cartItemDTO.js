export default class CartItemDto {
  /**
   * @param {Object} param0
   * @param {Object} param0.product - Documento o referencia del producto
   * @param {number} param0.quantity - Cantidad del producto en el carrito
   */
  constructor({ product, quantity }) {
    const prod = product || {};

    /** ID del producto */
    this.productId = prod._id?.toString() || null;

    /** Nombre del producto */
    this.title = prod.title || "Producto desconocido";

    /** Precio unitario */
    this.price = Number(prod.price) || 0;

    /** Cantidad agregada al carrito */
    this.quantity = Number(quantity) || 0;

    /** Subtotal (cantidad * precio) */
    this.subtotal = this.quantity * this.price;
  }
}
