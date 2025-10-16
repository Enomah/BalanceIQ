import React from 'react';
import { Bell } from 'lucide-react';
import { User } from '@/types/userTypes';
import ThemeToggle from '../ui/ThemeToggle';
import ProfilePreview from '../ui/ProfilePreview';

interface WelcomeSectionProps {
  userProfile: User | null;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userProfile }) => {
  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  return (
    <section className="welcome-section bg-[var(--bg-secondary)] p-[10px] md:p-6 sm:rounded-xl shadow-sm mb-[10px] sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-[20px] sm:text-2xl font-bold text-[var(--text-primary)]">
            Good {getTimeOfDay()}, {userProfile?.fullName.split(" ")[0] || 'User'} 👋
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Lets review your finances
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle/>
          <button className="p-2 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-600)] transition-colors">
            <Bell size={20} className="text-[var(--text-secondary)]" />
          </button>
          <ProfilePreview/>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;