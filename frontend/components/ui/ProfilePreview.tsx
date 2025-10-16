import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  ChevronUp,
  Shield,
  HelpCircle,
  ShoppingBag,
  Lightbulb,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ProfilePreview() {
  const { userProfile, isSignedIn, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isSignedIn || !userProfile) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
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
      href: "/dashboard/transactions",
    },
    {
      id: "savings",
      label: "Savings",
      icon: DollarSign,
      href: "/dashboard/savings",
    },
    {
      id: "insights",
      label: "Insights",
      icon: Lightbulb,
      href: "/dashboard/insights",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
      href: "/dashboard/privacy",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      href: "/dashboard/help",
    },
    {
      id: "logout",
      label: "Sign Out",
      icon: LogOut,
      action: logout,
      isDestructive: true,
    },
  ];

  return (
    <div className="relative z-[1000]" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group"
        aria-expanded={isDropdownOpen}
        aria-label="User profile menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white text-sm font-medium">
          {userProfile.avatar ? (
            <img
              src={userProfile.avatar}
              alt={userProfile.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(userProfile.fullName)
          )}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-600)] transition-colors">
            {userProfile.fullName}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {userProfile.nickname}
          </p>
        </div>

        <div className="text-[var(--text-tertiary)] group-hover:text-[var(--primary-600)] transition-colors">
          {isDropdownOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-64 bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border-light)] z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-[var(--border-light)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white font-medium">
                  {userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(userProfile.fullName)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {userProfile.fullName}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {userProfile.email}
                  </p>
                </div>
              </div>

              {userProfile.isVerified && (
                <div className="mt-2 flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-[var(--success-500)]" />
                  <span className="text-xs text-[var(--success-600)] font-medium">
                    Verified Account
                  </span>
                </div>
              )}
            </div>

            <div className="py-2">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${
                      pathname === item.href ? "bg-[var(--bg-secondary)]" : ""
                    } ${
                      item.isDestructive
                        ? "hover:bg-[var(--error-50)]"
                        : "hover:bg-[var(--bg-tertiary)]"
                    }`}
                  >
                    {item.action ? (
                      <button
                        onClick={() => {
                          item.action?.();
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          item.isDestructive
                            ? "text-[var(--error-600)] hover:bg-[var(--error-50)] hover:text-[var(--error-700)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-600)]"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        onClick={item.action}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-600)] transition-colors"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="px-4 py-3 bg-[var(--bg-tertiary)] border-t border-[var(--border-light)]">
              <p className="text-xs text-[var(--text-secondary)]">
                BalanceIQ • v1.0.0
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
