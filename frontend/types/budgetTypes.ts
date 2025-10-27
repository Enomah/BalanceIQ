export interface BudgetCategory {
  id:string;
  key: string;
  allocated: number;
  spent: number;
}

export interface MonthlyBudget {
  id: string;
  month: number;
  year: number;
  totalBudget: number;
  totalSpent: number;
  categories: BudgetCategory[];
  createdAt?: Date;
}
