import RecurringTransaction from "../models/RecurringTransaction.js";
import Transaction from "../models/Transactions.js";
import Income from "../models/Incomes.js";
import Expense from "../models/Expenses.js";
import User from "../models/Users.js";
import { checkBudgetThresholds } from "./budgetWatcher.js";

/**
 * Calculates the next occurrence date based on frequency
 */
const calculateNextDate = (currentDate, frequency) => {
  const next = new Date(currentDate);
  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setDate(next.getMonth() + 1);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
};

/**
 * Processes all due recurring transactions
 */
export const processRecurringTransactions = async () => {
  const now = new Date();

  // Find all active recurrings that are due
  const dueTransactions = await RecurringTransaction.find({
    status: "active",
    nextDate: { $lte: now },
  }).populate("userId");

  console.log(
    `[RecurringProcessor] Found ${dueTransactions.length} due transactions.`
  );

  for (const rec of dueTransactions) {
    try {
      const user = rec.userId;
      if (!user) continue;

      // 1. Create Transaction record
      const transaction = new Transaction({
        userId: user._id,
        type: rec.type,
        amount: rec.amount,
        category: rec.category,
        description: `[Recurring] ${rec.description}`,
      });
      await transaction.save();

      // 2. Create Type-specific record
      if (rec.type === "income") {
        await Income.create({
          userId: user._id,
          transactionId: transaction._id,
          amount: rec.amount,
          category: rec.category,
          source: rec.description || "Recurring Income",
        });
        user.accountBalance += rec.amount;
      } else {
        await Expense.create({
          userId: user._id,
          transactionId: transaction._id,
          amount: rec.amount,
          category: rec.category,
          merchant: rec.description || "Recurring Expense",
        });
        user.accountBalance -= rec.amount;

        // Update Budget Watcher for expenses
        await checkBudgetThresholds(user._id, rec.category, rec.amount, user);
      }

      await user.save();

      // 3. Update Recurring record
      rec.lastProcessed = now;
      rec.nextDate = calculateNextDate(rec.nextDate, rec.frequency);
      await rec.save();

      console.log(
        `[RecurringProcessor] Processed ${rec.type} for user ${user.email}: ${rec.category} - ${rec.amount}`
      );
    } catch (error) {
      console.error(
        `[RecurringProcessor] Error processing ID ${rec._id}:`,
        error
      );
    }
  }
};
