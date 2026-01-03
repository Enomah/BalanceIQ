import Modal from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";

interface WithdrawalWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function WithdrawalWarningModal({
  isOpen,
  onClose,
  onContinue,
}: WithdrawalWarningModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdrawal Warning">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-lg max-w-sm mx-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertTriangle className="text-[var(--warning-600)]" size={24} />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Withdrawal Impact
          </h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Withdrawing funds from an active goal will:
        </p>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 mb-4">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--warning-500)] rounded-full"></div>
            <span>Reduce your discipline score</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--warning-500)] rounded-full"></div>
            <span>Delay your goal achievement</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--success-500)] rounded-full"></div>
            <span>Return funds to your available balance</span>
          </li>
        </ul>
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-[var(--border-light)] rounded text-sm hover:bg-[var(--bg-tertiary)]"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-2 bg-[var(--warning-500)] text-white rounded text-sm hover:bg-[var(--warning-600)]"
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
