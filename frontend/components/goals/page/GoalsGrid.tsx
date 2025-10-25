import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Target } from "lucide-react";
import GoalItem from "../display/GoalItem";
import { useCallback, useEffect, useRef } from "react";
import { useGoalStore } from "@/store/goalsStore";
import { Goal } from "@/types/dashboardTypes";

interface Props {
  onRemove: (id: string) => void;
  loadingMore: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
  goals: Goal[]
}

export default function GoalsGrid({
  onRemove,
  loadingMore,
  hasMore,
  handleLoadMore,
  goals,
}: Props) {
  // Use the store directly instead of props
  // const goals = useGoalStore(state => state.goals);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingMore) {
        handleLoadMore();
      }
    },
    [hasMore, loadingMore, handleLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    const currentTarget = observerTarget.current;

    if (currentTarget && hasMore) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver, hasMore]);

  if (goals.length === 0) {
    return <EmptyState />;
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
          {loadingMore && <MoreLoader />}
          {hasMore && !loadingMore && <div className="h-20" />}
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <Target className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">
        No goals yet
      </h3>
      <p className="text-[var(--text-tertiary)] mb-6">
        Start by creating your first financial goal
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[var(--brand-primary)] text-white px-6 py-3 rounded-xl font-semibold"
      >
        Create Your First Goal
      </motion.button>
    </motion.div>
  );
}

function MoreLoader() {
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    </div>
  );
}