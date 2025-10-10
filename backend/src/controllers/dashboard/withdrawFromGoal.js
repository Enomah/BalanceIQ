import mongoose from "mongoose";
import User from "../../models/Users.js";
import Goal from "../../models/Goals.js";
import Transaction from "../../models/Transactions.js";

export const withdrawalFromGoal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, isFullWithdrawal = false } = req.body;
    const goalId = req.params.id;
    const userId = req.user?.id;

    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Amount must be a number greater than 0" });
    }

    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid goal ID" });
    }

    const user = await User.findById(userId).session(session);
    const goal = await Goal.findById(goalId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    if (!goal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.userId.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "Access denied. This goal does not belong to you.",
      });
    }

    const withdrawalAmount = isFullWithdrawal
      ? goal.currentAmount
      : parsedAmount;

    if (goal.currentAmount < withdrawalAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Insufficient goal balance. Available: ${
          user.currency || "USD"
        }${goal.currentAmount}`,
      });
    }

    const newGoalAmount = goal.currentAmount - withdrawalAmount;
    const newUserBalance = user.accountBalance + withdrawalAmount;
    const progressPercentage =
      goal.targetAmount > 0 ? (newGoalAmount / goal.targetAmount) * 100 : 0;

    user.accountBalance = newUserBalance;
    goal.currentAmount = newGoalAmount;
    goal.progress = progressPercentage;

    await user.save({ session });
    await goal.save({ session });

    await Transaction.create(
      [
        {
          userId,
          type: "savings",
          amount: withdrawalAmount,
          category: "goal",
          description: `Withdrawal from ${goal.title || "Goal"}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Withdrawal successful",
      data: {
        withdrawalAmount,
        newGoalBalance: newGoalAmount,
        newAccountBalance: newUserBalance,
        progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      },
      goal: {
        id: goal._id,
        title: goal.title,
        currentAmount: newGoalAmount,
        targetAmount: goal.targetAmount,
        progress: Math.min(100, Math.max(0, progressPercentage)),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Goal withdrawal error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid data format provided",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during withdrawal",
    });
  } finally {
    session.endSession();
  }
};
