"use client";

import React, { useState } from "react";
import { AlertTriangle, Wallet, Loader2, Check, X, Trophy } from "lucide-react";
import { Goal, MonthlySummary, Transaction } from "@/types/dashboardTypes";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";
import Modal from "@/components/ui/Modal";
import { useDashboardStore } from "@/store/dashboardStore";

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
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, accessToken } = useAuthStore();
  const isCompleted = localGoal.progress >= 100;
  const { updateMonthlySummary, dashboardData, addRecentTransaction } =
    useDashboardStore();
  // const canWithdraw = localGoal.currentAmount > 0;

  const handleWithdrawGoal = async (amount?: number) => {
    setSubmitError("");
    const parsedAmount = amount || parseFloat(withdrawAmount);
    const isFullWithdrawal = parsedAmount === localGoal.currentAmount;

    if (
      !parsedAmount ||
      parsedAmount <= 0 ||
      parsedAmount > localGoal.currentAmount
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
            // isFullWithdrawal,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (isFullWithdrawal && localGoal.progress >= 100) {
        onGoalRemove?.(localGoal.id);
        return;
      }

      setLocalGoal({
        ...localGoal,
        currentAmount: data.goal.currentAmount,
        progress: data.goal.progress,
        status: data.goal.status,
      });
      setWithdrawAmount("");
      setShowWithdrawInput(false);
      setShowWithdrawWarning(false);

      if (dashboardData) {
        const transaction: Transaction = {
          type: "savings",
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          amount: parsedAmount,
          description: `Withdrawal from ${goal.title || "Goal"}`,
          category: "goal",
        };

        const newMonthlySummary: MonthlySummary = {
          ...dashboardData.monthlySummary,
          balance: (dashboardData.monthlySummary.balance += transaction.amount),
        };

        addRecentTransaction(transaction);
        updateMonthlySummary(newMonthlySummary);
      }
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

  const handleFullWithdrawal = () => {
    handleWithdrawGoal(localGoal.currentAmount);
  };

  return (
    <>
      {submitError && (
        <div className="p-3 bg-[var(--error-900)]/5 border border-[var(--error-700)] rounded-lg text-[var(--error-700)] text-sm mb-3">
          {submitError}
        </div>
      )}
      <Modal
        isOpen={showWithdrawWarning}
        onClose={() => setShowWithdrawWarning(false)}
        title="Withdrawal Warning"
      >
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg max-w-sm mx-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="text-[var(--warning-600)]" size={24} />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Withdrawal Impact
            </h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Withdrawing funds from an active goal will:
          </p>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2 mb-4">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[var(--warning-500)] rounded-full"></div>
              <span>Reduce your discipline score</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[var(--warning-500)] rounded-full"></div>
              <span>Delay your goal achievement</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[var(--success-500)] rounded-full"></div>
              <span>Return funds to your available balance</span>
            </li>
          </ul>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowWithdrawWarning(false)}
              className="flex-1 py-2 border border-[var(--border-light)] rounded text-sm hover:bg-[var(--bg-tertiary)]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowWithdrawWarning(false);
                setShowWithdrawInput(true);
              }}
              className="flex-1 py-2 bg-[var(--warning-500)] text-white rounded text-sm hover:bg-[var(--warning-600)]"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
      {showWithdrawInput && (
        <div className="mb-3 p-3 bg-[var(--bg-tertiary)] rounded-lg">
          {!isCompleted && (
            <div className="flex items-center space-x-2 text-[var(--warning-600)] text-sm mb-2 p-2 bg-[var(--warning-50)] rounded">
              <AlertTriangle size={14} />
              <span>This will affect your discipline score</span>
            </div>
          )}
          <p className="text-[12px] mb-[5px] italic text-[var(--text-secondary)]">
            {isCompleted
              ? "Withdraw your completed goal funds back to your account"
              : "Withdraw funds back to your account balance"}
          </p>
          <div className="flex space-x-2 mb-2">
            <input
              type="number"
              placeholder={`Amount to withdraw (max: ${
                userProfile?.currency
              }${localGoal.currentAmount.toLocaleString()})`}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="flex-1 p-2 border border-[var(--border-light)] rounded text-sm"
              min="1"
              max={localGoal.currentAmount}
              disabled={isLoading}
            />
            <button
              onClick={() => handleWithdrawGoal()}
              className="px-3 bg-[var(--warning-500)] text-white rounded text-sm hover:bg-[var(--warning-600)] disabled:opacity-50 flex items-center space-x-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Check size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setShowWithdrawInput(false);
                setWithdrawAmount("");
              }}
              className="px-3 bg-[var(--neutral-200)] text-[var(--neutral-700)] rounded text-sm hover:bg-[var(--neutral-300)]"
              disabled={isLoading}
            >
              <X size={14} />
            </button>
          </div>
          {/* {isCompleted && (
            <button
              onClick={handleFullWithdrawal}
              className="w-full py-2 bg-[var(--success-500)] text-white rounded text-sm hover:bg-[var(--success-600)] disabled:opacity-50 flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <Trophy size={14} />
              <span>Withdraw Full Amount & Archive Goal</span>
            </button>
          )} */}
        </div>
      )}
    </>
  );
};

export default GoalWithdrawal;
