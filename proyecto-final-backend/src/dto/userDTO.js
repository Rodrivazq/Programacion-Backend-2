export default class UserDto {
  /**
   * @param {Object} [u={}] - Objeto usuario proveniente del modelo o de la base de datos.
   * Puede incluir `_id` (Mongoose) o `id` (tras toJSON()).
   */
  constructor(u = {}) {
    // ID del usuario (string o null)
    this.id = u._id?.toString?.() || u.id || null;

    // Nombre del usuario
    this.nombre = u.nombre || "";

    // Correo electrónico
    this.email = u.email || "";

    // Rol del usuario (usuario/admin)
    this.rol = u.rol || "usuario";
  }
}
