import { AlertTriangle, Loader2, Check, X } from "lucide-react";

interface WithdrawalInputProps {
  showWithdrawInput: boolean;
  isCompleted: boolean;
  withdrawAmount: string;
  setWithdrawAmount: (val: string) => void;
  maxAmount: number;
  currency?: string;
  isLoading: boolean;
  onWithdraw: () => void;
  onClose: () => void;
}

export default function WithdrawalInput({
  showWithdrawInput,
  isCompleted,
  withdrawAmount,
  setWithdrawAmount,
  maxAmount,
  currency,
  isLoading,
  onWithdraw,
  onClose,
}: WithdrawalInputProps) {
  if (!showWithdrawInput) return null;

  return (
    <div className="mb-3 p-3 bg-[var(--bg-tertiary)] rounded-lg">
      {!isCompleted && (
        <div className="flex items-center space-x-2 text-[var(--warning-600)] text-sm mb-2 p-2 bg-[var(--warning-50)] rounded">
          <AlertTriangle size={14} />
          <span>This will affect your discipline score</span>
        </div>
      )}
      <p className="text-[12px] mb-[5px] italic text-[var(--text-secondary)]">
        {isCompleted
          ? "Withdraw your completed goal funds back to your account"
          : "Withdraw funds back to your account balance"}
      </p>
      <div className="flex space-x-2 mb-2">
        <input
          type="number"
          placeholder={`Amount to withdraw (max: ${currency}${maxAmount.toLocaleString()})`}
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="flex-1 p-2 border border-[var(--border-light)] rounded text-sm"
          min="1"
          max={maxAmount}
          disabled={isLoading}
        />
        <button
          onClick={onWithdraw}
          className="px-3 bg-[var(--warning-500)] text-white rounded text-sm hover:bg-[var(--warning-600)] disabled:opacity-50 flex items-center space-x-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Check size={14} />
          )}
        </button>
        <button
          onClick={onClose}
          className="px-3 bg-[var(--neutral-200)] text-[var(--neutral-700)] rounded text-sm hover:bg-[var(--neutral-300)]"
          disabled={isLoading}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
