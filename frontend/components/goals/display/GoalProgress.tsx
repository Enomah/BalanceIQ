import React from "react";
import { Wallet, Target } from "lucide-react";
import { Goal } from "@/types/dashboardTypes";
import { useAuthStore } from "@/store/authStore";

interface GoalProgressProps {
  goal: Goal;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const { userProfile } = useAuthStore();
  const isCompleted = goal.progress >= 100;

  return (
    <>
      <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-3 mb-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${
            isCompleted ? "bg-[var(--success-500)]" : "bg-[var(--primary-500)]"
          }`}
          style={{ width: `${Math.min(goal.progress, 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center mb-4 text-sm">
        <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
          <Wallet size={14} />
          <span>
            {userProfile?.currency}
            {goal.currentAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
          <Target size={14} />
          <span>
            {userProfile?.currency}
            {goal.targetAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </>
  );
};

export default GoalProgress;