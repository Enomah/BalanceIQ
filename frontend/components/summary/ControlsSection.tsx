import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import MonthSelector from "./MonthSelector";
import RefreshButton from "./RefreshButton";
import { MonthYearOption } from "@/types/summaryTypes";

interface ControlsSectionProps {
  monthYearOptions: MonthYearOption[];
  selectedMonthYear: string;
  setSelectedMonthYear: (value: string) => void;
  loading: boolean;
  fetchData: () => void;
  userCreatedAt?: string;
}

export default function ControlsSection({
  monthYearOptions,
  selectedMonthYear,
  setSelectedMonthYear,
  loading,
  fetchData,
}: ControlsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[var(--bg-secondary)] rounded-2xl p-[10px]  sm:p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <motion.h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Financial Insights
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <MonthSelector
          monthYearOptions={monthYearOptions}
          selectedMonthYear={selectedMonthYear}
          setSelectedMonthYear={setSelectedMonthYear}
          loading={loading}
        />
        <RefreshButton loading={loading} fetchData={fetchData} />
      </div>
    </motion.div>
  );
}