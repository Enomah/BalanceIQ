import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
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

interface SavingsProgressProps {
  summaryData: SummaryData;
}

const getSavingsProgress = (summaryData: SummaryData) => {
  const { netSavings, totalIncome } = summaryData.overview;
  const progress = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  return Math.min(100, Math.max(0, progress));
};

export default function SavingsProgress({ summaryData }: SavingsProgressProps) {
  const { userProfile } = useAuthStore();
  const savingsProgress = getSavingsProgress(summaryData);

  return (
    <motion.div
      //@ts-ignore
      variants={itemVariants}
      className="bg-[var(--bg-secondary)] rounded-xl p-[10px]  sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[var(--success-100)] rounded-lg">
          <PiggyBank className="w-5 h-5 text-[var(--success-600)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Savings Progress
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Towards your monthly goal
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center my-4">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--bg-tertiary)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--success-500)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${savingsProgress * 3.51} 351`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {savingsProgress.toFixed(0)}%
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Saved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-[var(--text-secondary)]">
          You saved{" "}
          <span className="font-semibold text-[var(--success-600)]">
            {userProfile &&
              formatCurrency(
                summaryData.overview.netSavings,
                userProfile.currency
              )}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
