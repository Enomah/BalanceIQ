import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDashboard } from "@/hooks/useDashboard";
import { getLocalStorage, setLocalStorage } from "@/lib/storage";

export const useDashboardPageLogic = () => {
  const { userProfile } = useAuthStore();
  const { data: dashboardData, isLoading, error, refetch } = useDashboard();
  const [showTour, setShowTour] = useState<boolean>(false);
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(false);

  useEffect(() => {
    const tourSeen = getLocalStorage("dashboardTourSeen");
    if (!tourSeen) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setHasSeenTour(true);
    }
  }, []);

  const handleTourClose = () => {
    setShowTour(false);
    setLocalStorage("dashboardTourSeen", "true");
    setHasSeenTour(true);
  };

  const handleTourOpen = () => {
    setShowTour(true);
  };

  const monthlySummary = dashboardData?.monthlySummary;
  const recentTransactions = dashboardData?.recentTransactions;
  const activeGoals = dashboardData?.activeGoals;

  return {
    userProfile,
    dashboardData,
    isLoading,
    error,
    refetch,
    showTour,
    hasSeenTour,
    handleTourClose,
    handleTourOpen,
    monthlySummary,
    recentTransactions,
    activeGoals,
  };
};
