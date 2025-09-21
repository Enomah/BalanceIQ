// GoalsSection.tsx
import React from 'react';
import { Plus, Target } from 'lucide-react';
import { Goal } from '@/types/dashboardTypes';

interface GoalsSectionProps {
  activeGoals: Goal[];
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ activeGoals }) => {
  return (
    <div className="goals-section bg-[var(--bg-secondary)] p-[10px] sm:p-6 sm:rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Your Financial Goals</h3>
        <button className="p-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] transition-colors">
          <Plus size={20} />
        </button>
      </div>
      
      {activeGoals.length > 0 ? (
        <div className="space-y-4">
          {activeGoals.map(goal => (
            <div key={goal.id} className="goal-card p-4 border border-[var(--border-light)] rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-[var(--text-primary)] capitalize">{goal.title}</h4>
                <span className="text-sm font-medium text-[var(--primary-600)] dark:text-[var(--primary-400)]">{goal.progress}%</span>
              </div>
              
              <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2.5 mb-3">
                <div 
                  className="bg-[var(--primary-500)] h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>${goal.currentAmount.toLocaleString()}</span>
                <span>${goal.targetAmount.toLocaleString()}</span>
              </div>

              {goal.progress >= 25 && (
                <div className="mt-3 flex">
                  {goal.progress >= 25 && <span className="text-xs bg-[var(--success-100)] text-[var(--success-800)] dark:bg-[var(--success-900)] dark:text-[var(--success-400)] px-2 py-1 rounded mr-2">🏅 25%</span>}
                  {goal.progress >= 50 && <span className="text-xs bg-[var(--success-100)] text-[var(--success-800)] dark:bg-[var(--success-900)] dark:text-[var(--success-400)] px-2 py-1 rounded mr-2">🥈 50%</span>}
                  {goal.progress >= 75 && <span className="text-xs bg-[var(--success-100)] text-[var(--success-800)] dark:bg-[var(--success-900)] dark:text-[var(--success-400)] px-2 py-1 rounded mr-2">🥇 75%</span>}
                  {goal.progress >= 100 && <span className="text-xs bg-[var(--success-100)] text-[var(--success-800)] dark:bg-[var(--success-900)] dark:text-[var(--success-400)] px-2 py-1 rounded">🏆 Complete</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--text-tertiary)]">
          <Target size={48} className="mx-auto mb-4 opacity-50" />
          <p>No active goals</p>
          <p className="text-sm mt-1">Create your first financial goal to get started</p>
        </div>
      )}
    </div>
  );
};

export default GoalsSection;