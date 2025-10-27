"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CategoryHeader from "./CategoryHeader";
import CategoryProgress from "./CategoryProgress";
import CategoryAmounts from "./CategoryAmounts";
import EditInput from "./EditInput";
import StatusBadge from "./StatusBadge";

import { getProgress, isOverspent, getRemaining, getStatus } from "./calculations";

interface Category {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  allocated: number;
  spent: number;
}

interface Props {
  category: Category;
  totalBudget: number;
  currency: string;
}

export default function BudgetCategoryCard({ category, totalBudget, currency }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const progress = getProgress(category.spent, category.allocated);
  const overspent = isOverspent(category.spent, category.allocated);
  const remaining = getRemaining(category.allocated, category.spent);
  const status = getStatus(progress, overspent).label.toLowerCase().replace(" ", "") as "ontrack" | "almostthere" | "overspent";

  const handleEditStart = () => {
    setIsEditing(true);
    setEditValue(category.spent.toString());
  };

  const handleSave = () => {
    const spent = parseFloat(editValue) || 0;
    setIsEditing(false);
    setEditValue("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const percentageOfTotal = ((category.allocated / totalBudget) * 100).toFixed(1);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-[var(--bg-secondary)] rounded-xl border transition-all duration-300 hover:shadow-md ${
        overspent
          ? 'border-[var(--error-300)] hover:border-[var(--error-400)]'
          : 'border-[var(--border-light)] hover:border-[var(--border-medium)]'
      }`}
    >
      <div className="p-4 border-b border-[var(--border-light)]">
        <CategoryHeader
          icon={category.icon}
          label={category.label}
          percentageOfTotal={percentageOfTotal}
          onEdit={handleEditStart}
          color={category.color}
        />
      </div>

      <div className="p-4 space-y-3">
        <CategoryProgress progress={progress} isOverspent={overspent} color={category.color} />
        <CategoryAmounts
          allocated={category.allocated}
          spent={category.spent}
          remaining={remaining}
          isOverspent={overspent}
          currency={currency}
        />
        {isEditing && (
          <EditInput
            value={editValue}
            onChange={setEditValue}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>

      <StatusBadge status={status} />
    </motion.div>
  );
}