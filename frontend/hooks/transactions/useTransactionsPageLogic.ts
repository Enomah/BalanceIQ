import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { groupTransactionsByMonth } from "@/lib/transactions";

export const useTransactionsPageLogic = () => {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
  });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useTransactions(filters);

  const transactions = useMemo(() => {
    return data?.pages.flatMap((page) => page.transactions) || [];
  }, [data]);

  const groupedTransactions = useMemo(() => {
    return groupTransactionsByMonth(transactions);
  }, [transactions]);

  const handleFilterChange = (newFilters: {
    search: string;
    type: string;
    category: string;
  }) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    refetch();
  };

  const pagination = {
    currentPage: data?.pages.length || 1,
    totalPages: data?.pages[0]?.totalPages || 1,
  };

  return {
    filters,
    isLoading,
    isFetchingNextPage,
    error,
    groupedTransactions,
    transactions,
    pagination,
    hasNextPage,
    fetchNextPage,
    handleFilterChange,
    handleRefresh,
  };
};
