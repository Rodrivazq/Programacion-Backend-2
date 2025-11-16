import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// Listar todos los usuarios (solo admin)
router.get("/", verifyToken, isAdmin, getAllUsers);

// Obtener usuario por ID
router.get("/:id", verifyToken, getUserById);

// Actualizar usuario
router.put("/:id", verifyToken, updateUser);

// Eliminar usuario (solo admin)
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;
