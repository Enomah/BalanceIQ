import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface SpendingTrendChartProps {
  monthlySummary: any;
}

const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ monthlySummary }) => {
  // Generate weekly trend data based on monthly totals
  const weeklyTrendData = [
    { week: 'Week 1', spending: monthlySummary.expenses * 0.2, budget: monthlySummary.income * 0.25 },
    { week: 'Week 2', spending: monthlySummary.expenses * 0.4, budget: monthlySummary.income * 0.25 },
    { week: 'Week 3', spending: monthlySummary.expenses * 0.7, budget: monthlySummary.income * 0.25 },
    { week: 'Week 4', spending: monthlySummary.expenses, budget: monthlySummary.income * 0.25 }
  ];

  const { userProfile } = useAuthStore()

  const isOverspending = monthlySummary.expenses > monthlySummary.income * 0.8;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-secondary)] p-3 rounded-lg shadow-md border border-[var(--border-light)]">
          <p className="font-medium text-[var(--text-primary)]">{payload[0].payload.week}</p>
          <p className="text-[var(--error-500)]">
            Spending: <span className="font-semibold">{userProfile?.currency} {payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-[var(--primary-500)]">
            Weekly Budget: <span className="font-semibold">{userProfile?.currency} {payload[1].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">Weekly Spending Trend</h4>
        {isOverspending ? (
          <TrendingDown size={16} className="text-[var(--error-500)]" />
        ) : (
          <TrendingUp size={16} className="text-[var(--success-500)]" />
        )}
      </div>
      
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
            <XAxis dataKey="week" stroke="var(--text-secondary)" fontSize={10} />
            <YAxis stroke="var(--text-secondary)" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="spending" 
              stroke="var(--error-500)" 
              strokeWidth={2}
              dot={{ fill: 'var(--error-500)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="var(--primary-500)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingTrendChart;