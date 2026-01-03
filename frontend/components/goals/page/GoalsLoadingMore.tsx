import { Loader2 } from "lucide-react";

export default function GoalsLoadingMore() {
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    </div>
  );
}
