import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, PiggyBank } from "lucide-react";
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

interface FinancialHealthProps {
  summaryData: SummaryData;
}

const getFinancialHealth = (summaryData: SummaryData) => {
  const { savingsRate, netSavings } = summaryData.overview;
  if (savingsRate >= 20)
    return {
      score: "Excellent",
      color: "text-[var(--success-600)]",
      icon: Zap,
    };
  if (savingsRate >= 10)
    return {
      score: "Good",
      color: "text-[var(--warning-600)]",
      icon: TrendingUp,
    };
  if (netSavings > 0)
    return {
      score: "Okay",
      color: "text-[var(--warning-600)]",
      icon: PiggyBank,
    };
  return {
    score: "Needs Work",
    color: "text-[var(--error-600)]",
    icon: TrendingDown,
  };
};

export default function FinancialHealth({ summaryData }: FinancialHealthProps) {
  const { userProfile } = useAuthStore();
  const financialHealth = getFinancialHealth(summaryData);
  const HealthIcon = financialHealth.icon;

  return (
    <motion.div
      //@ts-ignore
      variants={itemVariants}
      className="bg-[var(--bg-secondary)] rounded-xl  p-[10px]  sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[var(--primary-100)] rounded-lg">
          <HealthIcon className="w-5 h-5 text-[var(--primary-600)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Financial Health
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Your money management score
          </p>
        </div>
      </div>

      <div className="text-center my-6">
        <div className={`text-4xl font-bold ${financialHealth.color} mb-2`}>
          {financialHealth.score}
        </div>
        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full ${
              financialHealth.score === "Excellent"
                ? "bg-[var(--success-500)] w-full"
                : financialHealth.score === "Good"
                ? "bg-[var(--warning-500)] w-3/4"
                : financialHealth.score === "Okay"
                ? "bg-[var(--warning-500)] w-1/2"
                : "bg-[var(--error-500)] w-1/4"
            }`}
          />
        </div>
      </div>

      <div className="space-y-2 text-sm text-[var(--text-secondary)]">
        <p>• Savings Rate: {summaryData.overview.savingsRate.toFixed(1)}%</p>
        <p>
          • Monthly Savings:{" "}
          {userProfile &&
            formatCurrency(
              summaryData.overview.netSavings,
              userProfile.currency
            )}
        </p>
        <p>
          • Total Transactions: {summaryData.overview.transactionCount.total}
        </p>
      </div>
    </motion.div>
  );
}
