"use client";

import React, { useState } from "react";
import { Goal } from "@/types/dashboardTypes";
import GoalHeader from "./GoalHeader";
import GoalProgress from "./GoalProgress";
import GoalFunding from "./GoalFunding";
import GoalWithdrawal from "./GoalWithdrawal";
import GoalActions from "./GoalActions";

interface GoalItemProps {
  goal: Goal;
  onGoalComplete?: (goalId: string) => void;
  onGoalRemove?: (goalId: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onGoalComplete,
  onGoalRemove,
}) => {
  const [showWithdrawWarning, setShowWithdrawWarning] = useState(false);
  const [showFundInput, setShowFundInput] = useState(false);
  const [localGoal, setLocalGoal] = useState<Goal>(goal);
  
  return (
    <div
      className={`goal-card p-4 border rounded-lg transition-all duration-300 hover:shadow-md relative overflow-hidden ${
        goal.progress >= 100
          ? "border-[var(--success-200)] bg-[var(--success-50)]"
          : "border-[var(--border-light)] bg-[var(--bg-secondary)]"
      }`}
    >
      <GoalHeader goal={localGoal} />
      <GoalProgress goal={localGoal} />
      <GoalFunding
        goal={goal}
        onGoalComplete={onGoalComplete}
        showFundInput={showFundInput}
        setShowFundInput={setShowFundInput}
        localGoal={localGoal}
        setLocalGoal={setLocalGoal}
      />
      <GoalWithdrawal
        goal={goal}
        onGoalRemove={onGoalRemove}
        setShowWithdrawWarning={setShowWithdrawWarning}
        showWithdrawWarning={showWithdrawWarning}
        localGoal={localGoal}
        setLocalGoal={setLocalGoal}
      />
      <GoalActions
        goal={localGoal}
        setGoal={setLocalGoal}
        onGoalRemove={onGoalRemove}
        setShowWithdrawWarning={setShowWithdrawWarning}
        setShowFundInput={setShowFundInput}
      />
    </div>
  );
};

export default GoalItem;
