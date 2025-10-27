"use client";

import { motion } from "framer-motion";
import { Progress } from "./Progress";
import { MonthlyBudget } from "@/types/budgetTypes";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

interface BudgetProgressProps {
  budget: MonthlyBudget | null;
}

export default function BudgetProgress({ budget }: BudgetProgressProps) {
  const { userProfile } = useAuthStore()

  console.log(budget);
  const budgetTotal = budget?.totalBudget ?? 0;
  const progress =
    budgetTotal > 0 ? ((budget?.totalSpent ?? 0) / budgetTotal) * 100 : 0;

  const getStatus = () => {
    if (progress < 60)
      return { color: "var(--success-500)", label: "On Track" };
    if (progress < 85)
      return { color: "var(--warning-500)", label: "Moderate" };
    return { color: "var(--error-500)", label: "Overspending" };
  };

  const status = getStatus();

  function getMonthName(monthNumber?: number) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (
      typeof monthNumber !== "number" ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      return "";
    }
    return months[monthNumber - 1];
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-secondary)] p-[10px] sm:p-6 rounded-lg sm:rounded-xl border border-[var(--border-light)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {getMonthName(budget?.month)} {budget?.year} Budget
          </h3>
          <p className="text-[var(--text-secondary)] text-sm">
            Track your monthly spending progress
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: `${status.color}20`,
            color: status.color,
          }}
        >
          {status.label}
        </div>
      </div>

      <Progress value={progress} color={status.color} />

      <div className="flex justify-between text-sm text-[var(--text-secondary)] mt-2">
        <span>
          Spent: {formatCurrency(budget?.totalSpent ?? 0, userProfile?.currency ?? "")}{" "}
        </span>
        <span>Budget: {formatCurrency(budget?.totalBudget ?? 0, userProfile?.currency ?? "")}{" "}</span>
      </div>
    </motion.div>
  );
}
