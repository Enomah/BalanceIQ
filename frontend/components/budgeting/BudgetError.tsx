"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

interface BudgetErrorProps {
  error: string;
  onRetry: () => void;
}

export default function BudgetError({ error, onRetry }: BudgetErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--error-50)] border border-[var(--error-200)] rounded-xl p-6"
    >
      <div className="flex items-center gap-4">
        <AlertCircle className="w-8 h-8 text-[var(--error-600)] flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--error-700)] mb-1">
            Unable to Load Budget
          </h3>
          <p className="text-[var(--error-600)] text-sm">
            {error}
          </p>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--error-600)] text-white rounded-lg hover:bg-[var(--error-700)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </motion.div>
  );
}