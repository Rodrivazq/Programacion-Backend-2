import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

export const getAllProducts = async () => {
  return await Product.find();
};

export const getProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID inválido');
  }
  const product = await Product.findById(id);
  if (!product) throw new Error('Producto no encontrado');
  return product;
};

export const updateProduct = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID inválido');
  }
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID inválido');
  }
  return await Product.findByIdAndDelete(id);
};
