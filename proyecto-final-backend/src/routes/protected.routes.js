import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// GET /api/protegido/perfil
// Devuelve los datos del usuario autenticado.
router.get("/perfil", verifyToken, (req, res) => {
  res.json({
    message: "Acceso permitido",
    user: req.user,
  });
});

export default router;