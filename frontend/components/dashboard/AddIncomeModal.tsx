import React, { useState } from "react";
import Modal from "../ui/Modal";
import AddIncomeForm from "./AddIncomeForm";
import { Plus } from "lucide-react";

export default function AddIncomeModal({}) {
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsAddIncomeModalOpen(false);
  };
  return (
    <div>
      <button
        onClick={() => setIsAddIncomeModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 hover:bg-[var(--primary-900)] text-white bg-[var(--primary-600)]`}
      >
        <Plus size={18} />
        Add Income
      </button>
      <Modal
        isOpen={isAddIncomeModalOpen}
        onClose={() => setIsAddIncomeModalOpen(false)}
        title="Add New Income"
        size="lg"
      >
        <AddIncomeForm
          onCancel={() => setIsAddIncomeModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
}
