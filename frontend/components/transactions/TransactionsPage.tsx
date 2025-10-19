"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";
import { requireAuth } from "@/lib/requireAuth";
import TransactionsHeader from "./TransactionsHeader";
import TransactionsList from "./TransactionsList";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "../dashboard/WelcomeSection";
import { useTransactionStore } from "@/store/transactionsStore";
import { AnimatePresence, motion } from "framer-motion";

export default function TransactionsPage() {
  const { accessToken, userProfile } = useAuthStore();
  const {
    transactions,
    groupedTransactions,
    setTransactions,
    addTransaction,
    updateTransactions,
  } = useTransactionStore();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    next: null as string | null,
  });

  requireAuth();

  const fetchData = async (url: string, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();

      if (isLoadMore) {
        updateTransactions(data);
      } else {
        setTransactions(data);
      }

      setPagination({
        current_page: data.current_page,
        total_pages: data.total_pages,
        next: data.next,
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (pagination.next && !loadingMore) {
      fetchData(pagination.next, true);
    }
  };

  const handleAddTransaction = (transaction: any) => {
    addTransaction(transaction);
  };

  const handleRefresh = () => {
    fetchData(`${baseUrl}/dashboard/transactions`);
  };

  useEffect(() => {
    fetchData(`${baseUrl}/dashboard/transactions`);
  }, [accessToken]);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar
        currentPath={"/dashboard/transactions"}
        userProfile={userProfile}
      />
      <div className="flex-1 sm:overflow-y-auto">
        <div className="sticky z-[100] top-0 left-0">
          <WelcomeSection userProfile={userProfile} />
        </div>
        {loading && transactions.length === 0 ? (
          <LoadingState />
        ) : error && transactions.length === 0 ? (
          <ErrorState error={error} onRetry={handleRefresh} />
        ) : groupedTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // className="space-y-8"
            >
              <div className="max-w-2xl mx-auto">
                <div className="px-[10px] sm:px-6 pb-[20px] ">
                  <TransactionsHeader />
                  <TransactionsList
                    groupedTransactions={groupedTransactions}
                    loading={loadingMore}
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    onLoadMore={loadMore}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
