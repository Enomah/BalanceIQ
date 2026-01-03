import { useState } from "react";
import { useRecurring } from "./useRecurring";
import { useAuthStore } from "@/store/authStore";

export const useRecurringListLogic = () => {
  const { recurringTransactions, isLoading, updateStatus, deleteRecurring } =
    useRecurring();
  const { userProfile } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const closeMenu = () => {
    setMenuOpen(null);
  };

  const handleDelete = (id: string) => {
    // Logic handled in component with confirm, but we could move it here if we use a custom modal
    // For now, exposing the mutator
    deleteRecurring(id);
    closeMenu();
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatus({ id, status });
    closeMenu();
  };

  return {
    recurringTransactions,
    isLoading,
    userProfile,
    menuOpen,
    toggleMenu,
    closeMenu,
    handleDelete,
    handleUpdateStatus,
  };
};
