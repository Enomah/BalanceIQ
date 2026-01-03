import User from "../../models/Users.js";
import Transaction from "../../models/Transactions.js";
import Goal from "../../models/Goals.js";
import MonthlyBudget from "../../models/MonthlyBudget.js";
import Expense from "../../models/Expenses.js";
import Income from "../../models/Incomes.js";

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await Promise.all([
      Transaction.deleteMany({ userId }),
      Goal.deleteMany({ userId }),
      MonthlyBudget.deleteMany({ userId }),
      Expense.deleteMany({ userId }),
      Income.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    res
      .status(200)
      .json({
        message: "Account deleted successfully. We're sorry to see you go.",
      });
  } catch (error) {
    console.error("Delete account error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete account", error: error.message });
  }
};
