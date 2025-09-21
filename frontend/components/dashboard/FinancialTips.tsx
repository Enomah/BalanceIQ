// FinancialTips.tsx
import React from 'react';
import { Lightbulb, PiggyBank } from 'lucide-react';
import { MonthlySummary, Goal } from '@/types/dashboardTypes';

interface FinancialTipsProps {
  monthlySummary: MonthlySummary;
  activeGoals: Goal[];
}

const FinancialTips: React.FC<FinancialTipsProps> = ({ monthlySummary, activeGoals }) => {
  return (
    <div className="tips-section bg-[var(--bg-secondary)] p-[10px] sm:p-6 sm:rounded-xl shadow-sm lg:col-span-2">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-[10px] sm:mb-6">Financial Tips</h3>
      
      <div className="tip-card p-4 bg-[var(--primary-50)] dark:bg-[var(--primary-900)] rounded-lg mb-4">
        <div className="flex">
          <div className="bg-[var(--primary-100)] dark:bg-[var(--primary-800)] p-2 rounded-full mr-3">
            <Lightbulb size={20} className="text-[var(--primary-600)] dark:text-[var(--primary-400)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-primary)]">Emergency Fund Progress</h4>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              You've saved ${activeGoals[0]?.currentAmount || 0} of your ${activeGoals[0]?.targetAmount || 0} target. Keep contributing regularly to build your safety net!
            </p>
          </div>
        </div>
      </div>
      
      <div className="tip-card p-4 bg-[var(--success-50)] dark:bg-[var(--success-900)] rounded-lg">
        <div className="flex">
          <div className="bg-[var(--success-100)] dark:bg-[var(--success-800)] p-2 rounded-full mr-3">
            <PiggyBank size={20} className="text-[var(--success-600)] dark:text-[var(--success-400)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-primary)]">Saving Strategy</h4>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Consider setting aside 20% of your income for savings. You're currently at {(monthlySummary.balance / monthlySummary.income * 100).toFixed(0)}% this month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialTips;