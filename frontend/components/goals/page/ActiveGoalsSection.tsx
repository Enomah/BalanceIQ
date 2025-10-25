// ActiveGoalsSection.tsx
"use client";

import { Goal } from "@/types/dashboardTypes";
import GoalsGrid from "./GoalsGrid";
import { useGoalStore } from "@/store/goalsStore";

interface ActiveGoalsSectionProps {
  goals: Goal[];
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRemoveGoal: (goalId: string) => void;
}

export default function ActiveGoalsSection({
  goals,
  loadingMore,
  hasMore,
  onLoadMore,
  onRemoveGoal,
}: ActiveGoalsSectionProps) {
  const { activeGoals } = useGoalStore();
  
  // Use the active goals from store or filter from props
  const displayGoals = activeGoals.length > 0 ? activeGoals : goals.filter(goal => goal.status !== "completed");

  return (
    <div className="min-h-[400px]">
      <GoalsGrid
        goals={displayGoals}
        onRemove={onRemoveGoal}
        loadingMore={loadingMore}
        hasMore={hasMore}
        handleLoadMore={onLoadMore}
      />
    </div>
  );
}