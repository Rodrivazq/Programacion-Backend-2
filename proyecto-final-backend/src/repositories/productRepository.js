import ProductDao from "../dao/productDAO.js";
import ProductDto from "../dto/productDTO.js";

export default class ProductRepository {
  constructor() {
    this.dao = new ProductDao();
  }

  // Devuelve todos los productos como DTO
  async getAll() {
    const list = await this.dao.findAll();
    return list.map((p) => new ProductDto(p));
  }

  // Busca un producto por ID y lo devuelve como DTO
  async getById(id) {
    const p = await this.dao.findById(id);
    return p ? new ProductDto(p) : null;
  }

  // Crea un producto y devuelve su DTO
  async create(data) {
    const p = await this.dao.create(data);
    return new ProductDto(p);
  }

  // Actualiza un producto y devuelve su DTO
  async update(id, data) {
    const p = await this.dao.update(id, data);
    return p ? new ProductDto(p) : null;
  }

  // Elimina un producto
  async delete(id) {
    return this.dao.delete(id);
  }

  // Actualiza únicamente el stock de un producto
  async setStock(id, newStock) {
    const p = await this.dao.updateStock(id, newStock);
    return p ? new ProductDto(p) : null;
  }
}
