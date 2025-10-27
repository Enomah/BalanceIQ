import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditInput({ value, onChange, onSave, onCancel }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="pt-3 border-t border-[var(--border-light)]"
    >
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-[var(--border-medium)] rounded text-[var(--text-primary)] bg-[var(--bg-primary)] text-sm"
          placeholder="Enter spent amount"
          min="0"
          step="0.01"
          autoFocus
        />
        <button
          onClick={onSave}
          className="p-2 text-[var(--success-600)] hover:bg-[var(--success-100)] rounded-lg transition-colors"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={onCancel}
          className="p-2 text-[var(--error-600)] hover:bg-[var(--error-100)] rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}