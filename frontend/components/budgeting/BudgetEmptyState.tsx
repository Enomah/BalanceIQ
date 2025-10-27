"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, PieChart } from "lucide-react";

interface BudgetEmptyStateProps {
  onGetStarted: () => void;
}

export default function BudgetEmptyState({ onGetStarted }: BudgetEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-[10px] sm:px-6"
    >
      <div className="max-w-2xl mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-[var(--primary-100)] rounded-full flex items-center justify-center">
          <PieChart className="w-12 h-12 text-[var(--brand-primary)]" />
        </div>
        
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          Plan Your Monthly Budget
        </h2>
        
        <p className="text-[var(--text-secondary)] text-lg mb-8">
          Take control of your finances by creating a monthly budget. 
          Track your spending, set limits, and achieve your financial goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px] mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-[10px] sm:p-6 bg-[var(--bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--border-light)]"
          >
            <Target className="w-8 h-8 text-[var(--brand-primary)] mb-3" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Set Goals</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Define spending limits for each category
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-[10px] sm:p-6 bg-[var(--bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--border-light)]"
          >
            <TrendingUp className="w-8 h-8 text-[var(--success-600)] mb-3" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Track Progress</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Monitor your spending in real-time
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-[10px] sm:p-6 bg-[var(--bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--border-light)]"
          >
            <PieChart className="w-8 h-8 text-[var(--warning-600)] mb-3" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Get Insights</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Visualize your spending patterns
            </p>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGetStarted}
          className="px-8 py-4 bg-[var(--brand-primary)] text-white rounded-lg text-lg font-semibold hover:bg-[var(--brand-primary-dark)] w-full max-w-[400px] transition-colors"
        >
          Create Your First Budget
        </motion.button>
      </div>
    </motion.div>
  );
}