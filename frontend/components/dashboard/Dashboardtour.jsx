import React, { useState, useCallback, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { X, HelpCircle } from 'lucide-react';

const DashboardTour = ({ isOpen, onClose }) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getTourPlacement = (defaultPlacement, mobilePlacement) => {
    return isMobile ? mobilePlacement : defaultPlacement;
  };

  const steps = [
    {
      target: '.welcome-section',
      content: 'Welcome to your financial dashboard! Here you can see a quick overview of your financial health.',
      placement: getTourPlacement('bottom', 'bottom'),
      title: 'Welcome to BalanceIQ',
      disableBeacon: true,
    },
    {
      target: '.account-overview',
      content: 'This is your financial snapshot. Track your income, balance, and expenses at a glance.',
      placement: getTourPlacement('bottom', 'bottom'),
      title: 'Financial Overview',
    },
    {
      target: '.chart-container:first-child',
      content: 'Visualize your income and expenses trends over time to understand your financial patterns.',
      placement: getTourPlacement('right', 'bottom'),
      title: 'Financial Trends',
    },
    {
      target: '.chart-container:last-child',
      content: 'See where your money is going with this expense breakdown by category.',
      placement: getTourPlacement('left', 'bottom'),
      title: 'Expense Categories',
    },
    {
      target: '.goals-section',
      content: 'Set and track your financial goals. Watch your progress with visual indicators and earn badges!',
      placement: getTourPlacement('top', 'bottom'),
      title: 'Financial Goals',
    },
    {
      target: '.recent-activity',
      content: 'Review your recent transactions and stay on top of your spending habits.',
      placement: getTourPlacement('top', 'bottom'),
      title: 'Recent Activity',
    },
    {
      target: '.tips-section',
      content: 'Get personalized financial tips and insights based on your spending patterns.',
      placement: getTourPlacement('top', 'bottom'),
      title: 'Financial Tips',
    },
    {
      target: '.quick-actions',
      content: 'Quickly add transactions, create goals, or generate reports with these handy shortcuts.',
      placement: getTourPlacement('left', 'bottom'),
      title: 'Quick Actions',
    },
    ...(!isMobile ? [{
      target: '.sidebar-toggle',
      content: 'Access all sections of the app from this navigation sidebar. You can collapse it to save space.',
      placement: getTourPlacement('right', 'bottom'),
      title: 'Navigation',
    }] : [])
  ];

  // Add/remove highlight classes when tour starts/stops
  useEffect(() => {
    if (run) {
      // Add highlight class to all tour elements
      steps.forEach(step => {
        if (step.target) {
          const elements = document.querySelectorAll(step.target);
          elements.forEach(el => el.classList.add('tour-highlight'));
        }
      });
    } else {
      // Remove highlight class from all elements
      const highlightedElements = document.querySelectorAll('.tour-highlight');
      highlightedElements.forEach(el => el.classList.remove('tour-highlight'));
    }

    return () => {
      // Clean up on unmount
      const highlightedElements = document.querySelectorAll('.tour-highlight');
      highlightedElements.forEach(el => el.classList.remove('tour-highlight'));
    };
  }, [run, steps]);

  // Reset state when tour opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowWelcome(true);
      setRun(false);
      setStepIndex(0);
    } else {
      setRun(false);
      // Remove highlights when tour closes
      const highlightedElements = document.querySelectorAll('.tour-highlight');
      highlightedElements.forEach(el => el.classList.remove('tour-highlight'));
    }
  }, [isOpen]);

  const handleJoyrideCallback = useCallback((data) => {
    const { status, index, action, type } = data;
    
    // Handle tour completion or skipping
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      setStepIndex(0);
      onClose();
      return;
    }
    
    // Handle step changes
    if (type === 'step:after' || type === 'target:not_found') {
      setStepIndex(index + (action === 'prev' ? -1 : 1));
    }
  }, [onClose]);

  const startTour = () => {
    setShowWelcome(false);
    setRun(true);
    setStepIndex(0);
  };

  const handleClose = () => {
    setRun(false);
    setStepIndex(0);
    setShowWelcome(true);
    onClose();
  };
  

  if (!isOpen) return null;

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: 'var(--bg-secondary)',
            backgroundColor: 'var(--bg-secondary)',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            primaryColor: 'var(--primary-500)',
            textColor: 'var(--text-primary)',
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: 12,
          },
          buttonNext: {
            backgroundColor: 'var(--primary-500)',
            color: 'white',
            outline: 'none',
          },
          buttonBack: {
            color: 'var(--text-secondary)',
            outline: 'none',
          },
          buttonSkip: {
            color: 'var(--error-500)',
            outline: 'none',
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip Tour',
        }}
        floaterProps={{
          disableAnimation: true,
        }}
      />

      {/* Tour Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close tour"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[var(--primary-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={32} className="text-[var(--primary-600)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Welcome to BalanceIQ!
              </h2>
              <p className="text-[var(--text-secondary)]">
                Let's take a quick tour to help you get familiar with your new financial dashboard.
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white mr-3">1</div>
                <p className="text-[var(--text-primary)]">Track your income and expenses</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white mr-3">2</div>
                <p className="text-[var(--text-primary)]">Set and monitor financial goals</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white mr-3">3</div>
                <p className="text-[var(--text-primary)]">Get personalized financial insights</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startTour}
                className="flex-1 bg-[var(--primary-500)] text-white py-3 rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2"
              >
                Start Guided Tour
              </button>
              <button
                onClick={handleClose}
                className="flex-1 border border-[var(--border-light)] py-3 rounded-lg font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2"
              >
                Explore on My Own
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <label className="flex items-center justify-center text-sm text-[var(--text-tertiary)] cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mr-2 rounded border-[var(--border-light)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]" 
                  onChange={(e) => {
                    if (e.target.checked) {
                      localStorage.setItem('balanceIqTourSeen', 'true');
                    } else {
                      localStorage.removeItem('balanceIqTourSeen');
                    }
                  }}
                />
                Don't show this again
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardTour;