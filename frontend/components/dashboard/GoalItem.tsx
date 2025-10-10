import React, { useState } from "react";
import { Target, Plus, Wallet, Loader2, Check, X, AlertTriangle, Trophy, Sparkles } from "lucide-react";
import { Goal } from "@/types/dashboardTypes";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";
import Modal from "../ui/Modal";

interface GoalItemProps {
  goal: Goal;
  onGoalComplete?: (goalId: string) => void;
  onGoalRemove?: (goalId: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onGoalComplete, onGoalRemove }) => {
  const [fundAmount, setFundAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showFundInput, setShowFundInput] = useState(false);
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [showWithdrawWarning, setShowWithdrawWarning] = useState(false);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
  const { userProfile, accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [localGoal, setLocalGoal] = useState<Goal>(goal);

  // Check if goal was just completed
  React.useEffect(() => {
    if (localGoal.progress >= 100 && goal.progress < 100) {
      setShowCompletionCelebration(true);
      setTimeout(() => setShowCompletionCelebration(false), 3000);
      onGoalComplete?.(localGoal.id);
    }
  }, [localGoal.progress, goal.progress, localGoal.id, onGoalComplete]);

  const handleFundGoal = async () => {
    setSubmitError("");
    const parsedAmount = parseFloat(fundAmount);

    if (!parsedAmount || parsedAmount <= 0) {
      setSubmitError("Amount must be a number greater than 0");
      return;
    }

    if (parsedAmount > (localGoal.targetAmount - localGoal.currentAmount)) {
      setSubmitError(`Maximum amount you can add is ${userProfile?.currency}${(localGoal.targetAmount - localGoal.currentAmount).toLocaleString()}`);
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

  const handleWithdrawGoal = async (amount?: number) => {
    setSubmitError("");
    const parsedAmount = amount || parseFloat(withdrawAmount);
    const isFullWithdrawal = parsedAmount === localGoal.currentAmount;

    if (!parsedAmount || parsedAmount <= 0 || parsedAmount > localGoal.currentAmount) {
      setSubmitError("Please enter a valid amount to withdraw");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${baseUrl}/dashboard/goals/${goal?.id}/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ 
            amount: parsedAmount,
            isFullWithdrawal 
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      // If full withdrawal on completed goal, remove from UI
      if (isFullWithdrawal && localGoal.progress >= 100) {
        onGoalRemove?.(localGoal.id);
        return;
      }

      // Update local goal state
      setLocalGoal({
        ...localGoal,
        currentAmount: data.goal.currentAmount,
        progress: data.goal.progress,
        status: data.goal.status,
      });

      setWithdrawAmount("");
      setShowWithdrawInput(false);
      setShowWithdrawWarning(false);
    } catch (error) {
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

  const getDaysRemaining = () => {
    if (!localGoal.targetDate) return null;
    const target = new Date(localGoal.targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();
  const isCompleted = localGoal.progress >= 100;
  const canWithdraw = localGoal.currentAmount > 0;

  return (
    <div
      className={`goal-card p-4 border rounded-lg transition-all duration-300 hover:shadow-md relative overflow-hidden ${
        isCompleted
          ? "border-[var(--success-200)] bg-[var(--success-50)]"
          : "border-[var(--border-light)] bg-[var(--bg-secondary)]"
      } ${showCompletionCelebration ? "animate-pulse" : ""}`}
    >
      {showCompletionCelebration && (
        <div className="absolute inset-0 bg-[var(--success-500)]/10 flex items-center justify-center z-10">
          <div className="text-center">
            <Sparkles className="mx-auto mb-2 text-[var(--success-600)]" size={32} />
            <p className="text-lg font-bold text-[var(--success-700)]">Goal Achieved! 🎉</p>
            <p className="text-sm text-[var(--success-600)]">Congratulations!</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="p-3 bg-[var(--error-50)] border border-[var(--error-200)] rounded-lg text-[var(--error-700)] text-sm mb-3">
          {submitError}
        </div>
      )}

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
              {localGoal.title}
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
              isCompleted
                ? "text-[var(--success-600)]"
                : "text-[var(--primary-600)]"
            }`}
          >
            {localGoal.progress.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-3 mb-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${
            isCompleted ? "bg-[var(--success-500)]" : "bg-[var(--primary-500)]"
          }`}
          style={{ width: `${Math.min(localGoal.progress, 100)}%` }}
        />
      </div>

      {/* Amounts and Progress */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
          <Wallet size={14} />
          <span>
            {userProfile?.currency}
            {localGoal.currentAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
          <Target size={14} />
          <span>
            {userProfile?.currency}
            {localGoal.targetAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {showFundInput && !isCompleted && (
        <div className="mb-3 p-3 bg-[var(--bg-tertiary)] rounded-lg">
          <p className="text-[12px] mb-[5px] italic text-[var(--text-secondary)]">
            Funds will be deducted from your current balance and allocated to this goal.
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
                  <span>Add</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowFundInput(false)}
              className="px-3 bg-[var(--neutral-200)] text-[var(--neutral-700)] rounded text-sm hover:bg-[var(--neutral-300)]"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={showWithdrawWarning} onClose={() => setShowWithdrawWarning(false)} title={"Warning"}>
         <div className="bg-[var(--bg-secondary)] p-6 rounded-lg max-w-sm mx-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="text-[var(--warning-600)]" size={24} />
              <h3 className="font-semibold text-[var(--text-primary)]">Withdrawal Impact</h3>
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
              : "Withdraw funds back to your account balance"
            }
          </p>
          
          <div className="flex space-x-2 mb-2">
            <input
              type="number"
              placeholder={`Amount to withdraw (max: ${userProfile?.currency}${localGoal.currentAmount.toLocaleString()})`}
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
                <>
                  <Check size={14} />
                </>
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

          {isCompleted && (
            <button
              onClick={handleFullWithdrawal}
              className="w-full py-2 bg-[var(--success-500)] text-white rounded text-sm hover:bg-[var(--success-600)] disabled:opacity-50 flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <Trophy size={14} />
              <span>Withdraw Full Amount & Archive Goal</span>
            </button>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {!isCompleted ? (
            <>
              <button
                onClick={() => setShowFundInput(!showFundInput)}
                className="flex items-center space-x-1 px-3 py-1 bg-[var(--primary-500)] text-white rounded-lg text-sm hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <Plus size={14} />
                <span>Fund</span>
              </button>

              <button
                onClick={() => setShowWithdrawWarning(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-[var(--warning-500)] text-white rounded-lg text-sm hover:bg-[var(--warning-600)] transition-colors disabled:opacity-50"
                disabled={isLoading || !canWithdraw}
              >
                <Wallet size={14} />
                <span>Withdraw</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowWithdrawInput(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-[var(--success-500)] text-white rounded-lg text-sm hover:bg-[var(--success-600)] transition-colors disabled:opacity-50"
              disabled={isLoading || !canWithdraw}
            >
              <Trophy size={14} />
              <span>Withdraw & Archive</span>
            </button>
          )}
        </div>

        {isCompleted && canWithdraw && (
          <button
            onClick={handleFullWithdrawal}
            className="text-[var(--success-600)] hover:text-[var(--success-700)] text-sm font-medium transition-colors flex items-center space-x-1"
            disabled={isLoading}
          >
            <span>Quick Withdraw</span>
            <Sparkles size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalItem;