import mongoose from "mongoose";
import { defaultIncomeSources } from "../../constants/transaction.js";
import User from "../../models/Users.js";
import Income from "../../models/Incomes.js";
import Transactions from "../../models/Transactions.js";

export const addIncome = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, category, description, date } = req.body;
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

    const income = await Income.create(
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

    await Transactions.create(
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

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Income added successfully",
      income: {
        id: income[0]._id,
        userId: income[0].userId,
        amount: income[0].amount,
        category: income[0].category,
        description: income[0].description,
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
