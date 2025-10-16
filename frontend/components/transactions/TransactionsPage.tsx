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
import {
  MonthYearGroup,
  Transaction,
  TransactionsResponse,
} from "@/types/dashboardTypes";
import Sidebar from "../dashboard/Sidebar";
import WelcomeSection from "../dashboard/WelcomeSection";

export default function TransactionsPage() {
  const { accessToken, userProfile, logout } = useAuthStore();
  const [groupedTransactions, setGroupedTransactions] = useState<
    MonthYearGroup[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [transactionsData, setTransactionsData] =
    useState<TransactionsResponse>({
      count: 0,
      next: null,
      prev: null,
      current_page: 0,
      total_pages: 0,
      page_size: 0,
      content: [],
    });

  requireAuth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const groupTransactionsByMonth = (
    transactions: Transaction[]
  ): MonthYearGroup[] => {
    if (!userProfile?.createdAt) return [];

    const accountCreated = new Date(userProfile.createdAt);
    const accountYear = accountCreated.getFullYear();
    const accountMonth = accountCreated.getMonth();

    const groups: MonthYearGroup[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    for (let year = accountYear; year <= currentYear; year++) {
      const startMonth = year === accountYear ? accountMonth : 0;
      const endMonth = year === currentYear ? currentMonth : 11;

      for (let month = startMonth; month <= endMonth; month++) {
        groups.push({
          year,
          month,
          monthName: monthNames[month],
          transactions: [],
        });
      }
    }

    groups.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();

      const group = groups.find(
        (g) => g.year === transactionYear && g.month === transactionMonth
      );
      if (group) {
        group.transactions.push(transaction);
      }
    });

    groups.forEach((group) => {
      group.transactions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    return groups.filter((group) => group.transactions.length > 0);
  };

  const fetchData = async (url: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${url}`,
        // `${baseUrl}/dashboard/transactions?page=${page}&limit=20`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data: TransactionsResponse = await response.json();
      // console.log("Fetched Transactions Data:", data);

      setTransactionsData((prevData) => ({
        count: data.count,
        next: data.next,
        prev: data.prev,
        current_page: data.current_page,
        total_pages: data.total_pages,
        page_size: data.page_size,
        content: [...prevData.content, ...data.content],
      }));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (
      transactionsData.current_page < transactionsData.total_pages &&
      !loading &&
      transactionsData.next
    ) {
      fetchData(transactionsData.next);
    }
  };

  useEffect(() => {
    fetchData(`${baseUrl}/dashboard/transactions`);
  }, [accessToken]);

  useEffect(() => {
    setGroupedTransactions(
      groupTransactionsByMonth(transactionsData?.content || [])
    );
  }, [transactionsData?.content, userProfile]);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentPath={"/dashboard/transactions"}
        userProfile={userProfile}
      />
      <div className="flex-1 sm:overflow-y-auto ">
        {loading && transactionsData?.content.length === 0 ? (
          <LoadingState />
        ) : error && transactionsData?.content.length === 0 ? (
          <ErrorState
            error={error}
            onRetry={() => fetchData(`${baseUrl}/dashboard/transactions`)}
          />
        ) : groupedTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="sticky md:relative top-0 sm:top-[20px] left-0"><WelcomeSection userProfile={userProfile} /></div>

            <div className="p-[10px]">
              <TransactionsHeader />
              <TransactionsList
                groupedTransactions={groupedTransactions}
                loading={loading}
                currentPage={transactionsData.current_page}
                totalPages={transactionsData.total_pages}
                onLoadMore={loadMore}
              />
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .group {
          animation: slideUp 0.6s ease-out both;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
