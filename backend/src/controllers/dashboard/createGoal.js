import mongoose from "mongoose";
import Goal from "../../models/Goals.js";

export const createGoal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, targetAmount, targetDate, description, category, priority } =
      req.body;

    let errors = {};

    if (!title.trim) errors.title = "Title is required";
    if (!targetAmount || isNaN(targetAmount) || targetAmount <= 0)
      errors.targetAmount = "Amount must be a number greater than 0";

    if (targetDate) {
      const parsedDate = new Date(targetDate);
      if (parsedDate <= new Date()) {
        errors.targetDate = "Target date must be in the future";
      }
    }

    if (Object.keys(errors).length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const goal = new Goal({
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      targetDate: targetDate ? new Date(targetDate) : undefined,
      description: description ? description.trim() : "",
      category: category || "savings",
      status: "active",
      priority: priority || "medium",
      userId: req.user.id,
    });

    const savedGoal = await goal.save({ session });

    await savedGoal.addTransaction(0, "deposit", "Goal created", { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal: {
        id: savedGoal._id,
        title: savedGoal.title,
        targetAmount: savedGoal.targetAmount,
        currentAmount: savedGoal.currentAmount,
        targetDate: savedGoal.targetDate,
        description: savedGoal.description,
        category: savedGoal.category,
        priority: savedGoal.priority,
        status: savedGoal.status,
        progress: savedGoal.progress,
        daysRemaining: savedGoal.daysRemaining,
        monthlySavingsNeeded: savedGoal.monthlySavingsNeeded,
        createdAt: savedGoal.createdAt,
      },
    });

    await session.abortTransaction();
  } catch (error) {
    console.error("Goal creation error:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
};
