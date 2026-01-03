export interface BudgetCategory {
  _id: string;
  id?: string;
  key: string;
  allocated: number;
  spent: number;
}

export interface MonthlyBudget {
  _id: string;
  id?: string;
  month: number;
  year: number;
  totalBudget: number;
  totalSpent: number;
  categories: BudgetCategory[];
  createdAt?: string | Date;
}
