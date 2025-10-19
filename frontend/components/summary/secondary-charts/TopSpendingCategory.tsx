import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { SummaryData } from "@/types/summaryTypes";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

interface TopSpendingCategoryProps {
  summaryData: SummaryData;
}

const getTopSpendingCategory = (summaryData: SummaryData) => {
  return summaryData.highlights.topCategory || { name: "No data", amount: 0 };
};

export default function TopSpendingCategory({
  summaryData,
}: TopSpendingCategoryProps) {
  const { userProfile } = useAuthStore();
  const topCategory = getTopSpendingCategory(summaryData);

  return (
    <motion.div
      //@ts-ignore
      variants={itemVariants}
      className="bg-[var(--bg-secondary)] rounded-xl p-[10px]  sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[var(--warning-100)] rounded-lg">
          <Target className="w-5 h-5 text-[var(--warning-600)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Top Spending
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Your biggest expense category
          </p>
        </div>
      </div>

      <div className="text-center my-6">
        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-[var(--warning-500)] to-[var(--error-500)] rounded-full flex items-center justify-center text-white text-lg font-bold">
          {topCategory.name.charAt(0).toUpperCase()}
        </div>
        <p className="text-lg font-bold text-[var(--text-primary)] capitalize">
          {topCategory.name}
        </p>
        <p className="text-2xl font-bold text-[var(--error-600)] mt-2">
          {userProfile &&
            formatCurrency(topCategory.amount, userProfile.currency)}
        </p>
      </div>

      <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
        <p className="text-xs text-[var(--text-secondary)] text-center">
          This is where most of your money went this month
        </p>
      </div>
    </motion.div>
  );
}
