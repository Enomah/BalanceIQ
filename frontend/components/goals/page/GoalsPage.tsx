"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";
import { requireAuth } from "@/lib/requireAuth";

import Sidebar from "@/components/sidebar/Sidebar";
import WelcomeSection from "@/components/dashboard/WelcomeSection";

import GoalsStats from "./GoalsStats";
import GoalsSkeleton from "./GoalsSkeleton";
import GoalsError from "./GoalsError";
import { Goal } from "@/types/dashboardTypes";
import GoalsHeader from "./GoalsHeader";
import { useGoalStore } from "@/store/goalsStore";
import GoalsTabs from "./GoalsTabs";
import ActiveGoalsSection from "./ActiveGoalsSection";
import CompletedGoalsSection from "./CompletedGoalsSection";

interface Pagination {
  count: number;
  next: string | null;
  prev: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  content: Goal[];
}

type ActiveTab = "active" | "completed";

export default function GoalsPage() {
  const { userProfile, accessToken } = useAuthStore();
  const { 
    goals,  
    removeGoal, 
    setActiveGoals, 
    setCompletedGoals,
    addActiveGoals,
    addCompletedGoals 
  } = useGoalStore();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>("active");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<Pagination, "content"> | null>(null);

  // Refs to track pagination for each tab
  const activePaginationRef = useRef<Omit<Pagination, "content"> | null>(null);
  const completedPaginationRef = useRef<Omit<Pagination, "content"> | null>(null);

  requireAuth();

  const fetchGoals = useCallback(
    async (url: string, isLoadMore = false, tab: ActiveTab = "active") => {
      try {
        if (isLoadMore) setLoadingMore(true);
        else if (!isLoadMore && tab === activeTab) setLoading(true);
        
        setError(null);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch ${tab} goals: ${res.status}`);

        const data = await res.json();

        // Store pagination for the specific tab
        const paginationData = {
          count: data.count,
          next: data.next,
          prev: data.prev,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          pageSize: data.pageSize,
        };

        if (tab === "active") {

          console.log(data)
          activePaginationRef.current = paginationData;
          if (isLoadMore) {
            console.log(data)
            addActiveGoals(data.content);
          } else {
            setActiveGoals(data);
          }
        } else {
          completedPaginationRef.current = paginationData;
          if (isLoadMore) {
            addCompletedGoals(data.content);
          } else {
            setCompletedGoals(data);
          }
        }

        // Update global pagination for current tab
        setPagination(paginationData);

      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : `Failed to load ${tab} goals`);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [accessToken, activeTab, setActiveGoals, setCompletedGoals, addActiveGoals, addCompletedGoals]
  );

  // Initial load for active tab
  useEffect(() => {
    fetchGoals(`${baseUrl}/dashboard/goals/active`);
  }, []);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setError(null);

    // If we haven't loaded this tab before, fetch it
    if ((tab === "active" && activePaginationRef.current === null) || 
        (tab === "completed" && completedPaginationRef.current === null)) {
      fetchGoals(`${baseUrl}/dashboard/goals/${tab}`, false, tab);
    } else {
      // Switch to already loaded pagination
      setPagination(tab === "active" ? activePaginationRef.current : completedPaginationRef.current);
    }
  }, [fetchGoals]);

  const handleRemoveGoal = (goalId: string) => removeGoal(goalId);

  const loadMore = () => {
    const currentPagination = activeTab === "active" ? activePaginationRef.current : completedPaginationRef.current;
    if (currentPagination?.next && !loadingMore) {
      fetchGoals(currentPagination.next, true, activeTab);
    }
  };

  const getCurrentHasMore = () => {
    const currentPagination = activeTab === "active" ? activePaginationRef.current : completedPaginationRef.current;
    return !!currentPagination?.next;
  };

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

            {loading && goals.length === 0 ? (
              <GoalsSkeleton />
            ) : (
              <>
                <GoalsHeader />
                
                <GoalsTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {error && (
                  <GoalsError
                    error={error}
                    onRetry={() => fetchGoals(`${baseUrl}/dashboard/goals/${activeTab}`, false, activeTab)}
                  />
                )}

                <div className="relative">
                  {activeTab === "active" ? (
                    <ActiveGoalsSection
                      goals={goals}
                      loadingMore={loadingMore}
                      hasMore={getCurrentHasMore()}
                      onLoadMore={loadMore}
                      onRemoveGoal={handleRemoveGoal}
                    />
                  ) : (
                    <CompletedGoalsSection
                      goals={goals}
                      loadingMore={loadingMore}
                      hasMore={getCurrentHasMore()}
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