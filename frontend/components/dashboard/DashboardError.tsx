interface DashboardErrorProps {
  error: { message?: string };
  onRetry: () => void;
}

export default function DashboardError({
  error,
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className="flex-1 flex items-center justify-center mt-[200px]">
      <div className="text-center p-6 bg-[var(--bg-secondary)] rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Error Loading Dashboard
        </h2>
        <p className="text-[var(--text-secondary)] mb-4">
          {error?.message || "Failed to load dashboard"}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
