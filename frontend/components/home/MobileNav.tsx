import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X } from "lucide-react";
import { NavItem } from "./Navbar";
import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, navItems }) => {
  const { isSignedIn } = useAuthStore();
  const pathname = usePathname();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        duration: 0.4,
        ease: [0.42, 0, 1, 1],
      },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.42, 0, 1, 1],
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: 50,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.42, 0, 1, 1],
      },
    },
  };

  const handleItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 z-50 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-[var(--bg-secondary)] shadow-lg z-50 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-end mb-8">
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <X className="h-6 w-6 text-[var(--text-primary)]" />
                </motion.button>
              </div>

              <nav className="flex-1">
                <ul className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <motion.button
                        onClick={() => handleItemClick(item)}
                        className={` ${
                          pathname === item.href
                            ? "text-[var(--primary-500)]"
                            : "text-[var(--text-primary)]"
                        } w-full text-left px-4 py-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors font-medium flex items-center space-x-3`}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.label}</span>
                      </motion.button>
                    </motion.li>
                  ))}

                  {isSignedIn && (
                    <motion.li
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ delay: 6 * 0.05 + 0.2 }}
                    >
                      <motion.button
                        onClick={() => (window.location.href = "/login")}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-primary)] font-medium flex items-center space-x-3"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LogIn />
                        <span>Login</span>
                      </motion.button>
                    </motion.li>
                  )}
                </ul>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
