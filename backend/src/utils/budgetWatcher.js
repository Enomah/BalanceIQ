import MonthlyBudget from "../models/MonthlyBudget.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Watches budget consumption and triggers alerts
 * @param {string} userId - User ID
 * @param {string} category - Expense category
 * @param {number} amount - Amount added (positive) or removed (negative)
 * @param {Object} user - User object (for email)
 * @returns {Object|null} - Alert info if threshold crossed
 */
export const checkBudgetThresholds = async (userId, category, amount, user) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Find current budget
    const budget = await MonthlyBudget.findByUserAndDate(userId, month, year);
    if (!budget) return null;

    const catIndex = budget.categories.findIndex((c) => c.key === category);
    if (catIndex === -1) return null;

    const cat = budget.categories[catIndex];
    const oldSpent = cat.spent;
    const newSpent = oldSpent + amount;
    const allocated = cat.allocated;

    // Update the budget record
    cat.spent = newSpent;
    budget.totalSpent += amount;
    await budget.save();

    if (allocated === 0) return null;

    const oldPercent = (oldSpent / allocated) * 100;
    const newPercent = (newSpent / allocated) * 100;

    let alert = null;

    // Threshold: 100% (Exceeded)
    if (newPercent >= 100 && oldPercent < 100) {
      alert = {
        type: "danger",
        title: "Budget Exceeded!",
        message: `You've spent ${newSpent.toFixed(
          2
        )} on ${category}, which exceeds your ${allocated.toFixed(2)} budget.`,
        category,
      };

      // Send Email
      await resend.emails.send({
        from: "BalanceIQ Alerts <onboarding@resend.dev>",
        to: user.email,
        subject: `⚠️ Budget Exceeded: ${category}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #333;">
            <h2 style="color: #ef4444;">Budget Ceiling Reached</h2>
            <p>Hello,</p>
            <p>You've just exceeded your monthly budget for <strong>${category}</strong>.</p>
            <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #fecaca;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #991b1b;">
                Spent: ${newSpent.toFixed(2)} / ${allocated.toFixed(2)}
              </p>
            </div>
            <p>Consider reviewing your spending or adjusting your budget in the BalanceIQ dashboard.</p>
            <p>Stay financially healthy!</p>
          </div>
        `,
      });
    }
    // Threshold: 80% (Warning)
    else if (newPercent >= 80 && oldPercent < 80) {
      alert = {
        type: "warning",
        title: "Budget Warning",
        message: `You've used ${newPercent.toFixed(
          0
        )}% of your ${category} budget.`,
        category,
      };
    }

    return alert;
  } catch (error) {
    console.error("BudgetWatcher Error:", error);
    return null;
  }
};
