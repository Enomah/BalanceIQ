"use client";

import React from "react";
import { Search } from "lucide-react";

interface HelpHeaderProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

export default function HelpHeader({ onSearch, searchTerm }: HelpHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
        How can we help you?
      </h1>
      <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto leading-relaxed">
        Search our knowledge base for articles and guides on how to make the
        most of BalanceIQ.
      </p>
      <div className="relative max-w-xl mx-auto group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--primary-500)] transition-colors"
          size={20}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search for articles, guides..."
          className="w-full pl-14 pr-6 py-4 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all"
        />
      </div>
    </div>
  );
}
