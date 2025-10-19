import { motion } from "framer-motion";
import { TrendingUp, Wallet, Zap, ArrowUp, ArrowDown } from "lucide-react";
import { SummaryData } from "@/types/summaryTypes";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

interface MonthlyComparisonProps {
  summaryData: SummaryData;
}

const getMonthlyComparison = (summaryData: SummaryData) => {
  const { income, expenses } = summaryData.trends;
  return {
    incomeChange: income.trend,
    expenseChange: expenses.trend,
    incomeDirection: income.direction,
    expenseDirection: expenses.direction,
  };
};

export default function MonthlyComparison({
  summaryData,
}: MonthlyComparisonProps) {
  const monthlyComparison = getMonthlyComparison(summaryData);

  return (
    <motion.div
      //@ts-ignore
      variants={itemVariants}
      className="bg-[var(--bg-secondary)] rounded-xl p-[10px]  sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[var(--primary-100)] rounded-lg">
          <TrendingUp className="w-5 h-5 text-[var(--primary-600)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Monthly Change
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Compared to last month
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--success-600)]">
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-[var(--success-600)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Income
            </span>
          </div>
          <div className="flex items-center gap-2">
            {monthlyComparison.incomeDirection === "up" ? (
              <ArrowUp className="w-4 h-4 text-[var(--success-600)]" />
            ) : (
              <ArrowDown className="w-4 h-4 text-[var(--error-600)]" />
            )}
            <span
              className={`text-sm font-semibold ${
                monthlyComparison.incomeDirection === "up"
                  ? "text-[var(--success-600)]"
                  : "text-[var(--error-600)]"
              }`}
            >
              {Math.abs(monthlyComparison.incomeChange).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--error-600)]">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-[var(--error-600)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Expenses
            </span>
          </div>
          <div className="flex items-center gap-2">
            {monthlyComparison.expenseDirection === "down" ? (
              <ArrowDown className="w-4 h-4 text-[var(--success-600)]" />
            ) : (
              <ArrowUp className="w-4 h-4 text-[var(--error-600)]" />
            )}
            <span
              className={`text-sm font-semibold ${
                monthlyComparison.expenseDirection === "down"
                  ? "text-[var(--success-600)]"
                  : "text-[var(--error-600)]"
              }`}
            >
              {Math.abs(monthlyComparison.expenseChange).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-[var(--bg-tertiary)] rounded-lg">
        <p className="text-xs text-[var(--text-secondary)] text-center">
          {monthlyComparison.incomeDirection === "up" &&
          monthlyComparison.expenseDirection === "down"
            ? "Great! You earned more and spent less 👍"
            : monthlyComparison.incomeDirection === "up"
            ? "Good! Your income is grew 💪"
            : monthlyComparison.expenseDirection === "down"
            ? "Nice! You spent less this month 👏"
            : "Needs improving 💰"}
        </p>
      </div>
    </motion.div>
  );
}
