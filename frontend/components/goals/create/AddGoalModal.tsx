import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import AddGoalForm from "./AddGoalForm";

export default function AddGoalModal({}) {
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsAddGoalModalOpen(false);
  };
  return (
    <div>
      <button
        onClick={() => setIsAddGoalModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 hover:bg-[var(--primary-900)] text-white bg-[var(--primary-600)]`}
      >
       <Plus size={18} /> Create Goal 
      </button>
      <Modal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        title="Add Goal"
        size="lg"
      >
       <AddGoalForm onCancel={() => setIsAddGoalModalOpen(false)} onSuccess={handleSuccess}/>
      </Modal>
    </div>
  );
}
