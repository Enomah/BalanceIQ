import RecurringTransaction from "../../models/RecurringTransaction.js";
import Transaction from "../../models/Transactions.js";
import Income from "../../models/Incomes.js";
import Expense from "../../models/Expenses.js";
import User from "../../models/Users.js";
import { checkBudgetThresholds } from "../../utils/budgetWatcher.js";

/**
 * Creates a new recurring transaction
 */
export const createRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, amount, category, description, frequency, startDate } =
      req.body;

    if (!type || !amount || !category || !frequency) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const start = startDate ? new Date(startDate) : new Date();

    const recurring = new RecurringTransaction({
      userId,
      type,
      amount,
      category,
      description,
      frequency,
      startDate: start,
      nextDate: start, // First run is on start date
    });

    await recurring.save();
    res.status(201).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetches all recurring transactions for a user
 */
export const getRecurringTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const recurrings = await RecurringTransaction.find({ userId }).sort({
      nextDate: 1,
    });
    res.status(200).json(recurrings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Toggles or updates a recurring transaction status
 */
export const updateRecurringStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const recurring = await RecurringTransaction.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { status },
      { new: true }
    );

    if (!recurring) return res.status(404).json({ message: "Not found" });
    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a recurring transaction
 */
export const deleteRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const recurring = await RecurringTransaction.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!recurring) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
