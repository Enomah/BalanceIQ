import mongoose from "mongoose";
import { defaultExpenseCategories } from "../../constants/transaction.js";
import Expense from "../../models/Expenses.js";
import Transaction from "../../models/Transactions.js";
import User from "../../models/Users.js";

export const addExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, category, description, date } = req.body;
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

    const expense = await Expense.create(
      [
        {
          userId,
          amount: parsedAmount,
          category,
          description: description ? description.trim().slice(0, 500) : "",
        },
      ],
      { session }
    );

    await Transaction.create(
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

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Expense added successfully",
      expense: {
        id: expense[0]._id,
        userId: expense[0].userId,
        amount: expense[0].amount,
        category: expense[0].category,
        description: expense[0].description,
        date: expense[0].date,
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
