import React from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { MonthlySummary } from "@/types/dashboardTypes";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/format";

interface AccountOverviewProps {
  monthlySummary: MonthlySummary;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({
  monthlySummary,
}) => {
  const { userProfile } = useAuthStore();
  return (
    <section className="account-overview grid grid-cols-1 md:grid-cols-3 gap-[0px] gap-[10px] sm:gap-6 mb-[10px] sm:mb-6">
      <div className="grid grid-cols-2 gap-[10px] sm:gap-6 md:col-span-2">
        <div className="overview-card bg-[var(--bg-secondary)] sm:p-6 p-[10px] rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wide">
              Monthly Income
            </h3>
            <TrendingUp size={20} className="text-[var(--success-500)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {formatCurrency(monthlySummary.income, userProfile?.currency ?? "")}
          </div>
          {/* <div className="text-sm text-[var(--success-600)] dark:text-[var(--success-400)] font-medium">
          +2.5% from last month
        </div> */}
        </div>

        <div className="overview-card bg-[var(--bg-secondary)] sm:p-6 p-[10px] rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wide">
              Monthly Expenses
            </h3>
            <TrendingDown size={20} className="text-[var(--error-500)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {formatCurrency(
              monthlySummary.expenses,
              userProfile?.currency ?? ""
            )}
          </div>
        </div>
      </div>

      <div className="overview-card bg-[var(--bg-secondary)] sm:p-6 p-[10px] rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wide">
            Spendable Balance
          </h3>
          <Wallet size={20} className="text-[var(--primary-500)]" />
        </div>
        <div className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {formatCurrency(monthlySummary.balance, userProfile?.currency ?? "")}
        </div>
        {/* <div className="text-sm text-[var(--success-600)] dark:text-[var(--success-400)] font-medium">
          +15% from last month
        </div> */}
      </div>
    </section>
  );
};

export default AccountOverview;
