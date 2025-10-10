import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Goal } from '@/types/dashboardTypes';
import GoalItem from './GoalItem';
import AddGoalModal from '../create/AddGoalModal';
import Link from 'next/link';

interface GoalsSectionProps {
  activeGoals: Goal[];
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ activeGoals }) => {
  const [goals, setGoals] = useState<Goal[]>(activeGoals);
  const [recentlyCompleted, setRecentlyCompleted] = useState<string[]>([]);

  useEffect(() => {
    setGoals(activeGoals)
  }, [activeGoals])

  const handleGoalRemove = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    setRecentlyCompleted(prev => prev.filter(id => id !== goalId));
  };

  const handleViewAllGoals = () => {
    console.log('Navigating to goals page');
  };

  const activeGoalsList = goals.filter(goal => goal.status === 'active' && goal.progress < 100);
  const completedGoals = goals.filter(goal => goal.progress >= 100);

  return (
    <div className="goals-section bg-[var(--bg-secondary)] p-[10px] sm:p-6 sm:rounded-xl shadow-sm">
      <div className="flex justify-between items-start gap-[10px] mb-6 flex-col">
        <div className='flex items-center justify-between w-full'>
         <div className=""> <h3 className="text-lg font-semibold text-[var(--text-primary)]">Your active Financial Goals</h3>
          {goals.length > 0 && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
            • {activeGoalsList.length} active •
            </p>
          )}
        </div>
        
        <Link href={'/dashboard/goals'} className='flex items-center gap-[5px] text-sm text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:underline'>All Goals<ArrowRight size={15}/></Link>
        </div>
        <AddGoalModal/>
      </div>

      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              // onGoalComplete={handleGoalComplete}
              onGoalRemove={handleGoalRemove}
            />
          ))}
        </div>
      ) : (
        <div className="text-center flex flex-col items-center justify-center py-8 text-[var(--text-tertiary)]">
          <Target size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No goals yet</p>
          <p className="text-sm mb-6">Start by creating your first financial goal</p>
          <AddGoalModal/>
        </div>
      )}
    </div>
  );
};

export default GoalsSection;