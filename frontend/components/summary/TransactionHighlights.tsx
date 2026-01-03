import { motion } from "framer-motion";
import { Crown, Zap } from "lucide-react";
import { SummaryData } from "@/types/summaryTypes";
import TransactionItem from "../transactions/TransactionItem";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

interface TransactionHighlightsProps {
  summaryData: SummaryData;
}

export default function TransactionHighlights({
  summaryData,
}: TransactionHighlightsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      <motion.div
        // variants={itemVariants}
        className="bg-[var(--bg-secondary)] rounded-2xl p-[10px] sm:p-6 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <Crown className="w-6 h-6 text-[var(--warning-500)]" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Top Income Sources
          </h3>
        </div>
        <div className="space-y-4">
          {summaryData.highlights.largestIncome.map((income, index) => {
            // const IconComponent = CATEGORY_ICONS[income.category] || DollarSign;
            return <TransactionItem key={index} transaction={income} />;
          })}
        </div>
      </motion.div>

      <motion.div
        // variants={itemVariants}
        className="bg-[var(--bg-secondary)] rounded-2xl p-[10px] sm:p-6 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-[var(--error-500)]" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Major Expenses
          </h3>
        </div>
        <div className="space-y-4">
          {summaryData.highlights.largestExpenses.map((expense, index) => {
            return <TransactionItem key={index} transaction={expense} />;
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
