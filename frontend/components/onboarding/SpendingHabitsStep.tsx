"use client";

import { motion } from "framer-motion";
import React from "react";

interface SpendingHabitsStepProps {
  formData: {
    spendingCategories: string[];
    budgetingStyle: string;
  };
  onChange: (field: string, value: any) => void;
  onCategoryToggle: (category: string) => void;
}

const SpendingHabitsStep: React.FC<SpendingHabitsStepProps> = ({
  formData,
  onChange,
  onCategoryToggle,
}) => {
  const categories = [
    { id: "food", label: "Food & Dining", emoji: "🍔" },
    { id: "rent", label: "Rent & Mortgage", emoji: "🏠" },
    { id: "transport", label: "Transportation", emoji: "🚗" },
    { id: "entertainment", label: "Entertainment", emoji: "🎬" },
    { id: "shopping", label: "Shopping", emoji: "🛍️" },
    { id: "subscriptions", label: "Subscriptions", emoji: "📱" },
    { id: "healthcare", label: "Healthcare", emoji: "🏥" },
    { id: "education", label: "Education", emoji: "🎓" },
    { id: "utilities", label: "Utilities", emoji: "💡" },
    { id: "travel", label: "Travel", emoji: "✈️" },
    { id: "personal", label: "Personal Care", emoji: "💄" },
    { id: "gifts", label: "Gifts & Donations", emoji: "🎁" },
  ];

  const budgetingStyles = [
    {
      id: "strict",
      label: "Strict Budget",
      description: "Track every dollar carefully",
      emoji: "📊",
    },
    {
      id: "flexible",
      label: "Flexible Budget",
      description: "Loose categories with flexibility",
      emoji: "⚖️",
    },
    {
      id: "insight",
      label: "Insights Only",
      description: "Just track spending, no strict budget",
      emoji: "👀",
    },
  ];

  return (
    <div className="space-y-6 mt-[20px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-medium text-[var(--primary-50)] mb-3">
          Select your main spending categories:
        </label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryToggle(category.id)}
              className={`p-2 rounded-lg border transition-all text-[var(--primary-50)] duration-200 ${
                formData.spendingCategories.includes(category.id)
                  ? "border-[var(--primary-500)] bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--primary-900)] dark:to-[var(--primary-800)] shadow-md"
                  : "border-[var(--border-medium)] hover:border-[var(--primary-300)]"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xl">{category.emoji}</span>
                <span className="text-xs font-medium text-center">{category.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="block text-sm font-medium text-[var(--primary-50)] mb-3">
          Preferred Budgeting Style
        </label>
        <div className="space-y-3 grid grid-cols-2 gap-2">
          {budgetingStyles.map((style) => (
            <motion.label
              key={style.id}
              whileHover={{ y: -2 }}
              className="flex items-start space-x-3 p-4 border border-[var(--border-medium)] rounded-xl cursor-pointer hover:border-[var(--primary-300)] transition-all duration-200"
            >
              <input
                type="radio"
                name="budgetingStyle"
                value={style.id}
                checked={formData.budgetingStyle === style.id}
                onChange={(e) => onChange("budgetingStyle", e.target.value)}
                className="mt-1 text-[var(--primary-500)]"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{style.emoji}</span>
                  <div className="font-medium text-[var(--primary-50)]">{style.label}</div>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{style.description}</div>
              </div>
            </motion.label>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SpendingHabitsStep;