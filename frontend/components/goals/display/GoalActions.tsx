"use client";

import React, { useState } from "react";
import { Plus, Wallet, Trophy, Loader2, Trash2 } from "lucide-react";
import { Goal } from "@/types/dashboardTypes";
// import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const isCompleted = goal.status === "completed";
  const canWithdraw = goal.currentAmount > 0;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    setIsLoading(true);
    try {
      await apiClient.delete(`/dashboard/goals/${goal.id}`);
      onGoalRemove?.(goal.id);
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goalsStats"] });
    } catch {
      setSubmitError("Failed to delete goal");
    } finally {
      setIsLoading(false);
    }
  };

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
      const { data } = await apiClient.post(
        `/dashboard/goals/${goal.id}/withdraw`,
        {
          amount: parsedAmount,
          isFullWithdrawal,
        }
      );

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
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (error) {
      console.log(error);
      setSubmitError(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to withdraw from goal."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {submitError && (
        <div className="p-3 bg-[var(--error-900)]/5 border border-[var(--error-700)] rounded-lg text-[var(--error-700)] text-sm mb-3">
          {submitError}
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {!isCompleted ? (
            <>
              <button
                onClick={() => setShowFundInput(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[var(--primary-500)] text-white rounded-lg text-sm hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50 font-medium"
                disabled={isLoading}
              >
                <Plus size={14} />
                <span>Fund</span>
              </button>
              <button
                onClick={() => setShowWithdrawWarning(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-light)] text-[var(--text-secondary)] rounded-lg text-sm hover:bg-[var(--bg-secondary)] hover:text-amber-600 transition-colors disabled:opacity-50"
                disabled={!canWithdraw || isLoading}
              >
                <Wallet size={14} />
                <span>Withdraw</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => handleWithdrawGoal(goal.currentAmount)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[var(--success-500)] text-white rounded-lg text-sm hover:bg-[var(--success-600)] transition-colors disabled:opacity-50"
              disabled={!canWithdraw || isLoading}
            >
              {isLoading ? (
                <Loader2 className="text-white animate-spin" size={14} />
              ) : (
                <>
                  <Trophy size={14} />
                  <span>Withdraw Safe</span>
                </>
              )}
            </button>
          )}
        </div>

        <button
          onClick={handleDelete}
          className="p-2 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
          title="Delete Goal"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

export default GoalActions;
