import { Edit2 } from "lucide-react";

interface Props {
  icon: React.ReactNode;
  label: string;
  percentageOfTotal: string;
  onEdit: () => void;
  color: string;
}

export default function CategoryHeader({ icon, label, percentageOfTotal, color }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-[${color}]`}
          style={{ backgroundColor: `${color}` }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm">{label}</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-0.5">{percentageOfTotal}% of total</p>
        </div>
      </div>
    </div>
  );
}