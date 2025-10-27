import mongoose from "mongoose";
import { defaultExpenseCategories } from "../constants/transaction.js";

const monthlyBudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  categories: [{
    key: {
      type: String,
      required: true,
      enum: defaultExpenseCategories
    },
    allocated: {
      type: Number,
      required: true,
      min: 0
    },
    spent: {
      type: Number,
      default: 0,
      min: 0
    }
  }]
}, { 
  timestamps: true 
});

// Compound index to ensure one budget per user per month-year combination
monthlyBudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

// Virtual for remaining budget
monthlyBudgetSchema.virtual('remainingBudget').get(function() {
  return this.totalBudget - this.totalSpent;
});

// Virtual for progress percentage
monthlyBudgetSchema.virtual('progressPercentage').get(function() {
  return (this.totalSpent / this.totalBudget) * 100;
});

// Method to update spent amount for a category
monthlyBudgetSchema.methods.updateCategorySpent = function(categoryKey, amount) {
  const category = this.categories.find(cat => cat.key === categoryKey);
  if (category) {
    const oldSpent = category.spent;
    category.spent = amount;
    
    // Update total spent
    this.totalSpent = this.totalSpent - oldSpent + amount;
    
    return this.save();
  }
  throw new Error('Category not found');
};

// Method to add expense to a category
monthlyBudgetSchema.methods.addExpense = function(categoryKey, amount) {
  const category = this.categories.find(cat => cat.key === categoryKey);
  if (category) {
    category.spent += amount;
    this.totalSpent += amount;
    
    return this.save();
  }
  throw new Error('Category not found');
};

// Static method to find budget by user and date
monthlyBudgetSchema.statics.findByUserAndDate = function(userId, month, year) {
  return this.findOne({ userId, month, year });
};

// Static method to get current month budget for user
monthlyBudgetSchema.statics.findCurrentMonthBudget = function(userId) {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();
  
  return this.findOne({ userId, month, year });
};

const MonthlyBudget = mongoose.model("MonthlyBudget", monthlyBudgetSchema);

export default MonthlyBudget;