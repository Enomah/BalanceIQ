import { motion } from "framer-motion";
import { TrendingUp, Target, PieChart } from "lucide-react";

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

const FeatureHighlights: React.FC = () => {
  const features = [
    { icon: TrendingUp, text: "Track your financial progress" },
    { icon: Target, text: "Achieve your savings goals" },
    { icon: PieChart, text: "Gain valuable insights" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.8 }}
      className="grid grid-cols-1 gap-4 mt-8"
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
};

export default FeatureHighlights;