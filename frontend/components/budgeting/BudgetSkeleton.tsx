"use client";

import React from "react";

export default function BudgetSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
          <div className="h-8 w-48 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
        </div>
        <div className="h-10 w-40 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded-lg"></div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm"
          >
            <div className="h-4 w-24 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded mb-4"></div>
            <div className="h-8 w-32 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
        <div className="flex justify-between mb-8">
          <div className="h-6 w-40 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
          <div className="h-6 w-32 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
                <div className="h-4 w-16 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
              </div>
              <div className="h-2 w-full bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
