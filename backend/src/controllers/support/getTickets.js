import SupportTicket from "../../models/SupportTicket.js";

const getTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tickets = await SupportTicket.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SupportTicket.countDocuments({ userId });

    res.status(200).json({
      tickets,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTickets: total,
      hasNextPage: page * limit < total,
    });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getTickets;
