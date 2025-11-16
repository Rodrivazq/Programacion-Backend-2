import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import debugRoutes from "./routes/debug.routes.js";

dotenv.config();

const app = express();

const { CORS_ORIGIN, NODE_ENV } = process.env;

app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN ? CORS_ORIGIN.split(",").map((s) => s.trim()) : "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/protegido", protectedRoutes);
app.use("/api/carritos", cartRoutes);
app.use("/api", purchaseRoutes);
app.use("/api", ticketRoutes);
app.use("/api/debug", debugRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, _req, res, _next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({
    status: "error",
    message: err.message || "Error interno del servidor",
  });
});

export default app;
