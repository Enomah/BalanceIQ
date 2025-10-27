import { AlertTriangle, Check } from "lucide-react";

interface Props {
  status: "ontrack" | "almostthere" | "overspent";
}

export default function StatusBadge({ status }: Props) {
  const config = {
    overspent: { bg: "bg-[var(--error-50)]", border: "border-[var(--error-200)]", text: "text-[var(--error-700)]", icon: <AlertTriangle className="w-3 h-3" /> },
    almostthere: { bg: "bg-[var(--warning-50)]", border: "border-[var(--warning-200)]", text: "text-[var(--warning-700)]", icon: <AlertTriangle className="w-3 h-3" /> },
    ontrack: { bg: "bg-[var(--success-50)]", border: "border-[var(--success-200)]", text: "text-[var(--success-700)]", icon: <Check className="w-3 h-3" /> },
  };

  const { bg, border, text, icon } = config[status];

  return (
    <div className={`px-4 py-2 border-t text-xs font-medium ${bg} ${border} ${text}`}>
      <div className="flex items-center gap-1">
        {icon}
        {status === "overspent" ? "Over Budget" : status === "almostthere" ? "Almost There" : "On Track"}
      </div>
    </div>
  );
}