import SupportMessage from "../../models/SupportMessage.js";
import SupportTicket from "../../models/SupportTicket.js";

const addMessage = async (req, res) => {
  try {
    const { id: ticketId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    const query =
      req.user.role === "admin" ? { _id: ticketId } : { _id: ticketId, userId };
    const ticket = await SupportTicket.findOne(query);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update ticket status back to open if it was closed/resolved/paused by user message
    if (["closed", "resolved", "paused"].includes(ticket.status)) {
      ticket.status = "open";
      await ticket.save();
    }

    const newMessage = await SupportMessage.create({
      ticketId,
      senderId: req.user.id,
      senderType: req.user.role === "admin" ? "platform" : "user",
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error adding support message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default addMessage;
