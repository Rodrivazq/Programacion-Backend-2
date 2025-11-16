import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepository from "../repositories/userRepository.js";
import UserDto from "../dto/userDTO.js";

const users = new UserRepository();

/**
 * Controlador de autenticación
 * Rutas:
 *  - POST /api/auth/register
 *  - POST /api/auth/login
 */

// Registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Verificar si ya existe un usuario con ese email
    const existing = await users.getByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Hashear contraseña
    const rounds = parseInt(process.env.BCRYPT_ROUNDS ?? "10", 10);
    const hashed = await bcrypt.hash(password, rounds);

    // Crear usuario
    const created = await users.create({
      nombre,
      email,
      password: hashed,
      rol: rol || "usuario",
    });

    const dto = new UserDto(created);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: dto,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario por email
    const user = await users.getByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ message: "Falta JWT_SECRET en las variables de entorno" });
    }

    // Armamos el payload con el id del usuario
    const payload = {
      id: user._id.toString(),
      email: user.email,
      rol: user.rol,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1d" });
    const dto = new UserDto(user);

    return res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: dto,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
