"use client";

import React, { useState } from "react";
import { Plus, Wallet, Trophy, Sparkles, Loader2 } from "lucide-react";
import { Goal } from "@/types/dashboardTypes";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";

interface GoalActionsProps {
  goal: Goal;
  setShowWithdrawWarning: (value: boolean) => void;
  setShowFundInput: (value: boolean) => void;
  onGoalRemove?: (value: string) => void;
  setGoal: (value: Goal) => void;
}

const GoalActions: React.FC<GoalActionsProps> = ({
  goal,
  setShowWithdrawWarning,
  setShowFundInput,
  onGoalRemove,
  setGoal,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuthStore();
  const isCompleted = goal.status === "completed";
  const canWithdraw = goal.currentAmount > 0;

  const handleWithdrawGoal = async (amount?: number) => {
    setSubmitError("");
    const parsedAmount = amount || parseFloat(withdrawAmount);
    const isFullWithdrawal = parsedAmount === goal.currentAmount;

    if (
      !parsedAmount ||
      parsedAmount <= 0 ||
      parsedAmount > goal.currentAmount
    ) {
      setSubmitError("Please enter a valid amount to withdraw");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${baseUrl}/dashboard/goals/${goal.id}/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount: parsedAmount,
            isFullWithdrawal,
          }),
        }
      );

      const data = await response.json();

      // console.log(data);

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (isFullWithdrawal && goal.progress >= 100) {
        onGoalRemove?.(goal.id);
        return;
      }

      setGoal({
        ...goal,
        currentAmount: data.goal.currentAmount,
        progress: data.goal.progress,
        status: data.goal.status,
      });
      setWithdrawAmount("");
    } catch (error) {
      console.log(error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to withdraw from goal. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      {submitError && (
        <div className="p-3 bg-[var(--error-900)]/5 border border-[var(--error-700)] rounded-lg text-[var(--error-700)] text-sm mb-3">
          {submitError}
        </div>
      )}
      <div className="flex space-x-2">
        {!isCompleted ? (
          <>
            <button
              onClick={() => setShowFundInput(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-[var(--primary-500)] text-white rounded-lg text-sm hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50"
              disabled={false}
            >
              <Plus size={14} />
              <span>Fund</span>
            </button>
            <button
              onClick={() => setShowWithdrawWarning(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-[var(--warning-500)] text-white rounded-lg text-sm hover:bg-[var(--warning-600)] transition-colors disabled:opacity-50"
              disabled={!canWithdraw}
            >
              <Wallet size={14} />
              <span>Withdraw</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => handleWithdrawGoal(goal.currentAmount)}
            className="flex items-center space-x-1 px-3 py-1 bg-[var(--success-500)] text-white rounded-lg text-sm hover:bg-[var(--success-600)] transition-colors disabled:opacity-50"
            disabled={!canWithdraw}
          >
            {isLoading ? (
              <Loader2 className="text-[var(--foreground)] animate-spin" size={14}/>
            ) : (
              <>
                <Trophy size={14} />
                <span>Withdraw & Archive</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalActions;
