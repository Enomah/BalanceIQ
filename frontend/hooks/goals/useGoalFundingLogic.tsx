import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { useToastStore } from "@/store/toastStore";
import { useAppMutation } from "@/hooks/useAppMutation";
import apiClient from "@/lib/api/client";
import { Goal } from "@/types/dashboardTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useGoalStore } from "@/store/goalsStore";

interface UseGoalFundingLogicProps {
  goal: Goal;
  onGoalComplete?: (id: string) => void;
  setShowFundInput: (show: boolean) => void;
  setLocalGoal: (goal: Goal) => void;
}

export const useGoalFundingLogic = ({
  goal,
  onGoalComplete,
  setShowFundInput,
  setLocalGoal,
}: UseGoalFundingLogicProps) => {
  const { userProfile, patchUserProfile } = useAuthStore();
  const { removeGoal } = useGoalStore(); // Correct store

  const [fundAmount, setFundAmount] = useState("");
  const [submitError, setSubmitError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Focus input when shown
  // This effect belongs in the UI component or here if we pass the ref.
  // Ideally hooks just return refs.

  const fundGoalMutation = useAppMutation({
    mutationFn: (amount: number) =>
      apiClient.post(`/dashboard/goals/${goal.id || (goal as any)._id}/fund`, {
        amount,
      }),
    successMessage: "Goal funded successfully!",
    onSuccess: (response) => {
      const data = response.data; // Access data from response
      const amount = parseFloat(fundAmount);

      // Update User Balance
      patchUserProfile({
        accountBalance: (userProfile?.accountBalance || 0) - amount,
      });

      // Update Local Goal State
      if (data.goal) {
        setLocalGoal(data.goal);

        // Handle completion
        if (data.goal.status === "completed" && onGoalComplete) {
          onGoalComplete(data.goal.id || data.goal._id);
        }
      }

      // Invalidate Queries
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      setFundAmount("");
      setShowFundInput(false);
    },
    onError: (err: any) => {
      setSubmitError(err.response?.data?.message || "Failed to fund goal.");
    },
  });

  const handleFundSubmit = () => {
    setSubmitError("");
    const amount = parseFloat(fundAmount);

    if (!amount || isNaN(amount) || amount <= 0) {
      setSubmitError("Amount must be a number greater than 0");
      return;
    }

    const remaining = goal.targetAmount - goal.currentAmount;
    if (amount > remaining) {
      setSubmitError(
        `Maximum amount you can add is ${
          userProfile?.currency
        }${remaining.toLocaleString()}`
      );
      return;
    }

    fundGoalMutation.mutate(amount);
  };

  return {
    fundAmount,
    setFundAmount,
    submitError,
    isLoading: fundGoalMutation.isPending,
    handleFundSubmit,
  };
};
