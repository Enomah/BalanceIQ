import { Transaction } from "./dashboardTypes";

export interface SummaryData {
  period: {
    month: number;
    year: number;
    monthName: string;
    start: string;
    end: string;
  };
  overview: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    transactionCount: {
      income: number;
      expenses: number;
      total: number;
    };
  };
  trends: {
    income: {
      current: number;
      previous: number;
      trend: number;
      direction: 'up' | 'down';
    };
    expenses: {
      current: number;
      previous: number;
      trend: number;
      direction: 'up' | 'down';
    };
  };
  highlights: {
    largestIncome: Transaction[];
    largestExpenses: Transaction[];
    topCategory: {
      name: string;
      amount: number;
    } | null;
  };
  charts: {
    daily: {
      days: number[];
      income: Array<{ day: number; amount: number }>;
      expenses: Array<{ day: number; amount: number }>;
    };
    categories: {
      income: Array<{ name: string; value: number; count: number }>;
      expenses: Array<{ name: string; value: number; count: number; average: number }>;
    };
    weekly: Array<{
      _id: number;
      totalExpenses: number;
      transactionCount: number;
      week: number;
      netSavings: number | null;
    }>;
  };
  weeklyBreakdown: any;
  categoryAnalysis: {
    income: Array<{
      _id: string;
      total: number;
      count: number;
      average: number;
    }>;
    expenses: Array<{
      _id: string;
      total: number;
      count: number;
      average: number;
      largest: number;
    }>;
  };
  transactionPatterns: any;
}

export interface MonthYearOption {
  isCurrent: unknown;
  value: string;
  label: string;
  year: number;
  month: number;
}