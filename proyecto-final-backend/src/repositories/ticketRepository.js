import TicketDao from "../dao/ticketDAO.js";
import TicketDto from "../dto/ticketDTO.js";

export default class TicketRepository {
  constructor() {
    this.dao = new TicketDao();
  }

  // Crea un ticket (compatible con transacciones)
  async create(data, opts = {}) {
    const doc = await this.dao.create(data, opts);
    if (!doc) throw new Error("No se pudo crear el ticket");
    return new TicketDto(doc);
  }

  // Busca un ticket por código
  async getByCode(code) {
    const doc = await this.dao.findByCode(code);
    return doc ? new TicketDto(doc) : null;
  }

  // Busca un ticket por ID
  async getById(id) {
    const doc = await this.dao.findById(id);
    return doc ? new TicketDto(doc) : null;
  }

  // Lista todos los tickets existentes
  async getAll() {
    const list = await this.dao.findAll();
    return Array.isArray(list) ? list.map((doc) => new TicketDto(doc)) : [];
  }
}
