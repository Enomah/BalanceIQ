import React from 'react';
import { Wallet, Target, Calendar, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface QuickStatsProps {
  monthlySummary: any;
}

const QuickStats: React.FC<QuickStatsProps> = ({ monthlySummary }) => {
  const dailySpending = monthlySummary.expenses / 30;
  const { userProfile } = useAuthStore()
  const projectedMonthly = monthlySummary.expenses * (30 / new Date().getDate());
  const balanceRate = monthlySummary.income > 0 ? 
    ((monthlySummary.balance / monthlySummary.income) * 100) : 0;

  const stats = [
    {
      icon: Wallet,
      label: 'Daily Average',
      value: `${userProfile?.currency} ${dailySpending.toFixed(0)}`,
      description: 'Per day spending'
    },
    {
      icon: Target,
      label: 'Balance Rate',
      value: `${balanceRate.toFixed(1)}%`,
      description: 'Of your income'
    },
    {
      icon: Calendar,
      label: 'Projected Month',
      value: `${userProfile?.currency} ${projectedMonthly.toFixed(0)}`,
      description: 'Based on current pace'
    },
    {
      icon: Zap,
      label: 'Financial Health',
      value: balanceRate > 20 ? 'Excellent' : balanceRate > 10 ? 'Good' : 'Needs Work',
      description: 'Overall status'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-[var(--bg-tertiary)] p-3 rounded-lg text-center">
          <stat.icon size={16} className="mx-auto mb-1 text-[var(--primary-500)]" />
          <p className="text-xs text-[var(--text-secondary)] mb-1">{stat.label}</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{stat.value}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;