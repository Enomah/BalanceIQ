import { MonthlyBudget } from "@/types/budgetTypes";
import { expenseCategories } from "@/constants/transaction";

export const combineCategories = (budget: MonthlyBudget) => {
  return expenseCategories.map(frontendCat => {
    const backendCat = budget.categories.find(b => b.key === frontendCat.key);
    return {
      ...frontendCat,
      allocated: backendCat?.allocated || 0,
      spent: backendCat?.spent || 0,
      id: backendCat?.id
    };
  });
};

export const getChartData = (combined: ReturnType<typeof combineCategories>, totalBudget: number) => {
  return combined
    .filter(cat => cat.allocated > 0)
    .map(cat => ({
      name: cat.label,
      value: cat.allocated,
      color: cat.color,
      spent: cat.spent,
      remaining: cat.allocated - cat.spent,
      percentage: ((cat.allocated / totalBudget) * 100).toFixed(1)
    }));
};

export const getOverspentCategories = (combined: ReturnType<typeof combineCategories>) => {
  return combined.filter(cat => cat.spent > cat.allocated && cat.allocated > 0);
};

export const getTopCategories = (combined: ReturnType<typeof combineCategories>, limit = 5) => {
  return combined
    .filter(cat => cat.allocated > 0)
    .sort((a, b) => b.allocated - a.allocated)
    .slice(0, limit);
};

export const getStatusColor = (progress: number): string => {
  if (progress < 60) return "var(--success-500)";
  if (progress < 85) return "var(--warning-500)";
  return "var(--error-500)";
};

export const getDaysRemaining = (year: number, month: number): number => {
  const lastDay = new Date(year, month, 0).getDate();
  const today = new Date().getDate();
  return Math.max(0, lastDay - today);
};