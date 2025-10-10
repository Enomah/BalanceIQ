import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieChartIcon, Plus } from "lucide-react";
import { MonthlySummary } from "@/types/dashboardTypes";
import { User } from "@/types/userTypes"; 
import AddExpenseModal from "./AddExpenseModal";

interface ExpenseBreakdownProps {
  expenseData: { name: string; value: number; fill: string }[];
  monthlySummary: MonthlySummary;
  userProfile: User | null;
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({
  expenseData,
  monthlySummary,
  userProfile,
}) => {
  const topExpenses = expenseData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-secondary)] p-3 rounded-lg shadow-md border border-[var(--border-light)]">
          <p className="text-[var(--text-primary)] font-medium">
            {label || payload[0].name}
          </p>
          <p className="text-[var(--text-secondary)]">
            Amount:{" "}
            <span className="font-semibold">
              {userProfile?.currency} {payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container bg-[var(--bg-secondary)] p-[10px] md:p-6 md:rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Expense Breakdown
        </h3>
        {expenseData.length > 0 && <AddExpenseModal />}
      </div>

      {expenseData.length > 0 ? (
        <>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topExpenses}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--neutral-200)"
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-secondary)"
                  fontSize={12}
                />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[250px] mt-[50px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={(value) => (
                    <span className="text-sm text-[var(--text-secondary)]">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-[var(--text-tertiary)] p-4">
          <PieChartIcon size={48} className="mb-4 opacity-50" />
          <p className="text-center mb-2 text-lg font-medium">
            No expenses this month
          </p>
          <p className="text-sm text-center mb-6">
            Start tracking your expenses to see your spending patterns
          </p>
          <AddExpenseModal/>
        </div>
      )}
    </div>
  );
};

export default ExpenseBreakdown;
