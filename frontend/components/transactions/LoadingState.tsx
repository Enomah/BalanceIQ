"use client";
export default function LoadingState() {

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <div className="flex-1 min-h-screen bg-[var(--bg-primary)] py-8">
        <div className="max-w-2xl mx-auto px-[10px] sm:px-[10px] lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-[var(--bg-tertiary)] rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-[var(--bg-tertiary)] rounded animate-pulse"></div>
          </div>
          {[1, 2, 3].map((group) => (
            <div key={group} className="mb-8">
              <div className="h-6 w-32 bg-[var(--bg-tertiary)] rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}