"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import React from "react";

interface CompletionStepProps {
  formData: OnboardingFormData;
  onChange: (field: string, value: any) => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ formData, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 mt-[20px]"
    >
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-gradient-to-br from-[var(--success-100)] to-[var(--success-200)] dark:from-[var(--success-900)] dark:to-[var(--success-800)] rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle className="h-12 w-12 text-[var(--success-600)]" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
        >
          ✓
        </motion.div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[var(--primary-50)] mb-2">
          Setup Complete! 🎉
        </h3>
        <p className="text-[var(--text-secondary)]">
          You're all set to start your financial journey with BalanceIQ
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xs text-[var(--text-secondary)]"
      >
        You can always change these settings later in your profile
      </motion.div>
    </motion.div>
  );
};

export default CompletionStep;