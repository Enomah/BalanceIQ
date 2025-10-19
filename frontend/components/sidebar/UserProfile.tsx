import { useState } from "react";
import { User as UserType } from "@/types/userTypes";

interface UserProfileProps {
  userProfile: UserType | null;
  isCollapsed: boolean;
  showTooltip: boolean;
}

export default function UserProfile({ userProfile, isCollapsed, showTooltip }: UserProfileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex items-center p-3 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-8 h-8 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white font-medium">
        {userProfile?.fullName?.charAt(0) || "U"}
      </div>
      
      {!isCollapsed && (
        <div className="ml-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {userProfile?.fullName || "User"}
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            Premium Account
          </p>
        </div>
      )}

      {showTooltip && isHovered && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50">
          <div className="bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-lg px-3 py-2 shadow-lg">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {userProfile?.fullName || "User"}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Premium Account
            </p>
            <div className="absolute right-full top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-[var(--bg-primary)] border-l border-t border-[var(--border-light)] transform rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}