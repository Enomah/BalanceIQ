export default function TransactionsLoading() {
  return (
    <div className="mt-[10px] space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)] animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded"></div>
                <div className="h-3 w-24 bg-[var(--bg-tertiary)] rounded"></div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 w-20 bg-[var(--bg-tertiary)] rounded"></div>
              <div className="h-3 w-16 bg-[var(--bg-tertiary)] rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
