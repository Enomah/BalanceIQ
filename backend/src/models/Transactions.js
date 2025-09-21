import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["income", "expense"] },
    amount: { type: Number },
    category: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Transactions", transactionSchema)
