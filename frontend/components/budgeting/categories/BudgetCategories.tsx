// components/budget/categories/BudgetCategories.tsx
"use client";

import { motion } from "framer-motion";
import { expenseCategories } from "@/constants/transaction";
import { useAuthStore } from "@/store/authStore";

import CategoriesSummaryGrid from "./CategoriesSummaryGrid";
import EmptyCategoriesState from "./EmptyCategoriesState";

import { MonthlyBudget } from "@/types/budgetTypes";
import BudgetCategoryCard from "./BudgetCatgoryCard";

interface BudgetCategoriesProps {
  budget: MonthlyBudget;
}

export default function BudgetCategories({ budget }: BudgetCategoriesProps) {
  const { userProfile } = useAuthStore();
  const currency = userProfile?.currency || "";

  const combinedCategories = expenseCategories
    .map(frontend => {
      const backend = budget.categories.find(b => b.key === frontend.key);
      return {
        ...frontend,
        allocated: backend?.allocated || 0,
        spent: backend?.spent || 0,
      };
    })
    .filter(cat => cat.allocated > 0);

  if (combinedCategories.length === 0) {
    return <EmptyCategoriesState />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <CategoriesSummaryGrid categories={combinedCategories} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {combinedCategories.map((cat, i) => (
          <BudgetCategoryCard
            key={cat.key}
            category={cat}
            totalBudget={budget.totalBudget}
            currency={currency}
          />
        ))}
      </div>
    </motion.div>
  );
}