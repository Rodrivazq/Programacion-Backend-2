import Product from "../models/product.model.js";

/**
 * DAO de Productos.
 * Encapsula las operaciones CRUD sobre la colección `products`.
 * Esta capa se encarga exclusivamente del acceso a datos.
 */
export default class ProductDao {
  // Buscar producto por ID
  async findById(id) {
    return Product.findById(id);
  }

  // Obtener todos los productos
  async findAll() {
    return Product.find({});
  }

  // Crear un nuevo producto
  async create(data) {
    return Product.create(data);
  }

  // Actualizar un producto existente
  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  // Eliminar un producto
  async delete(id) {
    const doc = await Product.findByIdAndDelete(id);
    return !!doc; // true si existía
  }

  // Actualizar el stock (usado en el proceso de compra)
  async updateStock(id, newStock) {
    return Product.findByIdAndUpdate(id, { stock: newStock }, { new: true });
  }
}
