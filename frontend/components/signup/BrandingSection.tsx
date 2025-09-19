import { motion } from "framer-motion";
import Logo from "../ui/Logo";

export default function BrandingSection() {
  return (
    <div className="space-y-[10px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex items-center space-x-3"
      >
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-5xl font-bold leading-tight"
      >
        Take Control of Your <span className="text-[var(--primary-200)]">Financial Future</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="text-xl opacity-90"
      >
        Join thousands who are taking control of their finances with our intuitive platform
      </motion.p>
    </div>
  );
}