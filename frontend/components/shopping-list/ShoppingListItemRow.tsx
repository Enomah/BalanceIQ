"use client";

import { useState } from "react";
import { ShoppingListItem } from "@/types/dashboardTypes";
import { Trash2, Edit2, Save, X } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

interface ShoppingListItemRowProps {
  item: ShoppingListItem;
  onUpdate: (updates: Partial<ShoppingListItem>) => void;
  onRemove: () => void;
  onToggleChecked: () => void;
}

export default function ShoppingListItemRow({
  item,
  onUpdate,
  onRemove,
  onToggleChecked,
}: ShoppingListItemRowProps) {
  const { userProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ ...item });

  const handleSave = () => {
    onUpdate({
      name: editValues.name,
      quantity: editValues.quantity,
      unit: editValues.unit,
      price: editValues.price,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({ ...item });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 p-3 bg-[var(--bg-secondary)] border border-[var(--brand-primary)] rounded-lg">
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-12 gap-2">
          <input
            value={editValues.name}
            onChange={(e) =>
              setEditValues({ ...editValues, name: e.target.value })
            }
            className="col-span-2 sm:col-span-5 px-2 py-1 text-sm border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
            placeholder="Name"
          />
          <div className="col-span-1 sm:col-span-2 flex gap-1">
            <input
              type="number"
              value={editValues.quantity}
              onChange={(e) =>
                setEditValues({
                  ...editValues,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              className="w-1/2 px-2 py-1 text-sm border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
              placeholder="Qty"
            />
            <input
              value={editValues.unit || ""}
              onChange={(e) =>
                setEditValues({ ...editValues, unit: e.target.value })
              }
              className="w-1/2 px-2 py-1 text-sm border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
              placeholder="Unit"
            />
          </div>
          <input
            type="number"
            value={editValues.price}
            onChange={(e) =>
              setEditValues({
                ...editValues,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className="col-span-1 sm:col-span-3 px-2 py-1 text-sm border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
            placeholder="Total Price"
            step="0.01"
          />
        </div>
        <div className="flex justify-end gap-1">
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <Save size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg group hover:shadow-sm transition-all">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={onToggleChecked}
          className="w-5 h-5 rounded border-[var(--border-medium)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
        />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-2 items-center">
        <span
          className={`col-span-5 text-sm ${
            item.checked
              ? "line-through text-[var(--text-tertiary)]"
              : "text-[var(--text-primary)] font-medium"
          }`}
        >
          {item.name}
        </span>
        <span className="col-span-3 text-sm text-[var(--text-secondary)]">
          {item.quantity} {item.unit || "pcs"}
        </span>
        <span className="col-span-4 text-sm font-semibold text-[var(--text-primary)] text-right">
          {formatCurrency(item.price, userProfile?.currency || "USD")}
        </span>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
