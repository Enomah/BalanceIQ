import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { getStatusColor, getDaysRemaining } from "./calculations";

interface Props {
  totalBudget: number;
  totalSpent: number;
  year: number;
  month: number;
}

export default function BudgetStatusSummary({ totalBudget, totalSpent, year, month }: Props) {
  const { userProfile } = useAuthStore();
  const currency = userProfile?.currency || "";
  const progress = (totalSpent / totalBudget) * 100;
  const remaining = totalBudget - totalSpent;
  const daysRemaining = getDaysRemaining(year, month);
  const dailyBudget = daysRemaining > 0 ? remaining / daysRemaining : 0;

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-light)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Budget Status
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-secondary)]">Monthly Progress</span>
          <div className="w-24 bg-[var(--bg-tertiary)] rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: getStatusColor(progress)
              }}
            />
          </div>
          <span className="text-[var(--text-primary)] font-medium w-12 text-right">
            {progress.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Days Remaining</span>
          <span className="text-[var(--text-primary)] font-medium">
            {daysRemaining} days
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Daily Budget</span>
          <span className="text-[var(--text-primary)] font-medium">
            {formatCurrency(dailyBudget, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}