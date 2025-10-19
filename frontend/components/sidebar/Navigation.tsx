import { MenuItem } from "@/types/dashboardTypes";
import MenuItemComponent from "./MenuItemComponent";

interface NavigationProps {
  menuItems: MenuItem[];
  isCollapsed: boolean;
  currentPath: string;
  showTooltip: boolean;
  onItemHover: () => void;
  onItemLeave: () => void;
}

export default function Navigation({
  menuItems,
  isCollapsed,
  currentPath,
  showTooltip,
  onItemHover,
  onItemLeave,
}: NavigationProps) {
  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
            showTooltip={showTooltip}
            onMouseEnter={onItemHover}
            onMouseLeave={onItemLeave}
          />
        ))}
      </ul>
    </nav>
  );
}