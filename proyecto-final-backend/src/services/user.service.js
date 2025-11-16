import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/userRepository.js";

/**
 * Servicio de usuarios.
 *
 * Capa de negocio para:
 *  - registro con contraseña hasheada
 *  - login con emisión de JWT
 *  - operaciones de lectura/escritura a través del repositorio
 */

const userRepository = new UserRepository();

/**
 * Registra un nuevo usuario.
 *
 * @async
 * @param {Object} data
 * @param {string} data.nombre
 * @param {string} data.email
 * @param {string} data.password  Contraseña en texto plano (se hashea aquí)
 * @returns {Promise<{message: string}>}
 * @throws {Error} si el usuario ya existe o falla el proceso
 */
export const registerUserService = async ({ nombre, email, password }) => {
  const existing = await userRepository.getByEmail(email);
  if (existing) throw new Error("El usuario ya existe");

  const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(password, rounds);

  await userRepository.create({ nombre, email, password: hashedPassword });

  return { message: "Usuario registrado correctamente" };
};

/**
 * Login de usuario.
 *
 * @async
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<{token: string, user: {id: string, nombre: string, email: string, rol: string}}>}
 * @throws {Error} si las credenciales son inválidas o falta la config JWT
 */
export const loginUserService = async ({ email, password }) => {
  const user = await userRepository.getByEmail(email);
  if (!user) throw new Error("Credenciales inválidas");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Credenciales inválidas");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta configuración del servidor: JWT_SECRET");

  const token = jwt.sign(
    { id: user._id?.toString(), email: user.email, rol: user.rol },
    secret,
    { expiresIn: "2h" }
  );

  return {
    token,
    user: {
      id: user._id?.toString(),
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  };
};

/**
 * Devuelve todos los usuarios (sin contraseña).
 *
 * @async
 * @returns {Promise<UserDto[]>}
 */
export const getAllUsersService = async () => {
  return userRepository.getAll();
};

/**
 * Obtiene un usuario por ID.
 *
 * @async
 * @param {string} id
 * @returns {Promise<UserDto>}
 * @throws {Error} si no existe
 */
export const getUserByIdService = async (id) => {
  const user = await userRepository.getById(id);
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

/**
 * Actualiza un usuario.
 *
 * @async
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<UserDto>}
 * @throws {Error} si no existe
 */
export const updateUserService = async (id, data) => {
  const updated = await userRepository.update(id, data);
  if (!updated) throw new Error("Usuario no encontrado");
  return updated;
};

/**
 * Elimina un usuario.
 *
 * @async
 * @param {string} id
 * @returns {Promise<boolean>}
 * @throws {Error} si no existe
 */
export const deleteUserService = async (id) => {
  const deleted = await userRepository.delete(id);
  if (!deleted) throw new Error("Usuario no encontrado");
  return deleted;
};
