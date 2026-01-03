import { useCallback, useState, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGoalStore } from "@/store/goalsStore";
import { useGoals } from "@/hooks/useGoals";
import { ActiveTab } from "@/types/dashboardTypes";

export const useGoalsPageLogic = () => {
  const { userProfile } = useAuthStore();
  const { removeGoal } = useGoalStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("active");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
    refetch,
  } = useGoals(activeTab);

  const goals = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) || [];
  }, [data]);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
  }, []);

  const handleRemoveGoal = (goalId: string) => removeGoal(goalId);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    userProfile,
    activeTab,
    goals,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    handleTabChange,
    handleRemoveGoal,
    loadMore,
  };
};
