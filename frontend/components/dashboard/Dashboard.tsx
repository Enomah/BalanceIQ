// Dashboard.tsx
"use client";

import { baseUrl } from "@/api/rootUrls";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState } from "react";
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

import { DashboardData, MenuItem } from "@/types/dashboardTypes";
import SkeletonLoader from "./SkeletonLoader";
import Sidebar from "./Sidebar";
import WelcomeSection from "./WelcomeSection";
import AccountOverview from "./AccountOverview";
import ChartsSection from "./ChartsSection";
import GoalsSection from "./GoalsSection";
import RecentActivity from "./RecentActivity";
import FinancialTips from "./FinancialTips";
import QuickActions from "./QuickActions";
import { getLocalStorage, setLocalStorage } from "@/lib/storage";
import DashboardTour from "./Dashboardtour";
import TourTrigger from "./TourTrigger";

const Dashboard: React.FC = () => {
  const { accessToken, userProfile, logout } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>("/dashboard");
  const [showTour, setShowTour] = useState<boolean>(false);
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(false);

  // Check if user has seen the tour before
  useEffect(() => {
    const tourSeen = getLocalStorage("dashboardTourSeen");
    if (!tourSeen) {
      // Show tour after a short delay when dashboard loads
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setHasSeenTour(true);
    }
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: User,
      href: "/dashboard",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: ShoppingBag,
      href: "/transactions",
    },
    {
      id: "savings",
      label: "Savings",
      icon: DollarSign,
      href: "/savings",
    },
    {
      id: "insights",
      label: "Insights",
      icon: Lightbulb,
      href: "/insights",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
      href: "/privacy",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      href: "/help",
    },
    {
      id: "logout",
      label: "Sign Out",
      icon: LogOut,
      action: logout,
      isDestructive: true,
    },
  ];

  const fetchDashboard = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/dashboard`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: DashboardData = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setDashboardData(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleTourClose = () => {
    setShowTour(false);
    setLocalStorage("dashboardTourSeen", "true");
    setHasSeenTour(true);
  };

  const handleTourOpen = () => {
    setShowTour(true);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen bg-[var(--bg-primary)]">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          menuItems={menuItems}
          currentPath={currentPath}
          userProfile={userProfile}
        />
        <div className="flex-1 overflow-y-auto">
          <SkeletonLoader />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen bg-[var(--bg-primary)]">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          menuItems={menuItems}
          currentPath={currentPath}
          userProfile={userProfile}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6 bg-[var(--bg-secondary)] rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">{error}</p>
            <button
              onClick={fetchDashboard}
              className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  if (!dashboardData) return null;

  const { monthlySummary, recentTransactions, activeGoals } = dashboardData;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        menuItems={menuItems}
        currentPath={currentPath}
        userProfile={userProfile}
      />

      <div className="flex-1 overflow-y-auto sm:p-6">
        <WelcomeSection userProfile={userProfile} />
        <AccountOverview monthlySummary={monthlySummary} />
        <ChartsSection monthlySummary={monthlySummary} />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-[10px] sm:gap-6 mb-[10px] sm:mb-6">
          <GoalsSection activeGoals={activeGoals} />
          <RecentActivity recentTransactions={recentTransactions} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[10px] sm:gap-6">
          <FinancialTips
            monthlySummary={monthlySummary}
            activeGoals={activeGoals}
          />
          <QuickActions />
        </section>

        <DashboardTour isOpen={showTour} onClose={handleTourClose} />

        {hasSeenTour && (
          <TourTrigger onClick={handleTourOpen} className="bottom-6 right-6" />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
