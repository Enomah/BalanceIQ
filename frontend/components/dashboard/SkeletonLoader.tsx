import React from 'react';

const SkeletonLoader: React.FC = () => (
  <div className="skeleton-container p-6">
    <div className="skeleton-header flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded-full animate-pulse"></div>
        <div>
          <div className="h-6 w-40 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded animate-pulse mb-2"></div>
          <div className="h-4 w-60 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-10 w-10 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded-full animate-pulse"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-sm animate-pulse">
          <div className="h-5 w-32 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded mb-4"></div>
          <div className="h-8 w-40 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded mb-4"></div>
          <div className="h-4 w-24 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-sm animate-pulse">
          <div className="h-6 w-40 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded mb-6"></div>
          <div className="h-64 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-sm animate-pulse">
        <div className="h-6 w-40 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-10 h-10 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded mb-2"></div>
                <div className="h-3 w-24 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
              </div>
              <div className="h-4 w-16 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-sm animate-pulse">
        <div className="h-6 w-40 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-10 h-10 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 w-40 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded mb-2"></div>
                <div className="h-3 w-32 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
              </div>
              <div className="h-4 w-16 bg-[var(--neutral-200)] dark:bg-[var(--neutral-700)] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;