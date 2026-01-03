import SupportTicket from "../../models/SupportTicket.js";
import SupportMessage from "../../models/SupportMessage.js";

export const getAllTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tickets = await SupportTicket.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SupportTicket.countDocuments({});

    res.status(200).json({
      tickets,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTickets: total,
      hasNextPage: page * limit < total,
    });
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminReply = async (req, res) => {
  try {
    const { id: ticketId } = req.params;
    const { message } = req.body;
    const adminId = req.user.id;

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Mark ticket as 'in_progress' when platform replies
    if (ticket.status === "open") {
      ticket.status = "in_progress";
      await ticket.save();
    }

    const newMessage = await SupportMessage.create({
      ticketId,
      senderId: adminId,
      senderType: "platform",
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending admin reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
