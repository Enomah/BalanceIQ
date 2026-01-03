import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { useAppMutation } from "./useAppMutation";

export interface Ticket {
  _id: string;
  userId: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed" | "paused";
  createdAt: string;
}

export interface TicketMessage {
  _id: string;
  ticketId: string;
  senderId: string;
  senderType: "user" | "platform";
  message: string;
  createdAt: string;
}

export interface TicketPage {
  tickets: Ticket[];
  currentPage: number;
  totalPages: number;
  totalTickets: number;
  hasNextPage: boolean;
}

export const useTickets = (limit = 10) => {
  return useInfiniteQuery<TicketPage>({
    queryKey: ["support-tickets"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get(
        `/support?page=${pageParam}&limit=${limit}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: ({ id, status }: { id: string; status: Ticket["status"] }) =>
      apiClient.put(`/support/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
    successMessage: "Ticket status updated successfully!",
  });
};

export const useTicketMessages = (ticketId: string | null) => {
  return useQuery<TicketMessage[]>({
    queryKey: ["support-messages", ticketId],
    queryFn: async () => {
      if (!ticketId) return [];
      const response = await apiClient.get(`/support/${ticketId}/messages`);
      return response.data;
    },
    enabled: !!ticketId,
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: ({
      ticketId,
      message,
    }: {
      ticketId: string;
      message: string;
    }) => apiClient.post(`/support/${ticketId}/messages`, { message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support-messages", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};

// Admin Hooks
export const useAdminAllTickets = (limit = 10) => {
  return useInfiniteQuery<TicketPage>({
    queryKey: ["admin-all-tickets"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get(
        `/support/admin/all?page=${pageParam}&limit=${limit}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useAdminAddReply = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: ({
      ticketId,
      message,
    }: {
      ticketId: string;
      message: string;
    }) => apiClient.post(`/support/admin/${ticketId}/reply`, { message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support-messages", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-all-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};
