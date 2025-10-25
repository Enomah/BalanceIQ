import mongoose from "mongoose";
import User from "../../models/Users.js";
import Income from "../../models/Incomes.js";
import Expense from "../../models/Expenses.js";
import Transaction from "../../models/Transactions.js";

export const getSummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { month, year } = req.query;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const currentDate = new Date();

    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    if (
      targetMonth === currentDate.getMonth() + 1 &&
      targetYear === currentDate.getFullYear()
    ) {
      return res.status(200).json({message: "This Month's Summary is not ready, Wait till the month is over!"})
    }

    if (targetMonth < 1 || targetMonth > 12) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const start = new Date(targetYear, targetMonth - 1, 1);
    const end = new Date(targetYear, targetMonth, 1);

    const oid = new mongoose.Types.ObjectId(userId);

    const [incomeAgg, expenseAgg] = await Promise.all([
      Income.aggregate([
        {
          $match: {
            userId: oid,
            createdAt: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      Expense.aggregate([
        {
          $match: {
            userId: oid,
            createdAt: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    const dailyIncome = await Income.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyExpenses = await Expense.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const incomeByCategory = await Income.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          average: { $avg: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          average: { $avg: "$amount" },
          largest: { $max: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const largestIncome = await Income.find({
      userId: userId,
      createdAt: { $gte: start, $lt: end },
    })
      .sort({ amount: -1 })
      .limit(3)
      .lean();

    const largestExpenses = await Expense.find({
      userId: userId,
      createdAt: { $gte: start, $lt: end },
    })
      .sort({ amount: -1 })
      .limit(3)
      .lean();

    const weeklySummary = await Expense.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $week: "$createdAt" },
          totalExpenses: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "incomes",
          let: { week: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", oid] },
                    { $gte: ["$createdAt", start] },
                    { $lt: ["$createdAt", end] },
                    { $eq: [{ $week: "$createdAt" }, "$$week"] },
                  ],
                },
              },
            },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
          ],
          as: "incomeData",
        },
      },
      {
        $addFields: {
          totalIncome: { $arrayElemAt: ["$incomeData.totalIncome", 0] } || 0,
        },
      },
      {
        $project: {
          week: "$_id",
          totalExpenses: 1,
          totalIncome: 1,
          transactionCount: 1,
          netSavings: { $subtract: ["$totalIncome", "$totalExpenses"] },
        },
      },
      { $sort: { week: 1 } },
    ]);

    const prevMonthStart = new Date(targetYear, targetMonth - 2, 1);
    const prevMonthEnd = new Date(targetYear, targetMonth - 1, 1);

    const [prevMonthIncome, prevMonthExpenses] = await Promise.all([
      Income.aggregate([
        {
          $match: {
            userId: oid,
            createdAt: { $gte: prevMonthStart, $lt: prevMonthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        {
          $match: {
            userId: oid,
            createdAt: { $gte: prevMonthStart, $lt: prevMonthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const prevMonthIncomeTotal = prevMonthIncome[0]?.total || 0;
    const prevMonthExpensesTotal = prevMonthExpenses[0]?.total || 0;

    const incomeTrend =
      prevMonthIncomeTotal > 0
        ? ((totalIncome - prevMonthIncomeTotal) / prevMonthIncomeTotal) * 100
        : 0;

    const expensesTrend =
      prevMonthExpensesTotal > 0
        ? ((totalExpenses - prevMonthExpensesTotal) / prevMonthExpensesTotal) *
          100
        : 0;

    const transactionStats = await Transaction.aggregate([
      {
        $match: {
          userId: oid,
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $facet: {
          byType: [
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
              },
            },
          ],
          byDayOfWeek: [
            {
              $group: {
                _id: { $dayOfWeek: "$createdAt" },
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
              },
            },
          ],
          busiestDay: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 1 },
          ],
        },
      },
    ]);

    const chartData = {
      daily: {
        days: Array.from(
          { length: new Date(targetYear, targetMonth, 0).getDate() },
          (_, i) => i + 1
        ),
        income: dailyIncome.map((item) => ({
          day: item._id,
          amount: item.total,
        })),
        expenses: dailyExpenses.map((item) => ({
          day: item._id,
          amount: item.total,
        })),
      },
      categories: {
        income: incomeByCategory.map((cat) => ({
          name: cat._id,
          value: cat.total,
          count: cat.count,
        })),
        expenses: expensesByCategory.map((cat) => ({
          name: cat._id,
          value: cat.total,
          count: cat.count,
          average: cat.average,
        })),
      },
      weekly: weeklySummary,
    };

    const summary = {
      period: {
        month: targetMonth,
        year: targetYear,
        monthName: start.toLocaleString("default", { month: "long" }),
        start: start,
        end: end,
      },
      overview: {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate: Math.round(savingsRate * 100) / 100,
        transactionCount: {
          income: dailyIncome.reduce((sum, day) => sum + day.count, 0),
          expenses: dailyExpenses.reduce((sum, day) => sum + day.count, 0),
          total:
            dailyIncome.reduce((sum, day) => sum + day.count, 0) +
            dailyExpenses.reduce((sum, day) => sum + day.count, 0),
        },
      },
      trends: {
        income: {
          current: totalIncome,
          previous: prevMonthIncomeTotal,
          trend: Math.round(incomeTrend * 100) / 100,
          direction: incomeTrend >= 0 ? "up" : "down",
        },
        expenses: {
          current: totalExpenses,
          previous: prevMonthExpensesTotal,
          trend: Math.round(expensesTrend * 100) / 100,
          direction: expensesTrend >= 0 ? "up" : "down",
        },
      },
      highlights: {
        largestIncome: largestIncome.map((tx) => ({
          id: tx._id,
          amount: tx.amount,
          category: tx.category,
          description: tx.description,
          type: "income",
          createdAt: tx.createdAt,
        })),
        largestExpenses: largestExpenses.map((tx) => ({
          id: tx._id,
          amount: tx.amount,
          category: tx.category,
          description: tx.description,
          type: "expense",
          createdAt: tx.createdAt,
        })),
        topCategory: expensesByCategory[0]
          ? {
              name: expensesByCategory[0]._id,
              amount: expensesByCategory[0].total,
            }
          : null,
      },
      charts: chartData,
      weeklyBreakdown: weeklySummary,
      categoryAnalysis: {
        income: incomeByCategory,
        expenses: expensesByCategory,
      },
      transactionPatterns: transactionStats[0],
    };

    return res.status(200).json({
      success: true,
      message: "Monthly summary retrieved successfully",
      summary,
    });
  } catch (error) {
    console.error("getSummary error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: "Server error",
    });
  }
};
