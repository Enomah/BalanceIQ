export interface User {
  _id: string;
  email: string;
  avatar: string;
  fullName: string;
  nickname: string;
  isVerified: string;
  currency: string;
  accountBalance: number;
  monthlyIncome: number;
  incomeSource: string;
  role: "user" | "admin";
  createdAt: string;
}
