import ProductRepository from "../repositories/productRepository.js";

const productRepository = new ProductRepository();

export const createProduct = async (data) => {
  try {
    return await productRepository.create(data);
  } catch (error) {
    throw new Error(`Error al crear producto: ${error.message}`);
  }
};

export const getAllProducts = async () => {
  try {
    return await productRepository.getAll();
  } catch (error) {
    throw new Error(`Error al obtener productos: ${error.message}`);
  }
};

export const getProductById = async (id) => {
  try {
    const product = await productRepository.getById(id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  } catch (error) {
    throw new Error(`Error al obtener producto: ${error.message}`);
  }
};

export const updateProduct = async (id, data) => {
  try {
    const updated = await productRepository.update(id, data);
    if (!updated) throw new Error("Producto no encontrado");
    return updated;
  } catch (error) {
    throw new Error(`Error al actualizar producto: ${error.message}`);
  }
};

export const deleteProduct = async (id) => {
  try {
    const deleted = await productRepository.delete(id);
    if (!deleted) throw new Error("Producto no encontrado");
    return deleted;
  } catch (error) {
    throw new Error(`Error al eliminar producto: ${error.message}`);
  }
};
