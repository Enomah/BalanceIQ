import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItem } from '@/types/dashboardTypes';
import { User } from '@/types/userTypes';
import Logo from '../ui/Logo';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  menuItems: MenuItem[];
  currentPath: string;
  userProfile: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  menuItems,
  currentPath,
  userProfile
}) => {
  return (
    <div className={`bg-[var(--sidebar-bg)] h-screen hidden  sm:flex flex-col border-r border-[var(--border-light)] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-[var(--border-light)]">
        {!isCollapsed && (
          <Logo/>
        )}
        <button 
          onClick={toggleSidebar}
          className="sidebar-toggle p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href || '#'}
                onClick={item.action}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  currentPath === item.href 
                    ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)] text-[var(--primary-600)] dark:text-[var(--primary-400)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                } ${item.isDestructive ? 'text-[var(--error-600)] dark:text-[var(--error-400)] hover:bg-[var(--error-50)] dark:hover:bg-[var(--error-900)]' : ''}`}
              >
                <item.icon size={20} />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-[var(--border-light)]">
        <div className="flex items-center p-3">
          <div className="w-8 h-8 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white">
            {userProfile?.fullName?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">{userProfile?.fullName || 'User'}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Premium Account</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;