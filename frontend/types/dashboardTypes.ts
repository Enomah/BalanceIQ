export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
  incomeCategoryTotals: Record<string, number>,
  expenseCategoryTotals:Record<string, number>
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
  status: 'active' | 'completed' | 'archived' | "paused";
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'savings';
  category: string;
  createdAt: string;
}

export interface DashboardStats {
  transactionsCountThisMonth: number;
  totalGoals: number;
  completedGoals: number;
}

export interface DashboardData {
  monthlySummary: MonthlySummary;
  recentTransactions: Transaction[];
  activeGoals: Goal[];
  stats: DashboardStats;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  action?: () => void;
  isDestructive?: boolean;
}