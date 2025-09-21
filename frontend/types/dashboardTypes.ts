export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
  incomeCategoryTotals: {
    salary: number;
    freelance: number;
    investment: number;
    gift: number;
    business: number;
    rental: number;
    others: number;
  };
  expenseCategoryTotals: {
    food: number;
    transport: number;
    accommodation: number;
    utilities: number;
    entertainment: number;
    healthcare: number;
    education: number;
    shopping: number;
    others: number;
  };
  startOfMonth: string;
  endOfMonth: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  status: 'Active' | 'Completed' | 'Archived';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
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