import React from "react";
import { Target, Trophy } from "lucide-react";
import { Goal } from "@/types/dashboardTypes";

interface GoalHeaderProps {
  goal: Goal;
}

const GoalHeader: React.FC<GoalHeaderProps> = ({ goal }) => {
  const getDaysRemaining = () => {
    if (!goal.targetDate) return null;
    const target = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();
  const isCompleted = goal.status === "completed";

  return (
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-full ${
            isCompleted
              ? "bg-[var(--success-100)] text-[var(--success-600)]"
              : "bg-[var(--primary-100)] text-[var(--primary-600)]"
          }`}
        >
          {isCompleted ? <Trophy size={20} /> : <Target size={20} />}
        </div>
        <div>
          <h4 className="font-semibold text-[var(--text-primary)] capitalize">
            {goal.title}
          </h4>
          <p className="text-sm text-[var(--text-secondary)]">
            {isCompleted ? "Completed 🎉" : "Active"} •{" "}
            {daysRemaining ? `${daysRemaining} days left` : "No deadline"}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span
          className={`text-lg font-bold ${
            isCompleted ? "text-[var(--success-600)]" : "text-[var(--primary-600)]"
          }`}
        >
          {isCompleted ? "100" : goal.progress.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default GoalHeader;