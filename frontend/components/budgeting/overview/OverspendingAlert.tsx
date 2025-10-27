import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

interface Category {
  key: string;
  label: string;
  icon: React.ReactNode;
  allocated: number;
  spent: number;
}

interface Props {
  categories: Category[];
}

export default function OverspendingAlert({ categories }: Props) {
  const { userProfile } = useAuthStore();
  const currency = userProfile?.currency || "";

  if (categories.length === 0) return null;

  return (
    <div className="bg-[var(--error-50)] border border-[var(--error-200)] p-4 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[var(--error-600)] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-[var(--error-700)]">
            Overspending Alert
          </h4>
          <p className="text-[var(--error-600)] text-sm mt-1">
            {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} exceeded budget
          </p>
          <ul className="text-[var(--error-600)] text-sm mt-2 space-y-1">
            {categories.map(cat => (
              <li key={cat.key} className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span className="flex-1">{cat.label}:</span>
                <span>
                  {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.allocated, currency)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}