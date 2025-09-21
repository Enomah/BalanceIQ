import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    targetDate: { type: Date },
    currentAmount: { type: Number, default: 0 },
    budgetingStyle: { type: String },
    progress: {type: Number},
    status: {
      type: String,
      enum: ["active", "completed", "abandoned", "failed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Goals", goalSchema);
