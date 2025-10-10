import { create } from "zustand";
import { DashboardData, Goal } from "@/types/dashboardTypes";
import { baseUrl } from "@/api/rootUrls";
import { useAuthStore } from "@/store/authStore";

interface DashboardStore {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  setDashboardData: (data: DashboardData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDashboard: () => Promise<void>;
  updateMonthlySummary: (summary: DashboardData["monthlySummary"]) => void;
  updateRecentTransactions: (
    transactions: DashboardData["recentTransactions"]
  ) => void;
  addRecentTransaction: (
    transaction: DashboardData["recentTransactions"][0]
  ) => void;
  updateActiveGoals: (goals: DashboardData["activeGoals"]) => void;
  updateGoal: (
    goalId: string,
    updatedGoal: Partial<DashboardData["activeGoals"][0]>
  ) => void;
  updateStats: (stats: DashboardData["stats"]) => void;
  clearDashboard: () => void;
  addGoal: (goal: Goal) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  dashboardData: null,
  loading: true,
  error: null,

  setDashboardData: (data) => set({ dashboardData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchDashboard: async () => {
    const { accessToken } = useAuthStore.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${baseUrl}/dashboard`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: DashboardData = await response.json();
      console.log(data);
      set({ dashboardData: data });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: "Failed to load dashboard" });
    } finally {
      set({ loading: false });
    }
  },

  updateMonthlySummary: (summary) =>
    set((state) => ({
      dashboardData: state.dashboardData
        ? { ...state.dashboardData, monthlySummary: summary }
        : null,
    })),

  updateRecentTransactions: (transactions) =>
    set((state) => ({
      dashboardData: state.dashboardData
        ? { ...state.dashboardData, recentTransactions: transactions }
        : null,
    })),

  addRecentTransaction: (transaction) =>
    set((state) => ({
      dashboardData: state.dashboardData
        ? {
            ...state.dashboardData,
            recentTransactions: [
              transaction,
              ...state.dashboardData.recentTransactions,
            ],
          }
        : null,
    })),

  updateActiveGoals: (goals) =>
    set((state) => ({
      dashboardData: state.dashboardData
        ? { ...state.dashboardData, activeGoals: goals }
        : null,
    })),

  addGoal: (goal) =>
    set((state) => ({
      dashboardData: state.dashboardData
        ? {
            ...state.dashboardData,
            activeGoals: [goal, ...state.dashboardData.activeGoals],
          }
        : null,
    })),

  updateGoal: (goalId, updatedGoal) =>
    set((state) => ({
      dashboardData: state.dashboardData
        ? {
            ...state.dashboardData,
            activeGoals: state.dashboardData.activeGoals.map((goal) =>
              goal.id === goalId ? { ...goal, ...updatedGoal } : goal
            ),
          }
        : null,
    })),

  updateStats: (stats) =>
    set((state) => ({
      dashboardData: state.dashboardData
        ? { ...state.dashboardData, stats }
        : null,
    })),

  clearDashboard: () =>
    set({ dashboardData: null, loading: false, error: null }),
}));
