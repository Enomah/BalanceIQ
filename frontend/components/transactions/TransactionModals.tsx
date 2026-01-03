import { Transaction } from "@/types/dashboardTypes";
import Modal from "../ui/Modal";
import AddExpenseForm from "../dashboard/AddExpenseForm";
import AddIncomeForm from "../dashboard/AddIncomeForm";
import { Loader2 } from "lucide-react";

interface TransactionModalsProps {
  transaction: Transaction;
  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  isEditModalOpen: boolean;
  onCloseEditModal: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export default function TransactionModals({
  transaction,
  isDeleteModalOpen,
  onCloseDeleteModal,
  isEditModalOpen,
  onCloseEditModal,
  onConfirmDelete,
  isDeleting,
}: TransactionModalsProps) {
  return (
    <>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        title="Delete Transaction"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            Are you sure you want to delete this transaction? This will also
            update your balance.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCloseDeleteModal}
              className="flex-1 py-2 px-4 border border-[var(--border-light)] rounded-lg font-medium hover:bg-[var(--bg-tertiary)]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="flex-1 py-2 px-4 bg-[var(--error-600)] text-white rounded-lg font-medium hover:bg-[var(--error-700)] flex items-center justify-center"
            >
              {isDeleting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Edit Transaction"
        size="lg"
      >
        {transaction.type === "expense" ? (
          <AddExpenseForm
            onCancel={onCloseEditModal}
            onSuccess={onCloseEditModal}
            initialCategory={transaction.category}
            isEditing={true}
            transaction={transaction}
          />
        ) : (
          <AddIncomeForm
            onCancel={onCloseEditModal}
            onSuccess={onCloseEditModal}
            initialCategory={transaction.category}
            isEditing={true}
            transaction={transaction}
          />
        )}
      </Modal>
    </>
  );
}
