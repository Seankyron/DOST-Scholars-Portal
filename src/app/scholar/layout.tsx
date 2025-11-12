// src/app/scholar/layout.tsx

import { ScholarHeader } from '@/components/scholar/layout/ScholarHeader';

export default function ScholarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
 
    <div className="flex h-screen flex-col overflow-hidden bg-auth-gradient">
      <ScholarHeader />
      
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}