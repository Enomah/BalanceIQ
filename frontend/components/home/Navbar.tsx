import React, { useState } from "react";
import {
  ArrowRight,
  DollarSign,
  Home,
  Info,
  Mail,
  Menu,
} from "lucide-react";
import MobileNav from "./MobileNav";
import ThemeToggle from "../ui/ThemeToggle";
import Link from "next/link";
import Logo from "../ui/Logo";
import { useAuthStore } from "@/store/authStore";
import ProfilePreview from "../ui/ProfilePreview";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const Navbar: React.FC = ({}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isSignedIn } = useAuthStore();
  const pathname = usePathname();

  console.log(pathname);

  const mainNavItems: NavItem[] = [
    { href: "/", label: "Home", icon: <Home /> },
    { href: "/about", label: "About", icon: <Info /> },
    { href: "/pricing", label: "Pricing", icon: <DollarSign /> },
    { href: "/contact", label: "Contact", icon: <Mail /> },
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
                className={`${
                  pathname === item.href
                    ? "text-[var(--primary-500)]"
                    : "text-[var(--text-primary)]"
                } hover:text-[var(--primary-500)] transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-[10px] md:gap-[20px]">
            <div className="">
              <ThemeToggle />
            </div>

            {isSignedIn ? (
              <ProfilePreview />
            ) : (
              <div className="flex space-x-4 hidden md:block">
                <Link
                  href={"/login"}
                  className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-700)] transition-colors flex items-center"
                >
                  Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}

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
