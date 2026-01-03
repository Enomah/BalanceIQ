import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface BudgetFormSummaryProps {
  totalBudget: string;
  allocatedTotal: number;
  remaining: number;
  currency: string;
  onDistribute: () => void;
  isPending: boolean;
}

export default function BudgetFormSummary({
  totalBudget,
  allocatedTotal,
  remaining,
  currency,
  onDistribute,
  isPending,
}: BudgetFormSummaryProps) {
  return (
    <AnimatePresence>
      {totalBudget && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-3 sm:p-4 bg-[var(--bg-tertiary)] rounded-lg sticky top-0 border border-[var(--border-light)] z-10"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center">
            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Total Budget
              </div>
              <div className="text-sm sm:text-lg font-semibold text-[var(--text-primary)] truncate">
                {formatCurrency(parseFloat(totalBudget), currency)}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Allocated
              </div>
              <div className="text-sm sm:text-lg font-semibold text-[var(--text-primary)] truncate">
                {formatCurrency(allocatedTotal, currency)}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Remaining
              </div>
              <div
                className={`text-sm sm:text-lg font-semibold truncate ${
                  remaining >= 0
                    ? "text-[var(--success-600)]"
                    : "text-[var(--error-600)]"
                }`}
              >
                {formatCurrency(remaining, currency)}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex justify-center sm:justify-end">
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={onDistribute}
                  disabled={isPending}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Distribute
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
