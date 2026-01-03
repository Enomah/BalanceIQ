import { useState } from "react";
import { Goal } from "@/types/dashboardTypes";

export const useGoalItemLogic = (goal: Goal) => {
  const [showWithdrawWarning, setShowWithdrawWarning] = useState(false);
  const [showFundInput, setShowFundInput] = useState(false);
  const [localGoal, setLocalGoal] = useState<Goal>(goal);

  return {
    showWithdrawWarning,
    setShowWithdrawWarning,
    showFundInput,
    setShowFundInput,
    localGoal,
    setLocalGoal,
  };
};
