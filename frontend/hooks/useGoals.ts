import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Goal } from "@/types/dashboardTypes";

export const useGoals = (status: "active" | "completed" = "active") => {
  return useInfiniteQuery({
    queryKey: ["goals", status],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<{
        content: Goal[];
        next: string | null;
        currentPage: number;
        totalPages: number;
      }>(`/dashboard/goals/${status}?page=${pageParam}&limit=10`);
      return data;
    },
    getNextPageParam: (lastPage) => {
      // If lastPage.next exists, extract the page number or just return lastPage.currentPage + 1
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
