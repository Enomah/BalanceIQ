// ChartsSection.tsx
import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { MonthlySummary } from '@/types/dashboardTypes';

interface ChartsSectionProps {
  monthlySummary: MonthlySummary;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ monthlySummary }) => {
  // Prepare data for charts
  const incomeData = Object.entries(monthlySummary.incomeCategoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const expenseData = Object.entries(monthlySummary.expenseCategoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  // Sample data for monthly trend (since API doesn't provide historical data)
  const monthlyTrendData = [
    { month: 'Jan', income: 120000, expenses: 85000 },
    { month: 'Feb', income: 135000, expenses: 92000 },
    { month: 'Mar', income: 142000, expenses: 78000 },
    { month: 'Apr', income: 148000, expenses: 89000 },
    { month: 'May', income: 150000, expenses: 95000 },
    { month: 'Jun', income: 150000, expenses: 0 },
  ];

  // COLORS for charts
  const INCOME_COLORS = ['#0d8af1', '#7cc2ff', '#0353a6', '#36a2ff', '#026ace'];
  const EXPENSE_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#fbbf24', '#dc2626', '#86efac'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-secondary)] p-3 rounded-lg shadow-md border border-[var(--border-light)]">
          <p className="text-[var(--text-primary)] font-medium">{label}</p>
          <p className="text-[var(--text-secondary)]">
            {payload[0].name}: <span className="font-semibold">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="charts-section grid grid-cols-1 lg:grid-cols-2 sm:gap-6 mb-[10px] sm:mb-6">
      {/* Income vs Expenses Trend */}
      <div className="chart-container bg-[var(--bg-secondary)] p-[10px] sm:p-6 sm:rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-[10px] sm:mb-6">Income vs Expenses Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stackId="1" stroke="var(--primary-500)" fill="var(--primary-100)" />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="var(--error-500)" fill="var(--error-100)" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="chart-container bg-[var(--bg-secondary)] p-[10px] sm:p-6 sm:rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-[10px] sm:mb-6">Expense Categories</h3>
        {expenseData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex flex-col items-center justify-center text-[var(--text-tertiary)]">
            <PieChartIcon size={48} className="mb-4 opacity-50" />
            <p>No expense data available</p>
            <p className="text-sm">Start adding expenses to see your spending breakdown</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChartsSection;