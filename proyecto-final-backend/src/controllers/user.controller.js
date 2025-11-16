import mongoose from "mongoose";
import UserRepository from "../repositories/userRepository.js";

const users = new UserRepository();

/**
 * Controlador de Usuarios.
 * Maneja las operaciones CRUD y delega la lógica en el repositorio.
 */

// Obtener todos los usuarios
export const getAllUsers = async (_req, res) => {
  try {
    const list = await users.getAll();
    return res.json(list);
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    return res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const dto = await users.getById(id);
    if (!dto) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(dto);
  } catch (error) {
    console.error("Error al obtener usuario:", error.message);
    return res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const dto = await users.update(id, { nombre, email });
    if (!dto) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      message: "Usuario actualizado correctamente",
      usuario: dto,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error.message);
    return res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const ok = await users.delete(id);
    if (!ok) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    return res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};
