"use client";

import { Plus, Loader2, X } from "lucide-react";
import { Goal } from "@/types/dashboardTypes";
import { useGoalFundingLogic } from "@/hooks/goals/useGoalFundingLogic";

interface GoalFundingProps {
  goal: Goal;
  onGoalComplete?: (goalId: string) => void;
  setShowFundInput: (value: boolean) => void;
  showFundInput: boolean;
  localGoal: Goal;
  setLocalGoal: (value: Goal) => void;
}

const GoalFunding: React.FC<GoalFundingProps> = ({
  goal,
  onGoalComplete,
  showFundInput,
  setShowFundInput,
  localGoal,
  setLocalGoal,
}) => {
  const {
    fundAmount,
    setFundAmount,
    submitError,
    isLoading,
    handleFundSubmit,
  } = useGoalFundingLogic({
    goal,
    onGoalComplete,
    setShowFundInput,
    setLocalGoal,
  });

  return (
    <>
      {submitError && (
        <div className="p-3 bg-[var(--error-50)] border border-[var(--error-200)] rounded-lg text-[var(--error-700)] text-sm mb-3">
          {submitError}
        </div>
      )}
      {showFundInput && localGoal.progress < 100 && (
        <div className="mb-3 p-3 bg-[var(--bg-tertiary)] rounded-lg">
          <p className="text-[12px] mb-[5px] italic text-[var(--text-secondary)]">
            Funds will be deducted from your current balance and allocated to
            this goal.
          </p>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Amount to add"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="flex-1 p-2 border border-[var(--border-light)] rounded text-sm"
              min="1"
              max={localGoal.targetAmount - localGoal.currentAmount}
              disabled={isLoading}
            />
            <button
              onClick={handleFundSubmit}
              className="px-3 bg-[var(--success-500)] text-white rounded text-sm hover:bg-[var(--success-600)] disabled:opacity-50 flex items-center space-x-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Plus size={14} />
              )}
            </button>
            <button
              onClick={() => setShowFundInput(false)}
              className="px-3 bg-[var(--neutral-200)] text-[var(--neutral-700)] rounded text-sm hover:bg-[var(--neutral-300)]"
              disabled={isLoading}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GoalFunding;
