"use client"

import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  PiggyBank,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";
import { SummaryData } from "@/types/summaryTypes";
import { useAuthStore } from "@/store/authStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

interface OverviewCardsProps {
  summaryData: SummaryData;
}

export default function OverviewCards({ summaryData }: OverviewCardsProps) {
  const { userProfile } = useAuthStore()

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: userProfile?.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      //   variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <motion.div
        // variants={itemVariants}
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-gradient-to-br from-[var(--success-500)] to-[var(--success-600)] text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Total Income</h3>
            <motion.div
              //   variants={floatingAnimation}
              animate="animate"
              className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <DollarSign className="w-5 h-5" />
            </motion.div>
          </div>
          <p className="text-3xl font-bold mb-2">
            {formatCurrency(summaryData.overview.totalIncome)}
          </p>
          <div className="flex items-center gap-2">
            {summaryData.trends.income.direction === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm opacity-90">
              {Math.abs(summaryData.trends.income.trend).toFixed(1)}% from last
              month
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -mr-16"></div>
      </motion.div>

      <motion.div
        // variants={itemVariants}
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-gradient-to-br from-[var(--error-500)] to-[var(--error-600)] text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Total Expenses</h3>
            <motion.div
              //   variants={floatingAnimation}
              animate="animate"
              className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <CreditCard className="w-5 h-5" />
            </motion.div>
          </div>
          <p className="text-3xl font-bold mb-2">
            {formatCurrency(summaryData.overview.totalExpenses)}
          </p>
          <div className="flex items-center gap-2">
            {summaryData.trends.expenses.direction === "down" ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span className="text-sm opacity-90">
              {Math.abs(summaryData.trends.expenses.trend).toFixed(1)}% from
              last month
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -mr-16"></div>
      </motion.div>

      <motion.div
        // variants={itemVariants}
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Net Savings</h3>
            <motion.div
              //   variants={floatingAnimation}
              animate="animate"
              className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <PiggyBank className="w-5 h-5" />
            </motion.div>
          </div>
          <p className="text-3xl font-bold mb-2">
            {formatCurrency(summaryData.overview.netSavings)}
          </p>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="text-sm opacity-90">
              {summaryData.overview.savingsRate.toFixed(1)}% savings rate
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -mr-16"></div>
      </motion.div>

      <motion.div
        // variants={itemVariants}
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-gradient-to-br from-[var(--warning-500)] to-[var(--warning-600)] text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Transactions</h3>
            <motion.div
              //   variants={floatingAnimation}
              animate="animate"
              className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <BarChart3 className="w-5 h-5" />
            </motion.div>
          </div>
          <p className="text-3xl font-bold mb-2">
            {summaryData.overview.transactionCount.total}
          </p>
          <div className="text-sm opacity-90">
            {summaryData.overview.transactionCount.income} income •{" "}
            {summaryData.overview.transactionCount.expenses} expenses
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -mr-16"></div>
      </motion.div>
    </motion.div>
  );
}
