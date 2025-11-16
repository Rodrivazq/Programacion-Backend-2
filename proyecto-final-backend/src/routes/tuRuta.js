import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// GET /api/privado
router.get("/privado", verifyToken, (req, res) => {
  res.json({
    message: "Accediste a una ruta protegida",
    user: req.user,
  });
});

export default router;
