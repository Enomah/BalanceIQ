"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function EmptyState() {
  const { userProfile } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <div className="flex-1 min-h-screen bg-[var(--bg-primary)] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 text-[var(--text-tertiary)]">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No transactions found
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Your transaction history will appear here once you start using your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}