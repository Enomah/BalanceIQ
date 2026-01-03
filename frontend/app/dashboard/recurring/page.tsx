"use client";

import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import { useAuthStore } from "@/store/authStore";
import { useRequireAuth } from "@/lib/useRequireAuth";
import RecurringList from "@/components/dashboard/recurring/RecurringList";
import { RefreshCcw } from "lucide-react";

export default function RecurringPage() {
  const { userProfile } = useAuthStore();
  useRequireAuth();

  return (
    <div className="flex match-height bg-[var(--bg-primary)]">
      <Sidebar currentPath="/dashboard/recurring" userProfile={userProfile} />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          <div className="max-w-6xl mx-auto px-[10px] sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <RefreshCcw className="text-[var(--primary-500)]" />
                  Subscriptions & Recurring
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                  Manage your automated expenses and regular income.
                </p>
              </div>
            </div>

            <RecurringList />
          </div>
        </div>
      </div>
    </div>
  );
}
