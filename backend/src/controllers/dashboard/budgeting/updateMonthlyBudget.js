import mongoose from "mongoose";
import MonthlyBudget from "../../../models/MonthlyBudget.js";
import { defaultExpenseCategories } from "../../../constants/transaction.js";

export const updateMonthlyBudget = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user?.id;
    const budgetId = req.params.id;
    const { month, year, totalBudget, categories } = req.body;


    if (!month || !year || !totalBudget || !categories) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Missing required fields: month, year, totalBudget, categories",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid budget ID" });
    }

    if (month < 1 || month > 12) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: "Month must be between 1 and 12" 
      });
    }

    const currentYear = new Date().getFullYear();
    if (year < currentYear - 1 || year > currentYear + 5) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: "Year must be between last year and 5 years from now" 
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

    const existingBudget = await MonthlyBudget.findOne({
      _id: budgetId,
      userId,
    }).session(session);

    if (!existingBudget) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Budget not found" });
    }

    const duplicateBudget = await MonthlyBudget.findOne({
      userId,
      month,
      year,
      _id: { $ne: budgetId } 
    }).session(session);

    if (duplicateBudget) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        message: "Another budget already exists for this month and year",
      });
    }

    let totalAllocated = 0;
    const validCategories = [];

    for (const category of categories) {
      if (!category.key || category.allocated === undefined) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Invalid category: missing key or allocated amount`,
        });
      }

      const categoryExists = defaultExpenseCategories.includes(category.key);
      if (!categoryExists) {
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
          message: `Allocated amount cannot be negative for ${category.key}`,
        });
      }

      if (isNaN(category.allocated)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Invalid allocated amount for ${category.key}`,
        });
      }

      totalAllocated += category.allocated;

      const existingCategory = existingBudget.categories.find(
        (cat) => cat.key === category.key
      );

      validCategories.push({
        key: category.key,
        allocated: category.allocated,
        spent: category.spent !== undefined ? category.spent : (existingCategory?.spent || 0),
      });
    }

    if (Math.abs(totalAllocated - totalBudget) > 0.01) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Category allocations (${totalAllocated.toFixed(2)}) do not match total budget (${totalBudget})`,
      });
    }

    const newTotalSpent = validCategories.reduce((sum, cat) => sum + cat.spent, 0);

    const updatedBudget = await MonthlyBudget.findByIdAndUpdate(
      budgetId,
      {
        month,
        year,
        totalBudget,
        totalSpent: newTotalSpent,
        categories: validCategories,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!updatedBudget) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Budget not found after update" });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Budget updated successfully",
      budget: {
        id: updatedBudget._id,
        month: updatedBudget.month,
        year: updatedBudget.year,
        totalBudget: updatedBudget.totalBudget,
        totalSpent: updatedBudget.totalSpent,
        categories: updatedBudget.categories,
        createdAt: updatedBudget.createdAt,
        updatedAt: updatedBudget.updatedAt,
      },
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Error updating monthly budget:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid budget ID format",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Budget already exists for this month and year",
      });
    }

    res.status(500).json({
      message: "Server error while updating budget",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

function getMonthName(monthNumber) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNumber - 1];
}