
import { create } from 'zustand';
import { Transaction, MonthYearGroup } from '@/types/dashboardTypes';

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
  updateTransactions: (response: TransactionsResponse) => void; 
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  groupedTransactions: [],
  loading: false,
  error: null,

  groupTransactionsByMonth: (transactions: Transaction[]): MonthYearGroup[] => {
    const groups: MonthYearGroup[] = [];
    const groupMap = new Map<string, MonthYearGroup>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          year,
          month,
          monthName: monthNames[month],
          transactions: []
        });
      }
      groupMap.get(key)!.transactions.push(transaction);
    });

    return Array.from(groupMap.values())
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      })
      .map(group => ({
        ...group,
        transactions: group.transactions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }));
  },

  setTransactions: (response) => set({
    transactions: response.content,
    groupedTransactions: get().groupTransactionsByMonth(response.content),
    error: null
  }),

  addTransaction: (transaction) => set((state) => {
    const newTransactions = [transaction, ...state.transactions];
    return {
      transactions: newTransactions,
      groupedTransactions: get().groupTransactionsByMonth(newTransactions)
    };
  }),

  updateTransactions: (response) => set((state) => {
    const newTransactions = [...state.transactions, ...response.content];
    return {
      transactions: newTransactions,
      groupedTransactions: get().groupTransactionsByMonth(newTransactions)
    };
  })
}));