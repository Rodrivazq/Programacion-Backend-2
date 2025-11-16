export default class ProductDto {
  /**
   * @param {Object} [p={}] - Objeto producto proveniente del modelo o la base de datos
   */
  constructor(p = {}) {
    /** @type {string|null} ID del producto */
    this.id = p._id?.toString() || null;

    /** @type {string} Nombre o título del producto */
    this.title = p.title || "Sin título";

    /** @type {string} Descripción breve del producto */
    this.description = p.description || "";

    /** @type {number} Precio del producto */
    this.price = Number(p.price) || 0;

    /** @type {number} Stock disponible */
    this.stock = Number(p.stock) || 0;

    /** @type {string} Categoría del producto */
    this.category = p.category || "general";
  }
}
