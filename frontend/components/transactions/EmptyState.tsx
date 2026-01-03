"use client";

import { SearchX, Inbox } from "lucide-react";

interface EmptyStateProps {
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export default function EmptyState({
  isFiltered,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-6 text-[var(--text-tertiary)]">
        {isFiltered ? <SearchX size={40} /> : <Inbox size={40} />}
      </div>
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {isFiltered ? "No matching transactions" : "No transactions found"}
      </h3>
      <p className="text-[var(--text-secondary)] max-w-sm mb-8">
        {isFiltered
          ? "We couldn't find any transactions matching your current filters. Try adjusting your search or filters."
          : "Your transaction history will appear here once you start recording your income and expenses."}
      </p>
      {isFiltered && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] transition-colors font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
