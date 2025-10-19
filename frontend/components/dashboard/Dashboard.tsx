"use client";

import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState } from "react";
import { MenuItem } from "@/types/dashboardTypes";
import SkeletonLoader from "./SkeletonLoader";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "./WelcomeSection";
import AccountOverview from "./AccountOverview";
import ChartsSection from "./ChartsSection";
import GoalsSection from "../goals/display/GoalsSection";
import RecentActivity from "./RecentActivity";
// import FinancialTips from "./FinancialTips";
// import QuickActions from "./QuickActions";
import { getLocalStorage, setLocalStorage } from "@/lib/storage";
import DashboardTour from "./Dashboardtour";
import TourTrigger from "./TourTrigger";
import { useDashboardStore } from "@/store/dashboardStore";

const Dashboard: React.FC = () => {
  const { userProfile, logout } = useAuthStore();
  const { dashboardData, loading, error, fetchDashboard } = useDashboardStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>("/dashboard");
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

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboardData) return null;

  const { monthlySummary, recentTransactions, activeGoals } = dashboardData;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath={currentPath} userProfile={userProfile} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          {error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6 bg-[var(--bg-secondary)] rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Error Loading Dashboard
                </h2>
                <p className="text-[var(--text-secondary)] mb-4">{error}</p>
                <button
                  onClick={fetchDashboard}
                  className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : loading && !dashboardData ? (
            <SkeletonLoader />
          ) : (
            <div className="px-[10px] sm:px-6 pb-[20px]">
              <AccountOverview monthlySummary={monthlySummary} />
              <ChartsSection monthlySummary={monthlySummary} />

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-[10px] sm:gap-6 mb-[10px] sm:mb-6">
                <GoalsSection activeGoals={activeGoals} />
                <RecentActivity recentTransactions={recentTransactions} />
              </section>

              {/* Uncomment if needed
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[10px] sm:gap-6">
          <FinancialTips
            monthlySummary={monthlySummary}
            activeGoals={activeGoals}
          />
          <QuickActions />
        </section>
        */}

              <DashboardTour isOpen={showTour} onClose={handleTourClose} />
            </div>
          )}

          {hasSeenTour && (
            <TourTrigger
              onClick={handleTourOpen}
              className="bottom-6 right-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
