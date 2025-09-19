import React, { useState } from "react";
import {
  ArrowRight,
  DollarSign,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Save,
  Scale,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  Store,
} from "lucide-react";
import MobileNav from "./MobileNav";
import ThemeToggle from "../ui/ThemeToggle";
import Link from "next/link";
import Logo from "../ui/Logo";

export interface NavItem {
  label: string;
  href: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const Navbar: React.FC = ({}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const mainNavItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/transactions", label: "Transactions", icon: <ShoppingBag /> },
    { href: "/savings", label: "Savings", icon: <DollarSign /> },
    { href: "/insights", label: "Insights", icon: <Lightbulb /> },
    { href: "/settings", label: "Settings", icon: <Settings /> },
  ];

  return (
    <>
      <nav className="fixed w-full bg-[var(--header-bg)]/80 backdrop-blur-md z-50 py-4 transition-all duration-300">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />

          <div className="hidden md:flex space-x-8">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--text-primary)] hover:text-[var(--primary-500)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-[20px]">
            <div className="">
              <ThemeToggle />
            </div>

            <div className="flex space-x-4 hidden md:block">
              <Link
                href={"/login"}
                className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-700)] transition-colors flex items-center"
              >
                Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="h-6 w-6 text-[var(--text-primary)]" />
            </button>
          </div>
        </div>
      </nav>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={mainNavItems}
      />
    </>
  );
};

export default Navbar;
