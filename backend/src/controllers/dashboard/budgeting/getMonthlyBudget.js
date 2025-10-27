import MonthlyBudget from "../../../models/MonthlyBudget.js";

export const getMonthlyBudget = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { month, year } = req.query;

    const currentDate = new Date();

    const targetMonth = !isNaN(month)
      ? parseInt(month)
      : currentDate.getMonth() + 1;

    const targetYear = year > 0 ? parseInt(year) : currentDate.getFullYear();

    const budget = await MonthlyBudget.findByUserAndDate(
      userId,
      targetMonth,
      targetYear
    );

    if (!budget) {
      return res
        .status(404)
        .json({ message: "Budget not found for this period" });
    }

    const formattedCategories = budget.categories.map(category => ({
      id: category._id,
      key: category.key,
      allocated: category.allocated,
      spent: category.spent
    }))

    const formttedBudget = {
      id: budget._id,
      categories: formattedCategories,
      month: budget.month,
      year: budget.year,
      totalBudget: budget.totalBudget,
      totalSpent: budget.totalSpent,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      userId: budget.userId,
    };

    res.status(200).json(formttedBudget);
  } catch (error) {
    // console.error("Error funding goal:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
