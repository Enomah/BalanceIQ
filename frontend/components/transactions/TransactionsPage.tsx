"use client";

import { useAuthStore } from "@/store/authStore";
import { useRequireAuth } from "@/lib/useRequireAuth";
import TransactionsHeader from "./TransactionsHeader";
import TransactionsFilters from "./TransactionsFilters";
import TransactionsList from "./TransactionsList";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "../dashboard/WelcomeSection";
import { AnimatePresence, motion } from "framer-motion";
import { useTransactionsPageLogic } from "@/hooks/transactions/useTransactionsPageLogic";

export default function TransactionsPage() {
  const { userProfile } = useAuthStore();
  useRequireAuth();

  const {
    filters,
    isLoading,
    isFetchingNextPage,
    error,
    groupedTransactions,
    transactions,
    pagination,
    fetchNextPage,
    handleFilterChange,
    handleRefresh,
  } = useTransactionsPageLogic();

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar
        currentPath={"/dashboard/transactions"}
        userProfile={userProfile}
      />
      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>
          {isLoading && transactions.length === 0 ? (
            <LoadingState />
          ) : error && transactions.length === 0 ? (
            <ErrorState
              error={(error as Error)?.message || "Error"}
              onRetry={handleRefresh}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="transactions-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto"
              >
                <div className="px-[10px] sm:px-6 pb-[20px]">
                  <TransactionsHeader />
                  <TransactionsFilters onFilterChange={handleFilterChange} />

                  {groupedTransactions.length === 0 ? (
                    <EmptyState
                      isFiltered={
                        !!(filters.search || filters.type || filters.category)
                      }
                    />
                  ) : (
                    <TransactionsList
                      groupedTransactions={groupedTransactions}
                      loading={isFetchingNextPage}
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onLoadMore={() => fetchNextPage()}
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
