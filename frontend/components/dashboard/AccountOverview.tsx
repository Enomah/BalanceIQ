import React from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { MonthlySummary } from "@/types/dashboardTypes";
import { useAuthStore } from "@/store/authStore";

interface AccountOverviewProps {
  monthlySummary: MonthlySummary;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({
  monthlySummary,
}) => {
  const { userProfile } = useAuthStore();
  return (
    <section className="account-overview grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[0px] sm:gap-6 mb-[10px] sm:mb-6">
      <div className="overview-card bg-[var(--bg-secondary)] sm:p-6 p-[10px]  sm:rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wide">
            Monthly Income
          </h3>
          <TrendingUp size={20} className="text-[var(--success-500)]" />
        </div>
        <div className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {userProfile?.currency}
          {monthlySummary.income.toLocaleString()}
        </div>
        <div className="text-sm text-[var(--success-600)] dark:text-[var(--success-400)] font-medium">
          +2.5% from last month
        </div>
      </div>

      <div className="overview-card bg-[var(--bg-secondary)] sm:p-6 p-[10px]  sm:rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wide">
            Current Balance
          </h3>
          <Wallet size={20} className="text-[var(--primary-500)]" />
        </div>
        <div className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {userProfile?.currency}
          {monthlySummary.balance.toLocaleString()}
        </div>
        <div className="text-sm text-[var(--success-600)] dark:text-[var(--success-400)] font-medium">
          +15% from last month
        </div>
      </div>

      <div className="overview-card bg-[var(--bg-secondary)] sm:p-6 p-[10px]  sm:rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wide">
            Monthly Expenses
          </h3>
          <TrendingDown size={20} className="text-[var(--error-500)]" />
        </div>
        <div className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {userProfile?.currency}
          {monthlySummary.expenses.toLocaleString()}
        </div>
        <div
          className={`text-sm font-medium ${
            monthlySummary.expenses > monthlySummary.income * 0.5
              ? "text-[var(--error-600)] dark:text-[var(--error-400)]"
              : "text-[var(--success-600)] dark:text-[var(--success-400)]"
          }`}
        >
          {monthlySummary.expenses > monthlySummary.income * 0.5
            ? "Over budget"
            : "Within budget"}
        </div>
      </div>
    </section>
  );
};

export default AccountOverview;
