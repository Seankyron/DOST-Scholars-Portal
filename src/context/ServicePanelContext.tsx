'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useServicePanel, ServiceId } from '@/hooks/useServicePanel';

interface ServicePanelContextType {
  activeService: ServiceId;
  openPanel: (serviceId: ServiceId) => void;
  closePanel: () => void;
  isOpen: boolean;
  isAnimating: boolean;
}

const ServicePanelContext = createContext<ServicePanelContextType | undefined>(undefined);

export function ServicePanelProvider({ children }: { children: ReactNode }) {
  const panel = useServicePanel();
  return (
    <ServicePanelContext.Provider value={panel}>
      {children}
    </ServicePanelContext.Provider>
  );
}

export function useServicePanelContext() {
  const context = useContext(ServicePanelContext);
  if (context === undefined) {
    throw new Error('useServicePanelContext must be used within a ServicePanelProvider');
  }
  return context;
}