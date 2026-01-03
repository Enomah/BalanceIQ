"use client";

import React from "react";
import SkeletonLoader from "./SkeletonLoader";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "./WelcomeSection";
import AccountOverview from "./AccountOverview";
import ChartsSection from "./ChartsSection";
import GoalsSection from "../goals/display/GoalsSection";
import RecentActivity from "./RecentActivity";
import FinancialTips from "./FinancialTips";
import QuickActions from "./QuickActions";
import DashboardTour from "./Dashboardtour";
import TourTrigger from "./TourTrigger";
import { useDashboardPageLogic } from "@/hooks/dashboard/useDashboardPageLogic";
import DashboardError from "./DashboardError";

const Dashboard: React.FC = () => {
  const {
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
  } = useDashboardPageLogic();

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath={"/dashboard"} userProfile={userProfile} />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          {error ? (
            <DashboardError error={error} onRetry={() => refetch()} />
          ) : isLoading && !dashboardData ? (
            <SkeletonLoader />
          ) : (
            <div className="px-[10px] sm:px-6 pb-[20px]">
              {monthlySummary && (
                <>
                  <AccountOverview monthlySummary={monthlySummary} />
                  <ChartsSection monthlySummary={monthlySummary} />
                </>
              )}

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-[10px] sm:gap-6 mb-[10px] sm:mb-6">
                {activeGoals && (
                  <GoalsSection activeGoals={activeGoals.slice(0, 3)} />
                )}
                {recentTransactions && (
                  <RecentActivity recentTransactions={recentTransactions} />
                )}
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-3 gap-[10px] sm:gap-6">
                <FinancialTips insights={dashboardData?.insights || []} />
                <QuickActions />
              </section>

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
