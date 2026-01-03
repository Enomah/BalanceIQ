"use client";

import React from "react";
import { Goal } from "@/types/dashboardTypes";
import { useGoalStore } from "@/store/goalsStore";
import { useGoalWithdrawalLogic } from "@/hooks/goals/useGoalWithdrawalLogic";
import WithdrawalWarningModal from "./WithdrawalWarningModal";
import WithdrawalInput from "./WithdrawalInput";

interface GoalWithdrawalProps {
  goal: Goal;
  onGoalRemove?: (goalId: string) => void;
  setShowWithdrawWarning: (value: boolean) => void;
  showWithdrawWarning: boolean;
  localGoal: Goal;
  setLocalGoal: (value: Goal) => void;
}

const GoalWithdrawal: React.FC<GoalWithdrawalProps> = ({
  goal,
  onGoalRemove,
  showWithdrawWarning,
  setShowWithdrawWarning,
  localGoal,
  setLocalGoal,
}) => {
  const { setStats, stats } = useGoalStore();

  const {
    withdrawAmount,
    setWithdrawAmount,
    showWithdrawInput,
    setShowWithdrawInput,
    submitError,
    isLoading,
    isCompleted,
    handleWithdrawGoal,
    userProfile,
  } = useGoalWithdrawalLogic({
    goal,
    localGoal,
    setLocalGoal,
    onGoalRemove,
    setStats,
    stats,
    setShowWithdrawWarning,
  });

  return (
    <>
      {submitError && (
        <div className="p-3 bg-[var(--error-900)]/5 border border-[var(--error-700)] rounded-lg text-[var(--error-700)] text-sm mb-3">
          {submitError}
        </div>
      )}

      <WithdrawalWarningModal
        isOpen={showWithdrawWarning}
        onClose={() => setShowWithdrawWarning(false)}
        onContinue={() => {
          setShowWithdrawWarning(false);
          setShowWithdrawInput(true);
        }}
      />

      <WithdrawalInput
        showWithdrawInput={showWithdrawInput}
        isCompleted={isCompleted}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        maxAmount={localGoal.currentAmount}
        currency={userProfile?.currency}
        isLoading={isLoading}
        onWithdraw={() => handleWithdrawGoal()}
        onClose={() => {
          setShowWithdrawInput(false);
          setWithdrawAmount("");
        }}
      />
    </>
  );
};

export default GoalWithdrawal;
