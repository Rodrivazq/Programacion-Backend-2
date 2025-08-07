import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
