"use client";

import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "../dashboard/WelcomeSection";
import { useAuthStore } from "@/store/authStore";
import { useRequireAuth } from "@/lib/useRequireAuth";
import {
  FileDown,
  Calendar,
  Mail,
  Send,
  FileText,
  Table,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api/client";
import { useToastStore } from "@/store/toastStore";

export default function ExportPage() {
  const { userProfile } = useAuthStore();
  const { showToast } = useToastStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState<"csv" | "pdf" | null>(null);

  useRequireAuth();

  const handleExport = async (format: "csv" | "pdf") => {
    // Validation
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      showToast("Start date cannot be after end date.", "error");
      return;
    }

    setIsExporting(format);
    try {
      const response = await apiClient.get(`/export/${format}`, {
        params: { startDate, endDate },
      });

      showToast(
        response.data.message || "Report has been sent to your email!",
        "success"
      );
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error(`Export failed:`, error);
      const errorMessage =
        error.response?.data?.message ||
        `Failed to send ${format.toUpperCase()} report. Please try again.`;
      showToast(errorMessage, "error");
    } finally {
      setIsExporting(null);
    }
  };

  const getExportScopeText = () => {
    if (!startDate && !endDate) return "All-Time History";
    if (startDate && !endDate)
      return `From ${new Date(startDate).toLocaleDateString()} to Present`;
    if (!startDate && endDate)
      return `Up to ${new Date(endDate).toLocaleDateString()}`;
    return `${new Date(startDate).toLocaleDateString()} — ${new Date(
      endDate
    ).toLocaleDateString()}`;
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath="/dashboard/export" userProfile={userProfile} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-3">
                <Mail className="text-[var(--primary-500)]" size={32} />
                Financial Reports
              </h1>
              <p className="text-[var(--text-secondary)]">
                Securely send your financial transaction history and aggregate
                summaries to your registered email address.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side: Configuration */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-[var(--primary-500)]" />
                    Specify Period
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary-500)] focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary-500)] focus:outline-none transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1.5">
                        <AlertCircle size={12} />
                        Leave blank to export all-time data.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={getExportScopeText()}
                  className="bg-[var(--primary-50)] p-6 rounded-2xl border border-[var(--primary-100)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FileDown size={64} className="text-[var(--primary-500)]" />
                  </div>
                  <h4 className="flex items-center gap-2 text-[var(--primary-700)] font-bold mb-2">
                    <CheckCircle2 size={18} />
                    Export Preview
                  </h4>
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[var(--primary-400)] block mb-1">
                      Target Period
                    </span>
                    <p className="text-lg font-bold text-[var(--primary-800)] leading-tight">
                      {getExportScopeText()}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--primary-600)] leading-relaxed">
                    This report will include your **total income**, **total
                    expenses**, and all transactions recorded during this
                    period.
                  </p>
                </motion.div>
              </div>

              {/* Right Side: Options */}
              <div className="space-y-6">
                {/* CSV Option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm hover:border-[var(--primary-400)] transition-all cursor-pointer group"
                  onClick={() => handleExport("csv")}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                      <Table size={24} />
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full uppercase">
                      Analysis Ready
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    Email CSV Report
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">
                    A raw spreadsheet format with a summary header. Best for
                    advanced data analysis.
                  </p>
                  <button
                    disabled={!!isExporting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-md group-hover:shadow-lg disabled:opacity-50"
                  >
                    {isExporting === "csv" ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                    Send to My Email
                  </button>
                </motion.div>

                {/* PDF Option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm hover:border-[var(--primary-400)] transition-all cursor-pointer group"
                  onClick={() => handleExport("pdf")}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                      <FileText size={24} />
                    </div>
                    <div className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full uppercase">
                      Professional Look
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    Email PDF Statement
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">
                    A beautifully formatted PDF featuring a Financial Snapshot
                    and aggregate totals.
                  </p>
                  <button
                    disabled={!!isExporting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md group-hover:shadow-lg disabled:opacity-50"
                  >
                    {isExporting === "pdf" ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                    Send to My Email
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Bottom Tip */}
            <div className="mt-12 text-center">
              <p className="text-sm text-[var(--text-tertiary)] flex items-center justify-center gap-2">
                Need help with your data?
                <a
                  href="/dashboard/help"
                  className="text-[var(--primary-500)] font-bold hover:underline flex items-center gap-1"
                >
                  Visit Help Center <ArrowRight size={14} />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
