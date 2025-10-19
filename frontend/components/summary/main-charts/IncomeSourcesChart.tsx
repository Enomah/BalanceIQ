import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { DollarSign } from "lucide-react";
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

interface IncomeSourcesChartProps {
  summaryData: SummaryData;
}

const prepareIncomeSources = (summaryData: SummaryData) => {
  const total = summaryData.charts.categories.income.reduce(
    (sum, item) => sum + item.value,
    0
  );
  return summaryData.charts.categories.income
    .map((item) => ({
      ...item,
      total,
      percentage: (item.value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

export default function IncomeSourcesChart({
  summaryData,
}: IncomeSourcesChartProps) {
  const { userProfile } = useAuthStore();

  return (
    <motion.div
      //@ts-ignore
      variants={itemVariants}
      className="bg-[var(--bg-secondary)] rounded-xl p-[10px]  sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--success-100)] rounded-lg">
          <DollarSign className="w-5 h-5 text-[var(--success-600)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Income Sources
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Where your money comes from
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={prepareIncomeSources(summaryData)}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) =>
              //@ts-ignore
              `${name} (${percentage.toFixed(0)}%)`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {prepareIncomeSources(summaryData).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  CHART_COLORS.categories[
                    index % CHART_COLORS.categories.length
                  ]
                }
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-[var(--text-primary)] capitalize">
                      {data.name}
                    </p>
                    <p className="text-sm text-[var(--text-primary)] font-semibold">
                      {userProfile &&
                        formatCurrency(data.value, userProfile.currency)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {((data.value / payload[0].payload.total) * 100).toFixed(
                        1
                      )}
                      % of total
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
