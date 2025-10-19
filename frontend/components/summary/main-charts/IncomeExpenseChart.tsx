import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { SummaryData } from "@/types/summaryTypes";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

const CHART_COLORS = {
  income: "#10b981",
  expenses: "#ef4444",
  savings: "#3b82f6",
  categories: [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#64748b",
  ],
};

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

interface IncomeExpenseChartProps {
  summaryData: SummaryData;
}

const prepareIncomeExpenseComparison = (summaryData: SummaryData) => {
  const { totalIncome, totalExpenses, netSavings } = summaryData.overview;
  return [
    { category: "Income", amount: totalIncome, fill: CHART_COLORS.income },
    {
      category: "Expenses",
      amount: totalExpenses,
      fill: CHART_COLORS.expenses,
    },
    { category: "Savings", amount: netSavings, fill: CHART_COLORS.savings },
  ];
};

export default function IncomeExpenseChart({
  summaryData,
}: IncomeExpenseChartProps) {
  const { userProfile } = useAuthStore();

  return (
    <motion.div
      //@ts-ignore
      variants={itemVariants}
      className="bg-[var(--bg-secondary)] rounded-xl p-[10px]  sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-100)] rounded-lg">
          <BarChart3 className="w-5 h-5 text-[var(--primary-600)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Income vs Expenses
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Compare your earnings and spending
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={prepareIncomeExpenseComparison(summaryData)}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
          <XAxis
            dataKey="category"
            stroke="var(--text-secondary)"
            fontSize={12}
          />
          <YAxis stroke="var(--text-secondary)" fontSize={12} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-[var(--text-primary)] mb-2">
                      {label}
                    </p>
                    {payload.map((entry: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 py-1"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-[var(--text-secondary)] capitalize">
                            {entry.name}:
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {userProfile &&
                            formatCurrency(entry.value, userProfile.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
            {prepareIncomeExpenseComparison(summaryData).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
