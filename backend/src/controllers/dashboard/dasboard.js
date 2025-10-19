import mongoose from "mongoose";
import User from "../../models/Users.js";
import Goal from "../../models/Goals.js";
import Income from "../../models/Incomes.js";
import Expense from "../../models/Expenses.js";
import Transaction from "../../models/Transactions.js";
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

    // console.log(MonthlySummary)

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
    const oid = new mongoose.Types.ObjectId(userId);

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
    const income =  incomeAgg[0]?.total || 0;

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
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 12 },
    ]);

    // console.log(incomeCategoriesAgg)

    const incomeCategoryTotals = {};
    for (const c of incomeCategoriesAgg) {
      incomeCategoryTotals[c._id || "others"] = c.total;
    }
    for (const src of defaultIncomeSources) {
      if (!(src in incomeCategoryTotals)) {
        incomeCategoryTotals[src] = 0;
      }
    }

    // console.log(defaultIncomeSources)

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
    // console.log(expenseCategoriesAgg)
    const expenseCategoryTotals = {};
    for (const c of expenseCategoriesAgg) {
      expenseCategoryTotals[c._id || "others"] = c.total;
    }
    for (const cat of defaultExpenseCategories) {
      if (!(cat in expenseCategoryTotals)) {
        expenseCategoryTotals[cat] = 0;
      }
    }

    // 7) Fetch all monthly income records
    const monthlyIncomes = await Income.find({
      userId: oid,
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    })
      .sort({ createdAt: -1 })
      .lean();

    // 8) Fetch all monthly expense records
    const monthlyExpenses = await Expense.find({
      userId: oid,
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    })
      .sort({ createdAt: -1 })
      .lean();

    // 9) Recent transactions from Transaction model (most recent 5)
    const recentTransactions = await Transaction.find({
      userId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

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

    // 11) Stats
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

    // 12) Package response
    return res.status(200).json({
      monthlySummary: {
        income,
        expenses,
        balance: user.accountBalance,
        incomeCategoryTotals,
        expenseCategoryTotals,
        startOfMonth,
        endOfMonth: startOfNextMonth,
      },
      monthlyIncomes,
      monthlyExpenses,
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
