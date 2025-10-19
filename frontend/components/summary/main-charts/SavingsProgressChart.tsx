import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PiggyBank } from "lucide-react";
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

interface SavingsProgressChartProps {
  summaryData: SummaryData;
}

const prepareSavingsProgress = (summaryData: SummaryData) => {
  const { totalIncome, netSavings } = summaryData.overview;
  return [
    { name: "Saved", value: netSavings, fill: CHART_COLORS.savings },
    {
      name: "Spent",
      value: totalIncome - netSavings,
      fill: CHART_COLORS.expenses,
    },
  ];
};

export default function SavingsProgressChart({
  summaryData,
}: SavingsProgressChartProps) {
  const { userProfile } = useAuthStore();

  return (
    <motion.div
      //@ts-ignore
      variants={itemVariants}
      className="bg-[var(--bg-secondary)] rounded-xl p-[10px]  sm:p-6 shadow-sm lg:col-span-2"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--success-100)] rounded-lg">
          <PiggyBank className="w-5 h-5 text-[var(--success-600)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Savings Breakdown
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            How much you saved vs spent
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={prepareSavingsProgress(summaryData)}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) =>
                `${name}: ${
                  //@ts-ignore  
                  userProfile && formatCurrency(value, userProfile.currency)
                }`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {prepareSavingsProgress(summaryData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
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
                        {(
                          (data.value / payload[0].payload.total) *
                          100
                        ).toFixed(1)}
                        % of total
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {summaryData.overview.savingsRate.toFixed(1)}%
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Savings Rate</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-[var(--success-600)]">
                {userProfile &&
                  formatCurrency(
                    summaryData.overview.netSavings,
                    userProfile.currency
                  )}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Total Saved
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--error-600)]">
                {userProfile &&
                  formatCurrency(
                    summaryData.overview.totalExpenses,
                    userProfile.currency
                  )}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Total Spent
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
