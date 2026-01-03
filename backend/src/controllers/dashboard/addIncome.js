import mongoose from "mongoose";
import { defaultIncomeSources } from "../../constants/transaction.js";
import User from "../../models/Users.js";
import Income from "../../models/Incomes.js";
import Transactions from "../../models/Transactions.js";
import RecurringTransaction from "../../models/RecurringTransaction.js";

export const addIncome = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, category, description, isRecurring, frequency, startDate } =
      req.body;
    const userId = req?.user?.id;

    let errors = {};

    if (!amount || isNaN(amount) || amount <= 0) {
      errors.amount = "Amount must be a number greater than 0";
    }

    if (!category || !defaultIncomeSources.includes(category)) {
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
      return res.status(400).json({ message: "User not found" });
    }

    user.accountBalance += parsedAmount;
    await user.save({ session });

    const transaction = await Transactions.create(
      [
        {
          userId,
          type: "income",
          amount: parsedAmount,
          category,
          description: description ? description.trim().slice(0, 500) : "",
        },
      ],
      { session }
    );

    await Income.create(
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
            type: "income",
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

    return res.status(201).json({
      message: "Income added successfully",
      income: {
        id: transaction[0]._id,
        userId: transaction[0].userId,
        amount: transaction[0].amount,
        category: transaction[0].category,
        description: transaction[0].description,
        createdAt: transaction[0].createdAt,
      },
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
