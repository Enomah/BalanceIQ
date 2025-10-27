import { TrendingUp, Check, AlertTriangle } from "lucide-react";
import SummaryCard from "./SummaryCard";

interface Category {
  allocated: number;
  spent: number;
}

interface Props {
  categories: Category[];
}

export default function CategoriesSummaryGrid({ categories }: Props) {
  const onTrack = categories.filter(c => c.spent <= c.allocated).length;
  const overspent = categories.filter(c => c.spent > c.allocated).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        title="Total Categories"
        value={categories.length}
        icon={<TrendingUp className="w-5 h-5 text-[var(--primary-600)]" />}
        bgClass="bg-[var(--primary-100)]"
        textClass="text-[var(--text-primary)]"
      />
      <SummaryCard
        title="On Track"
        value={onTrack}
        icon={<Check className="w-5 h-5 text-[var(--success-600)]" />}
        bgClass="bg-[var(--success-100)]"
        textClass="text-[var(--success-600)]"
      />
      <SummaryCard
        title="Overspent"
        value={overspent}
        icon={<AlertTriangle className="w-5 h-5 text-[var(--error-600)]" />}
        bgClass="bg-[var(--error-100)]"
        textClass="text-[var(--error-600)]"
      />
    </div>
  );
}