import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  fetchData: () => void;
}

export default function ErrorState({ error, fetchData }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-96">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <AlertCircle className="w-16 h-16 text-[var(--error-500)] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Unable to Load Summary
        </h3>
        <p className="text-[var(--text-secondary)] mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="bg-[var(--primary-500)] text-white px-6 py-3 rounded-xl hover:bg-[var(--primary-600)] transition-all duration-300 flex items-center gap-2 mx-auto transform hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </motion.div>
    </div>
  );
}