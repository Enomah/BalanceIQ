import mongoose from "mongoose";
import MonthlyBudget from "../../../models/MonthlyBudget.js";
import { defaultExpenseCategories } from "../../../constants/transaction.js";

export const createMonthlyBudget = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req?.user?.id;
    const { month, year, totalBudget, categories } = req.body;

    if (!month || !year || !totalBudget || !categories) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message:
          "Missing required fields: month, year, totalBudget, categories",
      });
    }

    const budget = await MonthlyBudget.findByUserAndDate(userId, month, year);

    if (budget) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "You already have a budget for this month",
      });
    }

    if (totalBudget <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Total budget must be greater than 0",
      });
    }
    if (!Array.isArray(categories) || categories.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Categories must be a non-empty array",
      });
    }

    let totalAllocated = 0;
    const validCategories = [];

    for (const category of categories) {
      if (!category.key || category.allocated === undefined) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Invalid category: missing key or allocated amount for ${category.key}`,
        });
      }

      const categoryDetails = defaultExpenseCategories.find(
        (cat) => cat === category.key
      );
      if (!categoryDetails) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Invalid category key: ${category.key}`,
        });
      }

      if (category.allocated < 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Allocated amount cannot be negative for ${categoryDetails.label}`,
        });
      }

      totalAllocated += category.allocated;

      validCategories.push({
        key: category.key,
        allocated: category.allocated,
        spent: category.spent || 0,
      });
    }

    if (Math.abs(totalAllocated - totalBudget) > 0.01) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Category allocations (${totalAllocated}) do not match total budget (${totalBudget})`,
      });
    }

    const monthlyBudget = new MonthlyBudget({
      userId,
      month,
      year,
      totalBudget,
      totalSpent: 0,
      categories: validCategories,
    });

    const savedBudget = await monthlyBudget.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log(
      `✅ Budget created successfully for user ${userId}, ${getMonthName(
        month
      )} ${year}`
    );

    res.status(201).json({
      message: "Budget created successfully",
      budget: {
        id: savedBudget._id,
        month: savedBudget.month,
        year: savedBudget.year,
        totalBudget: savedBudget.totalBudget,
        totalSpent: savedBudget.totalSpent,
        categories: savedBudget.categories,
        createdAt: savedBudget.createdAt,
        updatedAt: savedBudget.updatedAt,
      },
    });

    res.status(400).json({ message: "connected" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Error creating monthly budget:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Budget already exists for this month and year",
      });
    }

    res.status(500).json({
      message: "Server error while creating budget",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1];
}
