import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Goal } from "@/types/dashboardTypes";

interface GoalsResponse {
  count: number;
  next: string | null;
  prev: string | null;
  current_page: number;
  total_pages: number;
  page_size: number;
  content: Goal[];
}

export interface statsTypes {
  totalGoals: number;
  totalActive: number;
  totalTarget: number;
  totalSaved: number;
}

interface GoalState {
  // Main goals array (all goals)
  goals: Goal[];
  
  // Tab-specific goals arrays
  activeGoals: Goal[];
  completedGoals: Goal[];
  
  // Pagination states for each tab
  activePagination: Omit<GoalsResponse, 'content'> | null;
  completedPagination: Omit<GoalsResponse, 'content'> | null;
  
  stats: statsTypes;
  
  // Main actions
  setGoals: (response: GoalsResponse) => void;
  setStats: (stats: statsTypes) => void;
  updateGoals: (response: GoalsResponse) => void;
  addGoal: (goal: Goal) => void;
  removeGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updatedGoal: Partial<Goal>) => void;
  getGoal: (goalId: string) => Goal | undefined;
  
  // Tab-specific actions
  setActiveGoals: (response: GoalsResponse) => void;
  setCompletedGoals: (response: GoalsResponse) => void;
  updateActiveGoals: (response: GoalsResponse) => void;
  updateCompletedGoals: (response: GoalsResponse) => void;
  
  // NEW: Add goals without pagination (for appending to existing arrays)
  addActiveGoals: (goals: Goal[]) => void;
  addCompletedGoals: (goals: Goal[]) => void;
  
  // Helper actions
  recalculateTabGoals: () => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      activeGoals: [],
      completedGoals: [],
      activePagination: null,
      completedPagination: null,
      stats: {
        totalGoals: 0,
        totalActive: 0,
        totalTarget: 0,
        totalSaved: 0,
      },

      setStats: (stats: statsTypes) => {
        set({ stats });
      },

      setGoals: (response: GoalsResponse) => {
        const goals = response.content || [];
        const activeGoals = goals.filter(goal => goal.status !== "completed");
        const completedGoals = goals.filter(goal => goal.status === "completed");

        set({
          goals,
          activeGoals,
          completedGoals,
        });
      },

      updateGoals: (response: GoalsResponse) => {
        set((state) => {
          const existingIds = new Set(state.goals.map((g) => g.id));
          const newGoals = (response.content || []).filter(
            (g) => !existingIds.has(g.id)
          );
          const updatedGoals = [...state.goals, ...newGoals];
          
          const activeGoals = updatedGoals.filter(goal => goal.status !== "completed");
          const completedGoals = updatedGoals.filter(goal => goal.status === "completed");

          return {
            goals: updatedGoals,
            activeGoals,
            completedGoals,
          };
        });
      },

      // Tab-specific setters
      setActiveGoals: (response: GoalsResponse) => {
        const activeGoals = response.content || [];
        set({
          activeGoals,
          activePagination: {
            count: response.count,
            next: response.next,
            prev: response.prev,
            current_page: response.current_page,
            total_pages: response.total_pages,
            page_size: response.page_size,
          },
        });
      },

      setCompletedGoals: (response: GoalsResponse) => {
        const completedGoals = response.content || [];
        set({
          completedGoals,
          completedPagination: {
            count: response.count,
            next: response.next,
            prev: response.prev,
            current_page: response.current_page,
            total_pages: response.total_pages,
            page_size: response.page_size,
          },
        });
      },

      updateActiveGoals: (response: GoalsResponse) => {
        set((state) => {
          const existingIds = new Set(state.activeGoals.map((g) => g.id));
          const newGoals = (response.content || []).filter(
            (g) => !existingIds.has(g.id)
          );
          const updatedActiveGoals = [...state.activeGoals, ...newGoals];

          return {
            activeGoals: updatedActiveGoals,
            activePagination: {
              count: response.count,
              next: response.next,
              prev: response.prev,
              current_page: response.current_page,
              total_pages: response.total_pages,
              page_size: response.page_size,
            },
          };
        });
      },

      updateCompletedGoals: (response: GoalsResponse) => {
        set((state) => {
          const existingIds = new Set(state.completedGoals.map((g) => g.id));
          const newGoals = (response.content || []).filter(
            (g) => !existingIds.has(g.id)
          );
          const updatedCompletedGoals = [...state.completedGoals, ...newGoals];

          return {
            completedGoals: updatedCompletedGoals,
            completedPagination: {
              count: response.count,
              next: response.next,
              prev: response.prev,
              current_page: response.current_page,
              total_pages: response.total_pages,
              page_size: response.page_size,
            },
          };
        });
      },

      // NEW: Add goals to existing arrays without pagination
      addActiveGoals: (goals: Goal[]) => {
        set((state) => {
          const existingIds = new Set(state.activeGoals.map((g) => g.id));
          const newGoals = goals.filter((g) => !existingIds.has(g.id));
          const updatedActiveGoals = [...state.activeGoals, ...newGoals];

          return {
            activeGoals: updatedActiveGoals,
          };
        });
      },

      addCompletedGoals: (goals: Goal[]) => {
        set((state) => {
          const existingIds = new Set(state.completedGoals.map((g) => g.id));
          const newGoals = goals.filter((g) => !existingIds.has(g.id));
          const updatedCompletedGoals = [...state.completedGoals, ...newGoals];

          return {
            completedGoals: updatedCompletedGoals,
          };
        });
      },

      addGoal: (g: Goal) => {
        const goal: Goal = {
          targetDate: g.targetDate,
          id: g.id || `goal-${Date.now()}`,
          title: g.title?.trim() || "Untitled goal",
          targetAmount: g.targetAmount || 0,
          currentAmount: g.currentAmount || 0,
          progress: g.progress || 0,
          status: g.status || "active",
        };

        set((state) => {
          const goalExists = state.goals.some(
            (existingGoal) => existingGoal.id === goal.id
          );

          if (goalExists) {
            return state;
          }

          const updatedGoals = [goal, ...state.goals];
          const activeGoals = goal.status !== "completed" 
            ? [goal, ...state.activeGoals]
            : state.activeGoals;
          const completedGoals = goal.status === "completed"
            ? [goal, ...state.completedGoals]
            : state.completedGoals;

          return {
            goals: updatedGoals,
            activeGoals,
            completedGoals,
          };
        });
      },

      removeGoal: (goalId: string) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== goalId),
          activeGoals: state.activeGoals.filter((g) => g.id !== goalId),
          completedGoals: state.completedGoals.filter((g) => g.id !== goalId),
        }));
      },

      updateGoal: (goalId: string, updatedGoal: Partial<Goal>) => {
        set((state) => {
          const updatedGoals = state.goals.map((g) =>
            g.id === goalId ? { ...g, ...updatedGoal } : g
          );

          // Recalculate tab-specific arrays when status changes
          const activeGoals = updatedGoals.filter(goal => goal.status !== "completed");
          const completedGoals = updatedGoals.filter(goal => goal.status === "completed");

          return {
            goals: updatedGoals,
            activeGoals,
            completedGoals,
          };
        });
      },

      getGoal: (goalId: string) => {
        return get().goals.find((g) => g.id === goalId);
      },

      recalculateTabGoals: () => {
        set((state) => {
          const activeGoals = state.goals.filter(goal => goal.status !== "completed");
          const completedGoals = state.goals.filter(goal => goal.status === "completed");

          return {
            activeGoals,
            completedGoals,
          };
        });
      },
    }),
    {
      name: 'goals-storage',
      partialize: (state) => ({ 
        goals: state.goals,
        activeGoals: state.activeGoals,
        completedGoals: state.completedGoals,
        activePagination: state.activePagination,
        completedPagination: state.completedPagination,
        stats: state.stats,
      }),
    }
  )
);