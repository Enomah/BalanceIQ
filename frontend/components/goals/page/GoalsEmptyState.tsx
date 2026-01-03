import { motion } from "framer-motion";
import { Target } from "lucide-react";

export default function GoalsEmptyState() {
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
