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

  const openPanel = useCallback((serviceId: ServiceId) => {
    setActiveService(serviceId);
  }, []);

  const closePanel = useCallback(() => {
    setActiveService(null);
  }, []);

  return {
    activeService,
    isAnimating: false, 
    openPanel,
    closePanel,
    isOpen: activeService !== null,
  };
}