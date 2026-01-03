import React from "react";
import { Calendar } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";
import AddIncomeModal from "./AddIncomeModal";
import AddGoalModal from "../goals/create/AddGoalModal";
import Link from "next/link";

const QuickActions: React.FC = () => {
  return (
    <div className="quick-actions bg-[var(--bg-secondary)] p-[10px] sm:p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-[10px] sm:mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-[10px]">
        <AddExpenseModal />
        <AddIncomeModal />
        <AddGoalModal />

        <Link
          href="/dashboard/export"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 hover:bg-[var(--primary-900)] text-white bg-[var(--primary-600)]`}
        >
          <Calendar size={18} />
          Generate Report
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
