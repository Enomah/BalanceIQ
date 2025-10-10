"use client";

import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Smartphone, DollarSign } from "lucide-react";
import React from "react";

interface FinancialBasicsStepProps {
  formData: OnboardingFormData;
  onChange: (field: string, value: any) => void;
}

const FinancialBasicsStep: React.FC<FinancialBasicsStepProps> = ({
  formData,
  onChange,
}) => {
  const currencies = [
    { value: "USD", label: "US Dollar ($)", flag: "🇺🇸" },
    { value: "EUR", label: "Euro (€)", flag: "🇪🇺" },
    { value: "NGN", label: "Nigerian Naira (₦)", flag: "🇳🇬" },
    { value: "GBP", label: "British Pound (£)", flag: "🇬🇧" },
    { value: "JPY", label: "Japanese Yen (¥)", flag: "🇯🇵" },
  ];

  const incomeSources = [
    { value: "Salary", label: "Salary", icon: CreditCard },
    { value: "Business", label: "Business", icon: TrendingUp },
    { value: "Freelance", label: "Freelance", icon: Smartphone },
    { value: "Investments", label: "Investments", icon: TrendingUp },
    { value: "Other", label: "Other", icon: DollarSign },
  ];

  return (
    <div className="space-y-6 mt-[20px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-medium text-[var(--primary-50)] mb-3">
          Preferred Currency
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currencies.map((currency) => (
            <motion.button
              key={currency.value}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange("currency", currency.value)}
              className={`p-3 rounded-xl border text-[var(--primary-50)] transition-all duration-200 ${
                formData.currency === currency.value
                  ? "border-[var(--primary-500)] bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--primary-900)] dark:to-[var(--primary-800)] shadow-md"
                  : "border-[var(--border-medium)] hover:border-[var(--primary-300)] hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{currency.flag}</span>
                <span className="text-sm font-medium">{currency.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label className="block text-sm font-medium text-[var(--primary-50)] mb-3">
          Primary Income Source
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {incomeSources.map((source) => {
            const IconComponent = source.icon;
            return (
              <motion.button
                key={source.value}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange("incomeSource", source.value)}
                className={`p-3 rounded-xl border text-[var(--primary-50)] transition-all duration-200 ${
                  formData.incomeSource === source.value
                    ? "border-[var(--primary-500)] bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--primary-900)] dark:to-[var(--primary-800)] shadow-md"
                    : "border-[var(--border-medium)] hover:border-[var(--primary-300)] hover:shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4 text-[var(--primary-50)]" />
                  <span className="text-sm font-medium">{source.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-[10px]">
        {" "}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="block text-sm font-medium text-[var(--primary-50)] mb-2">
            Monthly income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]">
              {formData.currency}
            </span>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => onChange("monthlyIncome", e.target.value)}
              placeholder="0.00"
              className="w-full pl-[50px] pr-3 py-3 border border-[var(--border-medium)] rounded-xl focus:ring-2 text-[var(--primary-50)] focus:ring-[var(--primary-500)] focus:border-transparent"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="block text-sm font-medium text-[var(--primary-50)] mb-2">
            Current balance
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]">
              {formData.currency}
            </span>
            <input
              type="number"
              value={formData.accountBalance}
              onChange={(e) => onChange("accountBalance", e.target.value)}
              placeholder="0.00"
              className="w-full pl-[50px] pr-3 py-3 border border-[var(--border-medium)] rounded-xl focus:ring-2 text-[var(--primary-50)] focus:ring-[var(--primary-500)] focus:border-transparent"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialBasicsStep;
