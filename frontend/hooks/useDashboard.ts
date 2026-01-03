import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { DashboardData } from "@/types/dashboardTypes";

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardData>("/dashboard");
      return data;
    },
  });
};
