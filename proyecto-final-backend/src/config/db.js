import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    // 🔌 Intentar conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB conectado correctamente");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1); // Finaliza la aplicación si la conexión falla
  }
};


