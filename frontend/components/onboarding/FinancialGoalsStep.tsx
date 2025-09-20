"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import React from "react";

interface FinancialGoalsStepProps {
  formData: {
    currency: string;
    primaryGoal: string;
    targetAmount: string;
    targetDate: string;
  };
  onChange: (field: string, value: any) => void;
}

const FinancialGoalsStep: React.FC<FinancialGoalsStepProps> = ({ formData, onChange }) => {
  const goals = [
    { value: "emergency fund", label: "Emergency Fund", emoji: "🛡️" },
    { value: "pay debt", label: "Pay Off Debt", emoji: "💳" },
    { value: "save car", label: "Save for a Car", emoji: "🚗" },
    { value: "save_house", label: "Save for a House", emoji: "🏠" },
    { value: "invest", label: "Invest for Growth", emoji: "📈" },
    { value: "education", label: "Education Fund", emoji: "🎓" },
    { value: "retirement", label: "Retirement Planning", emoji: "🌴" },
    { value: "travel", label: "Travel Fund", emoji: "✈️" },
  ];

  return (
    <div className="space-y-6 mt-[20px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-medium text-[var(--primary-50)] mb-3">
          What's your primary financial goal?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {goals.map((goal) => (
            <motion.button
              key={goal.value}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange("primaryGoal", goal.value)}
              className={`p-3 rounded-xl border transition-all text-[var(--primary-50)] duration-200 ${
                formData.primaryGoal === goal.value
                  ? "border-[var(--primary-500)] bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--primary-900)] dark:to-[var(--primary-800)] shadow-md"
                  : "border-[var(--border-medium)] hover:border-[var(--primary-300)] hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{goal.emoji}</span>
                <span className="text-sm font-medium text-left">{goal.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-[var(--primary-50)] mb-2">
            Target Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]">
              {formData.currency}
            </span>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => onChange("targetAmount", e.target.value)}
              placeholder="0.00"
              className="w-full pl-[50px] pr-3 py-3 border border-[var(--border-medium)] rounded-xl focus:ring-2 text-[var(--primary-50)] focus:ring-[var(--primary-500)] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--primary-50)] mb-2">
            Target Date
          </label>
          <div className="relative">
            {/* <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" /> */}
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => onChange("targetDate", e.target.value)}
              className="w-full pl-[10px] pr-3 py-3 border border-[var(--border-medium)] rounded-xl focus:ring-2 text-[var(--primary-50)] focus:ring-[var(--primary-500)] focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialGoalsStep;