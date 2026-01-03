"use client";

import { User, Settings, Shield } from "lucide-react";

interface SettingsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function SettingsNavigation({
  activeTab,
  onTabChange,
}: SettingsNavigationProps) {
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="flex flex-col w-full md:w-64 gap-1 mb-8 md:mb-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
              isActive
                ? "bg-[var(--primary-500)] text-white shadow-lg shadow-[var(--primary-500)]/20"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
