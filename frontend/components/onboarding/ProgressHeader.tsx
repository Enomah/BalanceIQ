import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Logo from "../ui/Logo";
import { useAuthStore } from "@/store/authStore";

interface ProgressHeaderProps {
  progress: number;
}
export default function ProgressHeader({ progress }: ProgressHeaderProps) {
  const { userProfile } = useAuthStore();
  return (
    <div className="md:px-8 md:pt-8 md:pb-6 md:border-b border-[var(--border-light)]">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >

        </motion.div>

        <div className="text-[var(--primary-100)] text-[20px]">
          Hello{" "}
          <span className="text-[var(--primary-500)] text-[25px]">{userProfile?.nickname}</span>{" "}
          let's onboard you
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center md:text-right mt-[10px] md:mt-0"
        >
          <div className="text-sm text-[var(--text-secondary)] mb-2">
            {Math.round(progress)}% Complete
          </div>
          <div className="w-32 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] rounded-full shadow-md"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
