import SupportMessage from "../../models/SupportMessage.js";
import SupportTicket from "../../models/SupportTicket.js";

const getMessages = async (req, res) => {
  try {
    const { id: ticketId } = req.params;
    const userId = req.user.id;
    const query =
      req.user.role === "admin" ? { _id: ticketId } : { _id: ticketId, userId };
    const ticket = await SupportTicket.findOne(query);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const messages = await SupportMessage.find({ ticketId }).sort({
      createdAt: 1,
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching support messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getMessages;
