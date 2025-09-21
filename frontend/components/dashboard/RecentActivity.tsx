import React from 'react';
import { TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { Transaction } from '@/types/dashboardTypes';

interface RecentActivityProps {
  recentTransactions: Transaction[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentTransactions }) => {
  return (
    <div className="recent-activity bg-[var(--bg-secondary)] p-[10px] sm:p-6 sm:rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h3>
        <button className="text-sm text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:underline">View All</button>
      </div>
      
      {recentTransactions.length > 0 ? (
        <div className="space-y-4">
          {recentTransactions.slice(0, 5).map(transaction => (
            <div key={transaction.id} className="activity-item flex items-center p-3 border border-[var(--border-light)] rounded-lg">
              <div className={`p-2 rounded-full mr-3 ${
                transaction.type === 'income' 
                  ? 'bg-[var(--success-100)] text-[var(--success-600)] dark:bg-[var(--success-900)] dark:text-[var(--success-400)]' 
                  : 'bg-[var(--error-100)] text-[var(--error-600)] dark:bg-[var(--error-900)] dark:text-[var(--error-400)]'
              }`}>
                {transaction.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[var(--text-primary)]">{transaction.description}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className={`font-medium ${
                transaction.type === 'income' 
                  ? 'text-[var(--success-600)] dark:text-[var(--success-400)]' 
                  : 'text-[var(--error-600)] dark:text-[var(--error-400)]'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </div>
            </div>
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