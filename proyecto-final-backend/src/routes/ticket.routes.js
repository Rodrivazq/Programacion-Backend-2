import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getTickets,
  getTicketById,
  getTicketByCode,
} from "../controllers/ticket.controller.js";

const router = Router();

// GET /api/tickets
router.get("/tickets", authMiddleware, getTickets);

// GET /api/tickets/:tid
router.get("/tickets/:tid", authMiddleware, getTicketById);

// GET /api/tickets/code/:code
router.get("/tickets/code/:code", authMiddleware, getTicketByCode);

export default router;
