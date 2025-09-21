import User from "../../models/Users.js";
import Goal from "../../models/Goals.js";
import Income from "../../models/Incomes.js";
import Expense from "../../models/Expenses.js";
import {
  defaultExpenseCategories,
  defaultIncomeSources,
} from "../../constants/transaction.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 1) Load user profile (lean for performance)
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2) Compute month bounds (server local time)
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0,
      0,
      0,
      0
    );

    // Convert userId to ObjectId for aggregate queries
    const oid = userId;

    // 3) Aggregate monthly income
    const incomeAgg = await Income.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const income = incomeAgg[0]?.total || user.monthlyIncome || 0;

    // 4) Aggregate monthly expenses
    const expenseAgg = await Expense.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expenses = expenseAgg[0]?.total || 0;
    const balance = income - expenses;

    // 5) Income category breakdown (by source)
    const incomeCategoriesAgg = await Income.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      { $group: { _id: "$source", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 12 },
    ]);
    const incomeCategoryTotals = {};
    for (const c of incomeCategoriesAgg) {
      incomeCategoryTotals[c._id || "others"] = c.total;
    }
    for (const src of defaultIncomeSources) {
      if (!(src in incomeCategoryTotals)) {
        incomeCategoryTotals[src] = 0;
      }
    }

    // 6) Expense category breakdown
    const expenseCategoriesAgg = await Expense.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 12 },
    ]);
    const expenseCategoryTotals = {};
    for (const c of expenseCategoriesAgg) {
      expenseCategoryTotals[c._id || "others"] = c.total;
    }

    for (const cat of defaultExpenseCategories) {
      if (!(cat in expenseCategoryTotals)) {
        expenseCategoryTotals[cat] = 0;
      }
    }

    // 7) Recent transactions (combine Income and Expense, newest first)
    const recentIncome = await Income.find({
      userId: userId,
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    const recentExpenses = await Expense.find({
      userId: userId,
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const recentTransactions = [
      ...recentIncome.map((t) => ({
        id: t._id,
        type: "income",
        amount: t.amount,
        category: t.source,
        description: t.description || "",
        createdAt: t.createdAt,
      })),
      ...recentExpenses.map((t) => ({
        id: t._id,
        type: "expense",
        amount: t.amount,
        category: t.category,
        description: t.description || "",
        createdAt: t.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    // 8) Goals (all goals, compute progress)
    const allGoals = await Goal.find({ userId }).lean();
    const activeGoals = allGoals
      .filter((g) => {
        const s = (g.status || "").toLowerCase();
        return s === "active" || s === "in-progress" || s === "ongoing";
      })
      .map((g) => {
        const current = Number(g.currentAmount || 0);
        const target = Number(g.targetAmount || 0) || 0;
        const progress =
          target > 0
            ? Math.min(100, Math.round((current / target) * 10000) / 100)
            : 0;
        return {
          id: g._id,
          title: g.title || g.name || "Untitled goal",
          targetAmount: target,
          currentAmount: current,
          progress,
          status: g.status || "active",
        };
      });

    // 9) Stats
    const transactionsCountThisMonth =
      (await Income.countDocuments({
        userId: userId,
        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      })) +
      (await Expense.countDocuments({
        userId: userId,
        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      }));

    const totalGoals = allGoals.length;
    const completedGoals = allGoals.filter(
      (g) => (g.status || "").toLowerCase() === "completed"
    ).length;

    // 10) Package response
    return res.status(200).json({
      monthYear: "",
      monthlySummary: {
        income,
        expenses,
        balance,
        incomeCategoryTotals,
        expenseCategoryTotals,
        startOfMonth,
        endOfMonth: startOfNextMonth,
      },
      recentTransactions,
      activeGoals,
      stats: {
        transactionsCountThisMonth,
        totalGoals,
        completedGoals,
      },
    });
  } catch (error) {
    console.error("getDashboardData error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
