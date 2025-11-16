import User from "../models/user.model.js";

/**
 * DAO de Usuarios.
 * Se encarga de las operaciones CRUD y búsquedas sobre la colección `users`.
 * Mantiene separada la lógica de acceso a datos de la lógica de negocio.
 */
export default class UserDao {
  /**
   * Obtener todos los usuarios registrados.
   * @returns {Promise<User[]>}
   */
  async findAll() {
    return User.find({});
  }

  /**
   * Buscar un usuario por ID.
   * @param {string} uid
   * @returns {Promise<User|null>}
   */
  async findById(uid) {
    return User.findById(uid);
  }

  /**
   * Buscar un usuario por email (usado en login y registro).
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    return User.findOne({ email });
  }

  /**
   * Crear un nuevo usuario.
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async create(data) {
    return User.create(data);
  }

  /**
   * Actualizar los datos de un usuario.
   * @param {string} uid
   * @param {Object} data
   * @returns {Promise<User|null>}
   */
  async update(uid, data) {
    return User.findByIdAndUpdate(uid, data, { new: true });
  }

  /**
   * Eliminar un usuario.
   * @param {string} uid
   * @returns {Promise<boolean>}
   */
  async delete(uid) {
    const doc = await User.findByIdAndDelete(uid);
    return !!doc;
  }
}
