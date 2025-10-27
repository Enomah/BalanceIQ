import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

interface Payload {
  name: string;
  value: number;
  spent: number;
  remaining: number;
  percentage: string;
}

interface Props {
  active?: boolean;
  payload?: { payload: Payload }[];
}

export default function CustomTooltip({ active, payload }: Props) {
  const { userProfile } = useAuthStore();
  const currency = userProfile?.currency || "";

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-[var(--text-primary)]">{data.name}</p>
        <p className="text-sm text-[var(--text-secondary)]">
          Allocated: {formatCurrency(data.value, currency)}
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Spent: {formatCurrency(data.spent, currency)}
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Remaining: {formatCurrency(data.remaining, currency)}
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          {data.percentage}% of total
        </p>
      </div>
    );
  }
  return null;
}