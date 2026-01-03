"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-xl max-w-md w-full border border-[var(--border-light)] text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Something went wrong!
          </h2>
          <p className="text-[var(--text-secondary)]">
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-left overflow-auto max-h-32">
              <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors font-medium"
        >
          <RotateCcw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
}
