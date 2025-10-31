'use client';

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={100}>
      {children}
      <Toaster position="bottom-right" richColors />
    </TooltipProvider>
  );
}