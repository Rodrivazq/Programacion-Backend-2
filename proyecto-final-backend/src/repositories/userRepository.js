import UserDao from "../dao/userDAO.js";
import UserDto from "../dto/userDTO.js";

// Repositorio de usuarios.
// Separa la lógica de negocio del acceso a datos y devuelve siempre DTOs.
export default class UserRepository {
  constructor() {
    this.dao = new UserDao();
  }

  // Devuelve todos los usuarios en formato DTO
  async getAll() {
    const users = await this.dao.findAll();
    return users.map((u) => new UserDto(u));
  }

  // Busca un usuario por ID
  async getById(uid) {
    const u = await this.dao.findById(uid);
    return u ? new UserDto(u) : null;
  }

  // Busca un usuario por email (para login; se devuelve el documento completo)
  async getByEmail(email) {
    return this.dao.findByEmail(email);
  }

  // Crea un usuario y devuelve el DTO
  async create(data) {
    const user = await this.dao.create(data);
    return new UserDto(user);
  }

  // Actualiza datos del usuario
  async update(uid, data) {
    const user = await this.dao.update(uid, data);
    return user ? new UserDto(user) : null;
  }

  // Elimina un usuario
  async delete(uid) {
    return this.dao.delete(uid);
  }
}
