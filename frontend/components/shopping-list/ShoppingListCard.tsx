"use client";

import { useState } from "react";
import { ShoppingList } from "@/types/dashboardTypes";
import { useShoppingListMutations } from "@/hooks/shopping-list/useShoppingListMutations";
import { useShoppingListExport } from "@/hooks/shopping-list/useShoppingListExport";
import {
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface ShoppingListCardProps {
  list: ShoppingList;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ShoppingListCard({
  list,
  onEdit,
  onDelete,
}: ShoppingListCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { userProfile } = useAuthStore();
  const { exportList, isExporting, isDeleting } = useShoppingListMutations();
  const { captureScreenshot } = useShoppingListExport();

  const checkedItems = list.items.filter((item) => item.checked).length;
  const progress =
    list.items.length > 0 ? (checkedItems / list.items.length) * 100 : 0;

  const handleScreenshot = async () => {
    await captureScreenshot(`shopping-list-${list._id}`, list.name);
    setShowExportMenu(false);
    setMenuOpen(false);
  };

  const handlePDFExport = () => {
    exportList(list._id);
    setShowExportMenu(false);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        id={`shopping-list-${list._id}`}
        className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl overflow-hidden hover:shadow-md transition-all group"
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1 truncate">
                {list.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Created: {new Date(list.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-[var(--text-tertiary)] transition-colors"
              >
                <MoreVertical size={20} />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] shadow-xl z-20 py-1 overflow-hidden">
                    <button
                      onClick={() => {
                        onEdit();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <Edit size={16} />
                      Edit List
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowExportMenu(!showExportMenu);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <Download size={16} />
                      Export
                    </button>

                    {showExportMenu && (
                      <div className="bg-[var(--bg-tertiary)]/50 py-1">
                        <button
                          onClick={handleScreenshot}
                          className="flex items-center gap-2 w-full px-8 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                          <Camera size={14} />
                          Screenshot (PNG)
                        </button>
                        <button
                          onClick={handlePDFExport}
                          disabled={isExporting}
                          className="flex items-center gap-2 w-full px-8 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
                        >
                          <Download size={14} />
                          Email PDF
                        </button>
                      </div>
                    )}

                    <div className="h-px bg-[var(--border-light)] my-1" />

                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-[var(--text-primary)] block">
                  {formatCurrency(
                    list.totalPrice,
                    userProfile?.currency || "USD"
                  )}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  Total Estimated Cost
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  {checkedItems}/{list.items.length} Items
                </div>
                <div className="w-24 bg-[var(--bg-tertiary)] rounded-full h-1.5 ml-auto">
                  <div
                    className="bg-[var(--brand-primary)] h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Items Section */}
        {isExpanded && (
          <div className="bg-[var(--bg-tertiary)]/30 border-t border-[var(--border-light)] p-4 space-y-2">
            {list.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      item.checked
                        ? "bg-[var(--success-500)] border-[var(--success-500)]"
                        : "border-[var(--border-medium)]"
                    }`}
                  >
                    {item.checked && <Check size={10} className="text-white" />}
                  </div>
                  <span
                    className={`truncate ${
                      item.checked
                        ? "line-through text-[var(--text-tertiary)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                <span className="font-medium text-[var(--text-primary)] whitespace-nowrap ml-2">
                  {formatCurrency(item.price, userProfile?.currency || "USD")}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors border-t border-[var(--border-light)]"
        >
          {isExpanded ? (
            <>
              Simple View <ChevronUp size={14} />
            </>
          ) : (
            <>
              View Items ({list.items.length}) <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Shopping List"
        message={`Are you sure you want to delete "${list.name}"? This action cannot be undone.`}
        confirmText="Delete List"
        isProcessing={isDeleting}
      />
    </>
  );
}
