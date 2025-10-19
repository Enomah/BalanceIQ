import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
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

interface MonthlyTrendChartProps {
  summaryData: SummaryData;
}

const prepareMonthlyTrend = (summaryData: SummaryData) => {
  const { trends } = summaryData;
  return [
    {
      period: "Last Month",
      income: trends.income.previous,
      expenses: trends.expenses.previous,
    },
    {
      period: "This Month",
      income: trends.income.current,
      expenses: trends.expenses.current,
    },
  ];
};

export default function MonthlyTrendChart({
  summaryData,
}: MonthlyTrendChartProps) {
  const { userProfile } = useAuthStore();

  return (
    <motion.div
      //@ts-ignore
      variants={itemVariants}
      className="bg-[var(--bg-secondary)] rounded-xl p-[10px]  sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--warning-100)] rounded-lg">
          <TrendingUp className="w-5 h-5 text-[var(--warning-600)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Monthly Trend
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Compare with previous month
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={prepareMonthlyTrend(summaryData)}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
          <XAxis
            dataKey="period"
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
          <Legend />
          <Bar
            dataKey="income"
            fill={CHART_COLORS.income}
            name="Income"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            fill={CHART_COLORS.expenses}
            name="Expenses"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
