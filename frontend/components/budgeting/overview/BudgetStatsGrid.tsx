import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { MonthlyBudget } from "@/types/budgetTypes";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
// import { getStatusColor } from "./calculations";
import BudgetStatCard from "./BudgetStatCard";

interface Props {
  budget: MonthlyBudget;
}

export default function BudgetStatsGrid({ budget }: Props) {
  const { userProfile } = useAuthStore();
  const currency = userProfile?.currency || "";
  const remaining = budget.totalBudget - budget.totalSpent;
  const progress = (budget.totalSpent / budget.totalBudget) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BudgetStatCard
        title="Total Budget"
        value={formatCurrency(budget.totalBudget, currency)}
        icon={<Target className="w-6 h-6 text-[var(--primary-600)]" />}
        colorClass="text-[var(--primary-600)]"
        bgClass="bg-[var(--primary-100)]"
      />

      <BudgetStatCard
        title="Total Spent"
        value={formatCurrency(budget.totalSpent, currency)}
        subtitle={`${progress.toFixed(1)}% of budget`}
        icon={<TrendingUp className="w-6 h-6 text-[var(--error-600)]" />}
        colorClass="text-[var(--error-600)]"
        bgClass="bg-[var(--error-100)]"
        delay={0.1}
      />

      <BudgetStatCard
        title="Remaining"
        value={formatCurrency(remaining, currency)}
        subtitle={`${((remaining / budget.totalBudget) * 100).toFixed(
          1
        )}% left`}
        icon={<TrendingDown className="w-6 h-6 text-[var(--success-600)]" />}
        colorClass="text-[var(--success-600)]"
        bgClass="bg-[var(--success-100)]"
        delay={0.2}
        // style={{ color: getStatusColor(progress) }}
      />
    </div>
  );
}
