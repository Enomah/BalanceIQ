import mongoose from "mongoose";
import Transaction from "../../models/Transactions.js";
import Expense from "../../models/Expenses.js";
import Income from "../../models/Incomes.js";
import User from "../../models/Users.js";
import { checkBudgetThresholds } from "../../utils/budgetWatcher.js";

export const deleteTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
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

    // Revert the account balance
    if (transaction.type === "expense") {
      user.accountBalance += transaction.amount;
    } else if (transaction.type === "income") {
      user.accountBalance -= transaction.amount;
    }
    // Note: 'savings' logic might depend on how it's implemented,
    // but usually savings are just transfers. For now handling income/expense.

    await user.save({ session });

    // Delete from specific models (Income/Expense)
    // Try finding by linked transactionId first
    if (transaction.type === "expense") {
      await Expense.deleteOne({ transactionId: transaction._id }).session(
        session
      );
    } else if (transaction.type === "income") {
      await Income.deleteOne({ transactionId: transaction._id }).session(
        session
      );
    }

    // Delete the transaction itself
    await Transaction.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    // Trigger Budget Watcher for Expense deletions
    if (transaction.type === "expense") {
      // Use negative amount to decrement spent. Won't trigger alerts as thresholds aren't crossed upwards.
      await checkBudgetThresholds(
        userId,
        transaction.category,
        -transaction.amount,
        user
      );
    }

    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting transaction:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
