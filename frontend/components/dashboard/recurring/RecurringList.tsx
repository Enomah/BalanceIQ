"use client";

import React from "react";
import { Loader2, Calendar } from "lucide-react";
import { useRecurringListLogic } from "@/hooks/recurring/useRecurringListLogic";
import RecurringItem from "./RecurringItem";

export default function RecurringList() {
  const {
    recurringTransactions,
    isLoading,
    userProfile,
    menuOpen,
    toggleMenu,
    closeMenu,
    handleDelete,
    handleUpdateStatus,
  } = useRecurringListLogic();

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--primary-500)]" size={32} />
      </div>
    );
  }

  if (!recurringTransactions || recurringTransactions.length === 0) {
    return (
      <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-2xl border-2 border-dashed border-[var(--border-light)]">
        <div className="bg-[var(--bg-tertiary)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-[var(--text-tertiary)]" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          No recurring payments yet
        </h3>
        <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
          Set up regular bills like rent, Netflix, or your salary to automate
          budget tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recurringTransactions.map((item) => (
        <RecurringItem
          key={item._id}
          item={item}
          userProfile={userProfile}
          menuOpen={menuOpen === item._id}
          onToggleMenu={() => toggleMenu(item._id)}
          onCloseMenu={closeMenu}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
