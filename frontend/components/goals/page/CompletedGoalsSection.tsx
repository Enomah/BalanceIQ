// CompletedGoalsSection.tsx
"use client";

import { Goal } from "@/types/dashboardTypes";
import GoalsGrid from "./GoalsGrid";
import { useGoalStore } from "@/store/goalsStore";

interface CompletedGoalsSectionProps {
  goals: Goal[];
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRemoveGoal: (goalId: string) => void;
}

export default function CompletedGoalsSection({
  goals,
  loadingMore,
  hasMore,
  onLoadMore,
  onRemoveGoal,
}: CompletedGoalsSectionProps) {
  const { completedGoals } = useGoalStore();
  
  // Use the completed goals from store or filter from props
  const displayGoals = completedGoals.length > 0 ? completedGoals : goals.filter(goal => goal.status === "completed");

  return (
    <div className="min-h-[400px]">
      <GoalsGrid
        goals={displayGoals}
        onRemove={onRemoveGoal}
        loadingMore={loadingMore}
        hasMore={hasMore}
        handleLoadMore={onLoadMore}
        // showProgress={false} // Don't show progress bars for completed goals
      />
    </div>
  );
}