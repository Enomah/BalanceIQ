import React from "react";
import { TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react";
import { Transaction } from "@/types/dashboardTypes";
import { useAuthStore } from "@/store/authStore";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { userProfile } = useAuthStore();

  const getTransactionStyles = () => {
    switch (transaction.type) {
      case "income":
        return {
          icon: <TrendingUp size={16} />,
          bg: "bg-[var(--success-100)] text-[var(--success-600)] dark:bg-[var(--success-900)] dark:text-[var(--success-400)]",
          text: "text-[var(--success-600)] dark:text-[var(--success-400)]",
          prefix: "+",
        };
      case "expense":
        return {
          icon: <TrendingDown size={16} />,
          bg: "bg-[var(--error-100)] text-[var(--error-600)] dark:bg-[var(--error-900)] dark:text-[var(--error-400)]",
          text: "text-[var(--error-600)] dark:text-[var(--error-400)]",
          prefix: "-",
        };
      case "savings":
        return {
          icon: <Wallet size={16} />,
          bg: "bg-[var(--primary-100)] text-[var(--primary-600)] dark:bg-[var(--primary-900)] dark:text-[var(--primary-400)]",
          text: "text-[var(--primary-600)] dark:text-[var(--primary-400)]",
          prefix: "",
        };
      default:
        return {
          icon: <CreditCard size={16} />,
          bg: "bg-[var(--neutral-100)] text-[var(--neutral-600)] dark:bg-[var(--neutral-900)] dark:text-[var(--neutral-400)]",
          text: "text-[var(--neutral-600)] dark:text-[var(--neutral-400)]",
          prefix: "",
        };
    }
  };

  const { icon, bg, text, prefix } = getTransactionStyles();

  const date = new Date(transaction.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="activity-item flex items-center p-3 border border-[var(--border-light)] rounded-lg">
      <div className={`p-2 rounded-full mr-3 ${bg}`}>{icon}</div>
      <div className="flex-1">
        <h4 className="font-medium text-[var(--text-primary)]">
          {transaction.description}
        </h4>
        <p className="text-sm text-[var(--text-secondary)]">{date}</p>
      </div>
      <div className={`font-medium ${text}`}>
        {prefix}
        {userProfile?.currency}
        {transaction.amount.toLocaleString()}
      </div>
    </div>
  );
};

export default TransactionItem;
