import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TransactionItem from "@/components/transactions/TransactionItem";
import { MonthYearGroup } from "@/types/dashboardTypes";

interface TransactionsGroupProps {
  group: MonthYearGroup;
  groupIndex: number;
}

export default function TransactionsGroup({
  group,
  groupIndex,
}: TransactionsGroupProps) {
  return (
    <div
      className="group"
      style={{
        animationDelay: `${groupIndex * 100}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-[5px]">
          <div className="w-1 h-8 bg-[var(--primary-500)] rounded-full"></div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {group.monthName} {group.year}
          </h2>
        </div>
        <Link
          href={`/dashboard/summary?month=${group.month + 1}&year=${
            group.year
          }`}
          className="ml-4 px-3 py-1 bg-[var(--bg-tertiary)] rounded-full"
        >
          <div className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
            View summary <ArrowRight size={18} />
          </div>
        </Link>
      </div>

      <div className="space-y-3">
        {group.transactions.map((transaction, idx) => (
          <div
            key={`${transaction.id || transaction._id || idx}-${
              transaction.createdAt
            }`}
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              animationDelay: `${idx * 50}ms`,
            }}
          >
            <TransactionItem transaction={transaction} />
          </div>
        ))}
      </div>
    </div>
  );
}
