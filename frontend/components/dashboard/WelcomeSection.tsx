"use client";

import React from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { User } from "@/types/userTypes";
import ThemeToggle from "../ui/ThemeToggle";
import ProfilePreview from "../ui/ProfilePreview";
import { useRouter } from "next/navigation";

interface WelcomeSectionProps {
  userProfile: User | null;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userProfile }) => {
  const router = useRouter();
  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  return (
    <section className="welcome-section bg-[var(--bg-secondary)] p-[10px] md:p-[10px] sm:p-6 shadow-sm mb-[10px] sm:mb-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-[10px]">
          <button
            className="p-2 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-600)] transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
          </button>
          <div>
            <h1 className="text-[20px] sm:text-2xl font-bold text-[var(--text-primary)]">
              Hey {" "}
              {userProfile?.fullName.split(" ")[0] || "User"} 👋
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {/* <button className="p-2 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-600)] transition-colors">
            <Bell size={20} className="text-[var(--text-secondary)]" />
          </button> */}
          <ProfilePreview />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
