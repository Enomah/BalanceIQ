import React, { useState } from "react";
import Modal from "../ui/Modal";
import AddExpenseForm from "./AddExpenseForm";
import { Plus } from "lucide-react";

export default function AddExpenseModal({}) {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsAddExpenseModalOpen(false);
  };
  return (
    <div>
      <button
        onClick={() => setIsAddExpenseModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 hover:bg-[var(--primary-900)] text-white bg-[var(--primary-600)]`}
      >
        <Plus size={18} />
        Add Expense
      </button>
      <Modal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        title="Add New Expense"
        size="lg"
      >
        <AddExpenseForm
          onCancel={() => setIsAddExpenseModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
}
