import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  loading: boolean;
  fetchData: () => void;
}

export default function RefreshButton({ loading, fetchData }: RefreshButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: 180 }}
      whileTap={{ scale: 0.95 }}
      onClick={fetchData}
      disabled={loading}
      className="p-3 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white rounded-xl hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center"
      title="Refresh data"
    >
      <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
    </motion.button>
  );
}