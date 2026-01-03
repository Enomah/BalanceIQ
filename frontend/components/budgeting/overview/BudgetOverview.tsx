"use client";

import { motion } from "framer-motion";
import TopCategories from "./TopCategories";
import { MonthlyBudget } from "@/types/budgetTypes";
import {
  combineCategories,
  getChartData,
  getOverspentCategories,
  getTopCategories,
} from "./calculations";
import BudgetStatsGrid from "./BudgetStatsGrid";
import BudgetAllocationChart from "./BudgetAllocationChat";
import OverspendingAlert from "./OverspendingAlert";
import BudgetStatusSummary from "./BudgetSummaryStatus";

interface BudgetOverviewProps {
  budget: MonthlyBudget;
  onEditBudget: () => void;
}

export default function BudgetOverview({ budget }: BudgetOverviewProps) {
  const combined = combineCategories(budget);
  const chartData = getChartData(combined, budget.totalBudget);
  const overspent = getOverspentCategories(combined);
  const topCategories = getTopCategories(combined);

  return (
    <div className="space-y-6">
      <BudgetStatsGrid budget={budget} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetAllocationChart data={chartData} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <OverspendingAlert categories={overspent} />
          <TopCategories
            categories={topCategories}
            totalBudget={budget.totalBudget}
          />
          <BudgetStatusSummary
            totalBudget={budget.totalBudget}
            totalSpent={budget.totalSpent}
            year={budget.year}
            month={budget.month}
          />
        </motion.div>
      </div>
    </div>
  );
}
