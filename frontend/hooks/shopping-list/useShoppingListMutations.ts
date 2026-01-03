import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { ShoppingList, ShoppingListItem } from "@/types/dashboardTypes";
import { useToastStore } from "@/store/toastStore";

interface CreateShoppingListData {
  name: string;
  items: Omit<ShoppingListItem, "_id" | "checked">[];
}

interface UpdateShoppingListData {
  id: string;
  name?: string;
  items?: ShoppingListItem[];
  status?: "active" | "completed" | "archived";
}

export const useShoppingListMutations = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const createMutation = useMutation({
    mutationFn: async (data: CreateShoppingListData) => {
      const response = await apiClient.post("/shopping-lists", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
      showToast("Shopping list created successfully!", "success");
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Failed to create list",
        "error"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: UpdateShoppingListData) => {
      const response = await apiClient.put(`/shopping-lists/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
      showToast("Shopping list updated successfully!", "success");
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Failed to update list",
        "error"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/shopping-lists/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
      showToast("Shopping list deleted successfully!", "success");
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Failed to delete list",
        "error"
      );
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/shopping-lists/${id}/export`);
      return response.data;
    },
    onSuccess: () => {
      showToast("PDF sent to your email!", "success");
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Failed to export list",
        "error"
      );
    },
  });

  return {
    createList: createMutation.mutate,
    updateList: updateMutation.mutate,
    deleteList: deleteMutation.mutate,
    exportList: exportMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isExporting: exportMutation.isPending,
  };
};
