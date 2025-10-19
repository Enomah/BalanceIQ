import { useState } from "react";
import { MenuItem } from "@/types/dashboardTypes";
import Link from "next/link";

interface MenuItemComponentProps {
  item: MenuItem;
  isCollapsed: boolean;
  currentPath: string;
  showTooltip: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MenuItemComponent({
  item,
  isCollapsed,
  currentPath,
  showTooltip,
  onMouseEnter,
  onMouseLeave,
}: MenuItemComponentProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave();
  };

  const baseClasses = `flex items-center p-3 rounded-lg transition-colors w-full ${
    currentPath === item.href
      ? "bg-[var(--primary-50)] dark:bg-[var(--primary-900)] text-[var(--primary-600)] dark:text-[var(--primary-400)]"
      : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
  } ${
    item.isDestructive
      ? "text-[var(--error-600)] dark:text-[var(--error-400)] hover:bg-[var(--error-50)] dark:hover:bg-[var(--error-900)]"
      : ""
  }`;

  return (
    <li className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {item.action ? (
        <button onClick={item.action} className={baseClasses}>
          <item.icon size={20} />
          {!isCollapsed && <span className="ml-3">{item.label}</span>}
        </button>
      ) : (
        <Link href={item.href || "#"} className={baseClasses}>
          <item.icon size={20} />
          {!isCollapsed && <span className="ml-3">{item.label}</span>}
        </Link>
      )}

      {showTooltip && isHovered && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-[100]">
          <div className="bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {item.label}
            </span>
            <div className="absolute right-full top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-[var(--bg-primary)] border-l border-t border-[var(--border-light)] transform rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}