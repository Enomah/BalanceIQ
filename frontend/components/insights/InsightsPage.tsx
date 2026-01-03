"use client";

import React, { useMemo } from "react";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "../dashboard/WelcomeSection";
import { useAuthStore } from "@/store/authStore";
import { useDashboard } from "@/hooks/useDashboard";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { TrendingUp, AlertCircle, CheckCircle, Zap } from "lucide-react";

export default function InsightsPage() {
  const { userProfile } = useAuthStore();
  const { data: dashboardData, isLoading } = useDashboard();

  useRequireAuth();

  const insights = useMemo(() => {
    if (!dashboardData) return [];

    const { monthlySummary } = dashboardData;
    const { income, expenses } = monthlySummary;
    const items = [];

    // Savings Rate Insight
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    if (savingsRate > 20) {
      items.push({
        icon: CheckCircle,
        title: "Healthy Savings Rate",
        description: `You saved ${savingsRate.toFixed(
          1
        )}% of your income this month. Great job!`,
        color: "text-[var(--success-500)]",
        bg: "bg-[var(--success-50)]",
      });
    } else if (savingsRate > 0) {
      items.push({
        icon: Zap,
        title: "Action Needed",
        description: `Your savings rate is ${savingsRate.toFixed(
          1
        )}%. Aim for 20% to build wealth faster.`,
        color: "text-[var(--warning-500)]",
        bg: "bg-[var(--warning-50)]",
      });
    }

    // Expense Spike Insight
    if (expenses > income && income > 0) {
      items.push({
        icon: AlertCircle,
        title: "Spending Alert",
        description:
          "Your expenses have exceeded your income this month. Consider reviewing your variable costs.",
        color: "text-[var(--error-500)]",
        bg: "bg-[var(--error-50)]",
      });
    }

    // Category Insight
    const categories = Object.entries(monthlySummary.expenseCategoryTotals);
    if (categories.length > 0) {
      const highest = categories.reduce((a, b) => (b[1] > a[1] ? b : a));
      items.push({
        icon: TrendingUp,
        title: "Top Category",
        description: `Your highest spending is in '${highest[0]}'. Is this within your budget?`,
        color: "text-[var(--primary-500)]",
        bg: "bg-[var(--primary-50)]",
      });
    }

    return items;
  }, [dashboardData]);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath="/dashboard/insights" userProfile={userProfile} />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                Financial Insights
              </h1>
              <p className="text-[var(--text-secondary)]">
                Personalized analysis of your spending habits and financial
                health.
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-[var(--bg-secondary)] rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-6">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex gap-6 p-6 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl shadow-sm transition-all hover:translate-x-1"
                  >
                    <div
                      className={`w-12 h-12 ${insight.bg} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <insight.icon className={insight.color} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                        {insight.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-xl border border-dashed border-[var(--border-light)]">
                <TrendingUp
                  size={48}
                  className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-50"
                />
                <p className="text-[var(--text-secondary)]">
                  No insights available yet. Keep tracking your transactions!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
