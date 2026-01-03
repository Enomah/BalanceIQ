"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import { useAuthStore } from "@/store/authStore";
import SettingsNavigation from "@/components/settings/SettingsNavigation";
import { motion, AnimatePresence } from "framer-motion";
import PreferencesTab from "@/components/settings/PreferencesTab";
import ProfileTab from "@/components/settings/ProfileTab";
import SecurityTab from "@/components/settings/SecurityTab";

export default function SettingsPage() {
  const { userProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "preferences":
        return <PreferencesTab />;
      case "security":
        return <SecurityTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath="/dashboard/settings" userProfile={userProfile} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

        <div className="flex flex-col md:flex-row gap-8 px-[10px] sm:px-6 pb-[20px] max-w-5xl mx-auto">
          <SettingsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
        </div>

    </div>
  );
}
