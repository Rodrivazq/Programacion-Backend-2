import Ticket from "../models/ticket.model.js";

/**
 * DAO de Tickets.
 * Maneja las operaciones directas sobre la colección `tickets`.
 */
export default class TicketDao {
  /**
   * Crea un nuevo ticket de compra (soporta transacciones).
   * @param {{code:string, purchaser:string, items:Array, amount:number}} data
   * @param {{session?: import("mongoose").ClientSession}} [opts]
   * @returns {Promise<Ticket>}
   */
  async create(data, opts = {}) {
    try {
      const { session } = opts;
      // Se usa create con arreglo para que participe de la transacción
      const [doc] = await Ticket.create([data], { session });
      return doc;
    } catch (error) {
      console.error("Error al crear ticket:", error.message);
      throw new Error("Error al crear ticket");
    }
  }

  /**
   * Busca un ticket por su código único.
   * @param {string} code
   * @returns {Promise<Object|null>}
   */
  async findByCode(code) {
    try {
      return await Ticket.findOne({ code })
        .populate("purchaser")
        .populate("items.product")
        .lean();
    } catch (error) {
      console.error("Error al buscar ticket:", error.message);
      throw new Error("Error al buscar ticket");
    }
  }

  /**
   * Busca un ticket por su ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    try {
      return await Ticket.findById(id)
        .populate("purchaser")
        .populate("items.product")
        .lean();
    } catch (error) {
      console.error("Error al buscar ticket por ID:", error.message);
      throw new Error("Error al buscar ticket por ID");
    }
  }

  /**
   * Devuelve todos los tickets.
   * @returns {Promise<Array>}
   */
  async findAll() {
    try {
      return await Ticket.find({})
        .populate("purchaser")
        .populate("items.product")
        .lean();
    } catch (error) {
      console.error("Error al obtener tickets:", error.message);
      throw new Error("Error al obtener tickets");
    }
  }
}
