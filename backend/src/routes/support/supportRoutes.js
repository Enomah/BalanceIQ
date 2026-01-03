import express from "express";
import createTicket from "../../controllers/support/createTicket.js";
import getTickets from "../../controllers/support/getTickets.js";
import updateTicketStatus from "../../controllers/support/updateTicketStatus.js";
import addMessage from "../../controllers/support/addMessage.js";
import getMessages from "../../controllers/support/getMessages.js";
import {
  getAllTickets,
  adminReply,
} from "../../controllers/support/adminControllers.js";
import { auth, isAdmin } from "../../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createTicket);
router.get("/", auth, getTickets);
router.put("/:id/status", auth, updateTicketStatus);
router.post("/:id/messages", auth, addMessage);
router.get("/:id/messages", auth, getMessages);

// Admin Routes
router.get("/admin/all", auth, isAdmin, getAllTickets);
router.post("/admin/:id/reply", auth, isAdmin, adminReply);

export default router;
