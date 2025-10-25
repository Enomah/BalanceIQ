import Goals from "../../../models/Goals.js";

export const getGoals = async (req, res) => {
  const userId = req?.user?.id;
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalCount = await Goals.countDocuments({ userId, status: "active" });

    const goals = await Goals.find({ userId: userId, status: "active" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const allGoals = goals?.map((g) => {
      return {
        id: g._id,
        title: g.title || g.name || "Untitled goal",
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        progress: g.progress,
        status: g.status || "active",
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
      req.path
    }`;

    const response = {
      count: totalCount,
      next:
        page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      currentPage: page,
      totalPages,
      pageSize: limit,
      content: allGoals,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
