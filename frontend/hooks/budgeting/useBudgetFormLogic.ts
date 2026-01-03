import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { useAppMutation } from "@/hooks/useAppMutation";
import apiClient from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { MonthlyBudget } from "@/types/budgetTypes";
import { expenseCategories } from "@/constants/transaction";

interface UseBudgetFormLogicProps {
  existingBudget?: MonthlyBudget | null;
  onSubmit: () => void;
  onClose: () => void;
}

export const useBudgetFormLogic = ({
  existingBudget,
  onSubmit,
  onClose,
}: UseBudgetFormLogicProps) => {
  const { userProfile } = useAuthStore();
  const { dashboardData } = useDashboardStore();
  const queryClient = useQueryClient();

  const [totalBudget, setTotalBudget] = useState(
    existingBudget?.totalBudget.toString() || ""
  );
  const [allocations, setAllocations] = useState<Record<string, string>>(
    existingBudget?.categories.reduce(
      (acc, cat) => ({
        ...acc,
        [cat.key]: cat.allocated.toString(),
      }),
      {}
    ) || {}
  );

  const budgetMutation = useAppMutation({
    mutationFn: async (data: any) => {
      const id = existingBudget?._id || existingBudget?.id;
      if (id) {
        return apiClient.put(`/dashboard/budget/${id}`, data);
      }
      return apiClient.post("/dashboard/budget", data);
    },
    successMessage: existingBudget
      ? "Budget updated successfully"
      : "Budget created successfully",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onSubmit();
      onClose();
    },
  });

  const allocatedTotal = Object.values(allocations).reduce(
    (sum, value) => sum + (parseFloat(value) || 0),
    0
  );
  const remaining = parseFloat(totalBudget) - allocatedTotal;

  const handleAllocationChange = (categoryKey: string, value: string) => {
    setAllocations((prev) => ({
      ...prev,
      [categoryKey]: value,
    }));
  };

  const handleDistributeRemaining = () => {
    if (remaining <= 0) return;

    const emptyCategories = expenseCategories.filter(
      (cat) => !allocations[cat.key] || parseFloat(allocations[cat.key]) === 0
    );

    const categoriesToDistribute =
      emptyCategories.length > 0 ? emptyCategories : expenseCategories;

    const amountPerCategory = remaining / categoriesToDistribute.length;
    const newAllocations = { ...allocations };

    categoriesToDistribute.forEach((cat) => {
      const currentAllocation = parseFloat(newAllocations[cat.key]) || 0;
      newAllocations[cat.key] = (currentAllocation + amountPerCategory).toFixed(
        2
      );
    });

    setAllocations(newAllocations);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categories = expenseCategories.map((cat) => ({
      key: cat.key,
      allocated: parseFloat(allocations[cat.key]) || 0,
    }));

    budgetMutation.mutate({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalBudget: parseFloat(totalBudget),
      categories,
    });
  };

  return {
    userProfile,
    dashboardData,
    totalBudget,
    setTotalBudget,
    allocations,
    handleAllocationChange,
    handleDistributeRemaining,
    handleSubmit,
    allocatedTotal,
    remaining,
    budgetMutation,
  };
};
