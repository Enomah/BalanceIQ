"use client";

import { expenseCategories } from "@/constants/transaction";
import { MonthlyBudget } from "@/types/budgetTypes";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import React from "react";
import Modal from "../ui/Modal";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/format";
import { useDashboardStore } from "@/store/dashboardStore";
import { baseUrl } from "@/api/rootUrls";

interface BudgetFormProps {
  existingBudget?: MonthlyBudget | null;
  onSubmit: (budget: MonthlyBudget) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function BudgetForm({
  existingBudget,
  onSubmit,
  onClose,
  isOpen,
}: BudgetFormProps) {
  const { userProfile, accessToken } = useAuthStore();
  const { dashboardData } = useDashboardStore();
  const [totalBudget, setTotalBudget] = useState(
    existingBudget?.totalBudget.toString() || ""
  );
  const [allocations, setAllocations] = useState<Record<string, string>>(
    existingBudget?.categories.reduce(
      (acc, cat) => ({
        ...acc,
        [cat.key]: cat.allocated.toString(),
      }),
      {}
    ) || {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allocatedTotal = Object.values(allocations).reduce(
    (sum, value) => sum + (parseFloat(value) || 0),
    0
  );
  const remaining = parseFloat(totalBudget) - allocatedTotal;

  const handleAllocationChange = (categoryKey: string, value: string) => {
    setAllocations((prev) => ({
      ...prev,
      [categoryKey]: value,
    }));
    if (error) setError(null);
  };

  const handleDistributeRemaining = () => {
    if (remaining <= 0) return;

    const emptyCategories = expenseCategories.filter(
      (cat) => !allocations[cat.key] || parseFloat(allocations[cat.key]) === 0
    );

    const categoriesToDistribute =
      emptyCategories.length > 0 ? emptyCategories : expenseCategories;

    const amountPerCategory = remaining / categoriesToDistribute.length;
    const newAllocations = { ...allocations };

    categoriesToDistribute.forEach((cat) => {
      const currentAllocation = parseFloat(newAllocations[cat.key]) || 0;
      newAllocations[cat.key] = (currentAllocation + amountPerCategory).toFixed(
        2
      );
    });

    setAllocations(newAllocations);
  };

  const handleSaveBudget = async (budgetData: MonthlyBudget) => {
    try {
      setLoading(true);
      setError(null);

      if (!budgetData.totalBudget || budgetData.totalBudget <= 0) {
        throw new Error("Total budget must be greater than 0");
      }

      const totalAllocated = budgetData.categories.reduce(
        (sum, cat) => sum + cat.allocated,
        0
      );

      if (Math.abs(totalAllocated - budgetData.totalBudget) > 0.01) {
        throw new Error("Category allocations must match total budget");
      }

      // console.log("Saving budget:", budgetData);

      const isNewBudget = !existingBudget?.id;
      const url = isNewBudget
        ? `${baseUrl}/dashboard/budget`
        : `${baseUrl}/dashboard/budget/${existingBudget?.id}`;
      const method = isNewBudget ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(budgetData),
      });

      const responseData = await response.json();

      // console.log(responseData);

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(responseData.message || "Invalid budget data");
        } else if (response.status === 401) {
          throw new Error("Please log in to save budget");
        } else if (response.status === 409) {
          throw new Error("Budget already exists for this month");
        } else {
          throw new Error(
            responseData.message || `Failed to save budget: ${response.status}`
          );
        }
      }

      console.log("Budget saved successfully:", responseData);

      onSubmit(responseData.budget);

      onClose();
    } catch (error) {
      console.error("Error saving budget:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save budget";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categories = expenseCategories.map((cat) => ({
      key: cat.key,
      allocated: parseFloat(allocations[cat.key]) || 0,
    }));

    const budgetData: MonthlyBudget = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalBudget: parseFloat(totalBudget),
      //@ts-ignore
      categories: categories,
      ...(existingBudget?.id && { id: existingBudget.id }),
    };

    await handleSaveBudget(budgetData);
  };

  const handleTotalBudgetChange = (value: string) => {
    setTotalBudget(value);
    if (error) setError(null);
  };

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
              onChange={(e) => handleTotalBudgetChange(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              placeholder="Enter your total monthly budget"
              min="0"
              step="0.01"
              required
              // disabled={loading}
            />
          </div>

          <AnimatePresence>
            {totalBudget && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3 sm:p-4 bg-[var(--bg-tertiary)] rounded-lg sticky top-0 border border-[var(--border-light)]"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center">
                  <div className="text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                      Total Budget
                    </div>
                    <div className="text-sm sm:text-lg font-semibold text-[var(--text-primary)] truncate">
                      {formatCurrency(
                        parseFloat(totalBudget),
                        userProfile?.currency || ""
                      )}
                    </div>
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                      Allocated
                    </div>
                    <div className="text-sm sm:text-lg font-semibold text-[var(--text-primary)] truncate">
                      {formatCurrency(
                        allocatedTotal,
                        userProfile?.currency || ""
                      )}
                    </div>
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                      Remaining
                    </div>
                    <div
                      className={`text-sm sm:text-lg font-semibold truncate ${
                        remaining >= 0
                          ? "text-[var(--success-600)]"
                          : "text-[var(--error-600)]"
                      }`}
                    >
                      {formatCurrency(remaining, userProfile?.currency || "")}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex justify-center sm:justify-end">
                    {remaining > 0 && (
                      <button
                        type="button"
                        onClick={handleDistributeRemaining}
                        disabled={loading}
                        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        Distribute
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Category Allocations
            </h3>

            {expenseCategories.map((category, index) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]"
              >
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--text-primary)] text-sm sm:text-base truncate">
                    {category.label}
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    {(
                      ((parseFloat(allocations[category.key]) || 0) /
                        parseFloat(totalBudget) || 0) * 100
                    ).toFixed(1)}
                    % of total
                  </div>
                </div>

                <div className="w-24 sm:w-32 flex-shrink-0">
                  <input
                    type="number"
                    value={allocations[category.key] || ""}
                    onChange={(e) =>
                      handleAllocationChange(category.key, e.target.value)
                    }
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-[var(--border-medium)] rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] text-right focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] text-sm sm:text-base disabled:opacity-50"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    // disabled={loading}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6 pt-4 border-t border-[var(--border-light)]">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-[var(--error-50)] border border-[var(--error-200)] rounded-lg"
              >
                <p className="text-[var(--error-700)] text-sm">{error}</p>
              </motion.div>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 border border-[var(--border-medium)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                remaining !== 0 ||
                loading ||
                (dashboardData?.monthlySummary?.balance ?? 0) <
                  (parseFloat(totalBudget) || 0)
              }
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-1 sm:order-2 min-w-32"
            >
              {loading ? (
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
