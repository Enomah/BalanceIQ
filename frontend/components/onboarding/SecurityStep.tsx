"use client";

import { motion } from "framer-motion";
import { Shield, Mail } from "lucide-react";
import React from "react";

interface SecurityStepProps {
  formData: {
    enable2FA: boolean;
    recoveryEmail: string;
  };
  onChange: (field: string, value: any) => void;
}

const SecurityStep: React.FC<SecurityStepProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--primary-900)] dark:to-[var(--primary-800)] rounded-xl border border-[var(--primary-200)] dark:border-[var(--primary-700)]"
      >
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <div className="font-medium text-[var(--text-primary)] flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[var(--primary-600)]" />
              <span>Enable Two-Factor Authentication</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">
              Add an extra layer of security to your account
            </div>
          </div>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={formData.enable2FA}
              onChange={(e) => onChange("enable2FA", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                formData.enable2FA ? "bg-[var(--success-500)]" : "bg-[var(--border-medium)]"
              }`}
            />
            <div
              className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                formData.enable2FA ? "transform translate-x-6" : ""
              }`}
            />
          </div>
        </label>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Recovery Email (Optional)
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="email"
            value={formData.recoveryEmail}
            onChange={(e) => onChange("recoveryEmail", e.target.value)}
            placeholder="Enter recovery email"
            className="w-full pl-10 pr-3 py-3 border border-[var(--border-medium)] rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent bg-[var(--input-bg)]"
          />
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Used for account recovery if you lose access
        </p>
      </motion.div>
    </div>
  );
};

export default SecurityStep;