import { motion } from "framer-motion";

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  delay?: number;
  style?: string;
}

export default function BudgetStatCard({
  title,
  value,
  subtitle,
  icon,
  bgClass,
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-light)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[var(--text-secondary)] text-sm">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 ${bgClass} rounded-lg`}>{icon}</div>
      </div>
    </motion.div>
  );
}
