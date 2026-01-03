import { motion, AnimatePresence } from "framer-motion";
import GoalItem from "../display/GoalItem";
import { Goal } from "@/types/dashboardTypes";
import { useGoalsListLogic } from "@/hooks/goals/useGoalsListLogic";
import GoalsEmptyState from "./GoalsEmptyState";
import GoalsLoadingMore from "./GoalsLoadingMore";

interface Props {
  onRemove: (id: string) => void;
  loadingMore: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
  goals: Goal[];
}

export default function GoalsGrid({
  onRemove,
  loadingMore,
  hasMore,
  handleLoadMore,
  goals,
}: Props) {
  const { observerTarget } = useGoalsListLogic({
    loadingMore,
    hasMore,
    handleLoadMore,
  });

  if (goals.length === 0) {
    return <GoalsEmptyState />;
  }

  return (
    <>
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
        >
          {goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.08 }}
            >
              <GoalItem goal={goal} onGoalRemove={onRemove} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {hasMore && (
        <div
          ref={observerTarget}
          className="h-4 mt-8 flex items-center justify-center"
        >
          {loadingMore && <GoalsLoadingMore />}
          {hasMore && !loadingMore && <div className="h-20" />}
        </div>
      )}
    </>
  );
}
