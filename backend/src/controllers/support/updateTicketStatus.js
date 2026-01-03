import SupportTicket from "../../models/SupportTicket.js";

const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const validStatuses = [
      "open",
      "in_progress",
      "resolved",
      "closed",
      "paused",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const query = req.user.role === "admin" ? { _id: id } : { _id: id, userId };
    const ticket = await SupportTicket.findOne(query);

    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or unauthorized" });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      message: `Ticket status updated to ${status}`,
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default updateTicketStatus;
