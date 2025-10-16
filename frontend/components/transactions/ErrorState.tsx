"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { userProfile } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <div className="flex-1 min-h-screen bg-[var(--bg-primary)] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 text-[var(--error-400)]">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Unable to Load Transactions
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={onRetry}
              className="bg-[var(--primary-500)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}