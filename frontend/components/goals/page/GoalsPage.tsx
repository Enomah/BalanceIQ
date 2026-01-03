"use client";

import { useRequireAuth } from "@/lib/useRequireAuth";
import Sidebar from "@/components/sidebar/Sidebar";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import GoalsStats from "./GoalsStats";
import GoalsSkeleton from "./GoalsSkeleton";
import GoalsError from "./GoalsError";
import GoalsHeader from "./GoalsHeader";
import GoalsTabs from "./GoalsTabs";
import ActiveGoalsSection from "./ActiveGoalsSection";
import CompletedGoalsSection from "./CompletedGoalsSection";
import { useGoalsPageLogic } from "@/hooks/goals/useGoalsPageLogic";

export default function GoalsPage() {
  useRequireAuth();

  const {
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
  } = useGoalsPageLogic();

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath="/dashboard/goals" userProfile={userProfile} />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          <div className="mx-auto px-[10px] sm:px-6">
            <GoalsStats goals={goals} />

            {isLoading && goals.length === 0 ? (
              <GoalsSkeleton />
            ) : (
              <>
                <GoalsHeader />

                <GoalsTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />

                {error && (
                  <GoalsError
                    error={
                      (error as { message?: string })?.message ||
                      "Failed to load goals"
                    }
                    onRetry={() => refetch()}
                  />
                )}

                <div className="relative">
                  {activeTab === "active" ? (
                    <ActiveGoalsSection
                      goals={goals}
                      loadingMore={isFetchingNextPage}
                      hasMore={hasNextPage}
                      onLoadMore={loadMore}
                      onRemoveGoal={handleRemoveGoal}
                    />
                  ) : (
                    <CompletedGoalsSection
                      goals={goals}
                      loadingMore={isFetchingNextPage}
                      hasMore={hasNextPage}
                      onLoadMore={loadMore}
                      onRemoveGoal={handleRemoveGoal}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
