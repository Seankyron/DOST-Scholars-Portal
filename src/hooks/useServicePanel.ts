'use client';

import { useState, useCallback } from 'react';

export type ServiceId = 
  | 'grade-submission'
  | 'stipend-tracking'
  | 'practical-training'
  | 'thesis-allowance'
  | 'request-forms'
  | 'travel-clearance'
  | 'shifting-transferring'
  | 'reimbursement'
  | 'leave-of-absence'
  | 'support-feedback'
  | null;

export function useServicePanel() {
  const [activeService, setActiveService] = useState<ServiceId>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const openPanel = useCallback((serviceId: ServiceId) => {
    setIsAnimating(true);
    setActiveService(serviceId);
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const closePanel = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveService(null);
      setIsAnimating(false);
      // Re-enable body scroll
      document.body.style.overflow = '';
    }, 300);
  }, []);

  return {
    activeService,
    isAnimating,
    openPanel,
    closePanel,
    isOpen: activeService !== null,
  };
}