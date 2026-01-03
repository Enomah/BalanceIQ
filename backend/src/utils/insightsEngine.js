/**
 * Generates personalized financial insights based on user dashboard data.
 * @param {Object} data - Processed dashboard data
 * @param {Object} user - User profile data
 * @returns {Array} - Array of insight objects
 */
export const generateInsights = (data, user) => {
  const insights = [];
  const now = new Date();
  const { monthlySummary, activeGoals } = data;
  const { income, expenses, balance, expenseCategoryTotals } = monthlySummary;

  // 1. Savings Rate Insight
  if (income > 0) {
    const savingsRate = ((income - expenses) / income) * 100;
    if (savingsRate > 20) {
      insights.push({
        type: "success",
        title: "High Savings Rate",
        message: `Outstanding! You've saved ${savingsRate.toFixed(
          0
        )}% of your income this month. You're well ahead of the 20% rule.`,
        icon: "piggybank",
      });
    } else if (savingsRate > 0) {
      insights.push({
        type: "info",
        title: "Steady Progress",
        message: `Your savings rate is ${savingsRate.toFixed(
          0
        )}%. Aim for 20% to build your safety net even faster.`,
        icon: "trendingup",
      });
    } else {
      insights.push({
        type: "warning",
        title: "Spending Gap",
        message: `Your expenses currently exceed your income. Consider reviewing non-essential categories to rebalance.`,
        icon: "alerttriangle",
      });
    }
  }

  // 2. Top Spending Category insight
  const categories = Object.entries(expenseCategoryTotals)
    .filter(([_, total]) => total > 0)
    .sort((a, b) => b[1] - a[1]);

  if (categories.length > 0 && expenses > 0) {
    const [topCat, topVal] = categories[0];
    const catPercent = (topVal / expenses) * 100;

    if (catPercent > 40) {
      insights.push({
        type: "warning",
        title: `${
          topCat.charAt(0).toUpperCase() + topCat.slice(1)
        } Concentration`,
        message: `${catPercent.toFixed(
          0
        )}% of your spending is in ${topCat}. Finding small savings here could make a big difference.`,
        icon: "piechart",
      });
    } else {
      insights.push({
        type: "info",
        title: `Top Spent: ${topCat.charAt(0).toUpperCase() + topCat.slice(1)}`,
        message: `You've allocated ${topVal.toFixed(
          2
        )} to ${topCat} this month. It's your highest expense category so far.`,
        icon: "creditcard",
      });
    }
  }

  // 3. Goal Progress insight
  if (activeGoals && activeGoals.length > 0) {
    const sortedGoals = [...activeGoals].sort(
      (a, b) => (b.progress || 0) - (a.progress || 0)
    );
    const topGoal = sortedGoals[0];

    if (topGoal.progress >= 75 && topGoal.progress < 100) {
      insights.push({
        type: "success",
        title: "Goal in Sight!",
        message: `"${topGoal.title}" is ${topGoal.progress.toFixed(
          0
        )}% complete. You're in the final stretch!`,
        icon: "target",
      });
    } else if (topGoal.progress < 25) {
      insights.push({
        type: "info",
        title: "New Journey",
        message: `You've started working on "${topGoal.title}". Small, consistent contributions are the key to success.`,
        icon: "rocket",
      });
    }
  }

  // 4. Projected Spending (Burn Rate)
  const daysPassed = now.getDate();
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  if (daysPassed > 3 && expenses > 0) {
    const dailyAvg = expenses / daysPassed;
    const projectedTotal = dailyAvg * lastDayOfMonth;

    if (income > 0 && projectedTotal > income) {
      insights.push({
        type: "warning",
        title: "Overspending Projection",
        message: `At your current rate, you'll spend ${projectedTotal.toFixed(
          0
        )} this month, exceeding your income. Small changes now can help!`,
        icon: "trendingup",
      });
    } else if (income > 0 && projectedTotal < income * 0.7) {
      insights.push({
        type: "success",
        title: "Budget Master",
        message: `Great discipline! You're on track to spend only ${(
          (projectedTotal / income) *
          100
        ).toFixed(0)}% of your income this month.`,
        icon: "award",
      });
    }
  }

  // 5. Total Financial Health Score (Conceptual)
  if (income > 0) {
    const healthScore = Math.min(
      100,
      Math.max(0, (balance / income) * 100 + (activeGoals.length > 0 ? 20 : 0))
    );
    if (
      healthScore > 85 &&
      insights.filter((i) => i.type === "success").length > 1
    ) {
      insights.push({
        type: "success",
        title: "Financial Excellence",
        message:
          "Your overall financial habits this month are outstanding. You're balancing spending and goals perfectly.",
        icon: "award",
      });
    }
  }

  return insights.slice(0, 4); // Limit to top 4 insights for UI clarity
};
