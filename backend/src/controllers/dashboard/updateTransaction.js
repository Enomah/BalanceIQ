import mongoose from "mongoose";
import Transaction from "../../models/Transactions.js";
import Expense from "../../models/Expenses.js";
import Income from "../../models/Incomes.js";
import User from "../../models/Users.js";
import {
  defaultExpenseCategories,
  defaultIncomeSources,
} from "../../constants/transaction.js";
import { checkBudgetThresholds } from "../../utils/budgetWatcher.js";

export const updateTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amount, category, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transaction = await Transaction.findOne({ _id: id, userId }).session(
      session
    );
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Transaction not found" });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Validation
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Revert old balance impact
    if (transaction.type === "expense") {
      user.accountBalance += transaction.amount;
    } else if (transaction.type === "income") {
      user.accountBalance -= transaction.amount;
    }

    // Apply new balance impact
    if (transaction.type === "expense") {
      if (user.accountBalance < parsedAmount) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "Insufficient balance for this update" });
      }
      user.accountBalance -= parsedAmount;
    } else if (transaction.type === "income") {
      user.accountBalance += parsedAmount;
    }

    await user.save({ session });

    // Update Transaction
    transaction.amount = parsedAmount;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    await transaction.save({ session });

    // Update specific models
    const updateData = {
      amount: parsedAmount,
      category: category || transaction.category,
      description: description || transaction.description,
    };

    if (transaction.type === "expense") {
      await Expense.findOneAndUpdate(
        { transactionId: transaction._id },
        updateData,
        { session }
      );
    } else if (transaction.type === "income") {
      await Income.findOneAndUpdate(
        { transactionId: transaction._id },
        updateData,
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Trigger Budget Watcher for Expenses
    let budgetAlert = null;
    if (transaction.type === "expense") {
      const oldAmount = transaction.amount;
      const oldCategory = transaction.category;
      const newAmount = parsedAmount;
      const newCategory = category || transaction.category;

      if (oldCategory === newCategory) {
        // Same category, adjust by difference
        const diff = newAmount - oldAmount;
        budgetAlert = await checkBudgetThresholds(
          userId,
          newCategory,
          diff,
          user
        );
      } else {
        // Category changed: Revert old, Apply new
        // 1. Revert old category spent (use -amount, won't trigger alerts)
        await checkBudgetThresholds(userId, oldCategory, -oldAmount, user);
        // 2. Apply new category spent (triggers potential alerts)
        budgetAlert = await checkBudgetThresholds(
          userId,
          newCategory,
          newAmount,
          user
        );
      }
    }

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        createdAt: transaction.createdAt,
      },
      budgetAlert,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating transaction:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
