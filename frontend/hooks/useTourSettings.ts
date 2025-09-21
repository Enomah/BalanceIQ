import { useState, useEffect } from 'react';

export const useTourSettings = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getTourPlacement = (defaultPlacement: string, mobilePlacement: string) => {
    return isMobile ? mobilePlacement : defaultPlacement;
  };

  return { isMobile, getTourPlacement };
};