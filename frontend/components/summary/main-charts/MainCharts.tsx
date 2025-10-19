import { motion } from "framer-motion";
import { SummaryData } from "@/types/summaryTypes";
import IncomeExpenseChart from "./IncomeExpenseChart";
import IncomeSourcesChart from "./IncomeSourcesChart";
import MonthlyTrendChart from "./MonthlyTrendChart";
import SavingsProgressChart from "./SavingsProgressChart";
import ExpenseCategoriesChart from "./ExpenseCategoriesCharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface MainChartsProps {
  summaryData: SummaryData;
}

export default function MainCharts({ summaryData }: MainChartsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <IncomeExpenseChart summaryData={summaryData} />
      <IncomeSourcesChart summaryData={summaryData} />
      <ExpenseCategoriesChart summaryData={summaryData} />
      <MonthlyTrendChart summaryData={summaryData} />
      <SavingsProgressChart summaryData={summaryData} />
    </motion.div>
  );
}