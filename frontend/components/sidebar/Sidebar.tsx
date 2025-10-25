"use client";

import { useState, useEffect } from "react";
import { User as UserType } from "@/types/userTypes";
import Navigation from "./Navigation";
import UserProfile from "./UserProfile";
import { MenuItem } from "@/types/dashboardTypes";
import {
  User,
  ShoppingBag,
  DollarSign,
  Lightbulb,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";
import SidebarHeader from "./SideBarHeader";

interface SidebarProps {
  currentPath: string;
  userProfile: UserType | null;
}

export default function Sidebar({ currentPath, userProfile }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: User, href: "/dashboard" },
    { id: "transactions", label: "Transactions", icon: ShoppingBag, href: "/dashboard/transactions" },
    { id: "goals", label: "Financial Goals", icon: DollarSign, href: "/dashboard/goals" },
    { id: "insights", label: "Insights", icon: Lightbulb, href: "/dashboard/insights" },
    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
    { id: "privacy", label: "Privacy & Security", icon: Shield, href: "/dashboard/privacy" },
    { id: "help", label: "Help & Support", icon: HelpCircle, href: "/dashboard/help" },
    { id: "logout", label: "Sign Out", icon: LogOut, isDestructive: true },
  ];

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSidebarMouseEnter = () => {
    setIsSidebarHovered(true);
  };

  const handleSidebarMouseLeave = () => {
    setIsSidebarHovered(false);
  };


  const showTooltip = isCollapsed && isSidebarHovered;

  return (
    <div
      className={`bg-[var(--sidebar-bg)] h-screen hidden sm:flex flex-col border-r border-[var(--border-light)] transition-all duration-300 relative ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      onMouseEnter={handleSidebarMouseEnter}
      onMouseLeave={handleSidebarMouseLeave}
    >
    
      <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <Navigation
        menuItems={menuItems}
        isCollapsed={isCollapsed}
        currentPath={currentPath}
        showTooltip={showTooltip}
      />
      <div className="p-4 border-t border-[var(--border-light)]">
        <UserProfile
          userProfile={userProfile}
          isCollapsed={isCollapsed}
          showTooltip={showTooltip}
        />
      </div>
    </div>
  );
}