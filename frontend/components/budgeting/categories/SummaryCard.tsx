import { motion } from "framer-motion";

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
}

export default function SummaryCard({ title, value, icon, bgClass, textClass }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-light)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[var(--text-secondary)] text-sm">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${textClass}`}>{value}</p>
        </div>
        <div className={`p-2 ${bgClass} rounded-lg`}>{icon}</div>
      </div>
    </motion.div>
  );
}