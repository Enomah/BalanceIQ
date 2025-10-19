import { ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "../ui/Logo";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="p-4 flex items-center justify-between border-b border-[var(--border-light)]">
      {!isCollapsed && <Logo />}
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}