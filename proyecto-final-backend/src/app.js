import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import protectedRoutes from './routes/protected.routes.js';

dotenv.config();

const app = express();

// 🧱 Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔌 Rutas base
app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});

// 🛡️ Rutas de la API
app.use('/api/auth', authRoutes);              // Registro y login
app.use('/api/usuarios', userRoutes);          // Gestión de usuarios
app.use('/api/productos', productRoutes);      // Gestión de productos
app.use('/api/protegido', protectedRoutes);    // Ruta de prueba con token

// 🌐 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    process.exit(1); // Finaliza si falla la conexión
  });

export default app;
