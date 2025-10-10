import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';

interface CategoryInsightsProps {
  expenseData: Array<{ name: string; value: number }>;
  totalExpenses: number;
}

const CategoryInsights: React.FC<CategoryInsightsProps> = ({ expenseData, totalExpenses }) => {
  if (expenseData.length === 0) return null;

  const topCategory = expenseData.reduce((prev, current) => 
    prev.value > current.value ? prev : current
  );

  const getInsight = (category: string, percentage: number) => {
    const insights: Record<string, string> = {
      food: percentage > 30 ? 'Consider meal planning to reduce food costs' : 'Good balance on food spending',
      transport: percentage > 20 ? 'Explore cost-effective transportation options' : 'Transportation spending is reasonable',
      accommodation: percentage > 40 ? 'Housing is your largest expense - consider options' : 'Housing costs are well managed',
      entertainment: percentage > 15 ? 'Entertainment spending might be high' : 'Entertainment budget looks good',
      shopping: percentage > 25 ? 'Watch impulse purchases in shopping' : 'Shopping habits are controlled'
    };

    return insights[category] || 'Keep tracking your spending patterns';
  };

  const percentage = (topCategory.value / totalExpenses) * 100;

  return (
    <div className="bg-[var(--primary-50)] dark:bg-[var(--primary-900)] p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <Lightbulb size={16} className="text-[var(--primary-600)] mr-2" />
        <h4 className="text-sm font-semibold text-white">Spending Insight</h4>
      </div>
      
      <p className="text-sm text-white/70 mb-2">
        Your top spending category is <strong>{topCategory.name}</strong> at {percentage.toFixed(0)}% of total expenses.
      </p>
      
      <p className="text-xs text-white/70">
        💡 {getInsight(topCategory.name, percentage)}
      </p>
    </div>
  );
};

export default CategoryInsights;