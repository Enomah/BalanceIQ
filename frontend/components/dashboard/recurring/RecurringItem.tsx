import {
  Calendar,
  CheckCircle,
  PauseCircle,
  XCircle,
  TrendingDown,
  TrendingUp,
  MoreVertical,
  Trash2,
  PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/format";
import { RecurringTransaction } from "@/hooks/recurring/useRecurring";
import { User } from "@/types/userTypes";

interface RecurringItemProps {
  item: RecurringTransaction;
  userProfile: User | null;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800";
    case "paused":
      return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-800";
    default:
      return "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-100 dark:border-neutral-700";
  }
};

export default function RecurringItem({
  item,
  userProfile,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onUpdateStatus,
  onDelete,
}: RecurringItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl p-4 sm:p-6 transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl border ${
            item.type === "income"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900 text-emerald-600"
              : "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900 text-rose-600"
          }`}
        >
          {item.type === "income" ? (
            <TrendingUp size={24} />
          ) : (
            <TrendingDown size={24} />
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-[var(--text-primary)] text-lg">
              {item.description || "Untitled"}
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                item.status
              )}`}
            >
              {item.status === "active" && <CheckCircle size={10} />}
              {item.status === "paused" && <PauseCircle size={10} />}
              {item.status === "cancelled" && <XCircle size={10} />}
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] text-[var(--text-secondary)] capitalize font-medium">
              {item.frequency}
            </span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-1">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> Next due:{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {new Date(item.nextDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 pl-4 border-l border-[var(--border-light)] sm:border-0 sm:pl-0">
        <div className="text-right">
          <span
            className={`block text-lg font-bold ${
              item.type === "income"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {item.type === "income" ? "+" : "-"}{" "}
            {formatCurrency(item.amount, userProfile?.currency || "USD")}
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            per {item.frequency.replace("ly", "")}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={onToggleMenu}
            className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-[var(--text-tertiary)] transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={onCloseMenu} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] shadow-xl z-20 py-1 overflow-hidden">
                {item.status === "active" ? (
                  <button
                    onClick={() => onUpdateStatus(item._id, "paused")}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-amber-600 transition-colors"
                  >
                    <PauseCircle size={16} /> Pause Auto-Payment
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateStatus(item._id, "active")}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-emerald-600 transition-colors"
                  >
                    <PlayCircle size={16} /> Resume Auto-Payment
                  </button>
                )}

                <div className="h-px bg-[var(--border-light)] my-1" />

                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to stop this recurring payment?"
                      )
                    ) {
                      onDelete(item._id);
                    }
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 size={16} /> Delete Subscription
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
