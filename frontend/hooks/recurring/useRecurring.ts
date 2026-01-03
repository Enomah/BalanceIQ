import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

export interface RecurringTransaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  nextDate: string;
  status: "active" | "paused" | "cancelled";
  lastProcessed?: string;
}

export const useRecurring = () => {
  const queryClient = useQueryClient();

  const { data: recurringTransactions, isLoading } = useQuery<
    RecurringTransaction[]
  >({
    queryKey: ["recurring"],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/recurring");
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(`/dashboard/recurring/${id}`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/dashboard/recurring/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
    },
  });

  return {
    recurringTransactions,
    isLoading,
    updateStatus: updateStatusMutation.mutate,
    deleteRecurring: deleteMutation.mutate,
  };
};
