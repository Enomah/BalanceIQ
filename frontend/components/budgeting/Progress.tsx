"use client";

import { motion } from "framer-motion";

interface ProgressProps {
  value: number;
  color?: string;
  showLabel?: boolean;
}

export function Progress({ value, color = "var(--brand-primary)", showLabel = true }: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {showLabel && (
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Progress
          </span>
        )}
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {clampedValue.toFixed(1)}%
        </span>
      </div>
      
      <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full transition-all duration-300"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}