"use client";

import { MonthlyBudget } from "@/types/budgetTypes";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";
import Modal from "../ui/Modal";
import { formatCurrency } from "@/lib/format";
import { useBudgetFormLogic } from "@/hooks/budgeting/useBudgetFormLogic";
import BudgetFormSummary from "./BudgetFormSummary";
import BudgetFormCategories from "./BudgetFormCategories";

interface BudgetFormProps {
  existingBudget?: MonthlyBudget | null;
  onSubmit: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function BudgetForm({
  existingBudget,
  onSubmit,
  onClose,
  isOpen,
}: BudgetFormProps) {
  const {
    userProfile,
    dashboardData,
    totalBudget,
    setTotalBudget,
    allocations,
    handleAllocationChange,
    handleDistributeRemaining,
    handleSubmit,
    allocatedTotal,
    remaining,
    budgetMutation,
  } = useBudgetFormLogic({
    existingBudget,
    onSubmit,
    onClose,
  });

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={existingBudget ? "Edit Budget" : "Create Monthly Budget"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Available balance:{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {formatCurrency(
                dashboardData?.monthlySummary?.balance || 0,
                userProfile?.currency || ""
              )}
            </span>
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Total Monthly Budget
            </label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              placeholder="Enter your total monthly budget"
              min="0"
              step="0.01"
              required
            />
          </div>

          <BudgetFormSummary
            totalBudget={totalBudget}
            allocatedTotal={allocatedTotal}
            remaining={remaining}
            currency={userProfile?.currency || ""}
            onDistribute={handleDistributeRemaining}
            isPending={budgetMutation.isPending}
          />

          <BudgetFormCategories
            allocations={allocations}
            totalBudget={totalBudget}
            onAllocationChange={handleAllocationChange}
          />

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6 pt-4 border-t border-[var(--border-light)]">
            {budgetMutation.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-[var(--error-50)] border border-[var(--error-200)] rounded-lg"
              >
                <p className="text-[var(--error-700)] text-sm">
                  {(budgetMutation.error as { message?: string })?.message ||
                    "Failed to save budget"}
                </p>
              </motion.div>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={budgetMutation.isPending}
              className="px-4 sm:px-6 py-2 sm:py-3 border border-[var(--border-medium)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                remaining !== 0 ||
                budgetMutation.isPending ||
                (dashboardData?.monthlySummary?.balance ?? 0) <
                  (parseFloat(totalBudget) || 0)
              }
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-1 sm:order-2 min-w-32"
            >
              {budgetMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {existingBudget ? "Updating..." : "Creating..."}
                </>
              ) : existingBudget ? (
                "Update Budget"
              ) : (
                "Create Budget"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
