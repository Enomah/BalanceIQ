import { Edit2, Trash2 } from "lucide-react";
import { Transaction } from "@/types/dashboardTypes";
import { formatCurrency } from "@/lib/format";
import { useTransactionItemLogic } from "@/hooks/transactions/useTransactionItemLogic";
import TransactionModals from "./TransactionModals";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const {
    userProfile,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    deleteMutation,
    styles: { icon, bg, text, prefix },
  } = useTransactionItemLogic(transaction);

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
      <div className="flex items-center gap-4">
        <div className={`font-medium ${text}`}>
          {prefix}
          {userProfile &&
            formatCurrency(transaction.amount, userProfile?.currency)}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--primary-600)] transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--error-600)] transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <TransactionModals
        transaction={transaction}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
        isEditModalOpen={isEditModalOpen}
        onCloseEditModal={() => setIsEditModalOpen(false)}
        onConfirmDelete={() => deleteMutation.mutate()}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default TransactionItem;
