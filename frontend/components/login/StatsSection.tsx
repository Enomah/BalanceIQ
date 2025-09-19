import { motion } from "framer-motion";

const StatsSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 1 }}
      className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10"
    >
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-[var(--primary-200)]">
            10K+
          </div>
          <div className="text-sm opacity-80">Active Users</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[var(--primary-200)]">
            $25M+
          </div>
          <div className="text-sm opacity-80">Managed</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[var(--primary-200)]">98%</div>
          <div className="text-sm opacity-80">Satisfaction</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsSection;