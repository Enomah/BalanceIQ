import React from 'react';
import { Plus, TrendingUp, Target, Calendar } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <div className="quick-actions bg-[var(--bg-secondary)] p-[10px] sm:p-6 sm:rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-[10px] sm:mb-6">Quick Actions</h3>
      
      <div className="space-y-3">
        <button className="w-full flex items-center p-3 bg-[var(--primary-50)] dark:bg-[var(--primary-900)] text-[var(--primary-600)] dark:text-[var(--primary-400)] rounded-lg hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-800)] transition-colors">
          <Plus size={20} className="mr-3" />
          Add Expense
        </button>
        
        <button className="w-full flex items-center p-3 bg-[var(--success-50)] dark:bg-[var(--success-900)] text-[var(--success-600)] dark:text-[var(--success-400)] rounded-lg hover:bg-[var(--success-100)] dark:hover:bg-[var(--success-800)] transition-colors">
          <TrendingUp size={20} className="mr-3" />
          Add Income
        </button>
        
        <button className="w-full flex items-center p-3 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-600)] transition-colors">
          <Target size={20} className="mr-3" />
          Create Goal
        </button>
        
        <button className="w-full flex items-center p-3 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-600)] transition-colors">
          <Calendar size={20} className="mr-3" />
          Monthly Report
        </button>
      </div>
    </div>
  );
};

export default QuickActions;