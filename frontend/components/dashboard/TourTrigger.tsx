import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TourTriggerProps {
  onClick: () => void;
  className?: string;
}

const TourTrigger: React.FC<TourTriggerProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed z-40 flex items-center justify-center w-12 h-12 bg-[var(--primary-500)] text-white rounded-full shadow-lg hover:bg-[var(--primary-600)] transition-all ${className}`}
      aria-label="Take a tour"
    >
      <HelpCircle size={24} />
      <span className="absolute -top-1 -right-1 flex h-5 w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-400)] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-5 w-5 bg-[var(--primary-600)] text-xs items-center justify-center">!</span>
      </span>
    </button>
  );
};

export default TourTrigger;