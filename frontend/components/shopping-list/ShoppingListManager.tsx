"use client";

import { useState } from "react";
import { useShoppingLists } from "@/hooks/shopping-list/useShoppingLists";
import { useShoppingListMutations } from "@/hooks/shopping-list/useShoppingListMutations";
import ShoppingListCard from "./ShoppingListCard";
import ShoppingListForm from "./ShoppingListForm";
import { Plus, Loader2, ShoppingCart } from "lucide-react";
import { ShoppingList } from "@/types/dashboardTypes";

export default function ShoppingListManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "completed" | "archived"
  >("active");

  const { data, isLoading } = useShoppingLists({ status: statusFilter });
  const { deleteList } = useShoppingListMutations();

  const handleEdit = (list: ShoppingList) => {
    setEditingList(list);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingList(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader2
          className="animate-spin text-[var(--brand-primary)]"
          size={32}
        />
      </div>
    );
  }

  const lists = data?.lists || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-light)] shadow-sm">
        <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-lg w-full sm:w-auto">
          {(["active", "completed", "archived"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors font-medium shadow-sm hover:shadow"
        >
          <Plus size={18} />
          New List
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-2xl border-2 border-dashed border-[var(--border-light)]">
          <div className="bg-[var(--bg-tertiary)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="text-[var(--text-tertiary)]" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No shopping lists yet
          </h3>
          <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
            Create your first shopping list to start organizing your purchases
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ShoppingListCard
              key={list._id}
              list={list}
              onEdit={() => handleEdit(list)}
              onDelete={() => deleteList(list._id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ShoppingListForm
          isOpen={showForm}
          onClose={handleCloseForm}
          editingList={editingList}
        />
      )}
    </div>
  );
}
