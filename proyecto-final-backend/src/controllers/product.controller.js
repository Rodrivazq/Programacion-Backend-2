import ProductRepository from "../repositories/productRepository.js";
const products = new ProductRepository();

/**
 * Controlador de productos
 * Maneja las operaciones CRUD y usa la capa de repositorio para acceder a la BD.
 */

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const dto = await products.create(req.body);

    return res.status(201).json({
      message: "Producto creado correctamente",
      producto: dto,
    });
  } catch (error) {
    console.error("Error al crear producto:", error.message);
    return res.status(500).json({
      message: "Error al crear producto",
      error: error.message,
    });
  }
};

// Obtener todos los productos
export const getAllProducts = async (_req, res) => {
  try {
    const list = await products.getAll();
    return res.json(list);
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    return res.status(500).json({
      message: "Error al obtener productos",
      error: error.message,
    });
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const dto = await products.getById(req.params.id);

    if (!dto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(dto);
  } catch (error) {
    console.error("Error al buscar producto:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const dto = await products.update(req.params.id, req.body);

    if (!dto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({
      message: "Producto actualizado correctamente",
      producto: dto,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const ok = await products.delete(req.params.id);

    if (!ok) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
