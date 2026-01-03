export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
  incomeCategoryTotals: Record<string, number>;
  expenseCategoryTotals: Record<string, number>;
  startOfMonth?: string;
  endOfMonth?: string;
}

export interface Goal {
  targetDate: any;
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  status: "active" | "completed" | "archived" | "paused";
}

export interface Transaction {
  id: string;
  _id?: string;
  description: string;
  amount: number;
  type: "income" | "expense" | "savings";
  category: string;
  createdAt: string;
}

export interface DashboardStats {
  transactionsCountThisMonth: number;
  totalGoals: number;
  completedGoals: number;
}

export interface Insight {
  type: "success" | "info" | "warning" | "danger";
  title: string;
  message: string;
  icon: string;
}

export interface DashboardData {
  monthlySummary: MonthlySummary;
  recentTransactions: Transaction[];
  activeGoals: Goal[];
  stats: DashboardStats;
  insights: Insight[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  action?: () => void;
  isDestructive?: boolean;
}

export interface MonthYearGroup {
  year: number;
  month: number;
  monthName: string;
  transactions: Transaction[];
}

export interface TransactionsResponse {
  count: number;
  next: string | null;
  prev: string | null;
  current_page: number;
  total_pages: number;
  page_size: number;
  content: Transaction[];
}

export interface FetchTransactionsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: "income" | "expense" | "savings";
  category?: string;
}

export type ActiveTab = "active" | "completed";

export interface ShoppingListItem {
  _id?: string;
  name: string;
  quantity: number;
  unit?: string;
  price: number;
  category:
    | "groceries"
    | "electronics"
    | "clothing"
    | "household"
    | "health"
    | "other";
  checked: boolean;
}

export interface ShoppingList {
  _id: string;
  userId: string;
  name: string;
  items: ShoppingListItem[];
  totalPrice: number;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListsResponse {
  lists: ShoppingList[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalLists: number;
    hasMore: boolean;
  };
}
