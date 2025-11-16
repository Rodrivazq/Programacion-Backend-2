import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

// Rutas de autenticación.
// Manejan registro de usuarios y login mediante JWT.
// Prefijo esperado: /api/auth

// POST /api/auth/register
// Registro de usuario
router.post("/register", register);

// POST /api/auth/login
// Inicio de sesión
router.post("/login", login);

export default router;
