import React from "react";
import {
  Lightbulb,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  Target,
  Rocket,
  Award,
  CreditCard,
  PieChart,
} from "lucide-react";
import { Insight } from "@/types/dashboardTypes";
import { motion } from "framer-motion";

interface FinancialTipsProps {
  insights: Insight[];
}

const iconMap: Record<string, React.ReactNode> = {
  piggybank: <PiggyBank size={20} />,
  trendingup: <TrendingUp size={20} />,
  alerttriangle: <AlertTriangle size={20} />,
  target: <Target size={20} />,
  rocket: <Rocket size={20} />,
  award: <Award size={20} />,
  creditcard: <CreditCard size={20} />,
  piechart: <PieChart size={20} />,
  lightbulb: <Lightbulb size={20} />,
};

const FinancialTips: React.FC<FinancialTipsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="tips-section bg-[var(--bg-secondary)] p-6 rounded-xl shadow-sm lg:col-span-2 flex flex-col items-center justify-center text-center">
        <div className="bg-[var(--primary-50)] dark:bg-[var(--primary-900)] p-4 rounded-full mb-4">
          <Lightbulb size={32} className="text-[var(--primary-500)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Analysis in Progress
        </h3>
        <p className="text-[var(--text-secondary)] text-sm max-w-sm">
          Keep tracking your income and expenses. Soon, we&apos;ll provide
          personalized insights to help you manage your finances better.
        </p>
      </div>
    );
  }

  return (
    <div className="tips-section bg-[var(--bg-secondary)] p-[10px] sm:p-6 rounded-xl shadow-sm lg:col-span-2">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="text-[var(--primary-500)]" size={20} />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Financial Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border flex gap-4 transition-all hover:shadow-md ${
              insight.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800"
                : insight.type === "warning"
                ? "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-800"
                : "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800"
            }`}
          >
            <div
              className={`p-2 h-fit rounded-lg ${
                insight.type === "success"
                  ? "bg-[var(--success-100)] dark:bg-[var(--success-800)] text-[var(--success-600)] dark:text-[var(--success-400)]"
                  : insight.type === "warning"
                  ? "bg-[var(--error-100)] dark:bg-[var(--error-800)] text-[var(--error-600)] dark:text-[var(--error-400)]"
                  : "bg-[var(--primary-100)] dark:bg-[var(--primary-800)] text-[var(--primary-600)] dark:text-[var(--primary-400)]"
              }`}
            >
              {iconMap[insight.icon] || <Lightbulb size={20} />}
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1">
                {insight.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {insight.message}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FinancialTips;
