import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { ShoppingListsResponse } from "@/types/dashboardTypes";

interface UseShoppingListsParams {
  status?: "active" | "completed" | "archived";
  page?: number;
  limit?: number;
}

export const useShoppingLists = ({
  status,
  page = 1,
  limit = 10,
}: UseShoppingListsParams = {}) => {
  return useQuery<ShoppingListsResponse>({
    queryKey: ["shopping-lists", status, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await apiClient.get(
        `/shopping-lists?${params.toString()}`
      );
      return response.data;
    },
  });
};
