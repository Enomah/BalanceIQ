import mongoose from "mongoose";
import Goal from "../../models/Goals.js";

export const deleteGoal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOne({ _id: id, userId }).session(session);

    if (!goal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Goal not found" });
    }

    await Goal.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting goal:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
