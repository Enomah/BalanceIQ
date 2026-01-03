"use client";

import { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useShoppingListForm } from "@/hooks/shopping-list/useShoppingListForm";
import { useShoppingListMutations } from "@/hooks/shopping-list/useShoppingListMutations";
import ShoppingListItemRow from "./ShoppingListItemRow";
import { ShoppingList, ShoppingListItem } from "@/types/dashboardTypes";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

interface ShoppingListFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingList?: ShoppingList | null;
}

export default function ShoppingListForm({
  isOpen,
  onClose,
  editingList,
}: ShoppingListFormProps) {
  const { userProfile } = useAuthStore();
  const {
    name,
    setName,
    items,
    newItem,
    setNewItem,
    totalPrice,
    addItem,
    removeItem,
    updateItem,
    toggleItemChecked,
    removeCheckedItems,
    resetForm,
  } = useShoppingListForm({
    initialName: editingList?.name,
    initialItems: editingList?.items,
  });

  const { createList, updateList, isCreating, isUpdating } =
    useShoppingListMutations();

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    let finalName = name.trim();
    if (!finalName) {
      const dateStr = new Date().toLocaleDateString();
      const itemNames = items
        .slice(0, 3)
        .map((i) => i.name)
        .join(", ");
      finalName = itemNames
        ? `${itemNames}${items.length > 3 ? "..." : ""} (${dateStr})`
        : `Shopping List - ${dateStr}`;
    }

    const listData = {
      name: finalName,
      items: items.map(({ ...item }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...rest } = item;
        return rest;
      }),
    };

    if (editingList) {
      updateList({
        id: editingList._id,
        ...listData,
      });
    } else {
      createList(listData);
    }

    onClose();
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    addItem();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingList ? "Edit Shopping List" : "Create Shopping List"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            List Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            placeholder="e.g., Weekly Groceries (Optional)"
          />
        </div>

        <div className="bg-[var(--bg-tertiary)] p-4 rounded-xl mb-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <Plus size={16} />
            Add New Item
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                placeholder="e.g., Milk"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Quantity
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-20 px-3 py-2 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="1"
                  min="1"
                />
                <input
                  type="text"
                  value={newItem.unit || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unit: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="Unit (e.g. kg)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Total Price
              </label>
              <input
                type="number"
                value={newItem.price || ""}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                placeholder="Total Amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Category
              </label>
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    category: e.target.value as ShoppingListItem["category"],
                  })
                }
                className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="groceries">Groceries</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="household">Household</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            disabled={!newItem.name}
            className="w-full py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        {items.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[var(--text-primary)]">
                Items ({items.length})
              </h4>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={removeCheckedItems}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                  style={{
                    display: items.some((i) => i.checked) ? "block" : "none",
                  }}
                >
                  <span className="flex items-center gap-1">
                    <Trash2 size={12} />
                    Delete Selected ({items.filter((i) => i.checked).length})
                  </span>
                </button>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Total:{" "}
                  {formatCurrency(totalPrice, userProfile?.currency || "USD")}
                </span>
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {items.map((item) => (
                <ShoppingListItemRow
                  key={item._id}
                  item={item}
                  onUpdate={(updates) => updateItem(item._id!, updates)}
                  onRemove={() => removeItem(item._id!)}
                  onToggleChecked={() => toggleItemChecked(item._id!)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-[var(--border-light)]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-[var(--border-medium)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={items.length === 0 || isCreating || isUpdating}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {(isCreating || isUpdating) && (
              <Loader2 className="animate-spin" size={16} />
            )}
            {editingList ? "Update List" : "Create List"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
