import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Transaction } from "@/types/dashboardTypes";

interface TransactionsResponse {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  next: string | null;
  prev: string | null;
}

export const useTransactions = (
  filters: {
    search?: string;
    type?: string;
    category?: string;
  } = {}
) => {
  return useInfiniteQuery<TransactionsResponse>({
    queryKey: ["transactions", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.category) params.append("category", filters.category);
      params.append("page", (pageParam as number).toString());

      const { data } = await apiClient.get<
        TransactionsResponse & { content: Transaction[] }
      >(`/dashboard/transactions?${params.toString()}`);

      return {
        ...data,
        transactions: data.content || [],
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
