import mongoose from "mongoose";
import TicketRepository from "../repositories/ticketRepository.js";

const repo = new TicketRepository();

/**
 * Listar todos los tickets
 * GET /api/tickets
 */
export const getTickets = async (req, res) => {
  try {
    const tickets = await repo.getAll();

    return res.json({
      status: "success",
      count: tickets.length,
      tickets,
    });
  } catch (err) {
    console.error("Error al listar tickets:", err);
    return res.status(500).json({
      status: "error",
      message: "No se pudieron obtener los tickets",
    });
  }
};

/**
 * Obtener un ticket por su ID
 * GET /api/tickets/:tid
 */
export const getTicketById = async (req, res) => {
  try {
    const { tid } = req.params;

    // Validación de ID
    if (!tid || !mongoose.Types.ObjectId.isValid(tid)) {
      return res.status(400).json({
        status: "error",
        message: "El ID del ticket no es válido",
      });
    }

    const ticket = await repo.getById(tid);
    
    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "Ticket no encontrado",
      });
    }

    return res.json({
      status: "success",
      ticket,
    });
  } catch (err) {
    console.error("Error al obtener ticket:", err);
    return res.status(500).json({
      status: "error",
      message: "No se pudo obtener el ticket",
    });
  }
};

/**
 * Obtener un ticket por código
 * GET /api/tickets/code/:code
 */
export const getTicketByCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        status: "error",
        message: "El código del ticket es obligatorio",
      });
    }

    const ticket = await repo.getByCode(code);

    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "Ticket no encontrado",
      });
    }

    return res.json({
      status: "success",
      ticket,
    });
  } catch (err) {
    console.error("Error al buscar ticket por código:", err);
    return res.status(500).json({
      status: "error",
      message: "No se pudo obtener el ticket por código",
    });
  }
};
