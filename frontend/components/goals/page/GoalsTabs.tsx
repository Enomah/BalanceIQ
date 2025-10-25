"use client";

import { motion } from "framer-motion";

interface GoalsTabsProps {
  activeTab: "active" | "completed";
  onTabChange: (tab: "active" | "completed") => void;
}

export default function GoalsTabs({ activeTab, onTabChange }: GoalsTabsProps) {
  return (
    <div className="sticky top-[65px] md:top-[70px] z-50 bg-[var(--bg-primary)] py-[10px] border-b border-[var(--border-light)] mb-6">
      <div className="mx-auto">
        <div className="flex space-x-1 bg-[var(--bg-secondary)] p-1 rounded-lg w-fit border border-[var(--border-light)]">
          <button
            onClick={() => onTabChange("active")}
            className={`relative px-6 py-3 rounded-md text-sm font-medium  hover:opacity-50  transition-colors ${
              activeTab === "active"
                ? "bg-[var(--bg-primary)]"
                : ""
            }`}
          >
            Active Goals
          </button>
          <button
            onClick={() => onTabChange("completed")}
            className={`relative px-6 py-3 rounded-md text-sm hover:opacity-50 font-medium transition-colors ${
              activeTab === "completed"
                ? "bg-[var(--bg-primary)]"
                : ""
            }`}
          >
            Completed Goals
          </button>
        </div>
      </div>
    </div>
  );
}
