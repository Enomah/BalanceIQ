import mongoose from "mongoose";
import Goal from "../../models/Goals.js";
import User from "../../models/Users.js";
import Transaction from "../../models/Transactions.js";

export const fundGoal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount } = req.body;
    const goalId = req.params.id;
    const userId = req.user?.id;

    // console.log(goalId)

    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "Unauthorized" });
    }

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

    if (!user.accountBalance || user.accountBalance < parsedAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient account balance" });
    }


    const newAmount = (goal.currentAmount || 0) + parsedAmount;

    if(newAmount > goal.targetAmount) {
      return res.status(400).json({message: "You cannot exceed the target amount"})
    }

    const progressPercentage = (newAmount / goal.targetAmount) * 100;

    user.accountBalance -= parsedAmount;
    goal.currentAmount = newAmount;

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await user.save({ session });
    await goal.save({ session });

    await Transaction.create(
      [
        {
          userId,
          type: "savings",
          amount: parsedAmount,
          category: "goal",
          description: `Funded ${goal.title || "Goal"}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Goal funded successfully",
      goal: {
        id: goal._id,
        title: goal.title || "Untitled goal",
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount,
        progress: progressPercentage,
        status: goal.status,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error funding goal:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
