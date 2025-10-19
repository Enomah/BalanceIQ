import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { MonthYearOption } from "@/types/summaryTypes";

interface MonthSelectorProps {
  monthYearOptions: MonthYearOption[];
  selectedMonthYear: string;
  setSelectedMonthYear: (value: string) => void;
  loading: boolean;
}

export default function MonthSelector({
  monthYearOptions,
  selectedMonthYear,
  setSelectedMonthYear,
  loading,
}: MonthSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // console.log("month. year. options:", monthYearOptions)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = monthYearOptions.find(
    (opt) => opt.value === selectedMonthYear
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={loading || monthYearOptions.length === 0}
        className="flex items-center gap-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-[var(--text-primary)] font-medium hover:border-[var(--primary-500)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-48 justify-between group"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--primary-500)] transition-colors" />
          <span className="text-sm">
            {selectedOption?.label || "Select period"}
          </span>
        </div>
        {isDropdownOpen ? (
          <ChevronUp className="w-4 h-4 text-[var(--text-secondary)] transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] transition-transform" />
        )}
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[var(--card-bg)] border border-[var(--border-light)] rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-3">
              <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2 px-2">
                Available summaries
              </div>

              <div className="space-y-1">
                {monthYearOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedMonthYear(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      selectedMonthYear === option.value
                        ? "bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-600)]"
                    }`}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                    <div className="flex items-center gap-2">
                      {option.isCurrent === true && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                      {selectedMonthYear === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 bg-white/20 rounded flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {monthYearOptions.length === 0 && (
                <div className="text-center py-4 text-[var(--text-secondary)] text-sm">
                  No periods available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}