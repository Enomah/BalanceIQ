import { formatCurrency } from "@/lib/format";

interface Props {
  allocated: number;
  spent: number;
  remaining: number;
  isOverspent: boolean;
  currency: string;
}

export default function CategoryAmounts({ allocated, spent, remaining, isOverspent, currency }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div>
        <p className="text-[var(--text-secondary)]">Allocated</p>
        <p className="font-semibold text-[var(--text-primary)] mt-0.5">
          {formatCurrency(allocated, currency)}
        </p>
      </div>
      <div>
        <p className="text-[var(--text-secondary)]">Spent</p>
        <p className={`font-semibold mt-0.5 ${isOverspent ? 'text-[var(--error-600)]' : 'text-[var(--text-primary)]'}`}>
          {formatCurrency(spent, currency)}
        </p>
      </div>
      <div className="col-span-2">
        <p className="text-[var(--text-secondary)]">{isOverspent ? 'Overspent by' : 'Remaining'}</p>
        <p className={`font-semibold mt-0.5 ${isOverspent ? 'text-[var(--error-600)]' : 'text-[var(--success-600)]'}`}>
          {formatCurrency(Math.abs(remaining), currency)}
          {isOverspent && ' over budget'}
        </p>
      </div>
    </div>
  );
}