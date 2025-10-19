import React from 'react';
import { Transaction } from '@/types/dashboardTypes';
import TransactionItem from '../transactions/TransactionItem';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';

interface RecentActivityProps {
  recentTransactions: Transaction[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentTransactions }) => {
  return (
    <div className="recent-activity bg-[var(--bg-secondary)] p-[10px] sm:p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h3>
        <Link href={"/dashboard/transactions"} className="text-sm text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:underline">View All</Link>
      </div>
      {recentTransactions.length > 0 ? (
        <div className="space-y-4">
          {recentTransactions.slice(0, 5).map((transaction, idx) => (
            <TransactionItem key={idx} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--text-tertiary)]">
          <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
          <p>No recent transactions</p>
          <p className="text-sm mt-1">Your transactions will appear here</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;