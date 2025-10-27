"use client";

import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { useAuthStore } from "@/store/authStore";
import WelcomeSection from "../dashboard/WelcomeSection";
import { baseUrl } from "@/api/rootUrls";
import { requireAuth } from "@/lib/requireAuth";
import BudgetEmptyState from "./BudgetEmptyState";
import { AnimatePresence, motion } from "framer-motion";
import BudgetForm from "./BudgetForm";
import { MonthlyBudget } from "@/types/budgetTypes";
import { useDashboardStore } from "@/store/dashboardStore";
import BudgetProgress from "./BudgetProgress";
import BudgetOverview from "./overview/BudgetOverview";
import { Plus, TrendingUp, Grid, PieChart, Loader2 } from "lucide-react";
import BudgetCategories from "./categories/BudgetCategories";

type ViewMode = "overview" | "categories";

export default function BudgetingPage() {
  const { userProfile, accessToken } = useAuthStore();
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const {
    loading: dashboardLoading,
    error: dashboardError,
    fetchDashboard,
  } = useDashboardStore();

  const [budgetData, setBudgetData] = useState<MonthlyBudget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("overview");

  requireAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/dashboard/budget`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${data.message}`);
      }

      if (data) {
        setBudgetData(data);
      } else {
        throw new Error(
          data.message || "Invalid data format received from server"
        );
      }
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching data"
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchDashboard();
    fetchData();
  }, [fetchData]);

  const handleCreateBudget = (budget: MonthlyBudget) => {
    setBudgetData(budget);
    console.log("Budget created/updated:", budget);
    setShowBudgetForm(false);
  };

  const toggleView = () => {
    setView((prev) => (prev === "overview" ? "categories" : "overview"));
  };

  if (loading && !budgetData) {
    return (
      <div className="flex h-screen bg-[var(--bg-primary)]">
        <Sidebar currentPath="/dashboard/budgeting" userProfile={userProfile} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !budgetData) {
    return (
      <div className="flex h-screen bg-[var(--bg-primary)]">
        <Sidebar currentPath="/dashboard/budgeting" userProfile={userProfile} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--error-100)] rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[var(--error-600)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Failed to Load Budget
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath="/dashboard/budgeting" userProfile={userProfile} />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="sticky z-[100] top-0 left-0 bg-[var(--bg-primary)]">
          <WelcomeSection userProfile={userProfile} />
        </div>

        <div className="">
          <div className=" pb-8">
            <AnimatePresence mode="wait">
              {!budgetData ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="px-[10px] sm:px-6"
                >
                  <BudgetEmptyState
                    onGetStarted={() => setShowBudgetForm(true)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="budget-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="px-[10px] sm:px-6">
                    <BudgetProgress budget={budgetData} />
                  </div>

                  <div className="p-[10px] sm:px-6 sticky z-[100] top-[70px] bg-[var(--bg-primary)] left-0">
                    <AnimatePresence mode="wait">
                      {budgetData ? (
                        <motion.div
                          key="budget-actions"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                        >
                          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-light)]">
                            <button
                              onClick={() => setView("overview")}
                              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                view === "overview"
                                  ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              <PieChart className="w-4 h-4" />
                              Overview
                            </button>
                            <button
                              onClick={() => setView("categories")}
                              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                view === "categories"
                                  ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              <Grid className="w-4 h-4" />
                              Categories
                            </button>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowBudgetForm(true)}
                              className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors text-sm"
                            >
                              <Plus className="w-4 h-4" />
                              {budgetData ? "Edit Budget" : "Create Budget"}
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty-actions"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-center"
                        ></motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence mode="wait">
                    {view === "overview" ? (
                      <motion.div
                        key="overview-content"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="px-[10px] sm:px-6"
                      >
                        <BudgetOverview
                          budget={budgetData}
                          onEditBudget={() => setShowBudgetForm(true)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="categories-content"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="px-[10px] sm:px-6"
                      >
                        <BudgetCategories
                          budget={budgetData}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showBudgetForm && (
            <BudgetForm
              existingBudget={budgetData}
              onSubmit={handleCreateBudget}
              onClose={() => setShowBudgetForm(false)}
              isOpen={showBudgetForm}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
