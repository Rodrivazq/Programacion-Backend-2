import { Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// GET /api/debug/ping
// Verifica que authMiddleware funcione correctamente.
router.get("/ping", authMiddleware, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// GET /api/debug/decode
// Decodifica el token sin verificar firma (solo para debug).
router.get("/decode", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  res.json({
    hasToken: Boolean(token),
    decoded: token ? jwt.decode(token) : null
  });
});

export default router;
