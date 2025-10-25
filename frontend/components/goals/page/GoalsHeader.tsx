import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import AddGoalModal from "../create/AddGoalModal";

export default function GoalsHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Goals</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Track and manage your financial goals
        </p>
      </div>

      <AddGoalModal/>
    </div>
  );
}