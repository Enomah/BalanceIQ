import { motion } from "framer-motion";

const StatCardSkeleton = () => (
  <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-light)] animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 w-20 bg-[var(--bg-tertiary)] rounded"></div>
      <div className="h-10 w-10 bg-[var(--bg-tertiary)] rounded-xl"></div>
    </div>
    <div className="h-8 w-24 bg-[var(--bg-tertiary)] rounded mb-2"></div>
    <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded"></div>
  </div>
);

const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-light)] animate-pulse">
    <div className="h-6 w-40 bg-[var(--bg-tertiary)] rounded mb-6"></div>
    <div className={`h-[300px] bg-[var(--bg-tertiary)] rounded-xl`}></div>
  </div>
);

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartSkeleton height={800} />
        <ChartSkeleton height={800} />
      </div>
    </motion.div>
  );
}