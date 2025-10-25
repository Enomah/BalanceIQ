import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface Props {
  error: string;
  onRetry: () => void;
}

export default function GoalsError({ error, onRetry }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--error-50)] border border-[var(--error-200)] rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-[var(--error-500)]" />
        <div>
          <p className="text-[var(--error-700)] font-medium">Error loading goals</p>
          <p className="text-[var(--error-600)] text-sm mt-1">{error}</p>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="mt-2 text-sm text-[var(--brand-primary)] underline"
      >
        Try again
      </button>
    </motion.div>
  );
}