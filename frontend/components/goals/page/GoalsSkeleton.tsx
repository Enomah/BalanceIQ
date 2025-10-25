import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/sidebar/Sidebar";

export default function GoalsSkeleton() {
  const { userProfile } = useAuthStore();

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-[10px] sm:p-6 animate-pulse"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-6 bg-[var(--bg-tertiary)] rounded w-3/4" />
                <div className="h-6 bg-[var(--bg-tertiary)] rounded w-16" />
              </div>
              <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
              <div className="h-3 bg-[var(--bg-tertiary)] rounded w-2/3" />
              <div className="h-2 bg-[var(--bg-tertiary)] rounded w-full" />
              <div className="flex justify-between">
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-20" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
