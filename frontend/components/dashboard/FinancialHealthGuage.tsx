import { MonthlySummary } from "@/types/dashboardTypes";
import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "@/store/authStore";
import AddIncomeModal from "./AddIncomeModal";

interface FinancialHealthGaugeProps {
  income: number;
  expenses: number;
  balance: number;
  monthlySummary: MonthlySummary;
}

const FinancialHealthGauge: React.FC<FinancialHealthGaugeProps> = ({
  income,
  expenses,
  monthlySummary,
}) => {
  const { userProfile } = useAuthStore();
  const incomeData = Object.entries(monthlySummary.incomeCategoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      fill: getCategoryColor(name),
    }));

  function getCategoryColor(category: string): string {
    const colorMap: Record<string, string> = {
      business: "#f59e0b",
      freelance: "#8b5cf6",
      gift: "#0d8af1",
      investment: "#ec4899",
      salaru: "#22c55e",
      rentals: "#6366f1",
      others: "#6b7280",
    };
    return colorMap[category] || "#6b7280";
  }

  const topExpenses = incomeData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    }));

  // console.log(monthlySummary.incomeCategoryTotals);

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
    <div className="">
      {incomeData.length > 0 ? (
        <div className="w-full">
          <div className="h-48 mb-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topExpenses}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--neutral-200)"
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-secondary)"
                  fontSize={10}
                />
                <YAxis stroke="var(--text-secondary)" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-[var(--text-tertiary)] p-4">
          <p className="text-[14px] mb-[10px]">You have not added any monthly income yet</p>
          <AddIncomeModal/>
        </div>
      )}
    </div>
  );
};

export default FinancialHealthGauge;
