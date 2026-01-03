import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useBudget } from "@/hooks/useBudget";

type ViewMode = "overview" | "categories";

export const useBudgetingPageLogic = () => {
  const { userProfile } = useAuthStore();
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [view, setView] = useState<ViewMode>("overview");

  const {
    data: budgetData,
    isLoading,
    error,
    refetch: fetchData,
  } = useBudget();

  const handleCreateBudget = () => {
    fetchData();
    setShowBudgetForm(false);
  };

  const toggleView = () => {
    setView((prev) => (prev === "overview" ? "categories" : "overview"));
  };

  return {
    userProfile,
    budgetData,
    isLoading,
    error,
    fetchData,
    showBudgetForm,
    setShowBudgetForm,
    view,
    setView,
    handleCreateBudget,
    toggleView,
  };
};
