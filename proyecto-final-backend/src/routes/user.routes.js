import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Solo admin puede ver todos los usuarios
router.get('/', verifyToken, isAdmin, getAllUsers);

// Cualquier usuario logueado puede ver su perfil
router.get('/:id', verifyToken, getUserById);

// Cualquier usuario puede actualizar su propio perfil
router.put('/:id', verifyToken, updateUser);

// Solo admin puede eliminar usuarios
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
