import { motion } from "framer-motion";
import { SummaryData } from "@/types/summaryTypes";
import SavingsProgress from "./SavingsProgress";
import MonthlyComparison from "./MonthlyComparison";
import TopSpendingCategory from "./TopSpendingCategory";
import FinancialHealth from "./FinancialHealth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface SecondaryChartsProps {
  summaryData: SummaryData;
}

export default function SecondaryCharts({ summaryData }: SecondaryChartsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <SavingsProgress summaryData={summaryData} />
      <MonthlyComparison summaryData={summaryData} />
      <TopSpendingCategory summaryData={summaryData} />
      <FinancialHealth summaryData={summaryData} />
    </motion.div>
  );
}