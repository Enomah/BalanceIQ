import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Logo from "../ui/Logo";

const BrandingSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex items-center space-x-3"
      >
        {/* <Logo/> */}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-4xl font-bold leading-tight"
      >
        Welcome Back to Your{" "}
        <span className="text-[var(--primary-200)]">Financial Hub</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="text-xl opacity-90"
      >
        Continue your journey to financial freedom and smart money management
      </motion.p>
    </div>
  );
};

export default BrandingSection;