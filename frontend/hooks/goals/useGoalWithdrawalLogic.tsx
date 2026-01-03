import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { useGoalStore } from "@/store/goalsStore";
import { Goal, Transaction, MonthlySummary } from "@/types/dashboardTypes";
import { baseUrl } from "@/api/rootUrls";

interface UseGoalWithdrawalLogicProps {
  goal: Goal;
  localGoal: Goal;
  setLocalGoal: (goal: Goal) => void;
  onGoalRemove?: (id: string) => void;
  setStats: (stats: any) => void;
  stats: any;
  setShowWithdrawWarning: (show: boolean) => void;
}

export const useGoalWithdrawalLogic = ({
  goal,
  localGoal,
  setLocalGoal,
  onGoalRemove,
  setStats,
  stats,
  setShowWithdrawWarning,
}: UseGoalWithdrawalLogicProps) => {
  const { userProfile, accessToken } = useAuthStore();
  const { updateMonthlySummary, dashboardData, addRecentTransaction } =
    useDashboardStore();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const isCompleted = localGoal.progress >= 100;

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
          body: JSON.stringify({ amount: parsedAmount }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (isFullWithdrawal && localGoal.progress >= 100) {
        onGoalRemove?.(localGoal.id);
        return;
      }

      const updatedStats = {
        totalGoals: stats.totalGoals,
        totalActive: stats.totalActive,
        totalTarget: stats.totalTarget,
        totalSaved: (stats.totalSaved -= parsedAmount),
      };

      setStats(updatedStats);

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

  return {
    withdrawAmount,
    setWithdrawAmount,
    showWithdrawInput,
    setShowWithdrawInput,
    submitError,
    isLoading,
    isCompleted,
    handleWithdrawGoal,
    userProfile, // accessed in UI for currency
  };
};
