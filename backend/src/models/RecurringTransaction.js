import mongoose from "mongoose";

const recurringTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
      default: "monthly",
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
    lastProcessed: {
      type: Date,
    },
    // For smart matching if needed later
    providerId: String,
  },
  { timestamps: true }
);

// Index for efficient background processing
recurringTransactionSchema.index({ nextDate: 1, status: 1 });

export default mongoose.model(
  "RecurringTransaction",
  recurringTransactionSchema
);
