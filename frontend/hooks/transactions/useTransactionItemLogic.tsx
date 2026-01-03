import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTransactionStore } from "@/store/transactionsStore";
import { useToastStore } from "@/store/toastStore";
import { useAppMutation } from "@/hooks/useAppMutation";
import apiClient from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types/dashboardTypes";
import { TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react";

export const useTransactionItemLogic = (transaction: Transaction) => {
  const { userProfile, patchUserProfile } = useAuthStore();
  const { removeTransaction } = useTransactionStore();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const deleteMutation = useAppMutation({
    mutationFn: () =>
      apiClient.delete(
        `/dashboard/transactions/${transaction.id || transaction._id}`
      ),
    successMessage: "Transaction deleted successfully",
    onSuccess: () => {
      const id = transaction.id || transaction._id!;
      removeTransaction(id);

      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      const amount = transaction.amount;
      const isExpense = transaction.type === "expense";
      patchUserProfile({
        accountBalance: isExpense
          ? (userProfile?.accountBalance || 0) + amount
          : (userProfile?.accountBalance || 0) - amount,
      });

      setIsDeleteModalOpen(false);
    },
  });

  const getTransactionStyles = () => {
    switch (transaction.type) {
      case "income":
        return {
          icon: <TrendingUp size={16} />,
          bg: "bg-[var(--success-100)] text-[var(--success-600)] dark:bg-[var(--success-900)] dark:text-[var(--success-400)]",
          text: "text-[var(--success-600)] dark:text-[var(--success-400)]",
          prefix: "+",
        };
      case "expense":
        return {
          icon: <TrendingDown size={16} />,
          bg: "bg-[var(--error-100)] text-[var(--error-600)] dark:bg-[var(--error-900)] dark:text-[var(--error-400)]",
          text: "text-[var(--error-600)] dark:text-[var(--error-400)]",
          prefix: "-",
        };
      case "savings":
        return {
          icon: <Wallet size={16} />,
          bg: "bg-[var(--primary-100)] text-[var(--primary-600)] dark:bg-[var(--primary-900)] dark:text-[var(--primary-400)]",
          text: "text-[var(--primary-600)] dark:text-[var(--primary-400)]",
          prefix: "",
        };
      default:
        return {
          icon: <CreditCard size={16} />,
          bg: "bg-[var(--neutral-100)] text-[var(--neutral-600)] dark:bg-[var(--neutral-900)] dark:text-[var(--neutral-400)]",
          text: "text-[var(--neutral-600)] dark:text-[var(--neutral-400)]",
          prefix: "",
        };
    }
  };

  const { icon, bg, text, prefix } = getTransactionStyles();

  return {
    userProfile,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    deleteMutation,
    styles: { icon, bg, text, prefix },
  };
};
