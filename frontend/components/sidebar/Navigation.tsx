import { MenuItem } from "@/types/dashboardTypes";
import MenuItemComponent from "./MenuItemComponent";

interface NavigationProps {
  menuItems: MenuItem[];
  isCollapsed: boolean;
  currentPath: string;
  showTooltip: boolean;
}

export default function Navigation({
  menuItems,
  isCollapsed,
  currentPath,
  showTooltip,
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
          />
        ))}
      </ul>
    </nav>
  );
}