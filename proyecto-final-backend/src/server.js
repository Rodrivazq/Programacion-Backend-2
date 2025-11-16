// src/server.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

mongoose.set("strictQuery", true);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || "development";

if (!MONGO_URI) {
  console.error("Falta MONGO_URI en .env");
  process.exit(1);
}

(async () => {
  try {
    console.log("Conectando a MongoDB...");

    if (NODE_ENV !== "production") {
      console.log("MONGO_URI:", MONGO_URI);
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 7000,
    });

    console.log("Conexión establecida con MongoDB");

    // Intento opcional de obtener información del replica set
    try {
      const client = mongoose.connection.getClient();
      const adminDb = client.db().admin();
      const hello = await adminDb.command({ hello: 1 });

      console.log(
        `ReplicaSet: ${hello.setName || "N/A"} | Primary: ${hello.isWritablePrimary}`
      );
    } catch (infoErr) {
      console.warn("No se pudo obtener información de replica set:", infoErr.message);
    }

    const server = app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT} (modo ${NODE_ENV})`);
    });

    const shutdown = async (signal) => {
      console.log(`Señal recibida (${signal}). Cerrando servidor...`);
      try {
        await mongoose.connection.close();
        server.close(() => {
          console.log("Servidor cerrado correctamente");
          process.exit(0);
        });
      } catch (err) {
        console.error("Error al cerrar servidor:", err);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("unhandledRejection", (reason) => {
      console.error("Rechazo de promesa no manejado:", reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("Excepción no capturada:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  }
})();
