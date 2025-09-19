import { motion } from "framer-motion";
import { TrendingUp, Target, PieChart, Sparkles } from "lucide-react";

const floatingAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function FeatureHighlights() {
  const features = [
    { icon: TrendingUp, text: "Track spending patterns" },
    { icon: Target, text: "Set savings goals" },
    { icon: PieChart, text: "Visual financial insights" },
    { icon: Sparkles, text: "Personalized recommendations" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={floatingAnimation}
          animate="animate"
          className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm"
        >
          <feature.icon className="h-6 w-6 text-[var(--primary-200)]" />
          <span className="font-medium">{feature.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}