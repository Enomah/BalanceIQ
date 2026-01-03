"use client";

import { useToastStore, ToastType } from "@/store/toastStore";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const toastStyles: Record<ToastType, string> = {
  success:
    "bg-[var(--success-50)] border-[var(--success-200)] text-[var(--success-700)] dark:bg-[var(--success-900)] dark:border-[var(--success-800)] dark:text-[var(--success-400)]",
  error:
    "bg-[var(--error-50)] border-[var(--error-200)] text-[var(--error-700)] dark:bg-[var(--error-900)] dark:border-[var(--error-800)] dark:text-[var(--error-400)]",
  info: "bg-[var(--primary-50)] border-[var(--primary-200)] text-[var(--primary-700)] dark:bg-[var(--primary-900)] dark:border-[var(--primary-800)] dark:text-[var(--primary-400)]",
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[300px] max-w-md ${
              toastStyles[toast.type]
            }`}
          >
            <span className="shrink-0">{toastIcons[toast.type]}</span>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
