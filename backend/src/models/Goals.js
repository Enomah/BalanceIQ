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
    priority: { type: String },
    description: { type: String },
    category: { type: String },
    progress: { type: Number },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned", "failed"],
      default: "active",
    },
    transactions: [
      {
        amount: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          enum: ["deposit", "withdrawal"],
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],
  },
  { timestamps: true }
);

goalSchema.virtual("daysRemaining").get(function () {
  if (!this.targetDate) return null;
  const today = new Date();
  const diffTime = this.targetDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

goalSchema.virtual("monthlySavingsNeeded").get(function () {
  if (!this.targetDate) return null;

  const monthsRemaining = this.daysRemaining / 30.44;
  if (monthsRemaining <= 0) return this.targetAmount - this.currentAmount;

  return (this.targetAmount - this.currentAmount) / monthsRemaining;
});

goalSchema.pre("save", function (next) {
  if (this.targetAmount > 0) {
    this.progress = (this.currentAmount / this.targetAmount) * 100;

    if (this.progress >= 100 && this.status !== "completed") {
      this.status = "completed";
      this.progress = 100;
      this.currentAmount = this.targetAmount;
    }
  }
  next();
});

goalSchema.statics.findByUser = function (userId, status = null) {
  const query = { user: userId };
  if (status) query.status = status;
  return this.find(query).sort({ priority: -1, createdAt: -1 });
};

goalSchema.methods.addTransaction = function (amount, type, description = "") {
  this.transactions.push({
    amount,
    type,
    description,
  });

  if (type === "deposit") {
    this.currentAmount += amount;
  } else if (type === "withdrawal") {
    this.currentAmount = Math.max(0, this.currentAmount - amount);
  }

  return this.save();
};

goalSchema.methods.canFund = function(amount) {
  if (this.status !== 'active') return false;
  if (amount <= 0) return false;
  return (this.currentAmount + amount) <= this.targetAmount;
};

goalSchema.methods.canWithdraw = function(amount) {
  if (amount <= 0) return false;
  if (amount > this.currentAmount) return false;
  return true;
};


export default mongoose.model("Goals", goalSchema);
