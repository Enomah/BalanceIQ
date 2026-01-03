import mongoose from "mongoose";
import { defaultExpenseCategories } from "../../constants/transaction.js";
import Expense from "../../models/Expenses.js";
import Transaction from "../../models/Transactions.js";
import User from "../../models/Users.js";
import RecurringTransaction from "../../models/RecurringTransaction.js";
import { checkBudgetThresholds } from "../../utils/budgetWatcher.js";

export const addExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, category, description, isRecurring, frequency, startDate } =
      req.body;
    const userId = req?.user?.id;

    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "Unauthorized" });
    }

    let errors = {};

    if (!amount || isNaN(amount) || amount <= 0) {
      errors.amount = "Amount must be a number greater than 0";
    }

    if (!category || !defaultExpenseCategories.includes(category)) {
      errors.category = "Invalid category";
    }

    if (Object.keys(errors).length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const parsedAmount = parseFloat(amount);

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.accountBalance || user.accountBalance < parsedAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient account balance" });
    }

    user.accountBalance -= parsedAmount;
    await user.save({ session });

    const transaction = await Transaction.create(
      [
        {
          userId,
          type: "expense",
          amount: parsedAmount,
          category,
          description: description ? description.trim().slice(0, 500) : "",
        },
      ],
      { session }
    );

    await Expense.create(
      [
        {
          userId,
          amount: parsedAmount,
          category,
          description: description ? description.trim().slice(0, 500) : "",
          transactionId: transaction[0]._id,
        },
      ],
      { session }
    );

    // Handle Recurring Logic
    if (isRecurring) {
      const start = startDate ? new Date(startDate) : new Date();
      const next = new Date(start);

      // Calculate next occurrence
      if (frequency === "daily") next.setDate(next.getDate() + 1);
      else if (frequency === "weekly") next.setDate(next.getDate() + 7);
      else if (frequency === "monthly") next.setMonth(next.getMonth() + 1);
      else if (frequency === "yearly") next.setFullYear(next.getFullYear() + 1);

      await RecurringTransaction.create(
        [
          {
            userId,
            type: "expense",
            amount: parsedAmount,
            category,
            description,
            frequency,
            startDate: start,
            nextDate: next,
            lastProcessed: start,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Trigger Budget Watcher (Post-Check)
    // We do this after commit so failure in watcher doesn't roll back the transaction
    const budgetAlert = await checkBudgetThresholds(
      userId,
      category,
      parsedAmount,
      user
    );

    return res.status(201).json({
      message: "Expense added successfully",
      expense: {
        id: transaction[0]._id,
        userId: transaction[0].userId,
        amount: transaction[0].amount,
        category: transaction[0].category,
        description: transaction[0].description,
        createdAt: transaction[0].createdAt,
      },
      budgetAlert, // Include any triggered alerts
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating expense:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
