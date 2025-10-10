import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["income", "expense", "savings"] },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: { type: String, default: "others" },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
