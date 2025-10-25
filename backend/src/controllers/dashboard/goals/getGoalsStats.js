import Goals from "../../../models/Goals.js";

export const getGoalsStats = async (req, res) => {
  const userId = req?.user?.id;

  try {
    const totalCount = await Goals.countDocuments({ userId: userId });

    const activeGoalsLength = (
      await Goals.find({ userId, status: "completed" })
    ).length;

    const totalTarget = await Goals.aggregate([
      {
        $group: { _id: null, targetAmount: { $sum: "$targetAmount" } },
      },
    ]);

    const totalSaved = await Goals.aggregate([
      {
        $group: { _id: null, currentAmount: { $sum: "$currentAmount" } },
      },
    ]);

    const stats = {
      totalGoals: totalCount,
      totalActive: activeGoalsLength,
      totalTarget: totalTarget[0]?.targetAmount,
      totalSaved: totalSaved[0]?.currentAmount,
    };

        res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
