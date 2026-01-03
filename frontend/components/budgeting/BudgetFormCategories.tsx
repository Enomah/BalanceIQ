import { motion } from "framer-motion";
import { expenseCategories } from "@/constants/transaction";

interface BudgetFormCategoriesProps {
  allocations: Record<string, string>;
  totalBudget: string;
  onAllocationChange: (key: string, value: string) => void;
}

export default function BudgetFormCategories({
  allocations,
  totalBudget,
  onAllocationChange,
}: BudgetFormCategoriesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Category Allocations
      </h3>

      {expenseCategories.map((category, index) => (
        <motion.div
          key={category.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]"
        >
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
            style={{ backgroundColor: `${category.color}20` }}
          >
            {category.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-[var(--text-primary)] text-sm sm:text-base truncate">
              {category.label}
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {(
                ((parseFloat(allocations[category.key]) || 0) /
                  parseFloat(totalBudget) || 0) * 100
              ).toFixed(1)}
              % of total
            </div>
          </div>

          <div className="w-24 sm:w-32 flex-shrink-0">
            <input
              type="number"
              value={allocations[category.key] || ""}
              onChange={(e) => onAllocationChange(category.key, e.target.value)}
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-[var(--border-medium)] rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] text-right focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] text-sm sm:text-base disabled:opacity-50"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
