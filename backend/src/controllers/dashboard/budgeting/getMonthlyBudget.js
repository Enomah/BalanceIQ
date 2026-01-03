import mongoose from "mongoose";
import MonthlyBudget from "../../../models/MonthlyBudget.js";
import Expense from "../../../models/Expenses.js";

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

    const startDate = new Date(targetYear, targetMonth - 1, 1); 
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const expenseAgg = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { 
            $gte: startDate, 
            $lte: endDate 
          },
        },
      },
      {
        $group: {
          _id: "$category", 
          totalSpent: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    const expenseMap = new Map();
    expenseAgg.forEach((expense) => {
      expenseMap.set(expense._id, expense.totalSpent); // Use _id which is the category name
    });

    // console.log("Expense map:", expenseMap);

    let totalActualSpent = 0;

    // Update categories with actual spent amounts from expenses
    const updatedCategories = budget.categories.map((category) => {
      const actualSpent = expenseMap.get(category.key) || 0;
      totalActualSpent += actualSpent;

      return {
        id: category._id,
        key: category.key,
        allocated: category.allocated,
        spent: actualSpent, // Replace with actual spent from expenses
      };
    });


    // Update the budget with the new spent amounts
    const updatedBudget = await MonthlyBudget.findByIdAndUpdate(
      budget._id,
      {
        categories: updatedCategories,
        totalSpent: totalActualSpent,
      },
      { new: true, runValidators: true }
    );

    // Format the response
    const formattedBudget = {
      id: updatedBudget._id,
      categories: updatedCategories,
      month: updatedBudget.month,
      year: updatedBudget.year,
      totalBudget: updatedBudget.totalBudget,
      totalSpent: totalActualSpent,
      createdAt: updatedBudget.createdAt,
      updatedAt: updatedBudget.updatedAt,
      userId: updatedBudget.userId,
      expenseSummary: {
        totalExpenses: expenseAgg.reduce((sum, exp) => sum + exp.transactionCount, 0),
        categoriesWithExpenses: expenseAgg.length,
        period: {
          start: startDate,
          end: endDate,
        },
      },
    };

    res.status(200).json(formattedBudget);
  } catch (error) {
    console.error("❌ Error fetching monthly budget with expenses:", error);
    return res.status(500).json({
      message: "Server error while fetching budget",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};