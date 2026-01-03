import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function EmptyCategoriesState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)]"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
        <TrendingUp className="w-8 h-8 text-[var(--text-secondary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        No Categories Allocated
      </h3>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto">
        You haven&apos;t allocated any budget to categories yet. Start by
        creating a budget plan to track your spending.
      </p>
    </motion.div>
  );
}
