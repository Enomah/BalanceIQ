"use client";

import { Search, X } from "lucide-react";
import { expenseCategories, incomeCategories } from "@/constants/transaction";
import { useState, useEffect, useMemo } from "react";

interface TransactionsFiltersProps {
  onFilterChange: (filters: {
    search: string;
    type: string;
    category: string;
  }) => void;
}

export default function TransactionsFilters({
  onFilterChange,
}: TransactionsFiltersProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(() => {
    if (type === "expense") return expenseCategories;
    if (type === "income") return incomeCategories;
    return [...expenseCategories, ...incomeCategories];
  }, [type]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ search, type, category });
    }, 400);

    return () => clearTimeout(handler);
  }, [search, type, category, onFilterChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          className="block w-full pl-10 pr-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-sm placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <select
          aria-label="Filter by type"
          className="flex-1 md:flex-none pl-3 pr-8 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] appearance-none cursor-pointer"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setCategory(""); // Reset category when type changes
          }}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          aria-label="Filter by category"
          className="flex-1 md:flex-none pl-3 pr-8 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] appearance-none cursor-pointer"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
