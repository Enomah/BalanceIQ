import React, { useState, useEffect } from "react";
import { Plus, Loader2, Sparkles, X } from "lucide-react";
import { Goal, MonthlySummary, Transaction } from "@/types/dashboardTypes";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";
import { useDashboardStore } from "@/store/dashboardStore";
import { useGoalStore } from "@/store/goalsStore";

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
  const [fundAmount, setFundAmount] = useState("");
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, accessToken } = useAuthStore();
  const { updateMonthlySummary, dashboardData, addRecentTransaction } =
    useDashboardStore();
  const { setStats, stats } = useGoalStore();

  const handleFundGoal = async () => {
    setSubmitError("");
    const parsedAmount = parseFloat(fundAmount);

    if (!parsedAmount || parsedAmount <= 0) {
      setSubmitError("Amount must be a number greater than 0");
      return;
    }

    if (parsedAmount > localGoal.targetAmount - localGoal.currentAmount) {
      setSubmitError(
        `Maximum amount you can add is ${userProfile?.currency}${(
          localGoal.targetAmount - localGoal.currentAmount
        ).toLocaleString()}`
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${baseUrl}/dashboard/goals/${goal?.id}/fund`,
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

      // console.log(goal);

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      setLocalGoal({
        ...localGoal,
        currentAmount: data.goal.currentAmount,
        progress: data.goal.progress,
        status: data.goal.status,
      });
      setFundAmount("");
      setShowFundInput(false);

      // console.log(data.goal.status)

      if (data.goal.status === "completed") {
        console.log("completed")
        const updatedStats = {
          totalGoals: stats.totalGoals,
          totalActive: stats.totalActive -= 1,
          totalTarget: stats.totalTarget,
          totalSaved: stats.totalSaved,
        };

        setStats(updatedStats);
      }

      const updatedStats = {
        totalGoals: stats.totalGoals,
        totalActive: stats.totalActive,
        totalTarget: stats.totalTarget,
        totalSaved: (stats.totalSaved += parsedAmount),
      };

      setStats(updatedStats);

      if (dashboardData) {
        const transaction: Transaction = {
          type: "savings",
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          amount: parsedAmount,
          description: `Funded ${goal.title || "Goal"}`,
          category: "goal",
        };

        const newMonthlySummary: MonthlySummary = {
          ...dashboardData.monthlySummary,
          balance: (dashboardData.monthlySummary.balance -= transaction.amount),
        };

        addRecentTransaction(transaction);
        updateMonthlySummary(newMonthlySummary);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to fund goal. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {submitError && (
        <div className="p-3 bg-[var(--error-50)] border border-[var(--error-200)] rounded-lg text-[var(--error-700)] text-sm mb-3">
          {submitError}
        </div>
      )}
      {showFundInput && localGoal.progress < 100 && (
        <div className="mb-3 p-3 Кроме bg-[var(--bg-tertiary)] rounded-lg">
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
              onClick={handleFundGoal}
              className="px-3 bg-[var(--success-500)] text-white rounded text-sm hover:bg-[var(--success-600)] disabled:opacity-50 flex items-center space-x-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Plus size={14} />
                </>
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
