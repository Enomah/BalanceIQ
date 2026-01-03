import { create } from "zustand";
import { Transaction, MonthYearGroup } from "@/types/dashboardTypes";

interface TransactionsResponse {
  count: number;
  next: string | null;
  prev: string | null;
  current_page: number;
  total_pages: number;
  page_size: number;
  content: Transaction[];
}

interface TransactionState {
  transactions: Transaction[];
  groupedTransactions: MonthYearGroup[];
  loading: boolean;
  error: string | null;
  groupTransactionsByMonth: (transactions: Transaction[]) => MonthYearGroup[];
  setTransactions: (response: TransactionsResponse) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (transactionId: string) => void;
  patchTransaction: (transaction: Transaction) => void;
  updateTransactions: (response: TransactionsResponse) => void;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

import { groupTransactionsByMonth } from "@/lib/transactions";

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  groupedTransactions: [],
  loading: false,
  error: null,

  groupTransactionsByMonth,

  setTransactions: (response) =>
    set({
      transactions: response.content,
      groupedTransactions: get().groupTransactionsByMonth(response.content),
      error: null,
    }),

  addTransaction: (transaction) =>
    set((state) => {
      const newTransactions = [transaction, ...state.transactions];
      return {
        transactions: newTransactions,
        groupedTransactions: get().groupTransactionsByMonth(newTransactions),
      };
    }),

  removeTransaction: (transactionId) =>
    set((state) => {
      const newTransactions = state.transactions.filter(
        (t) => t.id !== transactionId && t._id !== transactionId
      );
      return {
        transactions: newTransactions,
        groupedTransactions: get().groupTransactionsByMonth(newTransactions),
      };
    }),

  patchTransaction: (updatedTransaction) =>
    set((state) => {
      const newTransactions = state.transactions.map((t) => {
        const isMatch =
          (t.id &&
            (t.id === updatedTransaction.id ||
              t.id === updatedTransaction._id)) ||
          (t._id &&
            (t._id === updatedTransaction.id ||
              t._id === updatedTransaction._id));

        return isMatch ? { ...t, ...updatedTransaction } : t;
      });
      return {
        transactions: newTransactions,
        groupedTransactions: get().groupTransactionsByMonth(newTransactions),
      };
    }),

  updateTransactions: (response) =>
    set((state) => {
      const newTransactions = [...state.transactions, ...response.content];
      return {
        transactions: newTransactions,
        groupedTransactions: get().groupTransactionsByMonth(newTransactions),
      };
    }),
}));
