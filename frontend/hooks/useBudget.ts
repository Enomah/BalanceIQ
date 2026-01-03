import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { MonthlyBudget } from "@/types/budgetTypes";

export const useBudget = () => {
  return useQuery<MonthlyBudget | null>({
    queryKey: ["budget"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<MonthlyBudget>(
          "/dashboard/budget"
        );
        return data;
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
};
