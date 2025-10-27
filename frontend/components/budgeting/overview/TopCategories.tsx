import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

interface Category {
  key: string;
  label: string;
  icon: React.ReactNode;
  allocated: number;
}

interface Props {
  categories: Category[];
  totalBudget: number;
}

export default function TopCategories({ categories, totalBudget }: Props) {
  const { userProfile } = useAuthStore();
  const currency = userProfile?.currency || "";

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-light)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Top Categories
      </h3>
      <div className="space-y-3">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-lg flex-shrink-0">{cat.icon}</span>
                <span className="text-[var(--text-primary)] truncate">{cat.label}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[var(--text-primary)] font-medium">
                  {formatCurrency(cat.allocated, currency)}
                </div>
                <div className="text-[var(--text-secondary)] text-sm">
                  {((cat.allocated / totalBudget) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-[var(--text-secondary)] py-4">
            No categories allocated yet
          </div>
        )}
      </div>
    </div>
  );
}