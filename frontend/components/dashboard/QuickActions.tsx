import React from 'react';
import { Plus, TrendingUp, Target, Calendar } from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';
import AddIncomeModal from './AddIncomeModal';
import AddGoalModal from '../goals/create/AddGoalModal';

const QuickActions: React.FC = () => {
  return (
    <div className="quick-actions bg-[var(--bg-secondary)] p-[10px] sm:p-6 sm:rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-[10px] sm:mb-6">Quick Actions</h3>
      
      <div className="space-y-3">

        <AddExpenseModal/>
        
        <AddIncomeModal/>

        <AddGoalModal/>
        
        <button className="w-full flex items-center p-3 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-600)] transition-colors">
          <Calendar size={20} className="mr-3" />
          Monthly Report
        </button>
      </div>
    </div>
  );
};

export default QuickActions;